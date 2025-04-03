import React, { useState } from "react";
import axios from "axios";
import { BiSearchAlt2 } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { setOtherUser } from "../../redux/userSclice";
import toast from "react-hot-toast";
import OUsers from "./OtherUsers";

const Chat_SlideBar = () => {
  const [search, setSearch] = useState("");
  const { OtherUsers } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const searchSubmitHandler = (e) => {
    e.preventDefault();
    if (!search.trim()) {
      // If search is empty, reset to show all users
      dispatch(setOtherUser(OtherUsers));
      return;
    }

    const searchTerm = search.toLowerCase().trim();
    const filteredUsers = OtherUsers?.filter((user) =>
      user.fullName.toLowerCase().includes(searchTerm)
    );

    if (filteredUsers?.length > 0) {
      dispatch(setOtherUser(filteredUsers));
    } else {
      toast.error("No users found matching your search");
      // Optionally keep the original list instead of clearing it
      dispatch(setOtherUser(OtherUsers));
    }
    setSearch("");
  };

  return (
    <div className="flex flex-col h-full p-4 bg-gray-900/80 text-white">
      <form onSubmit={searchSubmitHandler} className="flex items-center gap-3 mb-4 animate-fadeIn">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-2.5 bg-gray-800/90 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 hover:bg-gray-700/90"
          placeholder="Search chats..."
        />
        <button
          type="submit"
          className="p-2.5 bg-indigo-600 rounded-lg hover:bg-indigo-700 transform hover:scale-105 transition-all duration-200 active:scale-95"
        >
          <BiSearchAlt2 className="w-6 h-6 text-white" />
        </button>
      </form>
      <div className="border-t border-gray-700 mb-4 animate-expandLine"></div>
      <div className="flex-1 overflow-y-auto">
        <OUsers />
      </div>
    </div>
  );
};

export default Chat_SlideBar;