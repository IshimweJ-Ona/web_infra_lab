import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../models/User.js';
import { validateEmail, validatePassword } from '../utils/validator.js';

export const register = async (req, res) => {
  const { email, password } = req.body;

  if (!validateEmail(email) || !validatePassword(password)) {
    return res.status(400).json({ error: 'Invalid email or password format' });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);
    await db.execute('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashed]);
    res.status(201).json({ success: true, message: 'User registered' });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.APP_SECRET, {
      expiresIn: '1d'
    });

    res.json({ success: true, token });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const logout = (req, res) => {
  // Token-based logout is client-side; optionally invalidate token server-side
  res.json({ success: true, message: 'Logged out' });
};