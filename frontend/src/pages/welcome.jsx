import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InterestsScreen from "../component/interestsScreen.jsx";
import HoldUpMessage from "../component/HoldUpMessage.jsx";
import RestartPrompt from "../component/RestartPrompt.jsx";

const Welcome = () => {
    const [step, setStep] = useState(1);

    const nextScreen = (nextStep) => {
        setStep(nextStep);
    };

    useEffect(() => {
        const stepTimer = setTimeout(() => setStep(2), 3000);

        return () => {
            clearTimeout(stepTimer);
        };
    }, []);

    return (
        <div
        className="flex flex-col justify-center items-center min-h-screen"
        style={{
            backgroundImage:`url("/cat_universe.jpeg")`
        }}
    >
            {step === 1 && <HoldUpMessage />}
            {step === 2 && <RestartPrompt nextScreen={nextScreen} />}
            <AnimatePresence mode="wait">
                {step === 4 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.6 }}
                        className="w-full"
                    >
                        <InterestsScreen nextScreen={nextScreen} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Welcome;