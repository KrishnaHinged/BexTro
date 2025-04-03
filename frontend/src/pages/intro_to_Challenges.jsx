import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Challenges from "../component/Challenges.jsx";

const IntroToChallenges = () => {
    const [showText, setShowText] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowText(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#8EC5FC] to-[#E0C3FC] text-white p-6 relative overflow-hidden">
            <AnimatePresence>
                {showText && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.6 }}
                        className="w-full max-w-xl bg-white/90 text-gray-900 rounded-3xl shadow-xl p-8 text-center backdrop-blur-xl border border-white/40"
                    >
                        <h1 className="text-4xl font-extrabold mb-4 text-indigo-600">Your Journey Starts Now 🚀</h1>
                        <p className="text-lg leading-relaxed font-medium text-gray-800">
                            It's okay if life held you back before, but now is your time. Every dream starts with a single
                            step—take it today, and one day, you'll look back and be proud you did.
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