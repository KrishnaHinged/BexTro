import React from "react";
import { motion } from "framer-motion";

const HoldUpMessage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5 }}
      className="w-[800px] h-[250px] bg-white/60 backdrop-blur-xl text-center transition-all duration-500 flex flex-col justify-center items-center border border-white/30 rounded-2xl shadow-lg p-6 font-serif"
    >
      <h1 className="text-2xl font-semibold text-center">
        Hold up! You thought you could just waltz in without answering a few questions? Cute. Now, let’s get to know you first! 😏
      </h1>
    </motion.div>
  );
};

export default HoldUpMessage;
