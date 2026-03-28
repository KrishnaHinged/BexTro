import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaHeart, FaRegHeart, FaComment } from 'react-icons/fa';

// Make sure icons exist, if not we will use an alternative or text.

const PostCard = ({ post, currentUser }) => {
    const [likes, setLikes] = useState(post.likes || []);
    const [isLiked, setIsLiked] = useState(
        post.likes?.includes(currentUser?._id) || false
    );
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [comments, setComments] = useState(post.comments || []);

    const handleLike = async () => {
        try {
            const res = await axios.post(
                `http://localhost:5005/api/v1/posts/${post._id}/like`,
                {},
                { withCredentials: true }
            );

            setLikes(res.data.likes);
            setIsLiked(res.data.likes.includes(currentUser._id));
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

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/60 backdrop-blur-xl border border-white/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col gap-4 mb-6 break-inside-avoid"
        >
            {/* Header: User Info */}
            <div className="flex items-center gap-3">
                <img
                    src={post.user?.profilePhoto || "https://avatar.iran.liara.run/public"}
                    alt="avatar"
                    className="w-10 h-10 rounded-full bg-black/20"
                />
                <div>
                    <h4 className="text-gray-900 font-extrabold text-md">{post.user?.fullName}</h4>
                    <span className="text-gray-500 font-medium text-xs">@{post.user?.username} • {post.timelineTaken} days</span>
                </div>
            </div>

            {/* Challenge Info */}
            <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/50 shadow-inner">
                <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest">Challenge Completed</span>
                <p className="text-gray-800 font-medium text-md mt-1.5 italic">"{post.challengeText}"</p>
            </div>

            {/* Proof Display */}
            <div className="rounded-xl overflow-hidden my-1 border border-gray-100 shadow-sm">
                {post.proofType === 'image' && (
                    <img src={`http://localhost:5005${post.proofUrl}`} alt="Proof" className="w-full h-auto object-cover max-h-96" />
                )}
                {post.proofType === 'video' && (
                    <video controls src={`http://localhost:5005${post.proofUrl}`} className="w-full max-h-96" />
                )}
                {post.proofType === 'link' || post.proofType === 'blog' ? (
                    <a href={post.proofUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center p-6 bg-indigo-50 hover:bg-indigo-100 transition rounded-xl text-indigo-600 font-bold border border-indigo-100">
                        View Attached Link / Blog 🔗
                    </a>
                ) : null}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between text-gray-500 border-t border-gray-200 pt-3">
                <button onClick={handleLike} className="flex items-center gap-2 hover:text-red-500 transition cursor-pointer font-semibold">
                    {isLiked ? <span className="text-red-500 font-bold text-lg">♥</span> : <span className="text-lg">♡</span>} {likes.length} Likes
                </button>
                <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-2 hover:text-indigo-600 transition cursor-pointer font-semibold">
                    💬 {comments.length} Comments
                </button>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="mt-2 bg-gray-50 p-4 rounded-xl flex flex-col gap-3 border border-gray-100 shadow-inner">
                    <div className="max-h-48 overflow-y-auto pr-2 space-y-3">
                        {comments.length === 0 ? <p className="text-sm text-center text-gray-400 font-medium">No comments yet.</p> : null}
                        {comments.map((c, idx) => (
                            <div key={idx} className="flex flex-col text-sm border-b border-gray-200 pb-2 last:border-0 last:pb-0">
                                <span className="font-extrabold text-indigo-600">{c.user?.username || 'User'}</span>
                                <span className="text-gray-700 font-medium">{c.text}</span>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleComment} className="flex gap-2 mt-2">
                        <input
                            type="text"
                            className="bg-white border border-gray-300 rounded-lg px-4 py-2 flex-1 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 transition shadow-sm"
                            placeholder="Write a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                        />
                        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 shadow-sm text-white font-bold px-4 py-2 rounded-lg text-sm transition-all transform hover:scale-105">
                            Post
                        </button>
                    </form>
                </div>
            )}
        </motion.div>
    );
};

export default PostCard;
