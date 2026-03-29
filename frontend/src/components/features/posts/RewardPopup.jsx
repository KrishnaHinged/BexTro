import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';

const RewardPopup = ({ rewards, onClose }) => {
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
    const [showConfetti, setShowConfetti] = useState(true);

    useEffect(() => {
        const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        const timer = setTimeout(() => setShowConfetti(false), 5000);
        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timer);
        };
    }, []);

    if (!rewards) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                {showConfetti && <Confetti width={dimensions.width} height={dimensions.height} recycle={false} numberOfPieces={200} gravity={0.1} />}
                
                <motion.div 
                    initial={{ scale: 0.5, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.5, opacity: 0, y: 20 }}
                    className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl border-4 border-indigo-100 text-center relative overflow-hidden"
                >
                    {/* Background Glow */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                    
                    <motion.div 
                        initial={{ rotate: -10 }}
                        animate={{ rotate: 10 }}
                        transition={{ repeat: Infinity, repeatType: "reverse", duration: 2 }}
                        className="text-6xl mb-4"
                    >
                        🎉
                    </motion.div>
                    
                    <h2 className="text-3xl font-black text-gray-900 mb-1 tracking-tight">Challenge Completed!</h2>
                    <p className="text-gray-500 font-bold text-sm mb-6 uppercase tracking-widest">You're building momentum</p>

                    <div className="space-y-4 mb-8">
                        {/* XP Reward */}
                        <div className="bg-indigo-50 p-4 rounded-2xl flex items-center justify-between border border-indigo-100/50">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">🎯</span>
                                <span className="font-black text-gray-700">XP Gained</span>
                            </div>
                            <span className="text-xl font-black text-indigo-600">+{rewards.xpGained} XP</span>
                        </div>

                        {/* Streak Reward */}
                        <div className="bg-orange-50 p-4 rounded-2xl flex items-center justify-between border border-orange-100/50">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">🔥</span>
                                <span className="font-black text-gray-700">Daily Streak</span>
                            </div>
                            <div className="text-right">
                                <span className="text-xl font-black text-orange-600 block">{rewards.currentStreak} Days</span>
                                {rewards.currentStreak > 1 && <span className="text-[10px] font-bold text-orange-400 uppercase tracking-tighter">Streak Maintained!</span>}
                            </div>
                        </div>

                        {/* Badges Reward */}
                        {rewards.newBadges && rewards.newBadges.length > 0 && (
                            <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100/50">
                                <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-2">New Badge Unlocked!</p>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {rewards.newBadges.map((badge, i) => (
                                        <div key={i} className="flex items-center gap-1.5 bg-white border border-purple-200 px-3 py-1.5 rounded-full shadow-sm">
                                            <span className="text-lg">🏅</span>
                                            <span className="text-xs font-black text-purple-700">{badge}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <button 
                        onClick={onClose}
                        className="w-full bg-gray-900 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-gray-800 transition-all transform active:scale-95"
                    >
                        Keep Crushing It!
                    </button>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default RewardPopup;
