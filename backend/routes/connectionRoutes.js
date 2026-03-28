import express from "express";
import { User } from "../models/userModel.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

// 1. Send Connection Request
router.post("/request/:targetId", isAuthenticated, async (req, res) => {
    try {
        const userId = req.userId;
        const targetId = req.params.targetId;

        if (userId === targetId) return res.status(400).json({ message: "You can't connect with yourself" });

        const user = await User.findById(userId);
        const targetUser = await User.findById(targetId);

        if (!targetUser) return res.status(404).json({ message: "Target user not found" });

        // Check if already connected or requested
        if (user.connections.includes(targetId)) {
            return res.status(400).json({ message: "Already connected" });
        }
        if (user.sentRequests.includes(targetId)) {
            return res.status(400).json({ message: "Request already sent" });
        }

        // Add to arrays
        user.sentRequests.push(targetId);
        targetUser.receivedRequests.push(userId);

        await user.save();
        await targetUser.save();

        res.status(200).json({ message: "Connection request sent successfully" });
    } catch (error) {
        console.error("Connection Request Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// 2. Accept Connection Request
router.post("/accept/:requesterId", isAuthenticated, async (req, res) => {
    try {
        const userId = req.userId;
        const requesterId = req.params.requesterId;

        const user = await User.findById(userId);
        const requester = await User.findById(requesterId);

        if (!user.receivedRequests.includes(requesterId)) {
            return res.status(400).json({ message: "No pending request from this user" });
        }

        // Move to connections
        user.receivedRequests = user.receivedRequests.filter(id => id.toString() !== requesterId);
        user.connections.push(requesterId);
        
        // Let's also enforce followers logic to keep Feed logic happy!
        if (!user.followers.includes(requesterId)) user.followers.push(requesterId);
        if (!user.following.includes(requesterId)) user.following.push(requesterId);

        requester.sentRequests = requester.sentRequests.filter(id => id.toString() !== userId);
        requester.connections.push(userId);
        if (!requester.followers.includes(userId)) requester.followers.push(userId);
        if (!requester.following.includes(userId)) requester.following.push(userId);

        await user.save();
        await requester.save();

        res.status(200).json({ message: "Request accepted. You are now connected!" });
    } catch (error) {
        console.error("Accept Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// 3. Reject Connection Request
router.post("/reject/:requesterId", isAuthenticated, async (req, res) => {
    try {
        const userId = req.userId;
        const requesterId = req.params.requesterId;

        const user = await User.findById(userId);
        const requester = await User.findById(requesterId);

        user.receivedRequests = user.receivedRequests.filter(id => id.toString() !== requesterId);
        if (requester) {
            requester.sentRequests = requester.sentRequests.filter(id => id.toString() !== userId);
            await requester.save();
        }

        await user.save();

        res.status(200).json({ message: "Request rejected" });
    } catch (error) {
        console.error("Reject Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// 4. Disconnect (Remove connection)
router.post("/disconnect/:targetId", isAuthenticated, async (req, res) => {
    try {
        const userId = req.userId;
        const targetId = req.params.targetId;

        await User.findByIdAndUpdate(userId, {
            $pull: { connections: targetId, following: targetId, followers: targetId }
        });

        await User.findByIdAndUpdate(targetId, {
            $pull: { connections: userId, following: userId, followers: userId }
        });

        res.status(200).json({ message: "Disconnected successfully" });
    } catch (error) {
        console.error("Disconnect Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
