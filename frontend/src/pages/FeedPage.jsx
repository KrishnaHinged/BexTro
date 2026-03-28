import React, { useEffect, useState } from 'react';
import SkeletonCard from '../component/SkeletonCard';
import axios from 'axios';
import Masonry from 'react-masonry-css';
import PostCard from '../component/PostCard';
import ErrorBoundary from '../component/ErrorBoundary';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Navbar from '../component/home/Navbar.jsx';
import MainSlideBar from "../component/main_SlideBar";
import PageLoader from "../component/pagesLoader";
import { motion, AnimatePresence } from "framer-motion";
const API_URL = "http://localhost:5005/api/v1";

const FeedPage = () => {
    const { authUser: user, isAuthenticated } = useSelector(store => store.user);
    const isRehydrated = useSelector((state) => state._persist?.rehydrated);
    const [posts, setPosts] = useState([]);
    const [activeTab, setActiveTab] = useState('foryou');
    const [loading, setLoading] = useState(true);

    console.log("FeedPage: Rendering, user =", user, "isAuthenticated =", isAuthenticated, "isRehydrated =", isRehydrated);

    const fetchFeed = async (tab) => {
        console.log("Fetching feed for tab:", tab);
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/posts/feed?tab=${tab}`, { withCredentials: true });
            console.log("Feed response:", res.data);
            setPosts(res.data || []);
        } catch (error) {
            console.error("Error fetching feed", error);
            setPosts([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log("FeedPage useEffect triggered, user:", user);
        if (user?._id) {
            fetchFeed(activeTab);
        }
    }, [activeTab, user]);

    if (!isRehydrated) {
        return (
            <div className="min-h-screen bg-transparent relative flex items-center justify-center">
                <div className="loading loading-spinner text-info w-16"></div>
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        console.log("No authenticated user, showing login prompt");
        return (
            <div className="min-h-screen bg-transparent relative flex items-center justify-center">
                <div className="bg-white/40 backdrop-blur-md rounded-3xl p-8 shadow-sm border border-white/60 text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Sign In</h2>
                    <p className="text-gray-600 mb-6">You need to be logged in to view the feed.</p>
                    <a href="/signin" className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg">
                        Sign In
                    </a>
                </div>
            </div>
        );
    }

    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1
    };

    return (
        <ErrorBoundary>
            <div className="flex min-h-screen">

                {/* ✅ Sidebar SAME as Dashboard */}
                <MainSlideBar />

                {/* ✅ Right Content Area */}
                <div className="flex-1 p-4 md:p-8">

                    {/* Background Gradient */}
                    <div className='fixed top-0 left-0 w-full h-full -z-10 bg-gradient-to-br from-indigo-50/40 via-purple-50/30 to-blue-50/40'></div>

                    {/* Header */}
                    <h1 className="text-3xl md:text-4xl font-bold text-white/80 mb-8">
                        Community Feed <span className="text-blue-500">✨</span>
                    </h1>

                    {/* Tabs Card (Glass Style like Dashboard cards) */}
                    <div className="bg-white/40 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-white/60 mb-8 flex flex-col items-center">

                        <div className="flex bg-white/60 p-1.5 rounded-full border w-72">
                            <button
                                className={`flex-1 py-2.5 rounded-full transition ${activeTab === 'foryou'
                                        ? 'bg-indigo-500 text-white'
                                        : 'text-gray-500'
                                    }`}
                                onClick={() => setActiveTab('foryou')}
                            >
                                For You
                            </button>

                            <button
                                className={`flex-1 py-2.5 rounded-full transition ${activeTab === 'following'
                                        ? 'bg-indigo-500 text-white'
                                        : 'text-gray-500'
                                    }`}
                                onClick={() => setActiveTab('following')}
                            >
                                Following
                            </button>
                        </div>
                    </div>
                    <div className="px-2 md:px-4">
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                    <SkeletonCard key={i} />
                                ))}
                            </div>
                        ) : !posts || posts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="bg-white/40 p-6 rounded-full mb-6">
                                    <span className="text-5xl">📭</span>
                                </div>
                                <h3 className="text-2xl font-black text-gray-800 mb-2">The feed is quiet...</h3>
                                <p className="text-gray-500 max-w-xs font-medium">
                                    Try following more users or check back later for new inspiring challenges and proofs!
                                </p>
                            </div>
                        ) : (
                            <Masonry
                                breakpointCols={breakpointColumnsObj}
                                className="flex w-auto -ml-4"
                                columnClassName="pl-4"
                            >
                                {(Array.isArray(posts) ? posts : []).map(post => {
                                    if (!post || !post._id) return null;
                                    return (
                                        <PostCard
                                            key={post._id}
                                            post={post}
                                            currentUser={user}
                                        />
                                    );
                                })}
                            </Masonry>
                        )}
                    </div>

                </div>
            </div>
        </ErrorBoundary>
    );
};

export default FeedPage;