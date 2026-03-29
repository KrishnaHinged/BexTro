import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Challenges from "../components/features/challenge/Challenges";

const IntroToChallenges = () => {
    const [showText, setShowText] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowText(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center  p-6 relative overflow-hidden">
            <AnimatePresence>
                {showText && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 1 }}
                        className="w-full max-w-xl bg-white/90 text-gray-900 rounded-3xl shadow-xl p-8 text-center backdrop-blur-xl border border-white/40"
                    >
                        <h1 className="text-4xl font-extrabold mb-4 text-indigo-600">Your Journey Starts Now!!</h1>
                        <p className="text-lg leading-relaxed font-medium text-gray-800">
                            To start something new is always a challenge, but remember, every expert was once a beginner.
                        </p>
                        <p className="text-indigo-500 font-bold mt-4">— BeXtro</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Challenges Component */}
            {!showText && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.6 }}
                    className="w-full h-full flex justify-center items-center overflow-hidden"
                >
                    <Challenges />
                </motion.div>
            )}
        </div>
    );
};

export default IntroToChallenges;