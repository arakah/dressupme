import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from '../utils/db.js';

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '30m', // 30 menit
  });
};

export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Required fields missing' });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);

    await db.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
      [username, email, hashed]
    );

    res.status(201).json({ message: 'Signup successful' });
  } catch (err) {
    console.error('Signup error:', err.message);
    res.status(500).json({ message: 'Email might already be in use' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const result = await db.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  if (result.rows.length === 0) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const user = result.rows[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(user);
  res.json({ token });
};

export const logout = (req, res) => {
  res.json({ message: 'Logout success (client should delete token)' });
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query(
      'SELECT id, username, email FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get profile error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
