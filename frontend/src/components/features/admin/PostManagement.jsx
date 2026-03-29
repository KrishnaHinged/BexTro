import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaTrash, FaEye, FaUser } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const PostManagement = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            // We can use the feed API or a specific admin API if we created one
            // Let's assume we have a global feed/posts list for admins
            const res = await axios.get("http://localhost:5005/api/v1/posts/feed", { withCredentials: true });
            setPosts(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Fetch posts error:", error);
            setLoading(false);
        }
    };

    const handleDelete = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        try {
            await axios.delete(`http://localhost:5005/api/v1/admin/post/${postId}`, { withCredentials: true });
            toast.success("Post deleted.");
            fetchPosts();
        } catch (error) {
            toast.error("Failed to delete post.");
        }
    };

    if (loading) return <div className="p-10 text-white text-center">Loading posts...</div>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Post Moderation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <motion.div
                        key={post._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden flex flex-col"
                    >
                        <div className="p-4 border-b border-white/10 flex items-center gap-3">
                            <img src={post.user?.profilePhoto} className="w-8 h-8 rounded-lg object-cover" alt="avatar" />
                            <div>
                                <p className="text-white font-bold text-xs">{post.user?.fullName}</p>
                                <p className="text-white/40 text-[10px]">@{post.user?.username}</p>
                            </div>
                        </div>
                        <div className="flex-1 p-4">
                            <p className="text-white/80 text-xs italic mb-4">"{post.challengeText}"</p>
                            {post.proofType === 'image' && (
                                <img src={`http://localhost:5005${post.proofUrl}`} className="w-full h-32 object-cover rounded-xl border border-white/20" alt="Proof" />
                            )}
                            {post.proofType === 'video' && (
                                <div className="w-full h-32 bg-black/20 rounded-xl flex items-center justify-center text-white/40 text-[10px]">Video Content</div>
                            )}
                        </div>
                        <div className="p-4 bg-black/10 flex justify-between gap-2">
                             <a href={`http://localhost:5005${post.proofUrl}`} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold rounded-lg transition-all">
                                <FaEye /> View Full
                             </a>
                             <button onClick={() => handleDelete(post._id)} className="flex items-center justify-center gap-2 py-2 px-4 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white text-[10px] font-bold rounded-lg transition-all">
                                <FaTrash /> Delete
                             </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default PostManagement;
