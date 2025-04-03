import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMessages } from '../../redux/messageSlice';

const SendMessage = () => {
    const [message, setMessage] = useState("");
    const dispatch = useDispatch();
    const {messages} = useSelector(store=>store.message)
const {selectedUser} = useSelector(store=>store.user)
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`http://localhost:5005/api/v1/message/send/${selectedUser?._id}`, {message} ,{ Headers:{'Content-Type':'application/json'},
                withCredentials:true
        })
        dispatch(setMessages([...messages, res?.data?.newMessage]))
        } catch (error) {
console.log(error);

        }
        setMessage("")
    }
    return (
        <div className="p-4 border-t border-gray-700 animate-slideUp">
            <form onSubmit={onSubmitHandler} className="flex gap-3">
                <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
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
