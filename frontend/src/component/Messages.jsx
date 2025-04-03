import React from 'react';
import Message from './Message';
import useGetMessages from '../hooks/useGetMessages';
import { useSelector } from 'react-redux';
import useGetRealTimeMessage from '../hooks/useGetRealTimeMessage';

const Messages = () => {
    useGetMessages();
    useGetRealTimeMessage();
    const { messages } = useSelector((store) => store.message);

    if (!messages || messages.length === 0) {
        return (
            <div className="flex-1 p-4 overflow-y-auto text-gray-400">
                No messages yet.
            </div>
        );
    }

    return (
        <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((message) => (
                <Message key={message._id || Math.random()} message={message} />
            ))}
        </div>
    );
};

export default Messages;