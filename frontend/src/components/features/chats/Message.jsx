import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { ROOT_URL } from "../../../api/axios";

const Message = ({ message }) => {
    const scroll = useRef();
    const { authUser } = useSelector(store => store.user);

    useEffect(() => {
        scroll.current?.scrollIntoView({ behavior: 'smooth' });
    }, [message]);

    const isSender = String(message?.senderId?._id || message?.senderId) === String(authUser?._id);
    const sender = message?.senderId;
    const { selectedUser } = useSelector(store => store.user);

    // Resolve name with multiple layers of fallbacks
    const resolvedName = isSender 
        ? (authUser?.fullName || authUser?.username || "You")
        : (sender?.fullName || sender?.username || (!selectedUser?.isCommunity ? selectedUser?.fullName : null) || "User");

    const avatarFallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(resolvedName)}&background=random&color=fff`;
    
    const profilePhotoUrl = sender?.profilePhoto?.startsWith("http")
        ? sender.profilePhoto
        : sender?.profilePhoto
            ? `${ROOT_URL}${sender.profilePhoto}`
            : (!isSender && !selectedUser?.isCommunity)
            ? (selectedUser?.profilePhoto?.startsWith("http") ? selectedUser.profilePhoto : `${ROOT_URL}${selectedUser?.profilePhoto}`)
            : avatarFallback;

    return (
        <div className={`flex flex-col ${isSender ? 'items-end' : 'items-start'} mb-4 px-2 animate-fadeIn`}>
            {/* Sender Name (for Receiver only) */}
            {!isSender && (
                <span className="text-[11px] font-semibold text-gray-500 mb-1 ml-10">
                    {resolvedName}
                </span>
            )}

            <div className={`flex gap-2 max-w-[85%] ${isSender ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar (for Receiver only) */}
                {!isSender && (
                    <div className="flex-shrink-0 mt-auto">
                        <img 
                            className="w-8 h-8 rounded-full border border-gray-200 object-cover shadow-sm bg-white"
                            src={sender?.profilePhoto || avatarFallback} 
                            alt="avatar" 
                            onError={(e) => e.target.src = avatarFallback}
                        />
                    </div>
                )}

                {/* Message Bubble */}
                <div className="flex flex-col group">
                    <div className={`
                        px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm transition-all duration-200
                        ${isSender 
                            ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-br-none hover:shadow-indigo-500/20' 
                            : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none hover:border-gray-200'
                        }
                    `}>
                        {message?.message}
                    </div>

                    {/* Footer Info */}
                    <div className={`flex items-center gap-2 mt-1 px-1 ${isSender ? 'justify-end' : 'justify-start'}`}>
                        <time className="text-[10px] text-gray-400">
                             {new Date(message?.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </time>
                        
                        {isSender && (
                            <span className="text-[10px] flex items-center gap-1 font-medium">
                                {message.isOptimistic ? (
                                    <span className="text-gray-400 italic flex items-center animate-pulse">
                                         sending...
                                    </span>
                                ) : (
                                    <span className={message.isSeen ? 'text-indigo-500' : 'text-gray-300'}>
                                        {message.isSeen ? 'Read' : 'Sent'}
                                    </span>
                                )}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Message;