import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";
import { User } from "../models/userModel.js";
import Community from "../models/Community.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

// Utility function to check if users can DM
const canMessageDirectly = async (senderId, receiverId) => {
    const sender = await User.findById(senderId);
    
    // 1. Are they explicitly connected?
    if (sender.connections && sender.connections.includes(receiverId)) {
        return true;
    }

    // 2. Are they in the same Community?
    const sharedCommunity = await Community.findOne({
        members: { $all: [senderId, receiverId] }
    });

    if (sharedCommunity) {
        return true;
    }

    return false;
};

// --- PRIVATE MESSAGES ---
export const sendMessage = async (req, res) => {
    try {
        const senderId = req.userId;
        const receiverId = req.params.id;
        const { message } = req.body;

        const isAuthorized = await canMessageDirectly(senderId, receiverId);
        if (!isAuthorized) {
            return res.status(403).json({ message: "You must be connected or share a community to message this user." });
        }

        let gotConversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!gotConversation) {
            gotConversation = await Conversation.create({
                participants: [senderId, receiverId]
            });
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });

        if (newMessage) {
            gotConversation.messages.push(newMessage._id);
        }

        await Promise.all([gotConversation.save(), newMessage.save()]);

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        
        return res.status(201).json({ newMessage });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to send message" });
    }
};

export const getMessage = async (req, res) => {
    try {
        const receiverId = req.params.id;
        const senderId = req.userId;

        // Note: For reading history, blocking isn't strictly necessary since they
        // only have history if they were allowed to send at some point, 
        // but we can enforce it.
        const isAuthorized = await canMessageDirectly(senderId, receiverId);
        if (!isAuthorized) {
            return res.status(403).json({ message: "You don't have permission to view this chat." });
        }

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate("messages");

        return res.status(200).json(conversation?.messages || []);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to load messages" });
    }
};

// --- COMMUNITY GROUP MESSAGES ---
export const sendCommunityMessage = async (req, res) => {
    try {
        const senderId = req.userId;
        const communityId = req.params.id;
        const { message } = req.body;

        const community = await Community.findById(communityId);
        if (!community || !community.members.includes(senderId)) {
            return res.status(403).json({ message: "You must be a member of this community to chat here." });
        }

        // We use the Message model with communityId instead of receiverId
        const newMessage = await Message.create({
            senderId,
            communityId,
            message
        });

        // Broadcast to community room
        io.to(`community_${communityId}`).emit("newCommunityMessage", newMessage);

        return res.status(201).json({ newMessage });
    } catch (error) {
        console.error("Community Msg Error:", error);
        return res.status(500).json({ message: "Failed to send community message" });
    }
};

export const getCommunityMessages = async (req, res) => {
    try {
        const senderId = req.userId;
        const communityId = req.params.id;

        const community = await Community.findById(communityId);
        if (!community || !community.members.includes(senderId)) {
            return res.status(403).json({ message: "You must be a member to read this chat." });
        }

        // Fetch last 100 messages for community
        const messages = await Message.find({ communityId }).sort({ createdAt: 1 }).limit(100);

        return res.status(200).json(messages);
    } catch (error) {
        console.error("Get Community Msg Error:", error);
        return res.status(500).json({ message: "Failed to load community messages" });
    }
};