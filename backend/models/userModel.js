import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        profilePhoto: { type: String, default: "" },
        gender: { type: String, enum: ["Male", "Female"], required: true },
        score: { type: Number, default: 0 },

        role: { 
            type: String, 
            enum: ["user", "admin"], 
            default: "user" 
        },

        interests: {
            type: [{ type: String }],
            validate: {
                validator: function (v) {
                    return new Set(v).size === v.length;
                },
                message: "Interests must be unique",
            },
        },

        bucketList: [
            {
                text: { type: String, required: true },
                achieved: { type: Boolean, default: false },
            },
        ],

        acceptedChallenges: [
            {
                challengeText: { type: String, required: true },
                acceptedAt: { type: Date, default: Date.now },
            },
        ],

        stats: {
            totalAccepted: { type: Number, default: 0 },
            totalCustomChallenges: { type: Number, default: 0 },
            totalSkipped: { type: Number, default: 0 },
            totalCompleted: { type: Number, default: 0 },
            totalAbandoned: { type: Number, default: 0 },
        },
    },
    { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
