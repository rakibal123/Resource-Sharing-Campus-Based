const express = require('express');
const router = express.Router();
const { createRequest, getRequests, getUserRequests, getMyRequests, updateRequestStatus, deleteRequest } = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createRequest).get(protect, getRequests);
router.route('/my-requests').get(protect, getMyRequests);
router.route('/user/:userId').get(protect, getUserRequests);
router.route('/:id').put(protect, updateRequestStatus).delete(protect, deleteRequest);

module.exports = router;
