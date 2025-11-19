import React, { useState, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../../../redux/userSclice.js";

const OtherUser_Admin = ({ user }) => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((store) => store.user);
  const [activeTab, setActiveTab] = useState("interests");

  const selectedUserHandler = (user) => {
    console.log(user);
    dispatch(setSelectedUser(user));
  };

  const profilePhotoUrl = user?.profilePhoto?.startsWith("http")
    ? user.profilePhoto
    : user?.profilePhoto
    ? `http://localhost:5005${user.profilePhoto}`
    : "https://via.placeholder.com/150";

  const interests = user?.interests || [];
  const bucketList = user?.bucketList || [];

  return (
    <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-700/50 p-6 flex flex-col transition-all duration-300 hover:shadow-teal-500/20 hover:-translate-y-1">
      {/* Profile Section */}
      <div
        onClick={() => selectedUserHandler(user)}
        className="flex items-center gap-4 cursor-pointer mb-6"
      >
        <div className="relative">
          <img
            className="w-16 h-16 rounded-full border-2 border-teal-500 object-cover transition-transform duration-300 hover:scale-105"
            src={profilePhotoUrl}
            alt={`${user?.fullName || "User"}'s profile`}
          />
          <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-gray-800 rounded-full animate-pulse"></span>
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-teal-400">
            {user?.fullName || "Unknown User"}
          </h1>
          <div className="grid grid-cols-2 gap-2 mt-1 text-sm">
            <p className="text-gray-400">
              <span className="font-medium">Joined:</span>{" "}
              {user?.createdAt?.substring(0, 10) || "N/A"}
            </p>
            <p className="text-gray-400">
              <span className="font-medium">Score:</span>{" "}
              <span className="text-yellow-400">
                {user?.score !== undefined ? user.score : "N/A"}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700 mb-4">
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === "interests"
              ? "text-teal-400 border-b-2 border-teal-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
          onClick={() => setActiveTab("interests")}
        >
          Interests
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === "bucketlist"
              ? "text-teal-400 border-b-2 border-teal-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
          onClick={() => setActiveTab("bucketlist")}
        >
          Bucket List
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto max-h-64 scrollbar-thin scrollbar-thumb-teal-600 scrollbar-track-gray-800">
        {activeTab === "interests" && (
          <div className="bg-gray-700/50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-teal-400 mb-3">
              Interests
            </h2>
            {interests.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {interests.map((interest, index) => (
                  <span
                    key={index}
                    className="bg-teal-600/30 text-teal-300 px-3 py-1 rounded-full text-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">No interests added yet</p>
            )}
          </div>
        )}

        {activeTab === "bucketlist" && (
          <div className="bg-gray-700/50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-teal-400 mb-3">
              Bucket List
            </h2>
            {bucketList.length > 0 ? (
              <ul className="space-y-2">
                {bucketList.map((item, index) => (
                  <li
                    key={index}
                    className={`flex items-center gap-2 text-sm ${
                      item.achieved ? "text-gray-500 line-through" : "text-gray-200"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded border ${
                        item.achieved ? "bg-teal-500 border-teal-500" : "border-gray-500"
                      } flex items-center justify-center`}
                    >
                      {item.achieved && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </span>
                    {item.text}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center">
                No items in bucket list yet
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(OtherUser_Admin);