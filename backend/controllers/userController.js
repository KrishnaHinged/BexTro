import mongoose from "mongoose";
import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error("Only JPEG/JPG/PNG images are allowed!"));
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 },
}).single("profilePhoto");

export const register = async (req, res) => {
    try {
        console.log("Received Data:", req.body);
        
        const { fullName, username, password, confirmpassword, gender } = req.body;

        if (!fullName || !username || !password || !confirmpassword || !gender) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password !== confirmpassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const userExists = await User.findOne({ username: username.trim() });
        if (userExists) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password.trim(), salt);

        const profilePhoto = `https://ui-avatars.com/api/?name=${username.trim()}&background=random&color=fff&size=256`;

        const newUser = await User.create({
            fullName,
            username: username.trim(),
            password: hashedPassword,
            profilePhoto,
            gender,
            score: 0,
        });

        console.log("User Created Successfully:", newUser);

        return res.status(201).json({ message: "User registered successfully", success: true });
    } catch (error) {
        console.error("Register Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ username: username.trim() });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password.trim(), user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        if (!process.env.JWT_SECRET_KEY) {
            throw new Error("JWT_SECRET_KEY is not set");
        }

        const token = jwt.sign({ userId: user._id, role: user.role  }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            message: "Login successful",
            success: true,
            user: {
                _id: user._id,
                username: user.username,
                fullName: user.fullName,
                profilePhoto: user.profilePhoto,
                score: user.score,
                role:user.role
            },
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("token", "", { maxAge: 0 });
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const getOtherUsers = async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const currentUser = await User.findById(req.userId);
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Only return users who are mutual connections
        const connectedUsers = await User.find({ 
            _id: { $in: currentUser.connections || [] }
        }).select("-password");

        return res.status(200).json(connectedUsers);
    } catch (error) {
        console.error("Get Other Users Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const getProfile = async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const user = await User.findById(req.userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error("Get Profile Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const getUserProfileById = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.userId;

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Determine relationship status for the UI
        let connectionStatus = "none";
        if (currentUserId) {
            const currentUser = await User.findById(currentUserId);
            if (currentUser) {
                if (currentUser.connections.includes(userId)) {
                    connectionStatus = "connected";
                } else if (currentUser.sentRequests.includes(userId)) {
                    connectionStatus = "pending";
                } else if (currentUser.receivedRequests.includes(userId)) {
                    connectionStatus = "received";
                }
            }
        }

        const isFollowing = user.followers.includes(currentUserId);

        return res.status(200).json({
            user,
            connectionStatus,
            isFollowing,
            followersCount: user.followers.length,
            followingCount: user.following.length
        });
    } catch (error) {
        console.error("Get User Profile By ID Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                console.error("Multer Error:", err.message);
                return res.status(400).json({ message: err.message });
            }

            if (!req.userId) {
                return res.status(401).json({ message: "Unauthorized access" });
            }

            const { fullName, username, score } = req.body;

            if (!fullName || !username) {
                return res.status(400).json({ message: "Full name and username are required" });
            }

            const existingUser = await User.findOne({ username: username.trim(), _id: { $ne: req.userId } });
            if (existingUser) {
                return res.status(400).json({ message: "Username already exists" });
            }

            const updateData = {
                fullName,
                username: username.trim(),
            };

            if (req.file) {
                updateData.profilePhoto = `/uploads/${req.file.filename}`;
            }
            if (score !== undefined) {
                updateData.score = Number(score);
            }

            const updatedUser = await User.findByIdAndUpdate(
                req.userId,
                updateData,
                { new: true, runValidators: true }
            ).select("-password");

            if (!updatedUser) {
                return res.status(404).json({ message: "User not found" });
            }

            return res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
        });
    } catch (error) {
        console.error("Update Profile Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const updateScore = async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const { score } = req.body;
        if (score === undefined || isNaN(score)) {
            return res.status(400).json({ message: "Valid score required" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { score: Number(score) },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "Score updated", user: updatedUser });
    } catch (error) {
        console.error("Update Score Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const toggleFollow = async (req, res) => {
    try {
        const { targetUserId } = req.params;
        const currentUserId = req.userId;

        if (targetUserId === currentUserId) {
            return res.status(400).json({ message: "You cannot follow yourself" });
        }

        const targetUser = await User.findById(targetUserId);
        const currentUser = await User.findById(currentUserId);

        if (!targetUser || !currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const isFollowing = currentUser.following.includes(targetUserId);

        if (isFollowing) {
            // Unfollow
            currentUser.following = currentUser.following.filter(id => id.toString() !== targetUserId.toString());
            targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUserId.toString());
        } else {
            // Follow
            currentUser.following.push(targetUserId);
            targetUser.followers.push(currentUserId);
        }

        await currentUser.save();
        await targetUser.save();

        return res.status(200).json({ 
            message: isFollowing ? "Unfollowed successfully" : "Followed successfully", 
            isFollowing: !isFollowing 
        });
    } catch (error) {
        console.error("Toggle Follow Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const sendConnectionRequest = async (req, res) => {
    try {
        const { targetUserId } = req.params;
        const currentUserId = req.userId;

        if (targetUserId === currentUserId) {
            return res.status(400).json({ message: "You cannot send request to yourself" });
        }

        const targetUser = await User.findById(targetUserId);
        const currentUser = await User.findById(currentUserId);

        if (!targetUser || !currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if already connected
        if (currentUser.connections.includes(targetUserId)) {
            return res.status(400).json({ message: "Already connected" });
        }

        // Check if request already sent
        if (currentUser.sentRequests.includes(targetUserId)) {
            return res.status(400).json({ message: "Request already sent" });
        }

        // Check if target has already sent request
        if (currentUser.receivedRequests.includes(targetUserId)) {
            return res.status(400).json({ message: "You have a pending request from this user" });
        }

        // Add to sent requests
        currentUser.sentRequests.push(targetUserId);
        targetUser.receivedRequests.push(currentUserId);

        await currentUser.save();
        await targetUser.save();

        return res.status(200).json({ message: "Connection request sent successfully" });
    } catch (error) {
        console.error("Send Connection Request Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const acceptConnectionRequest = async (req, res) => {
    try {
        const { targetUserId } = req.params;
        const currentUserId = req.userId;

        const targetUser = await User.findById(targetUserId);
        const currentUser = await User.findById(currentUserId);

        if (!targetUser || !currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if request exists
        if (!currentUser.receivedRequests.includes(targetUserId)) {
            return res.status(400).json({ message: "No pending request from this user" });
        }

        // Remove from requests and add to connections
        currentUser.receivedRequests = currentUser.receivedRequests.filter(id => id.toString() !== targetUserId);
        targetUser.sentRequests = targetUser.sentRequests.filter(id => id.toString() !== currentUserId);

        currentUser.connections.push(targetUserId);
        targetUser.connections.push(currentUserId);

        await currentUser.save();
        await targetUser.save();

        return res.status(200).json({ message: "Connection request accepted" });
    } catch (error) {
        console.error("Accept Connection Request Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const rejectConnectionRequest = async (req, res) => {
    try {
        const { targetUserId } = req.params;
        const currentUserId = req.userId;

        const targetUser = await User.findById(targetUserId);
        const currentUser = await User.findById(currentUserId);

        if (!targetUser || !currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if request exists
        if (!currentUser.receivedRequests.includes(targetUserId)) {
            return res.status(400).json({ message: "No pending request from this user" });
        }

        // Remove from requests
        currentUser.receivedRequests = currentUser.receivedRequests.filter(id => id.toString() !== targetUserId);
        targetUser.sentRequests = targetUser.sentRequests.filter(id => id.toString() !== currentUserId);

        await currentUser.save();
        await targetUser.save();

        return res.status(200).json({ message: "Connection request rejected" });
    } catch (error) {
        console.error("Reject Connection Request Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const getConnectionRequests = async (req, res) => {
    try {
        const currentUserId = req.userId;
        const currentUser = await User.findById(currentUserId);

        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const receivedRequests = await User.find({ 
            _id: { $in: currentUser.receivedRequests || [] }
        }).select("fullName username profilePhoto");

        const sentRequests = await User.find({ 
            _id: { $in: currentUser.sentRequests || [] }
        }).select("fullName username profilePhoto");

        return res.status(200).json({
            received: receivedRequests,
            sent: sentRequests
        });
    } catch (error) {
        console.error("Get Connection Requests Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const getConnections = async (req, res) => {
    try {
        const currentUserId = req.userId;
        const currentUser = await User.findById(currentUserId);

        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const connections = await User.find({ 
            _id: { $in: currentUser.connections || [] }
        }).select("fullName username profilePhoto");

        return res.status(200).json(connections);
    } catch (error) {
        console.error("Get Connections Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

// Admin Moderation Controllers
export const getAllUsersAdmin = async (req, res) => {
    try {
        const users = await User.find({}).select("-password");
        return res.status(200).json(users);
    } catch (error) {
        console.error("Get All Users Admin Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const deleteUserAdmin = async (req, res) => {
    try {
        const { userId } = req.params;
        await User.findByIdAndDelete(userId);
        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Delete User Admin Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const updateUserRoleAdmin = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body; // "admin" or "user"
        
        if (!["admin", "user"].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, { role }, { new: true }).select("-password");
        return res.status(200).json({ message: "User role updated", user: updatedUser });
    } catch (error) {
        console.error("Update User Role Admin Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};