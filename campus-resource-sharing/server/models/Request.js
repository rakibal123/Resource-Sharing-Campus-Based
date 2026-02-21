const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    resourceId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Resource',
    },
    requesterId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    borrowDate: {
        type: Date,
    },
    returnDate: {
        type: Date,
    },
}, {
    timestamps: true,
});

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
