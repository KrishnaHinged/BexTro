import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";
import { User } from "../models/userModel.js";
import Community from "../models/Community.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import { Notification } from "../models/Notification.js";

// Utility function to check if users can DM
const canMessageDirectly = async (senderId, receiverId) => {
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);
    
    if (!sender || !receiver) return false;

    // 1. Connection Check (Primary BexTro Architecture)
    const isConnected = sender.connections && sender.connections.includes(receiverId);
    if (isConnected) return true;

    // 2. Mutual Follow Check (BexTro Restriction)
    const senderFollowsReceiver = sender.following && sender.following.includes(receiverId);
    const receiverFollowsSender = receiver.following && receiver.following.includes(senderId);

    if (senderFollowsReceiver && receiverFollowsSender) {
        return true;
    }

    // 3. Are they in the same Community?
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

        // Populate sender before emitting and returning
        const populatedMessage = await Message.findById(newMessage._id).populate("senderId", "fullName username profilePhoto");

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", populatedMessage);
        }

        // Create notification for new message
        try {
            const notification = await Notification.create({
                sender: senderId,
                receiver: receiverId,
                type: "message",
            });
            const populatedNotif = await Notification.findById(notification._id).populate("sender", "fullName username profilePhoto");
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newNotification", populatedNotif);
            }
        } catch (error) {
            console.error("Error creating chat notification:", error.message);
        }
        
        return res.status(201).json({ newMessage: populatedMessage });
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
        }).populate({
            path: "messages",
            populate: { path: "senderId", select: "fullName username profilePhoto" }
        });

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

        const newMessage = await Message.create({
            senderId,
            communityId,
            message
        });

        // Populate sender before emitting
        const populatedMessage = await Message.findById(newMessage._id).populate("senderId", "fullName username profilePhoto");

        // Broadcast to community room
        io.to(`community_${communityId}`).emit("newCommunityMessage", populatedMessage);

        // Create notifications for other members
        try {
            const otherMembers = community.members.filter(m => m.toString() !== senderId.toString());
            const notifications = otherMembers.map(memberId => ({
                sender: senderId,
                receiver: memberId,
                type: "communityMessage",
                community: communityId
            }));
            
            if (notifications.length > 0) {
                const createdNotifs = await Notification.insertMany(notifications);
                
                // Emit to online members
                for (const memberId of otherMembers) {
                    const receiverSocketId = getReceiverSocketId(memberId);
                    if (receiverSocketId) {
                        // Find the specific notif for this receiver
                        const myNotif = createdNotifs.find(n => n.receiver.toString() === memberId.toString());
                        if (myNotif) {
                            const populatedNotif = await Notification.findById(myNotif._id).populate("sender", "fullName username profilePhoto");
                            io.to(receiverSocketId).emit("newNotification", populatedNotif);
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Error creating community notifications:", error.message);
        }

        return res.status(201).json({ newMessage: populatedMessage });
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

        // Fetch last 100 messages for community with sender info
        const messages = await Message.find({ communityId })
            .populate("senderId", "fullName username profilePhoto")
            .sort({ createdAt: 1 })
            .limit(100);

        return res.status(200).json(messages);
    } catch (error) {
        console.error("Get Community Msg Error:", error);
        return res.status(500).json({ message: "Failed to load community messages" });
    }
};