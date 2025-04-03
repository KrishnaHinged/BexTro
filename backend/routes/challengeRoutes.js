import express from "express";
import { Together } from "together-ai";
import { User } from "../models/userModel.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();
const together = new Together({ apiKey: process.env.TOGETHER_AI_API_KEY });

export default function challengeRoutes(filter) {
    if (!filter || typeof filter.check !== "function") {
        throw new Error("Content filter function is required!");
    }

    // 🟢 Generate AI-Based Challenges
    router.get("/generate-challenges", isAuthenticated, async (req, res) => {
        try {
            const user = await User.findById(req.userId);
            if (!user) return res.status(404).json({ message: "User not found" });

            const interests = user.interests || [];
            const bucketList = user.bucketList.map((item) => item.text) || [];

            if (interests.length === 0 && bucketList.length === 0) {
                return res.status(400).json({ error: "Add interests or bucket list items first." });
            }

            const prompt = `
                Generate exactly 4 motivational and achievable challenges based on these interests: ${interests.join(
                    ", "
                )} and bucket list goals: ${bucketList.join(
                    ", "
                )}. Output **only** in valid JSON format without any extra text, markdown, or comments:

                [
                    {
                        "text": "Challenge description",
                        "objective": "Objective description",
                        "motivation": "Why it matters",
                        "benefits": ["Benefit 1", "Benefit 2"]
                    }
                ]
            `;

            const response = await together.chat.completions.create({
                model: "meta-llama/Llama-3-70b-chat-hf",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 500,
                temperature: 0.7,
            });

            const rawText = response.choices?.[0]?.message?.content || "";
            console.log("Raw AI Response:", rawText); // Debugging

            let challenges = [];

            try {
                const parsedChallenges = JSON.parse(rawText);
                if (Array.isArray(parsedChallenges)) {
                    challenges = parsedChallenges
                        .map((c) => ({
                            text: c.text?.trim() || "Unnamed Challenge",
                            objective: c.objective || "Complete this challenge!",
                            motivation: c.motivation || "Stay motivated!",
                            benefits: Array.isArray(c.benefits) ? c.benefits : ["Self-improvement"],
                        }))
                        .filter((c) => c.text.length >= 5 && !filter.check(c.text));
                } else {
                    throw new Error("Invalid JSON format");
                }
            } catch (error) {
                console.error("JSON Parsing Error:", error);
                return res.status(500).json({ error: "Failed to parse AI response." });
            }

            if (challenges.length === 0) {
                return res.status(500).json({ error: "No valid challenges generated." });
            }

            res.status(200).json({ challenges });
        } catch (error) {
            console.error("Challenge Generation Error:", error);
            res.status(500).json({ error: "Failed to generate challenges" });
        }
    });

    // 🟢 Accept Challenge
    router.post("/accept", isAuthenticated, async (req, res) => {
        try {
            const { challenge } = req.body;
            if (!challenge || typeof challenge !== "string") {
                return res.status(400).json({ message: "Valid challenge text required." });
            }

            if (filter.check(challenge)) {
                return res.status(400).json({ message: "Inappropriate challenge content." });
            }

            const user = await User.findById(req.userId);
            if (!user) return res.status(404).json({ message: "User not found" });

            user.acceptedChallenges.push({ challengeText: challenge, acceptedAt: new Date() });
            user.stats.totalAccepted = (user.stats.totalAccepted || 0) + 1;

            await user.save();
            res.status(200).json({ message: "Challenge accepted and saved!" });
        } catch (error) {
            console.error("Error accepting challenge:", error);
            res.status(500).json({ message: "Failed to accept challenge" });
        }
    });

    // 🟢 Custom Challenge
    router.post("/custom", isAuthenticated, async (req, res) => {
        try {
            let { challengeText } = req.body;
            if (!challengeText || typeof challengeText !== "string") {
                return res.status(400).json({ message: "Challenge text is required." });
            }

            if (filter.check(challengeText)) {
                return res.status(400).json({ message: "Inappropriate challenge content." });
            }

            const user = await User.findById(req.userId);
            if (!user) return res.status(404).json({ message: "User not found" });

            user.acceptedChallenges.push({ challengeText, acceptedAt: new Date() });
            user.stats.totalCustomChallenges = (user.stats.totalCustomChallenges || 0) + 1;

            await user.save();
            res.status(200).json({ message: "Custom challenge added successfully!" });
        } catch (error) {
            console.error("Error creating custom challenge:", error);
            res.status(500).json({ message: "Failed to create custom challenge" });
        }
    });

    // 🟢 Skip Challenge
    router.post("/skip", isAuthenticated, async (req, res) => {
        try {
            const user = await User.findById(req.userId);
            if (!user) return res.status(404).json({ message: "User not found" });

            user.stats.totalSkipped = (user.stats.totalSkipped || 0) + 1;
            await user.save();

            res.status(200).json({ message: "Challenge skipped!" });
        } catch (error) {
            console.error("Error skipping challenge:", error);
            res.status(500).json({ message: "Failed to skip challenge" });
        }
    });

    // 🟢 Complete Challenge
    router.post("/complete", isAuthenticated, async (req, res) => {
        try {
            const { challengeText } = req.body;
            if (!challengeText) return res.status(400).json({ message: "Challenge text required." });

            const user = await User.findById(req.userId);
            if (!user) return res.status(404).json({ message: "User not found" });

            const index = user.acceptedChallenges.findIndex(c => c.challengeText === challengeText);
            if (index === -1) return res.status(404).json({ message: "Challenge not found" });

            user.acceptedChallenges.splice(index, 1);
            user.stats.totalCompleted = (user.stats.totalCompleted || 0) + 1;
            user.score = (user.score || 0) + 10; // Add 10 points for completing a challenge

            await user.save();
            console.log("Updated User Score after Completion:", user.score); // Debug

            res.status(200).json({ 
                message: "Challenge completed!", 
                score: user.score 
            });
        } catch (error) {
            console.error("Error completing challenge:", error);
            res.status(500).json({ message: "Failed to complete challenge" });
        }
    });

    // 🟢 Abandon Challenge
    router.post("/aboard", isAuthenticated, async (req, res) => {
        try {
            const { challengeText } = req.body;
            if (!challengeText) return res.status(400).json({ message: "Challenge text required." });

            const user = await User.findById(req.userId);
            if (!user) return res.status(404).json({ message: "User not found" });

            const index = user.acceptedChallenges.findIndex(c => c.challengeText === challengeText);
            if (index === -1) return res.status(404).json({ message: "Challenge not found" });

            user.acceptedChallenges.splice(index, 1);
            user.stats.totalAbandoned = (user.stats.totalAbandoned || 0) + 1;

            await user.save();

            res.status(200).json({ message: "Challenge abandoned!" });
        } catch (error) {
            console.error("Error abandoning challenge:", error);
            res.status(500).json({ message: "Failed to abandon challenge" });
        }
    });

    return router;
}