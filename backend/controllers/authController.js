import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../models/User.js';
import { validateEmail, validatePassword } from '../utils/validator.js';

export const register = async (req, res) => {
  const { username, email, password, currency, phone } = req.body;

  if (!username || !email || !password || !currency || !phone) {
    return res.status(400).json({ success: false, error: 'All fields are required' });
  }

  if (!validateEmail(email) || !validatePassword(password)) {
    return res.status(400).json({ success: false, error: 'Invalid email or password format' });
  }

  try {
    const [existing] = await db.execute(
      'SELECT id FROM users WHERE username = ? OR email = ?', [username, email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ success: false, error: 'Username or email already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    await db.execute(
      'INSERT INTO users (username, email, password, currency, phone) VALUES (?, ?, ?, ?, ?)',
      [username, email, hashed, currency, phone]
    );

    res.json({ success: true, message: 'User registered' });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ success: false, error: 'Registration failed' });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'Username and password are required' });
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
    console.error('Login error:', err.message);
    res.status(500).json({ success: false, error: 'Login failed' });
  }
};

export const logout = (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true, message: 'Logged out' });
  });
};
