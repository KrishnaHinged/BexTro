import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMessages } from '../../../redux/messageSlice';

const SendMessage = () => {
    const [message, setMessage] = useState("");
    const dispatch = useDispatch();
    const {messages} = useSelector(store=>store.message)
const {selectedUser} = useSelector(store=>store.user)
    const {socket} = useSelector(store=>store.socket);
    const {authUser} = useSelector(store=>store.user);

    const handleInputChange = (e) => {
        setMessage(e.target.value);
        if (socket && selectedUser && !selectedUser.isCommunity) {
            socket.emit("typing", { 
                senderId: authUser?._id, 
                receiverId: selectedUser?._id, 
                isTyping: true 
            });

            // Stop typing after a delay
            if (window.typingTimeout) clearTimeout(window.typingTimeout);
            window.typingTimeout = setTimeout(() => {
                socket.emit("typing", { 
                    senderId: authUser?._id, 
                    receiverId: selectedUser?._id, 
                    isTyping: false 
                });
            }, 2000);
        }
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const tempId = Date.now().toString();
        const optimisticMessage = {
            _id: tempId,
            senderId: authUser?._id,
            receiverId: selectedUser?._id,
            message: message,
            isOptimistic: true, // Label for UI
            createdAt: new Date().toISOString()
        };

        // 1. Optimistic Update
        dispatch(setMessages([...messages, optimisticMessage]));
        const messageToSend = message;
        setMessage("");

        try {
            const endpoint = selectedUser.isCommunity 
                ? `http://localhost:5005/api/v1/message/community/send/${selectedUser?._id}`
                : `http://localhost:5005/api/v1/message/send/${selectedUser?._id}`;

            const res = await axios.post(endpoint, {message: messageToSend} ,{ 
                Headers:{'Content-Type':'application/json'},
                withCredentials:true
            });

            // 2. Replace optimistic message with real message from server
            const updatedMessages = [...messages, res?.data?.newMessage];
            dispatch(setMessages(updatedMessages));
            
            // Stop typing immediately on send
            if (socket && selectedUser) {
                socket.emit("typing", { senderId: authUser?._id, receiverId: selectedUser?._id, isTyping: false });
            }
        } catch (error) {
            console.log(error);
            // 3. Rollback on error
            dispatch(setMessages(messages)); 
            toast.error("Failed to send message");
        }
    }
    return (
        <div className="p-4 border-t border-gray-700 animate-slideUp">
            <form onSubmit={onSubmitHandler} className="flex gap-3">
                <input
                    value={message}
                    onChange={handleInputChange}
                    type="text"
                    className="flex-1 p-2.5 bg-gray-800/90 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 hover:bg-gray-700/90"
                    placeholder="Type a message..."
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transform hover:scale-105 transition-all duration-200 active:scale-95 text-white font-medium"
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default SendMessage;
