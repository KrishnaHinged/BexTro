import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const DailyQuotes = () => {
    const [quote, setQuote] = useState("Loading inspirational quote...");
    const [author, setAuthor] = useState("");

    useEffect(() => {
        const fetchQuote = async () => {
            try {
                const response = await fetch("http://localhost:5005/api/v1/quotes/random");
                const data = await response.json();
                if (data) {
                    setQuote(data.text);
                    setAuthor(data.author);
                } else {
                    setQuote("Believe in yourself and all that you are.");
                    setAuthor("Christian D. Larson");
                }
            } catch (error) {
                console.error("Error fetching quote:", error);
                setQuote("The best way to predict the future is to create it.");
                setAuthor("Peter Drucker");
            }
        };

        fetchQuote();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="p-6 bg-white/80 rounded-2xl shadow-xl backdrop-blur-md border border-white/30 text-center"
        >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Daily Inspiration</h2>
            <p className="text-lg italic text-gray-700">"{quote}"</p>
            <p className="text-sm text-gray-500 mt-2">- {author}</p>
        </motion.div>
    );
};

export default DailyQuotes;