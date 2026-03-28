import mongoose from "mongoose";
import { User } from "../models/userModel.js";
import { Post } from "../models/Post.js";
import Community from "../models/Community.js";
import { Report } from "../models/Report.js";

export const getAdminStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const postCount = await Post.countDocuments();
        const communityCount = await Community.countDocuments();
        const reportCount = await Report.countDocuments({ status: "pending" });

        return res.status(200).json({
            users: userCount,
            posts: postCount,
            communities: communityCount,
            pendingReports: reportCount
        });
    } catch (error) {
        console.error("Get Admin Stats Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password").sort({ createdAt: -1 });
        return res.status(200).json(users);
    } catch (error) {
        console.error("Get All Users Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        await Post.findByIdAndDelete(postId);
        return res.status(200).json({ message: "Post deleted successfully." });
    } catch (error) {
        console.error("Delete Post Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};
