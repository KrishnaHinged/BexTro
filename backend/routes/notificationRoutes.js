import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { getNotifications, markAsRead, deleteNotification } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", isAuthenticated, getNotifications);
router.put("/read", isAuthenticated, markAsRead);
router.delete("/:notificationId", isAuthenticated, deleteNotification);

export default router;
