import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.get("/news", async (req, res) => {
    try {
        if (!process.env.GNEWS_API_KEY) {
            throw new Error("GNEWS_API_KEY is missing");
        }

        const response = await axios.get("https://gnews.io/api/v4/search", {
            params: {
                q: "startup",
                lang: "en",
                country: "us",
                max: 10,
                token: process.env.GNEWS_API_KEY,
            },
        });

        res.json(response.data);
    } catch (error) {
        console.error("Error fetching news:", error.response?.data || error.message);
        res.status(500).json({ error: error.message || "Failed to fetch news" });
    }
});

export default router;
