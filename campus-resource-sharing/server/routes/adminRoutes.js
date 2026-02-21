const express = require('express');
const router = express.Router();
const {
    getUsers,
    blockUser,
    unblockUser,
    deleteUser,
    getAllResourcesAdmin,
    deleteResourceAdmin,
    getAllRequestsAdmin,
    getStats,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect);
router.use(admin);

router.get('/stats', getStats);
router.get('/users', getUsers);

router.put('/users/:id/block', blockUser);
router.put('/users/:id/unblock', unblockUser);
router.delete('/users/:id', deleteUser);

router.get('/resources', getAllResourcesAdmin);
router.delete('/resources/:id', deleteResourceAdmin);

router.get('/requests', getAllRequestsAdmin);

module.exports = router;
