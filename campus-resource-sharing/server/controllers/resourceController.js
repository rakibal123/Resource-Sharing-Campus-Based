const Resource = require('../models/Resource');
const AuditLog = require('../models/AuditLog');

// @desc    Get all resources
// @route   GET /api/resources
// @access  Public
const getResources = async (req, res) => {
    const resources = await Resource.find({}).populate('ownerId', 'name email');
    res.json(resources);
};

// @desc    Get single resource
// @route   GET /api/resources/:id
// @access  Public
const getResourceById = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id).populate('ownerId', 'name email');
        if (resource) {
            res.json(resource);
        } else {
            res.status(404).json({ message: 'Resource not found' });
        }
    } catch (error) {
        res.status(404).json({ message: 'Resource not found' });
    }
};

// @desc    Create a resource
// @route   POST /api/resources
// @access  Private
const createResource = async (req, res) => {
    const { title, category, description, imageUrl } = req.body;
    console.log('--- Create Resource Request ---');
    console.log('Body:', req.body);
    console.log('File:', req.file);

    if (!title || !category) {
        res.status(400).json({ message: 'Please add title and category' });
        return;
    }

    const resource = new Resource({
        ownerId: req.user._id,
        title,
        category,
        description,
        imageUrl: req.file ? `/uploads/${req.file.filename}` : imageUrl, // Use uploaded file path if available
    });

    const createdResource = await resource.save();

    await AuditLog.create({
        user: req.user._id,
        action: 'CREATE_RESOURCE',
        target: createdResource.title,
        details: `Created resource: ${createdResource.title}`
    });

    res.status(201).json(createdResource);
};

// @desc    Update a resource
// @route   PUT /api/resources/:id
// @access  Private
const updateResource = async (req, res) => {
    const { title, category, description, status, imageUrl } = req.body;

    const resource = await Resource.findById(req.params.id);

    if (resource) {
        // Check if user is owner or admin
        if (resource.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(401).json({ message: 'Not authorized to update this resource' });
            return;
        }

        resource.title = title || resource.title;
        resource.category = category || resource.category;
        resource.description = description || resource.description;
        resource.status = status || resource.status;
        resource.imageUrl = imageUrl || resource.imageUrl;

        const updatedResource = await resource.save();
        res.json(updatedResource);
    } else {
        res.status(404).json({ message: 'Resource not found' });
    }
};

// @desc    Delete a resource
// @route   DELETE /api/resources/:id
// @access  Private/Admin
const deleteResource = async (req, res) => {
    const resource = await Resource.findById(req.params.id);

    if (resource) {
        // Check if user is owner or admin
        if (resource.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(401).json({ message: 'Not authorized to delete this resource' });
            return;
        }
        await resource.deleteOne();

        await AuditLog.create({
            user: req.user._id,
            action: 'DELETE_RESOURCE',
            target: resource.title,
            details: `Deleted resource: ${resource.title}`
        });

        res.json({ message: 'Resource removed' });
    } else {
        res.status(404).json({ message: 'Resource not found' });
    }
};

module.exports = { getResources, getResourceById, createResource, updateResource, deleteResource };
