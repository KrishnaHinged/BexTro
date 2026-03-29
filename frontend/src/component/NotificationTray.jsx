import React, { useState, useEffect } from "react";
import axiosInstance, { ROOT_URL } from "../utils/axiosInstance";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaComment, FaUserPlus, FaTimes } from "react-icons/fa";
import { formatTimeAgo } from "../utils/dateFormatter";

const NotificationTray = ({ onClose }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const { socket } = useSelector(store => store.socket);

    const fetchNotifications = async () => {
        try {
            const res = await axiosInstance.get("/notifications");
            setNotifications(res.data);
        } catch (error) {
            console.error("Error fetching notifications", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();

        if (socket) {
            socket.on("newNotification", (notif) => {
                setNotifications(prev => [notif, ...prev]);
            });
            return () => socket.off("newNotification");
        }
    }, [socket]);

    const markAsRead = async () => {
        try {
            await axiosInstance.put("/notifications/read", {});
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error("Error marking as read", error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case "like": return <FaHeart className="text-red-500" />;
            case "comment": return <FaComment className="text-blue-500" />;
            case "follow": return <FaUserPlus className="text-green-500" />;
            default: return null;
        }
    };

    const getMessage = (notif) => {
        switch (notif.type) {
            case "like": return "liked your post";
            case "comment": return "commented on your post";
            case "follow": return "followed you";
            default: return "";
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            className="w-80 h-[500px] bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-110"
        >
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h3 className="font-bold text-gray-800">Notifications</h3>
                <div className="flex gap-2">
                    <button onClick={markAsRead} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                        Mark all as read
                    </button>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
                        <FaTimes />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full gap-2">
                        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-xs text-gray-500">Loading alerts...</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center gap-4">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                           <FaHeart size={32} />
                        </div>
                        <p className="text-sm text-gray-500 font-medium">No notifications yet. Interactions will appear here!</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {notifications.map((notif) => (
                            <div 
                                key={notif._id} 
                                className={`p-4 flex gap-3 hover:bg-gray-50 transition cursor-pointer ${!notif.isRead ? 'bg-indigo-50/30' : ''}`}
                            >
                                <div className="relative flex-shrink-0">
                                    <img 
                                        src={notif.sender.profilePhoto?.startsWith("http") ? notif.sender.profilePhoto : `${ROOT_URL}${notif.sender.profilePhoto}`} 
                                        alt={notif.sender.username} 
                                        className="w-10 h-10 rounded-full object-cover border border-gray-100" 
                                    />
                                    <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm text-[10px]">
                                        {getIcon(notif.type)}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-800 leading-snug">
                                        <span className="font-bold">{notif.sender.username}</span>{" "}
                                        {getMessage(notif)}
                                        {notif.post && (
                                            <span className="text-gray-500 italic truncate block text-xs mt-0.5">
                                                "{notif.post.challengeText}"
                                            </span>
                                        )}
                                    </p>
                                    <span className="text-[10px] text-gray-400 mt-1 block">
                                        {formatTimeAgo(notif.createdAt)}
                                    </span>
                                </div>
                                {!notif.isRead && (
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0 mt-2"></div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default NotificationTray;
