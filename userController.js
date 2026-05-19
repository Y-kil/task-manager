const db = require('../config/db');

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, name, email, profile_picture, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (users.length === 0) return res.status(404).json({ message: 'User not found.' });
    res.json(users[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Update profile
const updateProfile = async (req, res) => {
  const { name, profile_picture } = req.body;
  try {
    await db.query(
      'UPDATE users SET name = ?, profile_picture = ? WHERE id = ?',
      [name, profile_picture, req.user.id]
    );
    res.json({ message: 'Profile updated successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

module.exports = { getProfile, updateProfile };
