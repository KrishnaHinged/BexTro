// Startup.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const Startup = ({ onChallengeAction }) => {
    const [news, setNews] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axios.get("http://localhost:5005/api/v1/news");
                if (response.data.articles) {
                    setNews(response.data.articles);
                }
            } catch (error) {
                console.error("Error fetching news:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % news.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + news.length) % news.length);
    };

    if (loading) {
        return (
            <div className="p-6 bg-white/80 rounded-2xl shadow-lg border border-white/80 flex justify-center items-center h-64">
                <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-4 py-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="p-6 bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl shadow-lg border border-white/80"
        >
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" clipRule="evenodd" />
                </svg>
                Startup Spotlight
            </h2>
            
            {news.length > 0 ? (
                <div className="flex flex-col md:flex-row gap-6">
                    <motion.div 
                        key={currentIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="w-full md:w-1/2"
                    >
                        <img
                            src={news[currentIndex]?.image || "https://source.unsplash.com/random/600x400/?startup"}
                            alt="News"
                            className="w-full h-64 object-cover rounded-xl shadow-md"
                        />
                    </motion.div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800">{news[currentIndex]?.title}</h3>
                        <p className="text-gray-600 mt-3">{news[currentIndex]?.description}</p>
                        <div className="flex justify-between mt-6">
                            <button
                                onClick={handlePrev}
                                className="px-4 py-2 bg-gray-700 text-white rounded-lg shadow hover:bg-gray-800 transition-colors flex items-center"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Previous
                            </button>
                            <button
                                onClick={handleNext}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors flex items-center"
                            >
                                Next
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-gray-600">No news articles available</p>
            )}
        </motion.div>
    );
};

export default Startup;