const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb('Error: Images Only!');
        }
    },
});

// @desc    Upload profile image
// @route   POST /api/users/profile/image
// @access  Private
const uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ message: 'Please upload a file' });
            return;
        }

        const user = await User.findById(req.user._id);

        if (user) {
            user.profileImage = `/${req.file.path}`;
            await user.save();

            res.json({
                message: 'Image uploaded successfully',
                profileImage: user.profileImage,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ message: 'Server error during upload' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.department = req.body.department || user.department;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                department: updatedUser.department,
                role: updatedUser.role,
                token: req.token,
                profileImage: updatedUser.profileImage,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ message: 'Server error during profile update' });
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get user stats for dashboard
// @route   GET /api/users/stats
// @access  Private
const getUserStats = async (req, res) => {
    try {
        const Resource = require('../models/Resource');
        const Request = require('../models/Request');

        const totalResources = await Resource.countDocuments({ status: 'Available' });
        const borrowedItems = await Request.countDocuments({
            requesterId: req.user._id,
            status: 'Approved'
        });
        const myPendingRequests = await Request.countDocuments({
            requesterId: req.user._id,
            status: 'Pending'
        });

        res.json({
            totalResources,
            borrowedItems,
            myPendingRequests
        });
    } catch (error) {
        console.error("Get Stats Error:", error);
        res.status(500).json({ message: 'Server error fetching stats' });
    }
};

module.exports = {
    upload,
    uploadProfileImage,
    updateProfile,
    getProfile,
    getUserStats,
};
