import { Notification } from "../models/Notification.js";

// Get user notifications
export const getNotifications = async (req, res) => {
    try {
        const userId = req.userId;
        const notifications = await Notification.find({ receiver: userId })
            .sort({ createdAt: -1 })
            .populate("sender", "fullName username profilePhoto")
            .populate("post", "challengeText")
            .limit(50);

        return res.status(200).json(notifications);
    } catch (error) {
        console.error("Get Notifications Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

// Mark notifications as read
export const markAsRead = async (req, res) => {
    try {
        const userId = req.userId;
        await Notification.updateMany({ receiver: userId, isRead: false }, { $set: { isRead: true } });
        return res.status(200).json({ message: "Notifications marked as read" });
    } catch (error) {
        console.error("Mark as Read Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

// Delete a specific notification
export const deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;
        await Notification.findByIdAndDelete(notificationId);
        return res.status(200).json({ message: "Notification deleted" });
    } catch (error) {
        console.error("Delete Notification Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};
