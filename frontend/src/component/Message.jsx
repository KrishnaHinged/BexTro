import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

const Message = ({ message }) => {
    const scroll = useRef();
    const { authUser } = useSelector(store => store.user);

    useEffect(() => {
        scroll.current?.scrollIntoView({ behavior: 'smooth' });
    }, [message]);

    const isSender = String(message?.senderId) === String(authUser?._id);

    return (
        <div ref={scroll} className={`chat ${isSender ? 'chat-end' : 'chat-start'}`}>
           
            <div className="chat-header">
                {/* {displayName} */}
                <time className="text-xs opacity-50 ml-2">
                    {new Date(message?.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </time>
            </div>
            <div className={`chat-bubble ${isSender ? 'bg-primary text-white' : 'bg-gray-200 text-black'}`}>
                {message?.message}
            </div>
        </div>
    );
};

export default Message;