import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

const Score = () => {
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [isCelebrating, setIsCelebrating] = useState(false);
    const pointsPerLevel = 100;
    const maxScore = 500;
    const scoreRef = useRef(null);
    const confettiRef = useRef(null);

    // Fetch User Score
    useEffect(() => {
        const fetchScore = async () => {
            try {
                const res = await axios.get("http://localhost:5005/api/v1/user/profile", {
                    withCredentials: true,
                });
                if (res.data?.score !== undefined) {
                    const newScore = res.data.score;
                    setScore(newScore);
                    const newLevel = Math.floor(newScore / pointsPerLevel) + 1;
                    setLevel(newLevel);
                    
                    if (newLevel > level) {
                        triggerCelebration();
                    }
                }
            } catch (error) {
                console.error("Error fetching score:", error);
            }
        };

        fetchScore();
    }, []);

    // Animate Score with GSAP (keeping this since it's separate from Framer Motion)
    useEffect(() => {
        if (scoreRef.current) {
            gsap.fromTo(
                scoreRef.current,
                { innerText: 0 },
                {
                    innerText: score,
                    duration: 1.2,
                    ease: "power2.out", // Changed from elastic.out
                    snap: { innerText: 1 },
                    onUpdate: function () {
                        scoreRef.current.innerText = Math.floor(this.targets()[0].innerText);
                    },
                }
            );
        }
    }, [score]);

    const triggerCelebration = () => {
        setIsCelebrating(true);
        setTimeout(() => setIsCelebrating(false), 2000);
    };

    const getLevelBadge = () => {
        if (level >= 10) return { 
            label: "Legend 🏆", 
            color: "bg-gradient-to-br from-yellow-300 to-amber-500",
            glow: "shadow-[0_0_20px_rgba(234,179,8,0.6)]",
            emoji: "🔥"
        };
        if (level >= 5) return { 
            label: "Pro ⚡", 
            color: "bg-gradient-to-br from-blue-400 to-indigo-600",
            glow: "shadow-[0_0_15px_rgba(96,165,250,0.5)]",
            emoji: "🚀"
        };
        return { 
            label: "Newbie🌱", 
            color: "bg-gradient-to-br from-green-400 to-emerald-600",
            glow: "shadow-[0_0_10px_rgba(74,222,128,0.4)]",
            emoji: "👶"
        };
    };

    const badge = getLevelBadge();
    const pointsToNextLevel = pointsPerLevel - (score % pointsPerLevel);
    const progressPercentage = Math.min((score / maxScore) * 100, 100);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }} // Back-out ease
            className="p-6 bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl relative overflow-hidden max-w-md mx-auto"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            {/* Level Badge */}
            <motion.div className="flex items-center justify-center mb-6" whileHover={{ y: -3 }}>
                <motion.div
                    key={level}
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`w-16 h-16 rounded-full ${badge.color} ${badge.glow} flex items-center justify-center mr-4`}
                >
                    <span className="text-2xl">{badge.emoji}</span>
                </motion.div>
                <div>
                    <p className="text-xs text-gray-400 mb-1">LEVEL</p>
                    <motion.h2 
                        className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500"
                        animate={{ 
                            scale: [1, 1.05, 1],
                        }}
                        transition={{ 
                            duration: 2, 
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        {badge.label}
                    </motion.h2>
                </div>
            </motion.div>

            {/* Score Display */}
            <div className="text-center mb-8">
                <p className="text-sm text-gray-400 mb-2">YOUR SCORE</p>
                <motion.p
                    ref={scoreRef}
                    className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 mb-2"
                    whileHover={{ scale: 1.05 }}
                >
                    {score}
                </motion.p>
                <motion.p 
                    className="text-sm text-gray-400"
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 3, repeat: Infinity }}
                >
                    {pointsToNextLevel} points to level up!
                </motion.p>
            </div>

            {/* Progress Bar */}
            <div className="relative">
                <div className="h-3 bg-gray-800 rounded-full overflow-hidden mb-2">
                    <motion.div
                        className={`h-full rounded-full ${badge.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ 
                            duration: 1.5, 
                            ease: [0.6, 0.01, 0.05, 0.95] // Elastic ease
                        }}
                    />
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                    <span>0</span>
                    <span>{maxScore}</span>
                </div>
            </div>

            {/* Celebration Elements */}
            <AnimatePresence>
                {isCelebrating && (
                    <>
                        {/* Confetti */}
                        {[...Array(30)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute rounded-full w-2 h-2"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    bottom: "0%",
                                    background: ["#f43f5e", "#3b82f6", "#f59e0b", "#10b981"][Math.floor(Math.random() * 4)],
                                }}
                                initial={{ y: 0, opacity: 1, rotate: 0 }}
                                animate={{ 
                                    y: -500, 
                                    opacity: 0,
                                    rotate: 360,
                                    x: Math.random() > 0.5 ? 50 : -50,
                                }}
                                transition={{
                                    duration: 1.5,
                                    ease: "circOut",
                                    delay: Math.random() * 0.5,
                                }}
                            />
                        ))}
                        
                        {/* Trophy */}
                        <motion.div
                            className="absolute -top-8 -right-8 text-4xl"
                            initial={{ scale: 0, rotate: -30 }}
                            animate={{ scale: 1, rotate: [0, 25, -25, 0], y: [0, -20, 0] }}
                            exit={{ scale: 0 }}
                            transition={{ duration: 1.5 }}
                        >
                            🏆
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Score;