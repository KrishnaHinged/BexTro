import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

const Message = ({ message }) => {
    const scroll = useRef();
    const { authUser } = useSelector(store => store.user);

    useEffect(() => {
        scroll.current?.scrollIntoView({ behavior: 'smooth' });
    }, [message]);

    const isSender = String(message?.senderId?._id || message?.senderId) === String(authUser?._id);
    const sender = message?.senderId;
    const avatarFallback = `https://ui-avatars.com/api/?name=${sender?.username || 'User'}&background=random&color=fff`;

    return (
        <div ref={scroll} className={`chat ${isSender ? 'chat-end' : 'chat-start'} mb-2`}>
            {!isSender && (
                <div className="chat-image avatar">
                    <div className="w-10 rounded-full border border-gray-200 overflow-hidden bg-white">
                        <img 
                            src={sender?.profilePhoto || avatarFallback} 
                            alt="avatar" 
                            onError={(e) => e.target.src = avatarFallback}
                        />
                    </div>
                </div>
            )}
            <div className="chat-header mb-1 flex items-center gap-2">
                {!isSender && (
                    <span className="text-xs font-bold text-gray-700">
                        {sender?.username || 'Unknown'}
                    </span>
                )}
                <time className="text-[10px] opacity-40">
                    {new Date(message?.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </time>
            </div>
            <div className={`chat-bubble text-sm font-medium shadow-sm transition-all hover:shadow-md ${isSender ? 'bg-indigo-600 text-white' : 'bg-white text-gray-800 border border-gray-100'}`}>
                {message?.message}
            </div>
            {isSender && (
                <div className="chat-footer opacity-50 text-[10px] mt-1 flex items-center gap-1">
                    {message.isOptimistic ? (
                        <span className="animate-pulse italic">Sending...</span>
                    ) : message.isSeen ? (
                        <span className="text-blue-500 font-bold">Seen</span>
                    ) : (
                        <span>Sent</span>
                    )}
                </div>
            )}
        </div>
    );
};

export default Message;