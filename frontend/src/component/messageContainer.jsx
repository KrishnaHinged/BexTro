import React, { useEffect } from "react";
import SendMessage from "./SendMessage";
import Messages from "./Messages";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../../redux/userSclice";

const MessageContainer = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((store) => store.user); // Moved above useEffect

  // useEffect(() => {
  //   return () => dispatch(setSelectedUser(null));
  // }, [dispatch]); // Removed `selectedUser` from dependency array to prevent unnecessary re-renders

  const profilePhotoUrl = selectedUser?.profilePhoto?.startsWith("http")
    ? selectedUser.profilePhoto
    : selectedUser?.profilePhoto
    ? `http://localhost:5005${selectedUser.profilePhoto}`
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
          <span
            className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-gray-800 rounded-full animate-ping"
            aria-hidden="true"
          ></span>
          <span
            className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-gray-800 rounded-full"
            aria-hidden="true"
          ></span>
        </div>
        <div>
          <p className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors duration-200">
            {selectedUser?.fullName || "Unknown User"}
          </p>
          <p
            className="text-sm text-gray-400"
            aria-live="polite"
            aria-label={`${selectedUser?.fullName || "User"} is online`}
          >
            Online
          </p>
        </div>
      </header>
      <Messages />
      <SendMessage />
    </div>
  );
};

export default MessageContainer;
