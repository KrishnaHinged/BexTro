import React from "react";
import { motion } from "framer-motion";

const GamificationUI = ({ score = 0 }) => {
  const level = Math.floor(score / 100);
  const xpInCurrentLevel = score % 100;
  const progress = xpInCurrentLevel;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative p-8 rounded-3xl bg-white/20 backdrop-blur-xl border border-white/20 shadow-[0_0_40px_rgba(0,0,255,0.1)] overflow-hidden"
    >
      {/* ✨ Glow Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/10 via-purple-400/10 to-blue-400/10 blur-2xl"></div>

      {/* 🔥 Header */}
      <div className="flex justify-between items-center mb-6 relative z-10">
        <h2 className="text-xl font-bold text-white tracking-wide">
          ⚡ Level {level}
        </h2>
        <span className="text-sm text-white/70">
          {xpInCurrentLevel}/100 XP
        </span>
      </div>

      {/* 🚀 Progress Bar */}
      <div className="relative h-5 rounded-full bg-white/10 overflow-hidden border border-white/20">
        {/* Glow */}
        <div className="absolute inset-0 blur-md bg-blue-500/20"></div>

        {/* Animated Fill */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 shadow-[0_0_20px_rgba(99,102,241,0.8)]"
        ></motion.div>
      </div>

      {/* 🌟 Stats */}
      <div className="flex justify-between mt-6 text-white/80 text-sm relative z-10">
        <div>
          <p className="text-xs text-white/50">Total XP</p>
          <p className="font-semibold text-lg">{score}</p>
        </div>

        <div className="text-right">
          <p className="text-xs text-white/50">Next Level</p>
          <p className="font-semibold text-lg">{(level + 1) * 100}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default GamificationUI;