import Notification from "../models/NotificationModel.js";

export const createNotification = async (
  id_petualang,
  title,
  message,
  type = "system"
) => {
  if (!id_petualang) return null;
  return Notification.create({
    id_petualang,
    title,
    message,
    type,
  });
};
