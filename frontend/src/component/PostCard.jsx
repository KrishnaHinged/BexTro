import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaRegHeart, FaComment, FaShare, FaEllipsisV, FaFlag, FaExternalLinkAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const PostCard = ({ post, currentUser }) => {
    const navigate = useNavigate();
    const [likes, setLikes] = useState(post.likes || []);
    const [isLiked, setIsLiked] = useState(post.likes?.includes(currentUser?._id) || false);
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [comments, setComments] = useState(post.comments || []);
    const [showMenu, setShowMenu] = useState(false);
    const [followStatus, setFollowStatus] = useState(post.authorConnectionStatus || "none");

    const handleLike = async () => {
        try {
            const res = await axios.post(`http://localhost:5005/api/v1/posts/${post._id}/like`, {}, { withCredentials: true });
            setLikes(res.data.likes);
            setIsLiked(res.data.likes.includes(currentUser?._id));
        } catch (error) {
            console.error("Error toggling like", error);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        try {
            const res = await axios.post(`http://localhost:5005/api/v1/posts/${post._id}/comment`, { text: commentText }, { withCredentials: true });
            setComments(res.data.comments);
            setCommentText("");
        } catch (error) {
            console.error("Error adding comment", error);
        }
    };

    const handleFollow = async () => {
        try {
            const res = await axios.post(`http://localhost:5005/api/v1/user/${post.user?._id}/follow`, {}, { withCredentials: true });
            toast.success(res.data.message);
            setFollowStatus(res.data.isFollowing ? "following" : "none");
        } catch (error) {
            toast.error("Failed to update follow status");
        }
    };

    const handleReport = async () => {
        try {
            await axios.post(`http://localhost:5005/api/v1/report/create`, {
                targetType: "Post",
                targetId: post._id,
                reason: "Inappropriate content",
                description: "User reported this post via the Feed."
            }, { withCredentials: true });
            toast.success("Post reported to administrators.");
            setShowMenu(false);
        } catch (error) {
            toast.error("Failed to submit report.");
        }
    };

    const renderProof = () => {
        if (post.proofType === 'image') {
            return (
                <div className="rounded-2xl overflow-hidden border border-white/20 shadow-inner group relative">
                    <img src={`http://localhost:5005${post.proofUrl}`} alt="Proof" className="w-full h-auto object-cover max-h-[500px] transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all" />
                </div>
            );
        }
        if (post.proofType === 'video') {
            return (
                <div className="rounded-2xl overflow-hidden border border-white/20 shadow-inner bg-black/5">
                    <video controls src={`http://localhost:5005${post.proofUrl}`} className="w-full max-h-[500px]" />
                </div>
            );
        }
        if (post.proofType === 'link' || post.proofType === 'blog') {
            return (
                <a href={post.proofUrl} target="_blank" rel="noreferrer" 
                   className="block group bg-white/40 hover:bg-white/60 backdrop-blur-md p-5 rounded-2xl border border-white/80 transition-all shadow-sm hover:shadow-md">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-full inline-block mb-2">
                                {post.proofType === 'blog' ? 'Blog Post' : 'External Resource'}
                            </span>
                            <h5 className="text-gray-900 font-bold text-lg leading-tight mb-2 group-hover:text-indigo-600 transition-colors">
                                {post.challengeText || "Proof of Achievement"}
                            </h5>
                            <p className="text-xs text-gray-500 line-clamp-2 italic">
                                "{post.description || "Shared proof for this challenge. Click to view the full content and details."}"
                            </p>
                        </div>
                        <div className="bg-indigo-500 text-white p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                            <FaExternalLinkAlt />
                        </div>
                    </div>
                </a>
            );
        }
        return null;
    };

    const avatarFallback = (username) => `https://ui-avatars.com/api/?name=${username}&background=random&color=fff`;

return (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 mb-4 cursor-pointer break-inside-avoid"
  >

    {/* IMAGE / MAIN CONTENT */}
    <div className="relative">

      {/* IMAGE */}
      {post.proofType === "image" && (
        <img
          src={`http://localhost:5005${post.proofUrl}`}
          alt="post"
          className="w-full object-cover"
        />
      )}

      {/* VIDEO */}
      {post.proofType === "video" && (
        <video
          src={`http://localhost:5005${post.proofUrl}`}
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

      {/* 🔥 HOVER OVERLAY */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">

        <button className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold shadow">
          Save
        </button>

      </div>

      {/* 🔥 TOP RIGHT ACTIONS */}
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

    </div>

    {/* 🔥 USER INFO (MINIMAL) */}
    <div className="flex items-center justify-between px-3 py-2">

      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate(`/user/${post.user?._id}`)}
      >
        <img
          src={
            post.user?.profilePhoto ||
            `https://ui-avatars.com/api/?name=${post.user?.username}`
          }
          className="w-8 h-8 rounded-full object-cover"
        />

        <span className="text-sm font-semibold text-gray-700">
          {post.user?.username}
        </span>
      </div>

      {currentUser?._id !== post.user?._id && (
        <button
          onClick={handleFollow}
          className={`text-xs px-3 py-1 rounded-full ${
            followStatus === "following"
              ? "bg-gray-200 text-gray-700"
              : "bg-black text-white"
          }`}
        >
          {followStatus === "following" ? "Following" : "Follow"}
        </button>
      )}
    </div>

    {/* 🔥 TEXT (MINIMAL LIKE PINTEREST) */}
    {post.challengeText && (
      <p className="px-3 pb-3 text-sm text-gray-800 font-medium line-clamp-2">
        {post.challengeText}
      </p>
    )}

  </motion.div>
);
};

export default PostCard;
