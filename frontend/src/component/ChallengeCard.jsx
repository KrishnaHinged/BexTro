import React from "react";
import { motion } from "framer-motion";

const ChallengeCard = ({ challenge, index, onComplete, onAbandon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="p-6 bg-white/80 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100"
    >
      <h3 className="text-lg font-bold text-gray-900 mb-2">{challenge.challengeText}</h3>
      <p className="text-sm text-gray-500 mb-4">
        Accepted: {new Date(challenge.acceptedAt).toLocaleDateString()}
      </p>
      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onComplete(challenge, index)}
          className="px-4 py-2 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition-colors shadow-sm"
        >
          Complete
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onAbandon(challenge, index)}
          className="px-4 py-2 bg-rose-500 text-white rounded-lg font-medium hover:bg-rose-600 transition-colors shadow-sm"
        >
          Abandon
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ChallengeCard;