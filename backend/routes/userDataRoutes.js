import express from "express";
import {
    updateInterests,
    getInterests,
    updateBucketList,
    getBucketList,
} from "../controllers/userDataController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.route("/interests")
    .get(isAuthenticated, getInterests)
    .post(isAuthenticated, updateInterests);

router.route("/bucket-list")
    .get(isAuthenticated, getBucketList)
    .post(isAuthenticated, updateBucketList)
    .delete(isAuthenticated, (req, res) => {
        res.status(501).json({ error: "DELETE not implemented yet" });
    })
    .put(isAuthenticated, (req, res) => {
        res.status(501).json({ error: "PUT not implemented yet" });
    });

// Error handling middleware for this router
router.use((err, req, res, next) => {
    console.error("Route Error:", err.stack);
    res.status(500).json({ error: "Something went wrong in user data routes", details: err.message });
});



export default router;
