// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useParams, Navigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import MainSlideBar from '../component/main_SlideBar.jsx';
// import PostCard from '../component/PostCard.jsx';
// import ChallengeCard from '../component/challenge_tab/ChallengeCard.jsx';
// import Masonry from 'react-masonry-css';
// import { toast } from 'react-hot-toast';

// const UserProfile = () => {
//     const { userId } = useParams();
//     const { authUser: currentUser } = useSelector(store => store.user);
//     const [profileUser, setProfileUser] = useState(null);
//     const [posts, setPosts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [activeTab, setActiveTab] = useState('proofs');
    
//     // UI state
//     const [connectionStatus, setConnectionStatus] = useState("none");
//     const [isFollowing, setIsFollowing] = useState(false);
//     const [followersCount, setFollowersCount] = useState(0);

//     const fetchUserData = async () => {
//         try {
//             const [postRes, profileRes] = await Promise.all([
//                 axios.get(`http://localhost:5005/api/v1/posts/user/${userId}`, { withCredentials: true }),
//                 axios.get(`http://localhost:5005/api/v1/user/profile/${userId}`, { withCredentials: true })
//             ]);
            
//             setPosts(postRes.data);
//             setProfileUser(profileRes.data.user);
//             setConnectionStatus(profileRes.data.connectionStatus);
//             setIsFollowing(profileRes.data.isFollowing);
//             setFollowersCount(profileRes.data.followersCount);
            
//         } catch (error) {
//             console.error("Error fetching user profile", error);
//             toast.error("Failed to load profile.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (userId) {
//             fetchUserData();
//         }
//     }, [userId, currentUser]);

//     const handleFollow = async () => {
//         try {
//             const res = await axios.post(`http://localhost:5005/api/v1/user/${userId}/follow`, {}, { withCredentials: true });
//             setIsFollowing(res.data.isFollowing);
//             setFollowersCount(prev => res.data.isFollowing ? prev + 1 : prev - 1);
//             toast.success(res.data.message);
//         } catch (error) {
//             toast.error("Follow action failed.");
//         }
//     };

//     const handleConnect = async () => {
//         try {
//             if (connectionStatus === "none") {
//                 await axios.post(`http://localhost:5005/api/v1/user/${userId}/connect`, {}, { withCredentials: true });
//                 setConnectionStatus("pending");
//                 toast.success("Connection request sent!");
//             } else if (connectionStatus === "received") {
//                 await axios.post(`http://localhost:5005/api/v1/user/${userId}/accept`, {}, { withCredentials: true });
//                 setConnectionStatus("connected");
//                 toast.success("You are now connected!");
//             }
//         } catch (error) {
//             toast.error("Connection action failed.");
//         }
//     };

//     if (!currentUser) return <Navigate to="/signin" />;
    
//     if (loading) return (
//         <div className="min-h-screen bg-transparent flex justify-center items-center">
//             <span className="loading loading-spinner text-info w-16"></span>
//         </div>
//     );

//     const avatarFallback = `https://ui-avatars.com/api/?name=${profileUser?.username}&background=6366f1&color=fff`;

//     const masonryBreakpoints = {
//         default: 3,
//         1100: 2,
//         700: 1
//     };

//     return (
//         <div className="flex min-h-screen">
//             <MainSlideBar />

//             <div className="flex-1 relative overflow-y-auto max-h-screen">
//                 <div className='fixed top-0 left-0 w-full h-full -z-10 bg-gradient-to-br from-indigo-50/20 via-white to-purple-50/20'></div>

//                 <div className="pt-20 px-4 md:px-12 max-w-6xl mx-auto pb-20">
                    
//                     {/* Pinterest Style Header */}
//                     <div className="flex flex-col items-center mb-16">
//                         <div className="relative mb-6">
//                             <img 
//                                 src={profileUser?.profilePhoto || avatarFallback} 
//                                 onError={(e) => e.target.src = avatarFallback}
//                                 alt="Profile" 
//                                 className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-xl object-cover hover:scale-105 transition-transform duration-500"
//                             />
//                             {profileUser?.role === 'admin' && (
//                                 <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg tracking-widest uppercase">Admin</div>
//                             )}
//                         </div>
                        
//                         <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-2 tracking-tight">{profileUser?.fullName}</h1>
//                         <p className="text-gray-500 font-bold text-lg mb-6">@{profileUser?.username}</p>
                        
