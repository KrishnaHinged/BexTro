import mongoose from "mongoose";

const messageModel = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        // Optional because messages could be sent to a whole community instead
    },
    communityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Community",
        // Also optional since a message could be a direct private ping
    },
    message: {
        type: String,
        required: true
    },
    isSeen: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export const Message = mongoose.model("Message", messageModel);