import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { motion, AnimatePresence } from 'framer-motion';

const ChallengeAcceptModal = ({ challengeText, onClose, onSuccess }) => {
    const [timelineDays, setTimelineDays] = useState(3);
    const [loading, setLoading] = useState(false);
    const [fetchingAI, setFetchingAI] = useState(true);
    const [aiSuggestedDays, setAiSuggestedDays] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAISuggestion = async () => {
            try {
                const res = await axiosInstance.post("/challenges/suggest-timeline", { challengeText });

                if (res.data.suggestedDays) {
                    const validDays = [1, 3, 7];
                    const safeDays = validDays.includes(res.data.suggestedDays)
                        ? res.data.suggestedDays
                        : 3;

                    setAiSuggestedDays(safeDays);
                    setTimelineDays(safeDays);
                }
            } catch (err) {
                console.error("AI fetch failed:", err);
            } finally {
                setFetchingAI(false);
            }
        };

        fetchAISuggestion();
    }, [challengeText]);

    const handleAccept = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axiosInstance.post("/challenges/accept", {
                challenge: challengeText,
                timelineDays: Number(timelineDays)
            });

            onSuccess(res.data);
        } catch (err) {
            console.error("Accept error", err);
            setError(err.response?.data?.message || 'Failed to accept challenge');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            >
                <motion.div
                    initial={{ scale: 0.95, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 20 }}
                    className="bg-white/95 border border-white/40 p-8 rounded-3xl w-full max-w-md shadow-2xl text-center"
                >
                    <h3 className="text-3xl font-extrabold text-indigo-600 mb-2">
                        Accept Challenge
                    </h3>
                    <p className="text-gray-600 italic mb-6">"{challengeText}"</p>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    {fetchingAI ? (
                        <div className="mb-6">
                            <span className="loading loading-spinner"></span>
                            <p className="text-sm mt-2">AI calculating...</p>
                        </div>
                    ) : (
                        <div className="mb-6">
                            <p className="text-sm text-gray-500">
                                AI suggests:
                                <span className="text-indigo-600 font-bold ml-1">
                                    {aiSuggestedDays} days
                                </span>
                            </p>
                        </div>
                    )}

                    <div className="flex gap-2 justify-center mb-4">
                        {[1, 3, 7].map(days => (
                            <button
                                key={days}
                                onClick={() => setTimelineDays(days)}
                                className={`px-4 py-2 rounded-lg border ${
                                    timelineDays === days
                                        ? 'bg-indigo-500 text-white'
                                        : 'bg-white text-gray-500'
                                }`}
                            >
                                {days}
                            </button>
                        ))}
                    </div>

                    <input
                        type="number"
                        min="1"
                        value={timelineDays}
                        onChange={(e) => setTimelineDays(Number(e.target.value))}
                        className="w-full border p-2 rounded-lg mb-4"
                    />

                    <div className="flex gap-4">
                        <button onClick={onClose} className="flex-1 border p-2 rounded-lg">
                            Cancel
                        </button>
                        <button
                            onClick={handleAccept}
                            disabled={loading || fetchingAI}
                            className="flex-1 bg-indigo-600 text-white p-2 rounded-lg"
                        >
                            {loading ? "Loading..." : "Let's Go"}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ChallengeAcceptModal;