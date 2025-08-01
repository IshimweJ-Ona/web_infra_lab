import bcrypt from 'bcrypt';
import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// MySQL Connection
let db;
try {
  db = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
  console.log("✅ Connected to MySQL");
} catch (err) {
  console.error("❌ MySQL connection failed:", err);
  process.exit(1);
}
app.set('db', db);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'payrwa_secret',
  resave: false,
  saveUninitialized: false
}));

// Static
app.use('/static', express.static(path.join(__dirname, 'frontend', 'static')));

// Serve HTML
const servePage = (file) => path.join(__dirname, 'frontend', 'templates', file);
app.get('/', (req, res) => res.sendFile(servePage('index.html')));
app.get('/register', (req, res) => res.sendFile(servePage('register.html')));
app.get('/login', (req, res) => res.sendFile(servePage('login.html')));
app.get('/pay', (req, res) => res.sendFile(servePage('pay.html')));
app.get('/history', async (req, res) => {
  if (!req.session.user) return res.status(403).json({ success: false, error: 'Login required' });

  try {
    const [rows] = await db.execute(
      'SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC',
      [req.session.user.id]
    );
    res.json({ success: true, transactions: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: 'History error' });
  }
});

// Register
app.post('/register', async (req, res) => {
  const { username, email, password, currency, phone } = req.body;
  if (!username || !email || !password || !currency || !phone) {
    return res.status(400).json({ success: false, error: 'All fields are required.' });
  }

  try {
    const [existing] = await db.execute(
      'SELECT id FROM users WHERE username = ? OR email = ?', [username, email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ success: false, error: 'Username or email already exists.' });
    }

    const hashed = await bcrypt.hash(password, 10);
    await db.execute(
      'INSERT INTO users (username, email, password, currency, phone) VALUES (?, ?, ?, ?, ?)',
      [username, email, hashed, currency, phone]
    );

    res.json({ success: true, message: 'User registered' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

// Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'Username and password are required.' });
  }

  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    req.session.user = { id: user.id, username: user.username };
    await db.execute('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Login failed' });
  }
});

// Logout
app.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ success: true }));
});

// Session status
app.get('/status', (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, username: req.session.user.username });
  } else {
    res.json({ loggedIn: false });
  }
});

// Pay
app.post('/pay', async (req, res) => {
  if (!req.session.user) {
    return res.status(403).json({ success: false, error: 'Login required' });
  }

  const { payType, target, amount, userPhone, currency } = req.body;
  if (!payType || !target || !amount || !userPhone || !currency) {
    return res.status(400).json({ success: false, error: 'All fields are required' });
  }

  try {
    await db.execute(
      'INSERT INTO transactions (user_id, amount, paid_to, date, status, description, currency) VALUES (?, ?, ?, NOW(), ?, ?, ?)',
      [
        req.session.user.id,
        amount,
        target,
        'pending',
        `${payType} from ${userPhone}`,
        currency
      ]
    );

    res.json({ success: true, message: 'Payment created' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Payment error' });
  }
});

// Start
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});
