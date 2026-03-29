import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
});

const postSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        challengeText: { type: String, required: true },
        challengeId: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge", default: null },
        proofType: {
            type: String,
            enum: ["image", "video", "blog", "link"],
            required: true,
        },
        proofUrl: { type: String, required: true },
        description: { type: String, default: "" },
        timelineTaken: { type: Number, required: true }, // in days
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        comments: [commentSchema],
        visibility: { 
            type: String, 
            enum: ["public", "private"], 
            default: "public" 
        },
    },
    { timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);
