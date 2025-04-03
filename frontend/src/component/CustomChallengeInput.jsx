import React from "react";
import { motion } from "framer-motion";

const CustomChallengeInput = ({ customChallenge, setCustomChallenge, handleAddCustomChallenge }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="w-full max-w-3xl mx-auto mb-12 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-purple-100/50"
    >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Craft Your Challenge</h2>
        <div className="flex flex-col sm:flex-row gap-4">
            <input
                type="text"
                value={customChallenge}
                onChange={(e) => setCustomChallenge(e.target.value)}
                placeholder="e.g., 'Run 5km this week'"
                className="flex-1 p-4 rounded-xl bg-white border border-purple-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 shadow-sm"
                onKeyPress={(e) => e.key === "Enter" && handleAddCustomChallenge()}
            />
            <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)" }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddCustomChallenge}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-semibold"
            >
                Add
            </motion.button>
        </div>
        <p className="mt-2 text-sm text-gray-500">Keep it 5+ characters!</p>
    </motion.div>
);

export default CustomChallengeInput;