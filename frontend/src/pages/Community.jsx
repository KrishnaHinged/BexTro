import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import MainSlideBar from "../component/main_SlideBar.jsx";
import PageLoader from "../component/pagesLoader.jsx";
import Chat_SlideBar from "../component/chats/chat_SlideBar.jsx";
import MessageContainer from "../component/chats/messageContainer.jsx";
import ErrorBoundary from "../component/ErrorBoundary";

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
            await axios.post("http://localhost:5005/api/v1/communities/create", { name, description }, { withCredentials: true });
            setShowCreate(false);
            fetchCommunities();
        } catch (error) {
            console.error(error);
            alert("Failed to create community");
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
                                <div>
                                    <label className="text-gray-700 font-bold text-sm mb-2 block">Community Name</label>
                                    <input required value={name} onChange={e=>setName(e.target.value)} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500" placeholder="E.g. Code Masters" />
                                </div>
                                <div>
                                    <label className="text-gray-700 font-bold text-sm mb-2 block">Description</label>
                                    <textarea required value={description} onChange={e=>setDescription(e.target.value)} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500" rows="3" placeholder="What's this group about?" />
                                </div>
                                <div className="flex gap-4 mt-6">
                                    <button type="button" onClick={() => setShowCreate(false)} className="flex-1 px-4 py-3 bg-gray-100 font-bold text-gray-700 rounded-xl">Cancel</button>
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

const CommunitiesSection = ({ communities, myCommunities, onJoin }) => {
    const [activeSubTab, setActiveSubTab] = useState("explore");

    return (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-lg">
            <div className="flex gap-4 border-b border-white/20 mb-6 pb-4">
                <button 
                    onClick={() => setActiveSubTab("explore")}
                    className={`pb-2 font-bold px-2 ${activeSubTab === 'explore' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-white/60'}`}
                >
                    Explore Public
                </button>
                <button 
                    onClick={() => setActiveSubTab("mine")}
                    className={`pb-2 font-bold px-2 ${activeSubTab === 'mine' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-white/60'}`}
                >
                    My Communities
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(activeSubTab === "explore" ? communities : myCommunities).map(c => (
                    <div key={c._id} className="bg-white/20 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white/30 hover:shadow-md transition-all">
                        <div className={`h-24 rounded-xl bg-gradient-to-r ${c.coverColor} mb-4 flex items-end p-4`}>
                            <h3 className="text-xl font-bold text-white drop-shadow-md">{c.name}</h3>
                        </div>
                        <p className="text-white/80 text-sm mb-4 line-clamp-2 min-h-10">{c.description}</p>
                        
                        <div className="flex justify-between items-center mt-auto">
                            <span className="text-indigo-300 font-bold bg-indigo-500/20 px-3 py-1 rounded-lg text-xs">
                                {c.memberCount} Members
                            </span>
                            
                            {activeSubTab === "explore" ? (
                                <button 
                                    onClick={() => onJoin(c._id)}
                                    className="text-white bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded-lg font-bold text-sm transition"
                                >
                                    Join
                                </button>
                            ) : (
                                <Link to={`/chats?community=${c._id}`} className="text-indigo-300 hover:text-indigo-100 font-bold text-sm">
                                    Open Chat &rarr;
                                </Link>
                            )}
                        </div>
                    </div>
                ))}
            </div>
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