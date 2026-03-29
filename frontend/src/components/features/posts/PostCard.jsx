import React, { useState, useEffect } from 'react';
import axiosInstance, { ROOT_URL } from '../../../api/axios';
import { motion } from 'framer-motion';
import { FaHeart, FaRegHeart, FaEllipsisV } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const PostCard = ({ post, currentUser }) => {
    const navigate = useNavigate();

    const [likes, setLikes] = useState(post.likes || []);
    const [isLiked, setIsLiked] = useState(post.likes?.includes(currentUser?._id) || false);
    const [showMenu, setShowMenu] = useState(false);
    const [followStatus, setFollowStatus] = useState(post.authorConnectionStatus || "none");

    useEffect(() => {
        setFollowStatus(post.authorConnectionStatus || "none");
    }, [post.authorConnectionStatus]);

    const profilePhotoUrl = post.user?.profilePhoto?.startsWith("http")
        ? post.user.profilePhoto
        : post.user?.profilePhoto
            ? `${ROOT_URL}${post.user.profilePhoto}`
            : `https://ui-avatars.com/api/?name=${post.user?.username || "User"}&background=6366f1&color=fff`;

    const handleLike = async () => {
        const previousLikes = [...likes];
        const previouslyLiked = isLiked;

        const newLikes = previouslyLiked
            ? likes.filter(id => id !== currentUser?._id)
            : [...likes, currentUser?._id];
        
        setLikes(newLikes);
        setIsLiked(!previouslyLiked);

        try {
            const res = await axiosInstance.post(`/posts/${post._id}/like`);
            setLikes(res.data.likes);
            setIsLiked(res.data.likes.includes(currentUser?._id));
        } catch (error) {
            console.error("Error toggling like", error);
            setLikes(previousLikes);
            setIsLiked(previouslyLiked);
            toast.error("Failed to like post");
        }
    };

    const handleFollow = async () => {
        const previousStatus = followStatus;
        const nextStatus = previousStatus === "following" ? "none" : "following";
        setFollowStatus(nextStatus);

        try {
            const res = await axiosInstance.post(`/user/${post.user?._id}/follow`);
            toast.success(res.data.message);
            setFollowStatus(res.data.isFollowing ? "following" : "none");
        } catch (error) {
            console.error("Error toggling follow", error);
            setFollowStatus(previousStatus);
            toast.error("Failed to update follow status");
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 mb-4 cursor-pointer break-inside-avoid"
        >

            {/* IMAGE / CONTENT */}
            <div className="relative">

                {/* IMAGE */}
                {post.proofType === "image" && (
                    <img
                        src={post.proofUrl?.startsWith("http") ? post.proofUrl : `${ROOT_URL}${post.proofUrl}`}
                        alt="post"
                        className="w-full object-cover"
                    />
                )}

                {/* VIDEO */}
                {post.proofType === "video" && (
                    <video
                        src={post.proofUrl?.startsWith("http") ? post.proofUrl : `${ROOT_URL}${post.proofUrl}`}
                        controls
                        className="w-full"
                    />
                )}

                {/* LINK / BLOG */}
                {(post.proofType === "link" || post.proofType === "blog") && (
                    <a
                        href={post.proofUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="block p-4 bg-gray-50 hover:bg-gray-100"
                    >
                        <p className="text-sm font-semibold text-gray-800 line-clamp-2">
                            {post.challengeText}
                        </p>
                    </a>
                )}

                {/* HOVER OVERLAY */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                    {post.isChallengeDiscovery ? (
                        <button 
                            onClick={(e) => { e.stopPropagation(); navigate('/challenges'); }}
                            className="bg-indigo-600 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:bg-indigo-700 transition"
                        >
                            Take Challenge
                        </button>
                    ) : (
                        <button className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold shadow">
                            Save
                        </button>
                    )}
                </div>

                {/* TOP RIGHT ACTIONS */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition flex gap-2">

                    <button
                        onClick={handleLike}
                        className="bg-white p-2 rounded-full shadow"
                    >
                        {isLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                    </button>

                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="bg-white p-2 rounded-full shadow"
                    >
                        <FaEllipsisV />
                    </button>

                </div>

                {/* VISIBILITY BADGE */}
                {post.visibility === 'private' && (
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg border border-white/20">
                        <span className="text-xs">🔒</span>
                        <span className="text-[10px] font-black uppercase tracking-wider">Only Me</span>
                    </div>
                )}

            </div>

            {/* USER INFO */}
            <div className="flex items-center justify-between px-3 py-2">

                <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => navigate(`/user/${post.user?._id}`)}
                >
                    <img
                        src={profilePhotoUrl}
                        onError={(e) => (e.target.src = "https://ui-avatars.com/api/?name=User")}
                        className="w-8 h-8 rounded-full object-cover border border-gray-200"
                    />

                    <span className="text-sm font-semibold text-gray-700">
                        {post.user?.username}
                    </span>
                </div>

                {currentUser?._id !== post.user?._id && (
                    <button
                        onClick={handleFollow}
                        className={`text-xs px-3 py-1 rounded-full transition ${["following", "mutual"].includes(followStatus)
                                ? "bg-gray-200 text-gray-700"
                                : "bg-black text-white"
                            }`}
                    >
                        {["following", "mutual"].includes(followStatus) ? "Following" : "Follow"}
                    </button>
                )}
            </div>

            {/* TEXT */}
            {post.challengeText && (
                <p className="px-3 pb-3 text-sm text-gray-800 font-medium line-clamp-2">
                    {post.challengeText}
                </p>
            )}

        </motion.div>
    );


};

export default PostCard;
