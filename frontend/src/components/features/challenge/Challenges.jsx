import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import LoaderScreen from "../../common/loaders/LoaderScreen.jsx";
import LoaderC from "../../common/loaders/LoaderC.jsx";
import ChallengeAcceptModal from "../challenges/ChallengeAcceptModal.jsx";

const Challenges = () => {
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [customChallenge, setCustomChallenge] = useState("");
    const [showConfetti, setShowConfetti] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [showLoaderScreen, setShowLoaderScreen] = useState(false);
    const [selectedAcceptChallenge, setSelectedAcceptChallenge] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                setLoading(true);
                const response = await axios.get("http://localhost:5005/api/v1/challenges/generate-challenges", {
                    withCredentials: true,
                });
                const validChallenges = (response.data.challenges || []).filter((challenge) => {
                    const text = challenge.text?.trim();
                    return text && text.length >= 5 && !/^[{\[\]}]$/.test(text);
                });
                setChallenges(validChallenges);
            } catch (error) {
                toast.error("Oops! Challenges couldn’t load.");
            } finally {
                setLoading(false);
            }
        };
        fetchChallenges();
    }, []);

    const handleAcceptClick = (challenge, index) => {
        setSelectedAcceptChallenge({ challenge, index });
    };

    const handleAcceptSuccess = (data) => {
        toast.success("Challenge accepted—go get it!");
        setChallenges((prev) => prev.filter((_, i) => i !== selectedAcceptChallenge.index));
        setSelectedAcceptChallenge(null);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000); // Confetti for 4000ms
    };

    const handleSkip = async (index) => {
        try {
            await axios.post(
                "http://localhost:5005/api/v1/challenges/skip",
                {},
                { withCredentials: true }
            );
            toast.success("Skipped—next up!");
            setChallenges((prev) => prev.filter((_, i) => i !== index));
        } catch (error) {
            toast.error("Skip failed—try again!");
        }
    };

    const handleAddCustomChallenge = async () => {
        if (!customChallenge.trim()) {
            toast.error("Challenge can’t be empty!");
            return;
        }
        if (customChallenge.length < 5) {
            toast.error("Make it at least 5 characters!");
            return;
        }
        try {
            await axios.post(
                "http://localhost:5005/api/v1/challenges/custom",
                { challengeText: customChallenge },
                { withCredentials: true }
            );
            setChallenges((prev) => [
                ...prev,
                {
                    text: customChallenge,
                    objective: "Tackle your custom goal!",
                    motivation: "You’ve set the bar—reach it!",
                    benefits: ["Self-improvement", "Victory vibes"],
                },
            ]);
            setCustomChallenge("");
            toast.success("Challenge added—shine on!");
        } catch (error) {
            toast.error("Failed to add—retry!");
        }
    };

    const handleNextPage = () => {
        setShowLoader(true);
        setTimeout(() => {
            setShowLoader(false);
            setShowLoaderScreen(true);
            setTimeout(() => {
                setShowLoaderScreen(false);
                navigate("/dashboard");
            }, 4000);
        }, 3000);
    };

    return (
        <>
            {/* Loader Overlay */}
            {showLoader && (
                <div className="fixed inset-0 z-[999] bg-black/60 flex items-center justify-center">
                    <LoaderC isVisible={showLoader} />
                </div>
            )}

            {/* Loader Screen */}
            {showLoaderScreen && (
                <div className="fixed inset-0 z-[998] bg-gray-900">
                    <LoaderScreen />
                </div>
            )}

            {/* Accept Modal */}
            {selectedAcceptChallenge && (
                <ChallengeAcceptModal
                    challengeText={selectedAcceptChallenge.challenge.text}
                    onClose={() => setSelectedAcceptChallenge(null)}
                    onSuccess={handleAcceptSuccess}
                />
            )}

            {/* Main Content */}
            <div className="min-h-screen w-full bg-gradient-to-br from-gray-50/60 to-gray-100/60 rounded-4xl border border-amber-50 p-6 md:p-10 relative overflow-hidden">
                {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}

                <div className="max-w-7xl mx-auto relative z-10">
                    {/* Header */}
                    <motion.header
                        initial={{ opacity: 0, y: -40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, ease: "easeOut" }}
                        className="text-center mb-12"
                    >
                        <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 mb-4 tracking-tight">
                            Dare Yourself!
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-medium">
                            Step up, take on a challenge, and unlock your potential.
                        </p>
                    </motion.header>

                    {/* Custom Challenge Input */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="w-full max-w-3xl mx-auto mb-12 bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
                    >
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Craft Your Own Challenge</h2>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="text"
                                value={customChallenge}
                                onChange={(e) => setCustomChallenge(e.target.value)}
                                placeholder="e.g., 'Run 5km this week'"
                                className="flex-1 p-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                                onKeyPress={(e) => e.key === "Enter" && handleAddCustomChallenge()}
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleAddCustomChallenge}
                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-semibold"
                            >
                                Add Challenge
                            </motion.button>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">Minimum 5 characters required.</p>
                    </motion.div>

                    {/* Challenges List */}
                    <section className="mb-16">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">Your Challenges</h2>
                        {loading ? (
                            <div className="flex justify-center items-center py-20">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                    className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
                                />
                            </div>
                        ) : challenges.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <AnimatePresence>
                                    {challenges.map((challenge, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.4, delay: index * 0.05 }}
                                            className="p-6 bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col"
                                        >
                                            <div className="flex items-start mb-4">
                                                <div className="p-2 bg-purple-50 rounded-lg mr-3">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-6 w-6 text-purple-600"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                        />
                                                    </svg>
                                                </div>
                                                <h3 className="text-lg font-semibold text-gray-800">{challenge.text}</h3>
                                            </div>
                                            <div className="space-y-4 flex-1">
                                                <div>
                                                    <p className="text-xs font-medium text-purple-600 uppercase tracking-wide">Goal</p>
                                                    <p className="text-gray-600">{challenge.objective}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-medium text-purple-600 uppercase tracking-wide">Why</p>
                                                    <p className="text-gray-600">{challenge.motivation}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-medium text-purple-600 uppercase tracking-wide">Wins</p>
                                                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                                                        {challenge.benefits.map((benefit, i) => (
                                                            <li key={i}>{benefit}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="flex gap-4 pt-6 mt-4 border-t border-gray-100">
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleAcceptClick(challenge, index)}
                                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 font-medium flex items-center justify-center gap-2"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-5 w-5"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    Accept
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleSkip(index)}
                                                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg shadow-sm hover:bg-gray-200 hover:shadow-md transition-all duration-300 font-medium flex items-center justify-center gap-2"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-5 w-5"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M4 10a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    Skip
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-16 bg-white rounded-2xl shadow-md border border-gray-200"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-20 w-20 mx-auto text-purple-400 mb-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <h3 className="text-xl font-medium text-gray-800 mb-2">No Challenges Yet</h3>
                                <p className="text-gray-600 max-w-md mx-auto">Create your own challenge above or wait for new ones!</p>
                            </motion.div>
                        )}
                    </section>

                    {/* Next Page Button */}
                    <div className="text-center">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleNextPage}
                            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold flex items-center gap-2 mx-auto"
                        >
                            To Dashboard
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </motion.button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Challenges;