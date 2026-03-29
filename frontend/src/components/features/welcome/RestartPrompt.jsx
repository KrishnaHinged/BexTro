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
        className="fixed inset-0 flex items-center justify-center px-4 z-50"
      >
        <div className="w-full max-w-xl bg-white/60 backdrop-blur-xl text-center flex flex-col justify-center items-center border border-white/30 rounded-2xl shadow-lg p-6 sm:p-8 font-serif">
          <h1 className="text-lg sm:text-2xl font-semibold leading-relaxed">
            Just imagine you are somehow 3 years back in your life
          </h1>
          <p className="text-gray-700 text-base sm:text-xl mt-2">
            What are all the things you're going to start again?
          </p>

          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
            <motion.button
              onClick={() => nextScreen(4)}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white text-base sm:text-lg font-sans rounded-md shadow-md hover:bg-blue-700 transition"
            >
              Restart!!
            </motion.button>
            <button
              onClick={() => navigate("/")}
              className="w-full sm:w-auto px-6 py-2 bg-gray-200 text-gray-800 text-base sm:text-lg font-sans rounded-md hover:bg-gray-300 transition"
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
