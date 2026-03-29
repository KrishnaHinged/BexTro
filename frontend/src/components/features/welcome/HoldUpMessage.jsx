import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const HoldUpMessage = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 flex items-center justify-center px-4 z-50"
        >
          <div className="w-full max-w-xl h-auto sm:h-[250px] bg-white/60 backdrop-blur-xl text-center flex flex-col justify-center items-center border border-white/30 rounded-2xl shadow-lg p-6 sm:p-8 font-serif mx-auto">
            <h1 className="text-lg sm:text-2xl font-semibold leading-relaxed">
              Hold up!!
              <br /> Let's give you a dare.
            </h1>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HoldUpMessage;
