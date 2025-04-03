import express from "express";
import {
    getOtherUsers,
    login,
    logout,
    register,
    getProfile,
    updateProfile,
    updateScore

} from "../controllers/userController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import isAdmin from "../middleware/isAdmin.js"; 

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.use(isAuthenticated);
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.get("/users", getOtherUsers);
router.put("/score", updateScore);
router.get("/admin", isAdmin, (req, res) => {
    res.json({ message: "Welcome Admin!", user: req.user });
});

router.use((err, req, res, next) => {
    console.error("[USER_ROUTE_ERROR]", err.stack);
    res.status(500).json({
        success: false,
        error: "An error occurred in user routes"
    });
});

export default router;