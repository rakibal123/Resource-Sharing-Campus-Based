const express = require('express');
const router = express.Router();
const { upload, uploadProfileImage, updateProfile, getProfile, getUserStats } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/profile', protect, getProfile);
router.get('/stats', protect, getUserStats);
router.post('/profile/image', protect, upload.single('image'), uploadProfileImage);
router.put('/profile', protect, updateProfile);

module.exports = router;
