let models = require('../models');
let Notification = models.Notification;

const notificationController = {
  createNotification: async (req, res) => {
    try {
      const { text, adminId, isErrorNoti } = req.body;
      
      const newNotification = await Notification.create({
        text,
        isRead: false,
        adminId,
        isErrorNoti
      });

      res.status(200).json(newNotification);
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ message: 'Internal Server Error' });
    }
  },

  updateNotification: async (req, res) => {
    try {
      const { id } = req.params;
      const { isRead } = req.body;

      const notification = await Notification.findByPk(id);

      if (!notification) {
        res.status(404).send('Notification not found');
        return;
      }

      notification.isRead = isRead;

      await notification.save();

      res.status(200).json(notification);
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ message: 'Internal Server Error' });
    }
  },

  deleteNotification: async (req, res) => {
    try {
      const { id } = req.params;

      const notification = await Notification.findByPk(id);

      if (!notification) {
        res.status(404).send('Notification not found');
        return;
      }

      await notification.destroy();

      res.status(204).send();
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ message: 'Internal Server Error' });
    }
  },

  getNotificationsByAdminId: async (req, res) => {
    try {
      const { adminId } = req.params;

      const notifications = await Notification.findAll({
        where: { adminId },
      });

      res.status(200).json(notifications);
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ message: 'Internal Server Error' });
    }
  },

  updateAllNotifications: async (req, res) => {
    try {
      const { adminId } = req.params;

      const [updatedCount] = await Notification.update(
        { isRead: true },
        { where: { adminId, isRead: false } }
      );

      res.status(200).json({ updatedCount });
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ message: 'Internal Server Error' });
    }
  },
};

module.exports = notificationController;
