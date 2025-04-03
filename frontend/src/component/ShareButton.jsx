import React from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

const ShareButton = () => {
  const handleShare = () => {
    const shareText = "Hey friends! I’m crushing it with Bextro challenges. Join me at http://localhost:1573/signup!";
    navigator.clipboard.writeText(shareText);
    toast.success("Copied to clipboard!");
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleShare}
      className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-md"
    >
      Share with Friends <span className="ml-2">🚀</span>
    </motion.button>
  );
};

export default ShareButton;