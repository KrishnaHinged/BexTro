import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { User } from "../models/userModel.js";
import Challenge from "../models/Challenge.js"; // Correct default import
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

// Safe Gemini initialization
let model = null;
try {
    if (!process.env.GEMINI_API_KEY) {
        console.warn("GEMINI_API_KEY not set — using fallback mode");
    } else {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                temperature: 0.8,
                maxOutputTokens: 1000,
                responseMimeType: "application/json",
            },
        });
    }
} catch (err) {
    console.error("Gemini failed to initialize:", err.message);
}

export default function challengeRoutes(filter) {
    if (!filter || typeof filter.check !== "function") {
        throw new Error("Content filter function is required!");
    }

    // Generate AI-Based Challenges — BULLETPROOF VERSION
    // Generate AI-Based Challenges — FULLY PERSONALIZED + BULLETPROOF
    router.get("/generate-challenges", isAuthenticated, async (req, res) => {
        try {
            const user = await User.findById(req.userId).lean();
            if (!user) return res.status(404).json({ message: "User not found" });

            const interests = user.interests || [];
            const bucketList = user.bucketList?.map(i => i.text) || [];
            const keywords = [...new Set([...interests, ...bucketList])];

            if (keywords.length === 0) {
                return res.status(400).json({ error: "Add interests or bucket list items first!" });
            }

            let challenges = [];

            // Try Gemini first (with strong personalization)
            if (model) {
                try {
                    const prompt = `You are a motivational coach. Generate exactly 4 short, exciting, and achievable challenges based ONLY on these user interests and goals:

Interests & Bucket List: ${keywords.join(", ")}

Return ONLY valid JSON (no markdown, no extra text):

[{"text":"Challenge title (50-90 chars)","objective":"What to do","motivation":"Why it matters to them","benefits":["Benefit 1","Benefit 2","Benefit 3"]}]
`;

                    const result = await model.generateContent(prompt);
                    const rawText = result.response?.text?.()?.trim() || "";

                    console.log("Gemini raw:", rawText);

                    if (rawText) {
                        const parsed = JSON.parse(rawText);
                        if (Array.isArray(parsed) && parsed.length > 0) {
                            challenges = parsed;
                        }
                    }
                } catch (geminiErr) {
                    console.warn("Gemini failed, using smart fallback:", geminiErr.message);
                }
            }

            // SMART PERSONALIZED FALLBACK — uses actual keywords!
            if (challenges.length < 4) {
                const fallbackTemplates = [
                    { text: `Spend 15 minutes learning about ${keywords[0]} today`, objective: "Expand knowledge", motivation: "You're passionate about this", benefits: ["Growth", "Curiosity", "Confidence"] },
                    { text: `Do one small action toward "${keywords[keywords.length > 1 ? 1 : 0]}" this week`, objective: "Build momentum", motivation: "Your bucket list is calling", benefits: ["Progress", "Excitement", "Pride"] },
                    { text: `Teach someone what you know about ${keywords[0] || "your passion"}`, objective: "Share value", motivation: "Teaching deepens mastery", benefits: ["Connection", "Respect", "Clarity"] },
                    { text: `Find and save one inspiring ${keywords[0] || "idea"} resource`, objective: "Curate inspiration", motivation: "Fuel your journey", benefits: ["Motivation", "Direction day"] },
                    { text: `Take a photo related to ${keywords[0] || "your dream"} and set it as wallpaper`, objective: "Stay reminded", motivation: "Visual cues change behavior", benefits: ["Focus", "Daily motivation"] },
                    { text: `Message someone who shares your interest in ${keywords[0] || "growth"}`, objective: "Build community", motivation: "You're not alone", benefits: ["Support", "Ideas", "Friendship"] },
                    { text: `Set a 7-day micro-goal for ${keywords[0] || "your passion"}`, objective: "Create habit", motivation: "Small wins compound", benefits: ["Discipline", "Confidence", "Results"] },
                    { text: `Remove one thing blocking your ${keywords[0] || "goal"} progress`, objective: "Clear the path", motivation: "Less friction = more action", benefits: ["Clarity", "Freedom", "Speed"] }
                ];

                // Shuffle and pick 4 that match user's keywords
                challenges = fallbackTemplates
                    .filter(t => keywords.some(k => t.text.toLowerCase().includes(k.toLowerCase())))
                    .sort(() => Math.random() - 0.5)
                    .concat(fallbackTemplates.sort(() => Math.random() - 0.5)) // add generics if needed
                    .slice(0, 4);
            }

            // Final clean output
            const finalChallenges = challenges
                .filter(c => c?.text && c.text.length > 20 && c.text.length < 150)
                .filter(c => !filter.check(c.text))
                .slice(0, 4)
                .map(c => ({
                    text: c.text.trim(),
                    objective: c.objective || "Take action",
                    motivation: c.motivation || "This moves you forward",
                    benefits: Array.isArray(c.benefits) ? c.benefits : ["Growth", "Joy"]
                }));

            // Save to DB
            await Promise.all(
                finalChallenges.map(ch =>
                    Challenge.create({
                        ...ch,
                        createdFromInterests: keywords,
                        source: "AI"
                    })
                )
            );

            res.json({ challenges: finalChallenges });

        } catch (error) {
            console.error("Critical error:", error);
            // Even in total crash — still personalized!
            const keyword = keywords[0] || "growth";
            res.json({
                challenges: [
                    { text: `Take one tiny step toward ${keyword} today`, objective: "Start now", motivation: "You've been waiting long enough", benefits: ["Momentum", "Pride"] },
                    { text: `Spend 10 minutes researching ${keyword}`, objective: "Learn more", motivation: "Knowledge is power", benefits: ["Clarity", "Confidence"] },
                    { text: `Tell one person about your interest in ${keyword}`, objective: "Share your fire", motivation: "Speaking it makes it real", benefits: ["Accountability", "Connection"] },
                    { text: `Do something today that future you will thank you for`, objective: "Build your future", motivation: "You're worth it", benefits: ["Peace", "Growth"] }
                ]
            });
        }
    });

    // All your other routes — untouched and perfect
    router.post("/accept", isAuthenticated, async (req, res) => {
        try {
            const { challenge, timelineDays } = req.body;
            if (!challenge || typeof challenge !== "string") {
                return res.status(400).json({ message: "Valid challenge text required." });
            }
            if (filter.check(challenge)) {
                return res.status(400).json({ message: "Inappropriate challenge content." });
            }
            const user = await User.findById(req.userId);
            if (!user) return res.status(404).json({ message: "User not found" });

            const acceptedItem = {
                challengeText: challenge,
                acceptedAt: new Date(),
                status: "active",
                timelineDays: timelineDays ? Number(timelineDays) : 1
            };

            user.acceptedChallenges.push(acceptedItem);
            user.stats.totalAccepted = (user.stats.totalAccepted || 0) + 1;
            await user.save();

            res.json({ message: "Challenge accepted and saved!" });
        } catch (error) {
            console.error("Error accepting challenge:", error);
            res.status(500).json({ message: "Failed to accept challenge" });
        }
    });

    router.post("/custom", isAuthenticated, async (req, res) => {
        try {
            const { challengeText } = req.body;
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

            res.json({ message: "Custom challenge added successfully!" });
        } catch (error) {
            console.error("Error creating custom challenge:", error);
            res.status(500).json({ message: "Failed to create custom challenge" });
        }
    });

    router.post("/skip", isAuthenticated, async (req, res) => {
        try {
            const user = await User.findById(req.userId);
            if (!user) return res.status(404).json({ message: "User not found" });
            user.stats.totalSkipped = (user.stats.totalSkipped || 0) + 1;
            await user.save();
            res.json({ message: "Challenge skipped!" });
        } catch (error) {
            console.error("Error skipping challenge:", error);
            res.status(500).json({ message: "Failed to skip challenge" });
        }
    });

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
            user.score = (user.score || 0) + 10;
            await user.save();

            res.json({ message: "Challenge completed!", score: user.score });
        } catch (error) {
            console.error("Error completing challenge:", error);
            res.status(500).json({ message: "Failed to complete challenge" });
        }
    });

    router.post("/abandon", isAuthenticated, async (req, res) => {
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

            res.json({ message: "Challenge abandoned!" });
        } catch (error) {
            console.error("Error abandoning challenge:", error);
            res.status(500).json({ message: "Failed to abandon challenge" });
        }
    });

    // AI Timeline Suggestion
    router.post("/suggest-timeline", isAuthenticated, async (req, res) => {
        try {
            const { challengeText } = req.body;
            if (!challengeText) {
                return res.status(400).json({ message: "Challenge text is required." });
            }

            if (!model) {
                // Fallback deterministic logic if Gemini API key isn't provided
                const lowerText = challengeText.toLowerCase();
                let days = 3; // Default medium
                if (lowerText.length < 20 || lowerText.includes("drink") || lowerText.includes("read a page")) days = 1;
                else if (lowerText.includes("marathon") || lowerText.includes("build a") || lowerText.length > 80) days = 7;
                return res.json({ suggestedDays: days });
            }

            const prompt = `Analyze this challenge and suggest a realistic timeline in days to complete it. The challenge is: "${challengeText}". Respond with ONLY a single integer representing the number of days (e.g., 1, 3, or 7). Do not include any other text or characters.`;

            // Reinitialize model context dynamically just in case for exact output format
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const strictModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const result = await strictModel.generateContent(prompt);
            const response = await result.response;
            const textResponse = response.text().trim();

            // Extract the first integer found in the response
            const match = textResponse.match(/\d+/);
            const suggestedDays = match ? parseInt(match[0], 10) : 3;

            res.json({ suggestedDays });
        } catch (error) {
            console.error("AI Timeline Suggestion Error:", error);
            res.status(500).json({ message: "Failed to generate AI timeline suggestion." });
        }
    });

    return router;
}