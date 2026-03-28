import express from "express";
import {
    getOtherUsers,
    login,
    logout,
    register,
    getProfile,
    updateProfile,
    updateScore,
    toggleFollow,
    sendConnectionRequest,
    acceptConnectionRequest,
    rejectConnectionRequest,
    getConnectionRequests,
    getConnections,
    getUserProfileById,
    getAllUsersAdmin,
    deleteUserAdmin,
    updateUserRoleAdmin
} from "../controllers/userController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import isAdmin from "../middleware/isAdmin.js";

const router = express.Router();
router.post("/login", login);
router.post("/logout", logout);
router.post("/register", register);

router.use(isAuthenticated);
router.get("/profile", getProfile);
router.get("/profile/:userId", getUserProfileById); // New public profile fetch
router.put("/profile", updateProfile);
router.get("/users", getOtherUsers);
router.put("/score", updateScore);

// Connections & Social
router.post("/:targetUserId/follow", toggleFollow);
router.post("/:targetUserId/connect", sendConnectionRequest);
router.post("/:targetUserId/accept", acceptConnectionRequest);
router.post("/:targetUserId/reject", rejectConnectionRequest);
router.get("/connections/requests", getConnectionRequests);
router.get("/connections", getConnections);

// Admin Management
router.get("/admin/all", isAdmin, getAllUsersAdmin);
router.delete("/admin/:userId", isAdmin, deleteUserAdmin);
router.patch("/admin/:userId/role", isAdmin, updateUserRoleAdmin);

router.get("/admin", isAdmin, (req, res) => {
    res.json({ message: "Welcome Admin!", user: req.user });
});

router.use((err, req, res, next) => {
    console.error("[USER_ROUTE_ERROR]", err.stack);
    res.status(500).json({
        success: false,
        message: "An error occurred in user routes"
    });
});

export default router;