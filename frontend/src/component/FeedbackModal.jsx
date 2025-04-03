import React from "react";
import { motion } from "framer-motion";

const FeedbackModal = ({ show, feedback, setFeedback, onSubmit, onCancel, challengeName, userName }) => {
  if (!show) return null;

  const handleSubmit = () => {
    const timestamp = new Date().toLocaleString();
    onSubmit({ feedback, challengeName, userName, timestamp });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white/80 rounded-xl p-6 shadow-2xl w-full max-w-md"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">Share Your Experience</h3>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4 resize-none h-32"
          placeholder={`How did ${challengeName} feel?`}
        />
        <div className="flex gap-3 justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Submit
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Cancel
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
export default FeedbackModal;