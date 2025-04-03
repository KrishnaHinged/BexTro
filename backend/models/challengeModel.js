// Challenge Model
import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema({
    challenges: [{
        text: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            maxlength: 500
        },
        category: {
            type: String,
            trim: true,
            default: "General",
            enum: ["General", "Personal", "Professional", "Adventure", "Creative"]
        },
        difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            default: "Medium"
        },
        source: {
            type: String,
            enum: ["AI", "User"],
            default: "AI"
        },
        addedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true }
});

// Remove duplicates and ensure text uniqueness
challengeSchema.pre("save", function(next) {
    const uniqueChallenges = [];
    const seenTexts = new Set();
    
    for (const challenge of this.challenges) {
        if (!seenTexts.has(challenge.text)) {
            seenTexts.add(challenge.text);
            uniqueChallenges.push(challenge);
        }
    }
    this.challenges = uniqueChallenges;
    next();
});

// Index for faster text searches
challengeSchema.index({ "challenges.text": 1 });

export const Challenge = mongoose.model("Challenge", challengeSchema);