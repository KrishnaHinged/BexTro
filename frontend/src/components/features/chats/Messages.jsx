import React from 'react';
import Message from './Message';
import useGetMessages from '../../../hooks/useGetMessages';
import { useSelector } from 'react-redux';
import useGetRealTimeMessage from '../../../hooks/useGetRealTimeMessage';

const Messages = () => {
    useGetMessages();
    useGetRealTimeMessage();
    const { messages } = useSelector((store) => store.message);
    const scrollRef = React.useRef();

    React.useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (!messages || messages.length === 0) {
        return (
            <div className="flex-1 p-4 overflow-y-auto text-gray-400 flex items-center justify-center italic">
                No messages yet. Say hello!
            </div>
        );
    }

    return (
        <div className="flex-1 p-4 overflow-y-auto space-y-2">
            {messages.map((message) => (
                <div key={message._id || Math.random()} ref={scrollRef}>
                    <Message message={message} />
                </div>
            ))}
        </div>
    );
};

export default Messages;