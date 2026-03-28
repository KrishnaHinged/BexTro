import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import isAdmin from "../middleware/isAdmin.js";
import { getAdminStats, getAllUsers, deletePost } from "../controllers/adminController.js";

const router = express.Router();

router.use(isAuthenticated);
router.use(isAdmin);

router.get("/stats", getAdminStats);
router.get("/users", getAllUsers);
router.delete("/post/:postId", deletePost);

export default router;
