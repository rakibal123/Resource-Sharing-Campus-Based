const AuditLog = require('../models/AuditLog');

// @desc    Get all audit logs
// @route   GET /api/admin/logs
// @access  Private/Admin
const getAuditLogs = async (req, res) => {
    try {
        const logs = await AuditLog.find({})
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(100); // Limit to last 100 for now
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getAuditLogs };