//                         <div className="flex gap-8 mb-8">
//                             <div className="text-center group cursor-default">
//                                 <span className="block text-2xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors">{posts.length}</span>
//                                 <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Proofs</span>
//                             </div>
//                             <div className="text-center group cursor-default">
//                                 <span className="block text-2xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors">{followersCount}</span>
//                                 <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Followers</span>
//                             </div>
//                             <div className="text-center group cursor-default">
//                                 <span className="block text-2xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors">{profileUser?.score || 0}</span>
//                                 <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">XP Score</span>
//                             </div>
//                         </div>

//                         {currentUser._id !== userId && (
//                             <div className="flex gap-4">
//                                 <button 
//                                     onClick={handleFollow}
//                                     className={`px-8 py-3.5 rounded-full font-black text-sm transition-all shadow-lg hover:shadow-indigo-100 transform hover:-translate-y-1 active:scale-95
//                                         ${isFollowing ? 'bg-gray-100 text-gray-800 border border-gray-200' : 'bg-gray-900 text-white'}`}
//                                 >
//                                     {isFollowing ? 'Following' : 'Follow'}
//                                 </button>
                                
//                                 <button 
//                                     onClick={handleConnect}
//                                     className={`px-8 py-3.5 rounded-full font-black text-sm transition-all shadow-lg transform hover:-translate-y-1 active:scale-95 flex items-center gap-2
//                                         ${connectionStatus === 'connected' ? 'bg-indigo-600 text-white' : 
//                                           connectionStatus === 'pending' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 
//                                           connectionStatus === 'received' ? 'bg-amber-500 text-white animate-bounce' :
//                                           'bg-white text-gray-900 border-2 border-gray-900'}`}
//                                     disabled={connectionStatus === 'pending' || connectionStatus === 'connected'}
//                                 >
//                                     {connectionStatus === 'connected' ? 'Connected ✓' : 
//                                      connectionStatus === 'pending' ? 'Requested' : 
//                                      connectionStatus === 'received' ? 'Accept Request' :
//                                      'Message +'}
//                                 </button>
//                             </div>
//                         )}
//                     </div>

//                     {/* Pinterest Style Tabs */}
//                     <div className="flex justify-center gap-12 mb-12 border-b border-gray-100 pb-4">
//                         <button 
//                             className={`font-black text-sm uppercase tracking-widest transition-all pb-2 relative ${activeTab === 'proofs' ? 'text-gray-900' : 'text-gray-300 hover:text-gray-500'}`}
//                             onClick={() => setActiveTab('proofs')}
//                         >
//                             History of Proofs
//                             {activeTab === 'proofs' && <div className="absolute -bottom-[18px] left-0 w-full h-[3px] bg-indigo-600 rounded-full"></div>}
//                         </button>
//                         <button 
//                             className={`font-black text-sm uppercase tracking-widest transition-all pb-2 relative ${activeTab === 'ongoing' ? 'text-gray-900' : 'text-gray-300 hover:text-gray-500'}`}
//                             onClick={() => setActiveTab('ongoing')}
//                         >
//                             Active Targets
//                             {activeTab === 'ongoing' && <div className="absolute -bottom-[18px] left-0 w-full h-[3px] bg-indigo-600 rounded-full"></div>}
//                         </button>
//                     </div>

//                     {/* Pinterest Style Content Grid */}
//                     {activeTab === 'proofs' && (
//                         <div>
//                             {posts.length > 0 ? (
//                                 <Masonry
//                                     breakpointCols={masonryBreakpoints}
//                                     className="flex w-auto -ml-4"
//                                     columnClassName="pl-4 pb-4"
//                                 >
//                                     {posts.map(post => <PostCard key={post._id} post={post} currentUser={currentUser} />)}
//                                 </Masonry>
//                             ) : (
//                                 <div className="text-center py-32 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-200">
//                                     <span className="text-4xl block mb-4">🌑</span>
//                                     <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No proofs documented yet</p>
//                                 </div>
//                             )}
//                         </div>
//                     )}

