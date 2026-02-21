const Request = require('../models/Request');
const Resource = require('../models/Resource');
const AuditLog = require('../models/AuditLog');

// @desc    Create a borrow request
// @route   POST /api/requests
// @access  Private
const createRequest = async (req, res) => {
    const { resourceId, borrowDate, returnDate } = req.body;

    const resource = await Resource.findById(resourceId);

    if (!resource) {
        res.status(404).json({ message: 'Resource not found' });
        return;
    }

    if (resource.status !== 'available') {
        res.status(400).json({ message: 'Resource is not available' });
        return;
    }

    if (resource.ownerId.toString() === req.user._id.toString()) {
        res.status(400).json({ message: 'You cannot request your own resource' });
        return;
    }

    const request = new Request({
        resourceId,
        requesterId: req.user._id,
        ownerId: resource.ownerId,
        borrowDate,
        returnDate,
        status: 'pending',
    });

    const createdRequest = await request.save();

    await AuditLog.create({
        user: req.user._id,
        action: 'CREATE_REQUEST',
        target: resource.title,
        details: `Requested resource: ${resource.title}`
    });

    res.status(201).json(createdRequest);
};

// @desc    Get all requests (Admin or user-specific logic)
// @route   GET /api/requests
// @access  Private
const getRequests = async (req, res) => {
    let requests;
    if (req.user.role === 'admin') {
        requests = await Request.find({})
            .populate('resourceId', 'title imageUrl')
            .populate('requesterId', 'name email')
            .populate('ownerId', 'name email');
    } else {
        // If not admin, return requests involved with user
        requests = await Request.find({
            $or: [{ requesterId: req.user._id }, { ownerId: req.user._id }],
        })
            .populate('resourceId', 'title imageUrl')
            .populate('requesterId', 'name email')
            .populate('ownerId', 'name email');
    }
    res.json(requests);
};

// @desc    Get current user's requests
// @route   GET /api/requests/my-requests
// @access  Private
const getMyRequests = async (req, res) => {
    const requests = await Request.find({
        $or: [{ requesterId: req.user._id }, { ownerId: req.user._id }],
    })
        .populate('resourceId', 'title imageUrl')
        .populate('requesterId', 'name email')
        .populate('ownerId', 'name email');

    res.json(requests);
};

// @desc    Get requests for a specific user
// @route   GET /api/requests/user/:userId
// @access  Private
const getUserRequests = async (req, res) => {
    // Check if user is requesting their own data or is admin
    if (req.user._id.toString() !== req.params.userId && req.user.role !== 'admin') {
        res.status(401).json({ message: 'Not authorized to view these requests' });
        return;
    }

    const requests = await Request.find({
        $or: [{ requesterId: req.params.userId }, { ownerId: req.params.userId }],
    })
        .populate('resourceId', 'title imageUrl')
        .populate('requesterId', 'name email')
        .populate('ownerId', 'name email');

    res.json(requests);
}

// @desc    Update request status
// @route   PUT /api/requests/:id
// @access  Private
const updateRequestStatus = async (req, res) => {
    const { status } = req.body; // 'approved', 'rejected'
    const request = await Request.findById(req.params.id);

    if (!request) {
        res.status(404).json({ message: 'Request not found' });
        return;
    }

    // Only owner or admin can update status
    if (request.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(401).json({ message: 'Not authorized to update this request' });
        return;
    }

    request.status = status;
    await request.save();

    // Side effects on Resource status
    if (status === 'approved') {
        const resource = await Resource.findById(request.resourceId);
        if (resource) {
            resource.status = 'borrowed';
            await resource.save();
        }
    } else if (status === 'rejected' || status === 'returned') { // Handle returned as well if passed? Prompt said "returned/rejected -> available"
        const resource = await Resource.findById(request.resourceId);
        if (resource) {
            resource.status = 'available';
            await resource.save();
        }
    }

    await AuditLog.create({
        user: req.user._id,
        action: 'UPDATE_REQUEST_STATUS',
        target: request._id.toString(),
        details: `Updated request status to: ${status}`
    });

    res.json(request);
};

// @desc    Delete (Cancel) request
// @route   DELETE /api/requests/:id
// @access  Private
const deleteRequest = async (req, res) => {
    const request = await Request.findById(req.params.id);

    if (!request) {
        res.status(404).json({ message: 'Request not found' });
        return;
    }

    // Only requester can cancel (delete)
    if (request.requesterId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(401).json({ message: 'Not authorized to cancel this request' });
        return;
    }

    // Optional: Only allow cancelling if pending
    if (request.status !== 'pending' && req.user.role !== 'admin') {
        res.status(400).json({ message: 'Cannot cancel a processed request' });
        return;
    }

    await request.deleteOne();
    res.json({ message: 'Request cancelled' });
};

module.exports = { createRequest, getRequests, getUserRequests, getMyRequests, updateRequestStatus, deleteRequest };
