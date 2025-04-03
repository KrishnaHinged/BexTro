import React, { useState, useEffect } from "react";
import MainSlideBar from "../component/main_SlideBar.jsx";
import Chat_SlideBar from "../component/chat_SlideBar.jsx";
import PageLoader from "../component/pagesLoader.jsx";
import MessageContainer from "../component/messageContainer.jsx";

const Chat = () => {
    const [step, setStep] = useState(1);

    useEffect(() => {
        const timer = setTimeout(() => setStep(2), 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex min-h-screen text-white">
            {step === 1 ? (
                <PageLoader message="Chats..." />
            ) : (
                <div className="flex w-full animate-fadeIn">
                    <MainSlideBar />
                    <div className="flex-1 p-6">
                        <h1 className="text-4xl font-extrabold text-white/90 mb-8 tracking-tight drop-shadow-md animate-slideDown">
                            Chats
                        </h1>
                        <div className="flex h-[calc(100vh-8rem)] rounded-2xl shadow-2xl backdrop-blur-xl bg-white/10 border border-white/20 overflow-hidden transform transition-all duration-300 hover:shadow-indigo-500/20">
                            <div className="w-1/3 border-r border-white/20 flex-shrink-0 animate-slideInLeft">
                                <Chat_SlideBar />
                            </div>
                            <div className="flex-1 p-6 overflow-y-auto animate-slideInRight">
                                <MessageContainer />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chat;
