const User = require('../models/User');
const Resource = require('../models/Resource');
const Request = require('../models/Request');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    const users = await User.find({}).select('-password');
    res.json(users);
};

// @desc    Block user
// @route   PUT /api/admin/users/:id/block
// @access  Private/Admin
const blockUser = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.status = 'blocked';
        await user.save();
        res.json({ message: 'User blocked' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Unblock user
// @route   PUT /api/admin/users/:id/unblock
// @access  Private/Admin
const unblockUser = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.status = 'active';
        await user.save();
        res.json({ message: 'User unblocked' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await user.deleteOne();
        res.json({ message: 'User removed' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Get all resources (Admin view)
// @route   GET /api/admin/resources
// @access  Private/Admin
const getAllResourcesAdmin = async (req, res) => {
    const resources = await Resource.find({}).populate('ownerId', 'name email');
    res.json(resources);
};

// @desc    Delete resource (Admin override)
// @route   DELETE /api/admin/resources/:id
// @access  Private/Admin
const deleteResourceAdmin = async (req, res) => {
    const resource = await Resource.findById(req.params.id);

    if (resource) {
        await resource.deleteOne();
        res.json({ message: 'Resource removed' });
    } else {
        res.status(404).json({ message: 'Resource not found' });
    }
};

// @desc    Get all requests (Admin view)
// @route   GET /api/admin/requests
// @access  Private/Admin
const getAllRequestsAdmin = async (req, res) => {
    const requests = await Request.find({})
        .populate('resourceId', 'title imageUrl')
        .populate('requesterId', 'name email')
        .populate('ownerId', 'name email');
    res.json(requests);
};

// @desc    Get admin stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res) => {
    const totalUsers = await User.countDocuments({});
    const totalResources = await Resource.countDocuments({});
    const totalRequests = await Request.countDocuments({});
    // const totalReports = await Report.countDocuments({}); // Pending report model

    res.json({
        totalUsers,
        totalResources,
        totalRequests,
        totalReports: 0, // Placeholder
    });
};

module.exports = {
    getUsers,
    blockUser,
    unblockUser,
    deleteUser,
    getAllResourcesAdmin,
    deleteResourceAdmin,
    getAllRequestsAdmin,
    getStats,
};
