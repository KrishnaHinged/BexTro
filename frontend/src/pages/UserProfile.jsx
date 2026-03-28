import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../component/home/Navbar.jsx';
import PostCard from '../component/PostCard.jsx';
import ChallengeCard from '../component/challenge_tab/ChallengeCard.jsx';

const UserProfile = () => {
    const { userId } = useParams();
    const { authUser: currentUser } = useSelector(store => store.user);
    const [profileUser, setProfileUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('proofs'); // 'proofs' | 'followers' | 'following'
    
    // For local UI update of follow status
    const [connectionStatus, setConnectionStatus] = useState("none"); // "none", "pending", "connected"
    const [followersCount, setFollowersCount] = useState(0);

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                const [postRes, profileRes] = await Promise.all([
                    axios.get(`http://localhost:5005/api/v1/posts/user/${userId}`, { withCredentials: true }),
                    axios.get(`http://localhost:5005/api/v1/user/profile/${userId}`, { withCredentials: true })
                ]);
                
                setPosts(postRes.data);
                setProfileUser(profileRes.data);
                
                // If the user's followers list implies a connection status, map it. (Already handled below)

                // Check connection status
                if (currentUser) {
                    if (currentUser.connections?.includes(userId)) setConnectionStatus("connected");
                    else if (currentUser.sentRequests?.includes(userId)) setConnectionStatus("pending");
                    else setConnectionStatus("none");
                }
                
            } catch (error) {
                console.error("Error fetching user profile", error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchUserData();
        }
    }, [userId, currentUser]);

    const handleConnect = async () => {
        try {
            if (connectionStatus === "none") {
                setConnectionStatus("pending");
                await axios.post(`http://localhost:5005/api/v1/connections/request/${userId}`, {}, { withCredentials: true });
            } else if (connectionStatus === "connected") {
                setConnectionStatus("none");
                setFollowersCount(prev => prev - 1);
                await axios.post(`http://localhost:5005/api/v1/connections/disconnect/${userId}`, {}, { withCredentials: true });
            }
        } catch (error) {
            console.error("Error with connection action", error);
            // Revert on error
            setConnectionStatus("none");
        }
    };

    if (!currentUser) return <Navigate to="/signin" />;
    
    if (loading) return (
        <div className="min-h-screen bg-transparent flex justify-center items-center">
            <span className="loading loading-spinner text-info w-16"></span>
        </div>
    );

    return (
        <div className="min-h-screen bg-transparent relative">
            {/* Standard Background aligning with Light Theme */}
            <div className='fixed top-0 left-0 w-full h-full -z-10 bg-gradient-to-br from-indigo-50/40 via-purple-50/30 to-blue-50/40'></div>

            <Navbar />

            <div className="pt-24 px-4 md:px-8 max-w-5xl mx-auto">
                <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-3xl p-6 md:p-10 mb-8 flex flex-col md:flex-row items-center md:items-start gap-8 shadow-sm">
                    <img 
                        src={profileUser?.profilePhoto || "https://avatar.iran.liara.run/public"} 
                        alt="Profile" 
                        className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg object-cover"
                    />
                    
                    <div className="flex-1 text-center md:text-left mt-4 md:mt-2">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight">{profileUser?.fullName}</h1>
                        <p className="text-indigo-600 font-semibold text-lg mt-1">@{profileUser?.username}</p>
                        
                        <div className="flex justify-center md:justify-start gap-8 mt-6">
                            <div className="text-center">
                                <span className="block text-2xl font-extrabold text-gray-800">{posts.length}</span>
                                <span className="text-indigo-500 font-medium text-sm tracking-wide uppercase">Proofs</span>
                            </div>
                            <div className="text-center cursor-pointer hover:opacity-80 transition" onClick={() => setActiveTab('followers')}>
                                <span className="block text-2xl font-extrabold text-gray-800">{followersCount}</span>
                                <span className="text-indigo-500 font-medium text-sm tracking-wide uppercase">Followers</span>
                            </div>
                        </div>
                    </div>

                    {currentUser._id !== userId && (
                        <div className="mt-4 md:mt-0 flex gap-3">
                            <button 
                                onClick={handleConnect}
                                className={`px-8 py-3 rounded-xl font-bold transition-all shadow-md flex items-center gap-2 transform hover:-translate-y-0.5
                                    ${connectionStatus === 'connected' ? 'bg-white border-2 border-indigo-100 text-indigo-600 hover:bg-gray-50' : 
                                      connectionStatus === 'pending' ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-2 border-gray-200' : 
                                      'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200'}`}
                                disabled={connectionStatus === 'pending'}
                            >
                                {connectionStatus === 'connected' ? 'Connected' : connectionStatus === 'pending' ? 'Pending...' : 'Connect +'}
                            </button>
                            {connectionStatus === "connected" && (
                                <button className="px-5 py-3 rounded-xl bg-indigo-50 text-indigo-600 font-bold border border-indigo-100 hover:bg-indigo-100 transition shadow-sm">
                                    Message
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-8 pb-1">
                    <button 
                        className={`mr-8 font-extrabold py-2 border-b-4 transition-all tracking-wide ${activeTab === 'proofs' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                        onClick={() => setActiveTab('proofs')}
                    >
                        Completed Proofs
                    </button>
                    <button 
                        className={`font-extrabold py-2 border-b-4 transition-all tracking-wide ${activeTab === 'ongoing' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                        onClick={() => setActiveTab('ongoing')}
                    >
                        Ongoing Challenges
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'proofs' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                        {posts.length > 0 ? (
                            posts.map(post => <PostCard key={post._id} post={post} currentUser={currentUser} />)
                        ) : (
                            <div className="col-span-full text-center text-gray-500 font-medium py-16 bg-white/40 backdrop-blur-sm rounded-3xl border border-white/60 shadow-sm mt-4">
                                This user hasn't posted any proofs yet.
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'ongoing' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                        {profileUser?.acceptedChallenges?.filter(c => c.status === 'active').length > 0 ? (
                            profileUser.acceptedChallenges.filter(c => c.status === 'active').map((challenge, idx) => (
                                <div key={challenge._id || idx} className="opacity-95 pointer-events-none">
                                    <ChallengeCard challenge={challenge} index={idx} onComplete={()=>{}} onAbandon={()=>{}} />
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center text-gray-500 font-medium py-16 bg-white/40 backdrop-blur-sm rounded-3xl border border-white/60 shadow-sm mt-4">
                                This user currently has no active challenges.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
