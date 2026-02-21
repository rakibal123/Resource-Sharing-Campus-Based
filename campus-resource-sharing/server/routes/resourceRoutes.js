const express = require('express');
const router = express.Router();
const { getResources, getResourceById, createResource, updateResource, deleteResource } = require('../controllers/resourceController');
const { upload } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getResources).post(protect, upload.single('image'), createResource);
router.route('/:id').get(getResourceById).put(protect, updateResource).delete(protect, deleteResource);

module.exports = router;
