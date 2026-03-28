import { Post } from "../models/Post.js";
import { User } from "../models/userModel.js";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    },
});

export const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // Allowed up to 50MB for videos
}).single("proofFile");

export const createPost = async (req, res) => {
    try {
        const { challengeText, challengeId, proofType, proofUrl, timelineTaken, description } = req.body;
        const userId = req.userId;

        if (!challengeText || !proofType || !timelineTaken) {
            return res.status(400).json({ message: "Missing required fields: challengeText/proofType/timelineTaken." });
        }

        const allowedTypes = ["image", "video", "blog", "link"];
        if (!allowedTypes.includes(proofType)) {
            return res.status(400).json({ message: "Invalid proofType." });
        }

        let finalProofUrl = proofUrl;

        if (proofType === "image" || proofType === "video") {
            if (!req.file && !proofUrl) {
                return res.status(400).json({ message: "Proof file is required for image and video types." });
            }
            if (req.file) {
                finalProofUrl = `/uploads/${req.file.filename}`;
            }
        } else if (proofType === "blog") {
            if (!proofUrl || !proofUrl.trim()) {
                return res.status(400).json({ message: "Blog content is required for proofType blog." });
            }
        } else if (proofType === "link") {
            if (!proofUrl || !/^https?:\/\//.test(proofUrl.trim())) {
                return res.status(400).json({ message: "Valid link is required for proofType link." });
            }
        }

        if (!finalProofUrl) {
            return res.status(400).json({ message: "Proof URL or uploaded file is required." });
        }

        const newPost = await Post.create({
            user: userId,
            challengeText,
            challengeId: challengeId || null,
            proofType,
            proofUrl: finalProofUrl,
            description: description ? description.trim() : "",
            timelineTaken: Number(timelineTaken),
        });

        // Update user model to reflect completion 
        const user = await User.findById(userId);
        if (user) {
            // Find the active challenge
            const challengeIndex = user.acceptedChallenges.findIndex(
                (c) => c.challengeText === challengeText && c.status === "active"
            );

            if (challengeIndex !== -1) {
                user.acceptedChallenges[challengeIndex].status = "completed";
                user.acceptedChallenges[challengeIndex].proofPostId = newPost._id;
            } else {
                // If they completed directly without active status
                user.acceptedChallenges.push({
                    challengeText,
                    status: "completed",
                    timelineDays: timelineTaken,
                    proofPostId: newPost._id
                });
            }

            user.stats.totalCompleted = (user.stats.totalCompleted || 0) + 1;
            user.score = (user.score || 0) + 10;
            await user.save();
        }

        return res.status(201).json({ message: "Proof uploaded successfully", post: newPost });
    } catch (error) {
        console.error("Create Post Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const getFeed = async (req, res) => {
    try {
        const { tab } = req.query; // 'following' or 'foryou'
        const userId = req.userId;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        let filter = {};
        
        if (tab === "following") {
            // Include following + own posts
            const followingIds = user.following || [];
            filter = { user: { $in: [...followingIds, userId] } };
        } 
        // If tab is 'foryou' or undefined, global feed (no user filter)

        const posts = await Post.find(filter)
            .sort({ createdAt: -1 })
            .populate("user", "fullName username profilePhoto")
            .limit(50); // pagination can be added later

        return res.status(200).json(posts);
    } catch (error) {
        console.error("Get Feed Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const posts = await Post.find({ user: userId })
            .sort({ createdAt: -1 })
            .populate("user", "fullName username profilePhoto");

        return res.status(200).json(posts);
    } catch (error) {
        console.error("Get User Posts Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const toggleLike = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.userId;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const isLiked = post.likes.includes(userId);

        if (isLiked) {
            post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
        } else {
            post.likes.push(userId);
        }

        await post.save();
        return res.status(200).json({ message: isLiked ? "Post unliked" : "Post liked", likes: post.likes });
    } catch (error) {
        console.error("Toggle Like Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const addComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { text } = req.body;
        const userId = req.userId;

        if (!text || text.trim() === "") {
            return res.status(400).json({ message: "Comment cannot be empty" });
        }

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const comment = { user: userId, text };
        post.comments.push(comment);
        await post.save();

        const populatedPost = await Post.findById(postId).populate("comments.user", "fullName username profilePhoto");
        
        return res.status(200).json({ message: "Comment added", comments: populatedPost.comments });
    } catch (error) {
        console.error("Add Comment Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};
