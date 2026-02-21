const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ['Book', 'Notes', 'Equipment'],
    },
    description: {
        type: String,
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    status: {
        type: String,
        enum: ['available', 'borrowed'],
        default: 'available',
    },
    imageUrl: {
        type: String,
    },
}, {
    timestamps: true,
});

const Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource;
