import React from "react";
import { motion } from "framer-motion";

const ChallengeCard = ({ challenge, index, onComplete, onAbandon }) => {
  const start = new Date(challenge.acceptedAt);
  const end = new Date(start.getTime() + (challenge.timelineDays || 3) * 24 * 60 * 60 * 1000); // fallback to 3 days if missing
  const now = new Date();
  
  const diffTime = end - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  let timeStatus = "";
  let statusColor = "";
  if (diffDays > 0) {
      timeStatus = `${diffDays} days left`;
      statusColor = "text-indigo-600 bg-indigo-50 border-indigo-100";
  } else if (diffDays === 0) {
      timeStatus = "Due Today!";
      statusColor = "text-amber-600 bg-amber-50 border-amber-100 animate-pulse";
  } else {
      timeStatus = `${Math.abs(diffDays)} days overdue`;
      statusColor = "text-red-500 bg-red-50 border-red-100";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="p-6 bg-white/60 backdrop-blur-md rounded-2xl shadow-sm hover:shadow-md transition-all border border-white/80"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-extrabold text-gray-800 tracking-tight flex-1 pr-2">{challenge.challengeText}</h3>
        <span className={`text-xs px-3 py-1 rounded-full border shadow-sm font-bold whitespace-nowrap ${statusColor}`}>
          {timeStatus}
        </span>
      </div>
      
      <div className="flex flex-col gap-1 mb-6 text-sm">
        <div className="flex items-center text-gray-500">
          <span className="w-16 font-semibold text-gray-400">Start:</span>
          <span>{start.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
        <div className="flex items-center text-gray-700">
          <span className="w-16 font-semibold text-gray-400">Deadline:</span>
          <span className="font-bold">{end.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

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