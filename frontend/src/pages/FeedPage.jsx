import React, { useEffect, useState } from 'react';
import SkeletonCard from '../components/features/posts/SkeletonCard';
import axiosInstance from '../api/axios';
import Masonry from 'react-masonry-css';
import PostCard from '../components/features/posts/PostCard';
import ErrorBoundary from '../components/common/ErrorBoundary';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar.jsx';
import MainSlideBar from "../components/layout/MainSlideBar";
import PageLoader from "../components/common/loaders/pagesLoader";
import { motion, AnimatePresence } from "framer-motion";
import UserSearchCard from '../components/features/posts/UserSearchCard';
import { useDebounce } from '../hooks/useDebouncedSearch.js';

const FeedPage = () => {
    const { authUser: user, isAuthenticated } = useSelector(store => store.user);
    const isRehydrated = useSelector((state) => state._persist?.rehydrated);
    const [posts, setPosts] = useState([]);
    const [activeTab, setActiveTab] = useState('foryou');
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const debouncedSearch = useDebounce(searchQuery, 400);

    console.log("FeedPage: Rendering, user =", user, "isAuthenticated =", isAuthenticated, "isRehydrated =", isRehydrated);

    const fetchFeed = async (tab) => {
        console.log("Fetching feed for tab:", tab);
        setLoading(true);
        try {
            const res = await axiosInstance.get(`/posts/feed?tab=${tab}`);
            console.log("Feed response:", res.data);
            setPosts(res.data || []);
        } catch (error) {
            console.error("Error fetching feed", error);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    const { socket } = useSelector(store => store.socket);

    useEffect(() => {
        if (socket) {
            // Live Feed: New Post Listener
            socket.on("newPost", (newPost) => {
                setPosts(prev => [newPost, ...prev]);
            });

            // Live Feed: Like/Comment Listener
            socket.on("postUpdate", ({ postId, likes, comments, type }) => {
                setPosts(prev => prev.map(post => {
                    if (post._id === postId) {
                        return {
                            ...post,
                            likes: type === "like" ? likes : post.likes,
                            comments: type === "comment" ? comments : post.comments
                        };
                    }
                    return post;
                }));
            });

            return () => {
                socket.off("newPost");
                socket.off("postUpdate");
            };
        }
    }, [socket]);

    useEffect(() => {
        const performSearch = async () => {
            if (!debouncedSearch.trim()) {
                setSearchResults([]);
                return;
            }
            setSearching(true);
            try {
                const res = await axiosInstance.get(`/user/search?query=${debouncedSearch}`);
                setSearchResults(res.data || []);
            } catch (error) {
                console.error("Search error", error);
            } finally {
                setSearching(false);
            }
        };
        performSearch();
    }, [debouncedSearch]);

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

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <h1 className="text-3xl md:text-4xl font-bold text-white/80">
                            Community Feed
                        </h1>

                        {/* Search Bar */}
                        <div className="relative w-full md:w-96 group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className={searching ? "animate-spin text-indigo-500" : "text-gray-400 group-hover:text-indigo-500 transition-colors"}>
                                    {searching ? "🔄" : "🔍"}
                                </span>
                            </div>
                            <input 
                                type="text"
                                placeholder="Search users by name or username..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/40 backdrop-blur-md border border-white/60 hover:bg-white/60 focus:bg-white/80 rounded-2xl py-3.5 pl-12 pr-4 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 shadow-sm transition-all duration-300"
                            />

                            {/* Search Results Dropdown */}
                            <AnimatePresence>
                                {searchQuery && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute left-0 right-0 top-full mt-3 bg-white/90 backdrop-blur-xl border border-white/80 rounded-3xl shadow-2xl z-[100] max-h-[450px] overflow-y-auto p-4 flex flex-col gap-2 no-scrollbar"
                                    >
                                        <div className="flex justify-between items-center px-2 mb-2">
                                            <span className="text-xs font-black uppercase tracking-widest text-indigo-500/70">
                                                {searching ? "Searching..." : `Results (${searchResults.length})`}
                                            </span>
                                            {searchQuery && !searching && (
                                                <button 
                                                    onClick={() => setSearchQuery('')}
                                                    className="text-xs font-bold text-gray-400 hover:text-rose-500 transition-colors"
                                                >
                                                    Clear
                                                </button>
                                            )}
                                        </div>

                                        {searchResults.length > 0 ? (
                                            searchResults.map(user => (
                                                <UserSearchCard key={user._id} user={user} />
                                            ))
                                        ) : !searching && (
                                            <div className="py-8 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                                                <p className="text-gray-500 font-medium italic">No users found for "{searchQuery}"</p>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Tabs Card (Glass Style like Dashboard cards) */}
                    <div className="backdrop-blur-md rounded-3xl p-6 mb-8 flex flex-col items-center">

                        <div className="flex bg-white/60 p-1.5 rounded-full w-72">
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