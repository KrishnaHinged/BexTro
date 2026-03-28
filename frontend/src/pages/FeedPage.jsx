import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Masonry from 'react-masonry-css';
import PostCard from '../component/PostCard';
import ErrorBoundary from '../component/ErrorBoundary';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Navbar from '../component/home/Navbar.jsx';

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
            <div className="min-h-screen bg-transparent relative">
                <div className='fixed top-0 left-0 w-full h-full -z-10 bg-gradient-to-br from-indigo-50/40 via-purple-50/30 to-blue-50/40'></div>

                <Navbar />

                <div className="pt-24 px-4 md:px-8 max-w-7xl mx-auto">
                    <div className="flex flex-col items-center mb-10 w-full bg-white/40 backdrop-blur-md rounded-3xl py-8 shadow-sm border border-white/60">
                        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-500 to-blue-600 mb-6">
                            Community Feeds
                        </h1>

                        <div className="flex bg-white/60 p-1.5 rounded-full border w-72">
                            <button
                                className={`flex-1 py-2.5 rounded-full ${activeTab === 'foryou' ? 'bg-indigo-500 text-white' : 'text-gray-500'}`}
                                onClick={() => setActiveTab('foryou')}
                            >
                                For You
                            </button>
                            <button
                                className={`flex-1 py-2.5 rounded-full ${activeTab === 'following' ? 'bg-indigo-500 text-white' : 'text-gray-500'}`}
                                onClick={() => setActiveTab('following')}
                            >
                                Following
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <span className="loading loading-spinner text-info w-16"></span>
                        </div>
                    ) : !posts || posts.length === 0 ? (
                        <div className="text-center text-gray-500 mt-20 bg-white/40 p-8 rounded-3xl">
                            No posts available.
                        </div>
                    ) : (
                        <Masonry
                            breakpointCols={breakpointColumnsObj}
                            className="flex w-auto -ml-6 pb-20"
                            columnClassName="pl-6"
                        >
                           {Array.isArray(posts) && posts.map(post => (
                                <PostCard key={post._id} post={post} currentUser={user} />
                            ))}
                        </Masonry>
                    )}
                </div> {/* inner container */}

            </div> {/* ❗ outer wrapper FIXED */}
        </ErrorBoundary>
    );
};

export default FeedPage;