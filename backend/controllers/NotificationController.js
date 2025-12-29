import Notification from "../models/NotificationModel.js";

export const getNotifications = async (req, res) => {
  try {
    const { id_petualang } = req.params;
    const notifications = await Notification.findAll({
      where: { id_petualang },
      order: [["created_at", "DESC"]],
    });
    res.status(200).json({ data: notifications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.update({ is_read: true }, { where: { id_notification: id } });
    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markAllRead = async (req, res) => {
  try {
    const { id_petualang } = req.params;
    await Notification.update({ is_read: true }, { where: { id_petualang } });
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
