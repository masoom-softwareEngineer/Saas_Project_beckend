import { Notification, NotificationType } from "../Models/notificationModel";
import { Server } from "socket.io";

export const createNotification = async (
  io: Server,
  data: {
    recipient: string;
    sender: string;
    type: NotificationType;
    title: string;
    message: string;
    relatedId?: string;
  }
) => {
  try {
    const notification = await Notification.create(data);
    io.to(data.recipient).emit("NEW_NOTIFICATION", notification);

    return notification;
  } catch (error) {
    console.error("Notification Service Error:", error);
  }
};