//                     {activeTab === 'ongoing' && (
//                         <div>
//                             {profileUser?.acceptedChallenges?.filter(c => c.status === 'active').length > 0 ? (
//                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                                     {profileUser.acceptedChallenges.filter(c => c.status === 'active').map((challenge, idx) => (
//                                         <div key={challenge._id || idx} className="opacity-95 transform hover:scale-[1.02] transition-transform">
//                                             <ChallengeCard challenge={challenge} index={idx} onComplete={()=>{}} onAbandon={()=>{}} />
//                                         </div>
//                                     ))}
//                                 </div>
//                             ) : (
//                                 <div className="text-center py-32 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-200">
//                                     <span className="text-4xl block mb-4">🌤️</span>
//                                     <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No active challenges currently</p>
//                                 </div>
//                             )}
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default UserProfile;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MainSlideBar from '../component/main_SlideBar.jsx';
import PostCard from '../component/PostCard.jsx';
import ChallengeCard from '../component/challenge_tab/ChallengeCard.jsx';
import Masonry from 'react-masonry-css';
import { toast } from 'react-hot-toast';

const UserProfile = () => {
const { userId } = useParams();
const { authUser: currentUser } = useSelector(store => store.user);
const [profileUser, setProfileUser] = useState(null);
const [posts, setPosts] = useState([]);
const [loading, setLoading] = useState(true);
const [activeTab, setActiveTab] = useState('proofs');

// UI state
const [connectionStatus, setConnectionStatus] = useState("none");
const [isFollowing, setIsFollowing] = useState(false);
const [followersCount, setFollowersCount] = useState(0);

const fetchUserData = async () => {
    try {
        const [postRes, profileRes] = await Promise.all([
            axios.get(`http://localhost:5005/api/v1/posts/user/${userId}`, { withCredentials: true }),
            axios.get(`http://localhost:5005/api/v1/user/profile/${userId}`, { withCredentials: true })
        ]);
        
        setPosts(postRes.data);
        setProfileUser(profileRes.data.user);
        setConnectionStatus(profileRes.data.connectionStatus);
        setIsFollowing(profileRes.data.isFollowing);
        setFollowersCount(profileRes.data.followersCount);
        
    } catch (error) {
        console.error("Error fetching user profile", error);
        toast.error("Failed to load profile.");
    } finally {
        setLoading(false);
    }
};

useEffect(() => {
    if (userId) {
        fetchUserData();
    }
}, [userId, currentUser]);

const handleFollow = async () => {
    try {
        const res = await axios.post(`http://localhost:5005/api/v1/user/${userId}/follow`, {}, { withCredentials: true });
        setIsFollowing(res.data.isFollowing);
        setFollowersCount(prev => res.data.isFollowing ? prev + 1 : prev - 1);
        toast.success(res.data.message);
    } catch (error) {
        toast.error("Follow action failed.");
    }
};

const handleConnect = async () => {
    try {
        if (connectionStatus === "none") {
            await axios.post(`http://localhost:5005/api/v1/user/${userId}/connect`, {}, { withCredentials: true });
            setConnectionStatus("pending");
            toast.success("Connection request sent!");
        } else if (connectionStatus === "received") {
            await axios.post(`http://localhost:5005/api/v1/user/${userId}/accept`, {}, { withCredentials: true });
            setConnectionStatus("connected");
            toast.success("You are now connected!");
        }
    } catch (error) {
        toast.error("Connection action failed.");
    }
};

if (!currentUser) return <Navigate to="/signin" />;

if (loading) return (
    <div className="min-h-screen bg-transparent flex justify-center items-center">
        <span className="loading loading-spinner text-info w-16"></span>
    </div>
);

// ✅ FIX ADDED HERE (ONLY ADDITION)
const profilePhotoUrl = profileUser?.profilePhoto?.startsWith("http")
    ? profileUser.profilePhoto
    : profileUser?.profilePhoto
    ? `http://localhost:5005${profileUser.profilePhoto}`
    : `https://ui-avatars.com/api/?name=${profileUser?.username}&background=6366f1&color=fff`;

const masonryBreakpoints = {
    default: 3,
    1100: 2,
    700: 1
};

return (
    <div className="flex min-h-screen">
        <MainSlideBar />

        <div className="flex-1 relative overflow-y-auto max-h-screen">
            <div className='fixed top-0 left-0 w-full h-full -z-10 bg-gradient-to-br from-indigo-50/20 via-white to-purple-50/20'></div>

            <div className="pt-20 px-4 md:px-12 max-w-6xl mx-auto pb-20">
                
                {/* Pinterest Style Header */}
                <div className="flex flex-col items-center mb-16">
                    <div className="relative mb-6">
                        <img 
                            src={profilePhotoUrl} 
                            onError={(e) => e.target.src = "https://ui-avatars.com/api/?name=User"}
                            alt="Profile" 
                            className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-xl object-cover hover:scale-105 transition-transform duration-500"
                        />
                        {profileUser?.role === 'admin' && (
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg tracking-widest uppercase">Admin</div>
                        )}
                    </div>
                    
                    <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-2 tracking-tight">{profileUser?.fullName}</h1>
                    <p className="text-gray-500 font-bold text-lg mb-6">@{profileUser?.username}</p>
                    
                    <div className="flex gap-8 mb-8">
                        <div className="text-center group cursor-default">
                            <span className="block text-2xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors">{posts.length}</span>
                            <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Proofs</span>
                        </div>
                        <div className="text-center group cursor-default">
                            <span className="block text-2xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors">{followersCount}</span>
                            <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Followers</span>
                        </div>
                        <div className="text-center group cursor-default">
                            <span className="block text-2xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors">{profileUser?.score || 0}</span>
                            <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">XP Score</span>
                        </div>
                    </div>

                    {currentUser._id !== userId && (
                        <div className="flex gap-4">
                            <button 
                                onClick={handleFollow}
                                className={`px-8 py-3.5 rounded-full font-black text-sm transition-all shadow-lg hover:shadow-indigo-100 transform hover:-translate-y-1 active:scale-95
                                    ${isFollowing ? 'bg-gray-100 text-gray-800 border border-gray-200' : 'bg-gray-900 text-white'}`}
                            >
                                {isFollowing ? 'Following' : 'Follow'}
                            </button>
                            
                            <button 
                                onClick={handleConnect}
                                className={`px-8 py-3.5 rounded-full font-black text-sm transition-all shadow-lg transform hover:-translate-y-1 active:scale-95 flex items-center gap-2
                                    ${connectionStatus === 'connected' ? 'bg-indigo-600 text-white' : 
                                      connectionStatus === 'pending' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 
                                      connectionStatus === 'received' ? 'bg-amber-500 text-white animate-bounce' :
                                      'bg-white text-gray-900 border-2 border-gray-900'}`}
                                disabled={connectionStatus === 'pending' || connectionStatus === 'connected'}
                            >
                                {connectionStatus === 'connected' ? 'Connected ✓' : 
                                 connectionStatus === 'pending' ? 'Requested' : 
                                 connectionStatus === 'received' ? 'Accept Request' :
                                 'Message +'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Pinterest Style Tabs */}
                <div className="flex justify-center gap-12 mb-12 border-b border-gray-100 pb-4">
                    <button 
                        className={`font-black text-sm uppercase tracking-widest transition-all pb-2 relative ${activeTab === 'proofs' ? 'text-gray-900' : 'text-gray-300 hover:text-gray-500'}`}
                        onClick={() => setActiveTab('proofs')}
                    >
                        History of Proofs
                        {activeTab === 'proofs' && <div className="absolute -bottom-[18px] left-0 w-full h-[3px] bg-indigo-600 rounded-full"></div>}
                    </button>
                    <button 
                        className={`font-black text-sm uppercase tracking-widest transition-all pb-2 relative ${activeTab === 'ongoing' ? 'text-gray-900' : 'text-gray-300 hover:text-gray-500'}`}
                        onClick={() => setActiveTab('ongoing')}
                    >
                        Active Targets
                        {activeTab === 'ongoing' && <div className="absolute -bottom-[18px] left-0 w-full h-[3px] bg-indigo-600 rounded-full"></div>}
                    </button>
                </div>

                {/* Pinterest Style Content Grid */}
                {activeTab === 'proofs' && (
                    <div>
                        {posts.length > 0 ? (
                            <Masonry
                                breakpointCols={masonryBreakpoints}
                                className="flex w-auto -ml-4"
                                columnClassName="pl-4 pb-4"
                            >
                                {posts.map(post => <PostCard key={post._id} post={post} currentUser={currentUser} />)}
                            </Masonry>
                        ) : (
                            <div className="text-center py-32 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-200">
                                <span className="text-4xl block mb-4">🌑</span>
                                <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No proofs documented yet</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'ongoing' && (
                    <div>
                        {profileUser?.acceptedChallenges?.filter(c => c.status === 'active').length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {profileUser.acceptedChallenges.filter(c => c.status === 'active').map((challenge, idx) => (
                                    <div key={challenge._id || idx} className="opacity-95 transform hover:scale-[1.02] transition-transform">
                                        <ChallengeCard challenge={challenge} index={idx} onComplete={()=>{}} onAbandon={()=>{}} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-32 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-200">
                                <span className="text-4xl block mb-4">🌤️</span>
                                <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No active challenges currently</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    </div>
);


};

export default UserProfile;
