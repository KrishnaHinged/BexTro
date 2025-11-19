import React, { useState, useEffect } from "react";
import AdminSlideBar from "../component/admin/AdminSlideBar.jsx";
import Chat_SlideBar from "../component/chats/chat_SlideBar.jsx";
import MessageContainer from "../component/chats/messageContainer.jsx";

const AdminChat = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [showChatList, setShowChatList] = useState(true);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            // Always show both panels on desktop
            if (window.innerWidth >= 768) {
                setShowChatList(true);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleChatList = () => {
        setShowChatList(!showChatList);
    };

    return (
        <div className="flex min-h-screen text-white ">
            <AdminSlideBar />
            <div className="flex-1 p-4 md:p-6">
                <div className="flex items-center justify-between mb-4 md:mb-8">
                    <h1 className="text-2xl md:text-4xl font-extrabold text-white/90 tracking-tight drop-shadow-md">
                        Chats
                    </h1>
                    {isMobile && (
                        <button 
                            onClick={toggleChatList}
                            className="md:hidden bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg text-sm"
                        >
                            {showChatList ? 'Hide List' : 'Show List'}
                        </button>
                    )}
                </div>
                
                <div className="flex h-[calc(100vh-7rem)] md:h-[calc(100vh-8rem)] rounded-xl md:rounded-2xl shadow-lg md:shadow-2xl backdrop-blur-xl bg-white/10 border border-white/20 overflow-hidden">
                    {/* Chat List Sidebar */}
                    {(showChatList || !isMobile) && (
                        <div className={`${isMobile ? 'w-full absolute z-10 h-full' : 'w-full md:w-1/3'} border-r border-white/20 flex-shrink-0 bg-gray-800 md:bg-transparent md:relative`}>
                            <Chat_SlideBar 
                                onSelectChat={isMobile ? () => setShowChatList(false) : null}
                            />
                        </div>
                    )}
                    
                    {/* Message Container */}
                    <div className={`${isMobile && showChatList ? 'hidden' : 'flex-1'} p-2 overflow-y-auto`}>
                        
                        <MessageContainer />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminChat;