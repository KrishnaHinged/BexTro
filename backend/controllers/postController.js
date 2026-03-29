import { Post } from "../models/Post.js";
import { User } from "../models/userModel.js";
import Challenge from "../models/Challenge.js";
import { Notification } from "../models/Notification.js";
import { io, getReceiverSocketId } from "../socket/socket.js";
import multer from "multer";

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

        const populatedPost = await Post.findById(newPost._id).populate("user", "fullName username profilePhoto");
        
        // --- REAL-TIME: Broadcast new post ---
        io.emit("newPost", populatedPost);

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

        let posts = [];
        if (tab === "following") {
            const followingIds = user.following || [];
            posts = await Post.find({ user: { $in: [...followingIds, userId] } })
                .sort({ createdAt: -1 })
                .populate("user", "fullName username profilePhoto following")
                .limit(50);
        } else {
            // For You Logic: Personalization + Discovery
            let candidatePosts = await Post.find({})
                .sort({ createdAt: -1 })
                .populate("user", "fullName username profilePhoto following")
                .limit(200);

            // FALLBACK: If feed is empty or very small, inject personalized challenges as discovery items
            if (candidatePosts.length < 10) {
                const interests = (user.interests || []).map(i => i.toLowerCase());
                
                // Find challenges matching interests or just recent ones
                const challenges = await Challenge.find({
                    $or: [
                        { category: { $in: user.interests || [] } },
                        { createdFromInterests: { $in: user.interests || [] } }
                    ]
                }).limit(20);

                const finalChallenges = challenges.length > 0 ? challenges : await Challenge.find().limit(20);

                const mockPosts = finalChallenges.map(ch => ({
                    _id: ch._id,
                    challengeText: ch.text,
                    description: ch.difficulty + " Challenge: " + (ch.objective || ""),
                    proofType: "link",
                    proofUrl: "/challenges", // Redirect to challenges page to start
                    isChallengeDiscovery: true,
                    user: {
                        _id: "000000000000000000000000", // System ID
                        username: "Bextro Discovery",
                        fullName: "Bextro AI",
                        profilePhoto: "https://cdn-icons-png.flaticon.com/512/2103/2103633.png"
                    },
                    likes: [],
                    comments: [],
                    createdAt: ch.addedAt || new Date()
                }));

                candidatePosts = [...candidatePosts, ...mockPosts];
            }

            console.log(`[getFeed] Found ${candidatePosts.length} total candidates (including fallbacks).`);

            // Prepare user keywords for matching
            const interests = (user.interests || []).map(i => i.toLowerCase());
            const bucketListItems = (user.bucketList || []).map(b => b.text.toLowerCase());
            const allKeywords = [...new Set([...interests, ...bucketListItems])];
            
            console.log(`[getFeed] User keywords:`, allKeywords);

            const scoredPosts = candidatePosts.map(post => {
                let score = 0;
                const challengeText = (post.challengeText || "").toLowerCase();
                const description = (post.description || "").toLowerCase();

                // Keyword matches (+30 for interest, +40 for bucket list)
                allKeywords.forEach(keyword => {
                    if (challengeText.includes(keyword) || description.includes(keyword)) {
                        const isBucketList = bucketListItems.includes(keyword);
                        score += isBucketList ? 40 : 30;
                    }
                });

                // Engagement score (+5 per like, +10 per comment)
                score += (post.likes.length * 5);
                score += (post.comments.length * 10);

                // Author affinity (+20 if user follows the author)
                const authorId = post.user?._id?.toString();
                const isFollowingAuthor = authorId && (user.following || []).some(id => id.toString() === authorId);
                if (isFollowingAuthor) score += 20;

                return { post, score };
            });

            // Sort by score descending and take the top 50
            posts = scoredPosts
                .sort((a, b) => b.score - a.score)
                .slice(0, 50)
                .map(item => item.post);

            console.log(`[getFeed] Returning ${posts.length} personalized posts.`);
        }

        const postsWithStatus = posts.map(post => {
            const p = post.toObject ? post.toObject() : post;
            if (!p.user) return null; // Safety check

            const authorId = p.user._id.toString();
            
            let status = "none";
            if (authorId === userId.toString()) {
                status = "self";
            } else {
                const iFollow = (user.following || []).some(id => id.toString() === authorId);
                const theyFollowMe = (p.user.following || []).some(id => id.toString() === userId.toString());
                
                if (iFollow && theyFollowMe) status = "mutual";
                else if (iFollow) status = "following";
                else if (theyFollowMe) status = "followed_by";
            }
            
            p.authorConnectionStatus = status;
            delete p.user.following;
            return p;
        }).filter(Boolean);

        return res.status(200).json(postsWithStatus);
    } catch (error) {
        console.error("Get Feed Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.userId;
        const currentUser = await User.findById(currentUserId);

        const posts = await Post.find({ user: userId })
            .sort({ createdAt: -1 })
            .populate("user", "fullName username profilePhoto following");

        const postsWithStatus = posts.map(post => {
            const p = post.toObject();
            const authorId = p.user._id.toString();
            
            let status = "none";
            if (authorId === currentUserId.toString()) {
                status = "self";
            } else if (currentUser) {
                const iFollow = (currentUser.following || []).some(id => id.toString() === authorId);
                const theyFollowMe = (p.user.following || []).some(id => id.toString() === currentUserId.toString());
                
                if (iFollow && theyFollowMe) status = "mutual";
                else if (iFollow) status = "following";
                else if (theyFollowMe) status = "followed_by";
            }
            
            p.authorConnectionStatus = status;
            delete p.user.following;
            return p;
        });

        return res.status(200).json(postsWithStatus);
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

        // --- REAL-TIME: Live Like Update & Notification ---
        const authorId = post.user.toString();
        const receiverSocketId = getReceiverSocketId(authorId);

        if (!isLiked && authorId !== userId.toString()) {
            const notification = await Notification.create({
                sender: userId,
                receiver: authorId,
                type: "like",
                post: postId
            });
            const populatedNotif = await Notification.findById(notification._id).populate("sender", "fullName username profilePhoto");
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newNotification", populatedNotif);
            }
        }

        // Always broadcast the like update for the feed
        io.emit("postUpdate", { postId, likes: post.likes, type: "like" });

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
        
        // --- REAL-TIME: Live Comment Update & Notification ---
        const authorId = post.user.toString();
        const receiverSocketId = getReceiverSocketId(authorId);

        if (authorId !== userId.toString()) {
            const notification = await Notification.create({
                sender: userId,
                receiver: authorId,
                type: "comment",
                post: postId
            });
            const populatedNotif = await Notification.findById(notification._id).populate("sender", "fullName username profilePhoto");
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newNotification", populatedNotif);
            }
        }

        // Broadcast comment update for the feed
        io.emit("postUpdate", { postId, comments: populatedPost.comments, type: "comment" });

        return res.status(200).json({ message: "Comment added", comments: populatedPost.comments });
    } catch (error) {
        console.error("Add Comment Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};
