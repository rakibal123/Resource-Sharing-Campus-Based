const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    action: {
        type: String,
        required: true,
    },
    target: {
        type: String,
    },
    details: {
        type: String,
    },
}, {
    timestamps: true,
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;
