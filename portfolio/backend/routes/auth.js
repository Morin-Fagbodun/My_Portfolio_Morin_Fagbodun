const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const AUTH_FILE = path.join(__dirname, '../data/auth.json');

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  const authData = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf8'));
  const admin = authData.admin;

  if (username !== admin.username) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const passwordMatch = bcrypt.compareSync(password, admin.passwordHash);
  if (!passwordMatch) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const token = jwt.sign(
    { username, role: 'admin' },
    process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    { expiresIn: '8h' }
  );

  res.json({ token, message: 'Login successful.' });
});

// POST /api/auth/change-password  (protected)
const authMiddleware = require('../middleware/auth');
router.post('/change-password', authMiddleware, (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' });
  }

  const hash = bcrypt.hashSync(newPassword, 10);
  const authData = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf8'));
  authData.admin.passwordHash = hash;
  fs.writeFileSync(AUTH_FILE, JSON.stringify(authData, null, 2));

  res.json({ message: 'Password updated successfully.' });
});

module.exports = router;
