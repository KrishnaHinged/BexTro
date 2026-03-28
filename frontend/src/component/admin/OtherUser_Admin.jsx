import React, { useState, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../../../redux/userSlice.js";

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
    <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-6 flex flex-col transition-all duration-500 hover:shadow-2xl hover:bg-white/10 hover:border-white/20 group transform hover:-translate-y-1">
      {/* Profile Section */}
      <div
        onClick={() => selectedUserHandler(user)}
        className="flex items-center gap-4 cursor-pointer mb-6"
      >
        <div className="relative">
          <img
            className="w-16 h-16 rounded-2xl border-2 border-white/20 object-cover shadow-lg transition-transform duration-500 group-hover:scale-110"
            src={profilePhotoUrl}
            alt={`${user?.fullName || "User"}'s profile`}
          />
          <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[#1a1c23] rounded-full"></span>
        </div>
        <div className="flex-1">
          <h4 className="text-xl font-black text-white tracking-tight leading-tight">
            {user?.fullName || "Unknown User"}
          </h4>
          <div className="flex flex-col gap-0.5 mt-1">
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
              Joined {user?.createdAt?.substring(0, 10) || "N/A"}
            </p>
            <p className="text-indigo-400 text-sm font-black">
              Proof Score: {user?.score !== undefined ? user.score : 0}
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 p-1 bg-white/5 rounded-xl mb-4 border border-white/5">
        <button
          className={`flex-1 py-2 font-black text-[10px] uppercase tracking-widest rounded-lg transition-all ${
            activeTab === "interests"
              ? "bg-indigo-600 text-white shadow-lg"
              : "text-white/40 hover:text-white"
          }`}
          onClick={() => setActiveTab("interests")}
        >
          Interests
        </button>
        <button
          className={`flex-1 py-2 font-black text-[10px] uppercase tracking-widest rounded-lg transition-all ${
            activeTab === "bucketlist"
              ? "bg-indigo-600 text-white shadow-lg"
              : "text-white/40 hover:text-white"
          }`}
          onClick={() => setActiveTab("bucketlist")}
        >
          Bucket List
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto max-h-48 scroll-smooth pr-1">
        {activeTab === "interests" && (
          <div className="space-y-3">
            {interests.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {interests.map((interest, index) => (
                  <span
                    key={index}
                    className="bg-white/10 text-white/80 border border-white/10 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-tighter hover:bg-white/20 transition-colors"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-white/20 text-center text-xs italic py-4">No interests documented.</p>
            )}
          </div>
        )}

        {activeTab === "bucketlist" && (
          <div className="space-y-2">
            {bucketList.length > 0 ? (
              <ul className="space-y-2">
                {bucketList.map((item, index) => (
                  <li
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-xl border border-white/5 ${
                      item.achieved ? "bg-green-500/10 opacity-60" : "bg-white/5"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-md border-2 ${
                        item.achieved ? "bg-green-500 border-green-500" : "border-white/20"
                      } flex items-center justify-center transition-all flex-shrink-0`}
                    >
                      {item.achieved && (
                        <svg className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-xs font-medium ${item.achieved ? "text-white/40 line-through" : "text-white/80"}`}>
                        {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-white/20 text-center text-xs italic py-4">
                No items in bucket list.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Moderation Actions */}
      <div className="mt-6 pt-6 border-t border-white/10 flex gap-2">
         <button 
           onClick={() => user.role === 'admin' ? window.onUpdateRole(user._id, 'user') : window.onUpdateRole(user._id, 'admin')}
           className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
            ${user.role === 'admin' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' : 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'}
            hover:scale-[1.02] active:scale-[0.98]`}
         >
           {user.role === 'admin' ? 'Demote' : 'Promote'}
         </button>
         <button 
           onClick={() => window.onDeleteUser(user._id)}
           className="px-5 py-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/30 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
         >
           Delete
         </button>
      </div>
    </div>
  );
};

export default memo(OtherUser_Admin);