import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const RestartPrompt = ({ nextScreen }) => {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 flex items-center justify-center"
      >
        <div className="w-[800px] h-[250px] bg-white/60 backdrop-blur-xl text-center transition-all duration-500 flex flex-col justify-center items-center border border-white/30 rounded-2xl shadow-lg p-6 font-serif">
          <h1 className="text-2xl font-semibold text-center">
            Jsut Imagine you are some how 3 years back in your life 
          </h1>
          <p className="text-gray-600 text-xl mt-2">
            What all are the things you are gonna start again
          </p>

          <div className="mt-6 flex justify-center gap-4">
            <motion.button
              onClick={() => nextScreen(4)}
              whileTap={{ scale: 0.95 }}
              className="px-4 mt-5 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition"
            >
              Begin a New Journey
            </motion.button>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 mt-5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RestartPrompt;
