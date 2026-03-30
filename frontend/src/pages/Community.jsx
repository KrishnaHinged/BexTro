import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import MainSlideBar from "../components/layout/MainSlideBar.jsx";
import PageLoader from "../components/common/loaders/pagesLoader.jsx";
import Chat_SlideBar from "../components/features/chats/chat_SlideBar.jsx";
import MessageContainer from "../components/features/chats/messageContainer.jsx";
import ErrorBoundary from "../components/common/ErrorBoundary";

const Community = () => {
    const [communities, setCommunities] = useState([]);
    const [myCommunities, setMyCommunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("communities"); // "communities" or "chats"
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [showChatList, setShowChatList] = useState(true);

    // Form states
    const [showCreate, setShowCreate] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState("");

    const fetchCommunities = async () => {
        setLoading(true);
        try {
            const exploreRes = await axios.get("http://localhost:5005/api/v1/communities/explore", { withCredentials: true });
            const myRes = await axios.get("http://localhost:5005/api/v1/communities/my-communities", { withCredentials: true });
            
            setCommunities(exploreRes.data);
            setMyCommunities(myRes.data);
        } catch (error) {
            console.error("Error fetching communities", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCommunities();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setShowChatList(true);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", description);
            if (photoFile) formData.append("profilePhoto", photoFile);

            await axios.post(
                "http://localhost:5005/api/v1/communities/create",
                formData,
                { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
            );
            setShowCreate(false);
            setName("");
            setDescription("");
            setPhotoFile(null);
            setPhotoPreview("");
            fetchCommunities();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Failed to create community");
        }
    };

    const handleJoin = async (id) => {
        try {
            await axios.post(`http://localhost:5005/api/v1/communities/join/${id}`, {}, { withCredentials: true });
            fetchCommunities();
            alert("Joined successfully!");
        } catch (error) {
            console.error(error);
        }
    };

    const toggleChatList = () => {
        setShowChatList(!showChatList);
    };

    if (loading) return <PageLoader message="Loading Communities..." />;

    return (
        <ErrorBoundary>
            <div className="flex min-h-screen text-white">
                <MainSlideBar />
                <div className="flex-1 p-4 md:p-6">
                    <div className="flex items-center justify-between mb-4 md:mb-8">
                        <h1 className="text-2xl md:text-4xl font-extrabold text-white/90 tracking-tight drop-shadow-md">
                            Community
                        </h1>
                        {activeTab === "communities" && (
                            <button 
                                onClick={() => setShowCreate(true)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all"
                            >
                                + Create New
                            </button>
                        )}
                        {activeTab === "chats" && isMobile && (
                            <button
                                onClick={toggleChatList}
                                className="md:hidden bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg text-sm"
                            >
                                {showChatList ? 'Hide List' : 'Show List'}
                            </button>
                        )}
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex bg-white/60 p-1.5 rounded-full border w-72 mb-6">
                        <button 
                            className={`flex-1 py-2.5 rounded-full ${activeTab === 'communities' ? 'bg-indigo-500 text-white' : 'text-gray-500'}`}
                            onClick={() => setActiveTab('communities')}
                        >
                            Communities
                        </button>
                        <button 
                            className={`flex-1 py-2.5 rounded-full ${activeTab === 'chats' ? 'bg-indigo-500 text-white' : 'text-gray-500'}`}
                            onClick={() => setActiveTab('chats')}
                        >
                            Chats
                        </button>
                    </div>

                    {activeTab === "communities" ? (
                        <CommunitiesSection 
                            communities={communities}
                            myCommunities={myCommunities}
                            onJoin={handleJoin}
                            onOpenChat={() => setActiveTab('chats')}
                        />
                    ) : (
                        <ChatsSection 
                            isMobile={isMobile}
                            showChatList={showChatList}
                        />
                    )}
                </div>

                {/* Create Modal */}
                {showCreate && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
                            <h2 className="text-2xl font-extrabold text-indigo-900 mb-6">Create Community</h2>
                            <form onSubmit={handleCreate} className="flex flex-col gap-4">

                                {/* Community Photo */}
                                <div>
                                    <label className="text-gray-700 font-bold text-sm mb-2 block">Community Photo <span className="text-gray-400 font-normal">(optional)</span></label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-20 h-20 rounded-2xl bg-indigo-50 border-2 border-dashed border-indigo-200 flex items-center justify-center overflow-hidden shrink-0">
                                            {photoPreview ? (
                                                <img src={photoPreview} alt="preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-3xl">📷</span>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                                id="communityPhoto"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        setPhotoFile(file);
                                                        setPhotoPreview(URL.createObjectURL(file));
                                                    }
                                                }}
                                            />
                                            <label
                                                htmlFor="communityPhoto"
                                                className="cursor-pointer inline-block bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold text-sm px-4 py-2 rounded-xl border border-indigo-200 transition-all"
                                            >
                                                {photoFile ? "Change Photo" : "Upload Photo"}
                                            </label>
                                            {photoFile && (
                                                <p className="text-xs text-gray-400 mt-1 truncate max-w-[180px]">{photoFile.name}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-gray-700 font-bold text-sm mb-2 block">Community Name</label>
                                    <input required value={name} onChange={e=>setName(e.target.value)} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500" placeholder="E.g. Code Masters" />
                                </div>
                                <div>
                                    <label className="text-gray-700 font-bold text-sm mb-2 block">Description</label>
                                    <textarea required value={description} onChange={e=>setDescription(e.target.value)} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500" rows="3" placeholder="What's this group about?" />
                                </div>
                                <div className="flex gap-4 mt-2">
                                    <button type="button" onClick={() => { setShowCreate(false); setPhotoFile(null); setPhotoPreview(""); }} className="flex-1 px-4 py-3 bg-gray-100 font-bold text-gray-700 rounded-xl">Cancel</button>
                                    <button type="submit" className="flex-1 px-4 py-3 bg-indigo-600 font-bold text-white rounded-xl shadow-lg hover:bg-indigo-700">Create</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
};

const CommunitiesSection = ({ communities, myCommunities, onJoin, onOpenChat }) => {
    const [activeSubTab, setActiveSubTab] = useState("explore");
    const displayList = activeSubTab === "explore" ? communities : myCommunities;

    return (
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl transition-all duration-500">
            <div className="flex gap-6 border-b border-white/10 mb-8 pb-4">
                <button 
                    onClick={() => setActiveSubTab("explore")}
                    className={`pb-2 font-bold px-4 transition-all duration-300 ${activeSubTab === 'explore' ? 'text-indigo-400 border-b-2 border-indigo-400 scale-105' : 'text-white/40 hover:text-white/70'}`}
                >
                    Explore Public
                </button>
                <button 
                    onClick={() => setActiveSubTab("mine")}
                    className={`pb-2 font-bold px-4 transition-all duration-300 ${activeSubTab === 'mine' ? 'text-indigo-400 border-b-2 border-indigo-400 scale-105' : 'text-white/40 hover:text-white/70'}`}
                >
                    My Communities
                </button>
            </div>

            {displayList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayList.map(c => (
                        <div key={c._id} className="group bg-white/10 backdrop-blur-md p-1 rounded-3xl shadow-lg border border-white/20 hover:border-indigo-500/50 hover:shadow-indigo-500/10 transition-all duration-500 transform hover:-translate-y-2">
                            <div className="p-5">
                                <div className={`h-32 rounded-2xl mb-5 flex items-end p-5 shadow-inner overflow-hidden relative ${!c.profilePhoto ? `bg-gradient-to-br ${c.coverColor || 'from-indigo-500 to-purple-600'}` : ''}`}>
                                    {c.profilePhoto && (
                                        <img
                                            src={`http://localhost:5005${c.profilePhoto}`}
                                            alt={c.name}
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-500"></div>
                                    <h3 className="text-2xl font-bold text-white drop-shadow-xl z-10">{c.name}</h3>
                                </div>
                                <p className="text-white/70 text-sm mb-6 line-clamp-2 min-h-[3rem] leading-relaxed">{c.description}</p>
                                
                                <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>
                                        <span className="text-indigo-300 font-medium text-xs tracking-wide uppercase">
                                            {c.memberCount || 0} Members
                                        </span>
                                    </div>
                                    
                                    {activeSubTab === "explore" ? (
                                        <button 
                                            onClick={() => onJoin(c._id)}
                                            className="text-white bg-indigo-600/80 hover:bg-indigo-600 px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                                        >
                                            Join
                                        </button>
                                    ) : (
                                        <div
                                            onClick={onOpenChat}
                                            className="cursor-pointer flex items-center gap-2 text-indigo-300 hover:text-white font-bold text-sm bg-white/5 hover:bg-indigo-500 px-4 py-2.5 rounded-xl transition-all group/btn"
                                        >
                                            Open Chat <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                    <div className="text-6xl mb-4 opacity-50">🏔️</div>
                    <p className="text-white/40 font-medium text-lg">
                        {activeSubTab === "explore" ? "No public communities found." : "You haven't joined any communities yet."}
                    </p>
                    {activeSubTab === "mine" && (
                        <button 
                            onClick={() => setActiveSubTab("explore")}
                            className="mt-4 text-indigo-400 hover:text-indigo-300 font-bold underline underline-offset-4"
                        >
                            Explore Communities
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

const ChatsSection = ({ isMobile, showChatList }) => {
    return (
        <div className="flex h-[calc(100vh-7rem)] md:h-[calc(100vh-8rem)] rounded-xl md:rounded-2xl shadow-lg md:shadow-2xl backdrop-blur-xl bg-white/10 border border-white/20 overflow-hidden">
            {(showChatList || !isMobile) && (
                <div className={`${isMobile ? 'w-full absolute z-10' : 'w-1/3'} border-r border-white/20 flex-shrink-0 bg-gray-800 md:bg-transparent md:relative h-full`}>
                    <Chat_SlideBar onSelectChat={isMobile ? () => {} : null} />
                </div>
            )}
            <div className={`${isMobile && showChatList ? 'hidden' : 'flex-1'} p-2 overflow-y-auto`}>
                <MessageContainer />
            </div>
        </div>
    );
};

export default Community;