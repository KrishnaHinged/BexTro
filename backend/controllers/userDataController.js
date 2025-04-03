import { User } from "../models/userModel.js";

export const updateInterests = async (req, res) => {
    try {
        console.log("Update Interests - Request Body:", req.body);
        if (!req.userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        const { interest, action } = req.body;
        if (!interest || !action) {
            return res.status(400).json({ error: "Interest and action are required" });
        }
        if (!["add", "remove"].includes(action)) {
            return res.status(400).json({ error: "Invalid action" });
        }

        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (action === "add" && !user.interests.includes(interest)) {
            user.interests.push(interest);
        } else if (action === "remove") {
            user.interests = user.interests.filter((i) => i !== interest);
        }

        await user.save();
        res.status(200).json({ success: true, message: "Interests updated", data: user.interests });
    } catch (error) {
        console.error("Update Interests Error:", error.stack);
        res.status(500).json({ error: "Failed to update interests", details: error.message });
    }
};

// Get user interests
export const getInterests = async (req, res) => {
    try {
        console.log("Get Interests - User ID:", req.userId);
        if (!req.userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        const user = await User.findById(req.userId).select("interests");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ interests: user.interests || [] });
    } catch (error) {
        console.error("Get Interests Error:", error.stack);
        res.status(500).json({ error: "Failed to fetch interests", details: error.message });
    }
};
// Update user bucket list
export const updateBucketList = async (req, res) => {
    try {
        console.log("Update Bucket List - Request Body:", req.body);
        if (!req.userId) {
            console.log("Authentication failed - No userId");
            return res.status(401).json({ error: "User not authenticated" });
        }
        const { bucketList, action, item } = req.body;
        console.log("Action and Item:", { action, item });
        const user = await User.findById(req.userId);
        if (!user) {
            console.log("User not found for ID:", req.userId);
            return res.status(404).json({ message: "User not found" });
        }

        console.log("User Found:", user);

        if (bucketList && Array.isArray(bucketList)) {
            user.bucketList = bucketList;
        } else if (action && item) {
            switch (action) {
                case "add":
                    if (!item.text) return res.status(400).json({ error: "Item text is required" });
                    const newItem = { text: item.text, achieved: item.achieved || false }; // No _id handling needed
                    user.bucketList.push(newItem);
                    break;
                case "remove":
                    user.bucketList = user.bucketList.filter((i) => i.text !== item.text);
                    break;
                case "update":
                    const index = user.bucketList.findIndex((i) => i.text === item.text);
                    if (index !== -1) {
                        user.bucketList[index] = { ...user.bucketList[index], ...item }; // Remove _id preservation
                    }
                    break;
                default:
                    return res.status(400).json({ error: "Invalid action" });
            }
        } else {
            return res.status(400).json({ error: "Invalid request format" });
        }

        console.log("Saving User with Updated Bucket List:", user.bucketList);
        await user.save();
        console.log("Save successful");
        res.status(200).json({ success: true, message: "Bucket list updated", data: user.bucketList });
    } catch (error) {
        console.error("Update Bucket List Error:", error.stack);
        res.status(500).json({ error: "Failed to update bucket list", details: error.message });
    }
};

// Get user bucket list
export const getBucketList = async (req, res) => {
    try {
        console.log("Get Bucket List - User ID:", req.userId);
        if (!req.userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        const user = await User.findById(req.userId).select("bucketList");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ bucketList: user.bucketList || [] });
    } catch (error) {
        console.error("Get Bucket List Error:", error.stack);
        res.status(500).json({ error: "Failed to fetch bucket list", details: error.message });
    }
};

