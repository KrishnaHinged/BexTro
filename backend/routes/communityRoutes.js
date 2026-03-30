import express from "express";
import path from "path";
import multer from "multer";
import Community from "../models/Community.js";
import { User } from "../models/userModel.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

// Multer setup for community profile photos
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, `community-${Date.now()}${path.extname(file.originalname).toLowerCase()}`),
});
const fileFilter = (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    if (allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only image files (jpeg, jpg, png, webp) are allowed"), false);
    }
};
const uploadCommunityPhoto = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter }).single("profilePhoto");

// 1. Create a Public Community
router.post("/create", isAuthenticated, (req, res, next) => {
    uploadCommunityPhoto(req, res, (err) => {
        if (err) return res.status(400).json({ message: err.message });
        next();
    });
}, async (req, res) => {
    try {
        const { name, description, tags, coverColor } = req.body;
        const userId = req.userId;

        if (!name || !description) {
            return res.status(400).json({ message: "Name and Description are required" });
        }

        const existing = await Community.findOne({ name });
        if (existing) {
            return res.status(400).json({ message: "A community with this name already exists" });
        }

        const profilePhoto = req.file ? `/uploads/${req.file.filename}` : "";

        const newCommunity = await Community.create({
            name,
            description,
            creator: userId,
            admins: [userId],
            members: [userId],
            tags: tags || [],
            coverColor: coverColor || "from-indigo-500 to-purple-600",
            profilePhoto,
        });

        res.status(201).json({ message: "Community created!", community: newCommunity });
    } catch (error) {
        console.error("Community Create Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// 2. Explore Public Communities (Discovery)
router.get("/explore", isAuthenticated, async (req, res) => {
    try {
        const userId = req.userId;
        // Find communities the user is NOT a member of yet
        const communities = await Community.find({ members: { $ne: userId } })
            .sort({ createdAt: -1 })
            .limit(20)
            .lean();

        const payload = communities.map(c => {
            const memberCount = c.members?.length || 0;
            delete c.members;
            return { ...c, memberCount };
        });

        res.status(200).json(payload);
    } catch (error) {
        console.error("Community Explore Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// 3. Get Joined Communities
router.get("/my-communities", isAuthenticated, async (req, res) => {
    try {
        const userId = req.userId;
        const communities = await Community.find({ members: userId })
            .sort({ createdAt: -1 })
            .lean();

        const payload = communities.map(c => {
            const memberCount = c.members?.length || 0;
            delete c.members;
            return { ...c, memberCount };
        });

        res.status(200).json(payload);
    } catch (error) {
        console.error("My Communities Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// 4. Join a Community
router.post("/join/:communityId", isAuthenticated, async (req, res) => {
    try {
        const userId = req.userId;
        const communityId = req.params.communityId;

        const community = await Community.findById(communityId);
        if (!community) return res.status(404).json({ message: "Community not found" });

        if (community.members.includes(userId)) {
            return res.status(400).json({ message: "Already a member" });
        }

        community.members.push(userId);
        await community.save();

        res.status(200).json({ message: "Welcome to the community!", community });
    } catch (error) {
        console.error("Join Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// 5. Leave a Community
router.post("/leave/:communityId", isAuthenticated, async (req, res) => {
    try {
        const userId = req.userId;
        const communityId = req.params.communityId;

        const community = await Community.findById(communityId);
        if (!community) return res.status(404).json({ message: "Community not found" });

        if (!community.members.includes(userId)) {
            return res.status(400).json({ message: "Not a member" });
        }

        community.members = community.members.filter(id => id.toString() !== userId);
        
        // Handling Edge case: If creator leaves? Or admins? (Skip deep logic for Phase 1 MVP)

        await community.save();
        res.status(200).json({ message: "You left the community", communityId });
    } catch (error) {
        console.error("Leave Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
