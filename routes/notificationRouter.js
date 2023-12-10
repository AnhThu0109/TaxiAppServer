const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/auth');

// Define routes for notifications
router.post('/', auth, notificationController.createNotification);
router.put('/:id', auth, notificationController.updateNotification);
router.put('/updateAll/:adminId', auth, notificationController.updateAllNotifications);
router.delete('/:id', auth, notificationController.deleteNotification);
router.get('/admin/:adminId', auth, notificationController.getNotificationsByAdminId);

module.exports = router;
