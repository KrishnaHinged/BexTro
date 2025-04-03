import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import BucketList from "../component/BucketList.jsx";
import { toast } from "react-hot-toast";

const InterestsScreen = ({ nextScreen }) => {
    const [selectedInterests, setSelectedInterests] = useState(new Set());
    const [customInterest, setCustomInterest] = useState("");
    const [showBucketList, setShowBucketList] = useState(false);

    useEffect(() => {
        axios
            .get("http://localhost:5005/api/v1/userdata/interests", { withCredentials: true })
            .then((res) => setSelectedInterests(new Set(res.data.interests || [])))
            .catch((err) => {
                console.error("Error fetching interests:", err);
                toast.error("Failed to load interests");
            });
    }, []);

    const initialInterests = [
        { id: "coding", label: "Coding" },
        { id: "art", label: "Art" },
        { id: "music", label: "Music" },
        { id: "sports", label: "Sports" },
        { id: "travel", label: "Travel" },
    ];

    const handleInterestClick = (interest) => {
        const isAdding = !selectedInterests.has(interest);
        const action = isAdding ? "add" : "remove";

        axios
            .post(
                "http://localhost:5005/api/v1/userdata/interests",
                { interest, action },
                { withCredentials: true }
            )
            .then((res) => {
                setSelectedInterests(new Set(res.data.data || []));
                toast.success(isAdding ? "Interest added!" : "Interest removed!");
            })
            .catch((err) => {
                console.error(`Error ${isAdding ? "adding" : "removing"} interest:`, err);
                toast.error(err.response?.data?.error || "Failed to update interest");
            });
    };

    const addCustomInterest = () => {
        const value = customInterest.trim();
        if (!value) {
            toast.error("Please enter a valid interest!");
            return;
        }
        if (!selectedInterests.has(value)) {
            axios
                .post(
                    "http://localhost:5005/api/v1/userdata/interests",
                    { interest: value, action: "add" },
                    { withCredentials: true }
                )
                .then((res) => {
                    setSelectedInterests(new Set(res.data.data || []));
                    setCustomInterest("");
                    toast.success("Custom interest added!");
                })
                .catch((err) => {
                    console.error("Error adding custom interest:", err);
                    toast.error(err.response?.data?.error || "Failed to add custom interest");
                });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {!showBucketList ? (
                <div className="max-w-2xl w-full p-8 bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 text-center transition-all duration-500 relative z-10">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4 drop-shadow-md">
                        Your Dreamy Interests 🌟
                    </h1>
                    <p className="text-xl text-gray-800 mb-6">Tap to add to your dream cloud!</p>

                    <div className="flex flex-wrap justify-center gap-4 mb-6">
                        {initialInterests.map(({ id, label }) => (
                            <motion.div
                                key={id}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className={`px-6 py-3 backdrop-blur-md rounded-xl border border-white/30 cursor-pointer transition-all duration-300 shadow-md ${
                                    selectedInterests.has(id)
                                        ? "bg-amber-600 border-teal-500 text-white shadow-lg animate-float"
                                        : "hover:bg-white/30 hover:-translate-y-1"
                                }`}
                                onClick={() => handleInterestClick(id)}
                            >
                                {label}
                            </motion.div>
                        ))}

                        <AnimatePresence>
                            {[...selectedInterests]
                                .filter((interest) => !initialInterests.some(({ id }) => id === interest))
                                .map((custom) => (
                                    <motion.div
                                        key={custom}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="relative px-6 py-3 bg-teal-400/40 backdrop-blur-md rounded-xl border border-teal-500 text-white cursor-pointer transition-all duration-300 shadow-lg animate-float"
                                    >
                                        {custom}
                                        <button
                                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs -mt-1 -mr-1"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleInterestClick(custom);
                                            }}
                                        >
                                            ❌
                                        </button>
                                    </motion.div>
                                ))}
                        </AnimatePresence>
                    </div>

                    <div className="flex justify-center gap-2 mb-6">
                        <input
                            type="text"
                            value={customInterest}
                            onChange={(e) => setCustomInterest(e.target.value)}
                            placeholder="Add your own interest"
                            className="px-4 py-2 bg-white/30 backdrop-blur-md rounded-xl border-none text-gray-800 placeholder-gray-500 focus:outline-none w-48"
                        />
                        <button
                            onClick={addCustomInterest}
                            className="px-4 py-2 bg-green-500/80 backdrop-blur-md rounded-xl text-white hover:bg-green-600/90 hover:-translate-y-1 transition-all duration-300"
                        >
                            Add
                        </button>
                    </div>

                    <button
                        onClick={() => setShowBucketList(true)}
                        className="px-6 py-3 bg-purple-500/80 backdrop-blur-md rounded-full text-white hover:bg-purple-600/90 hover:-translate-y-1 transition-all duration-300 shadow-md"
                    >
                        Chase More Dreams
                    </button>
                </div>
            ) : (
                <AnimatePresence mode="wait">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.6 }}
                        className="w-full"
                    >
                        <BucketList />
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
};

export default InterestsScreen;
