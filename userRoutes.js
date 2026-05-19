const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const { getProfile, updateProfile } = require('../controllers/userController');

router.use(verifyToken);

// GET  /api/users/profile  - get profile
// PUT  /api/users/profile  - update profile
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

module.exports = router;
