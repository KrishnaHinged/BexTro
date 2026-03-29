import React, { useEffect } from "react";
import SendMessage from "./SendMessage";
import Messages from "./Messages";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../../../redux/userSlice";
import { ROOT_URL } from "../../utils/axiosInstance";

const MessageContainer = () => {
  const dispatch = useDispatch();
  const { selectedUser, authUser, onlineUsers } = useSelector((store) => store.user);
  const { socket } = useSelector((store) => store.socket);
  const [isTyping, setIsTyping] = [React.useState(false)]; // Local typing state

  useEffect(() => {
    if (socket && selectedUser) {
        socket.on("typingStatus", ({ senderId, isTyping }) => {
            if (senderId === selectedUser._id) {
                setIsTyping(isTyping);
            }
        });

        // Emit 'markAsSeen' when conversation opens
        socket.emit("markAsSeen", { senderId: selectedUser._id, receiverId: authUser?._id });

        return () => {
            socket.off("typingStatus");
            dispatch(setSelectedUser(null));
        };
    }
  }, [dispatch, socket, selectedUser, authUser?._id]);

  const profilePhotoUrl = selectedUser?.profilePhoto?.startsWith("http")
    ? selectedUser.profilePhoto
    : selectedUser?.profilePhoto
    ? `${ROOT_URL}${selectedUser.profilePhoto}`
    : "https://via.placeholder.com/150";

  if (!selectedUser) {
    return (
      <div className="flex flex-col h-full justify-center items-center text-gray-400 animate-pulse">
        <p className="text-lg">Select a user to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-900 animate-fadeInUp">
      <header className="flex items-center gap-3 bg-gray-800/90 p-4 rounded-t-lg border-b border-gray-700 transition-all duration-300">
        <div className="relative group">
          <img
            className="w-12 h-12 rounded-full border-2 border-gray-600 object-cover transition-all duration-300 group-hover:scale-110"
            src={profilePhotoUrl}
            alt={`${selectedUser?.fullName || "User"}'s profile`}
            onError={(e) => {
              console.warn("Failed to load profile image for:", selectedUser?.fullName);
              e.target.src = "https://via.placeholder.com/150";
            }}
          />
         
        </div>
        <div>
          <p className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors duration-200">
            {selectedUser?.fullName || "Unknown User"}
          </p>
          <div className="flex items-center gap-2">
            {isTyping ? (
                <span className="text-xs text-indigo-400 animate-pulse font-medium">typing...</span>
            ) : (
                <>
                    <div className={`w-2 h-2 rounded-full ${onlineUsers?.includes(selectedUser?._id) ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-500'}`}></div>
                    <span className="text-xs text-gray-400 capitalize">
                        {onlineUsers?.includes(selectedUser?._id) ? 'Online' : 'Offline'}
                    </span>
                </>
            )}
          </div>
        </div>
      </header>
      <Messages />
      <SendMessage />
    </div>
  );
};

export default MessageContainer;
