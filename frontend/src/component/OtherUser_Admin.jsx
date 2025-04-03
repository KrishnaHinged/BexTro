import React, { useState, memo } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, setSelectedUser } from "../../redux/userSclice.js";

const fetchAPI = async (url, body) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });
    if (!response.headers.get("Content-Type")?.includes("application/json")) {
      throw new Error("Response is not JSON");
    }
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Request failed");
    return result;
  } catch (error) {
    throw error;
  }
};

const OtherUser_Admin = ({ user }) => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((store) => store.user);
  const navigate = useNavigate();

  const [interests, setInterests] = useState(user?.interests || []);
  const [bucketList, setBucketList] = useState(user?.bucketList || []);
  const [newInterest, setNewInterest] = useState("");
  const [newBucketItem, setNewBucketItem] = useState("");
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

  const handleAddInterest = async () => {
    const trimmedInterest = newInterest.trim();
    if (!trimmedInterest) return toast.error("Interest cannot be empty!");
    if (interests.includes(trimmedInterest)) return toast.error("Interest already exists!");
    try {
      await fetchAPI("http://localhost:5005/api/v1/userdata/interests", {
        interest: trimmedInterest,
        action: "add",
      });
      setInterests([...interests, trimmedInterest]);
      setNewInterest("");
      toast.success("Interest added!");
    } catch (error) {
      console.error("Add Interest Error:", error);
      toast.error(error.message || "Failed to add interest!");
    }
  };

  const handleDeleteInterest = async (interest) => {
    try {
      await fetchAPI("http://localhost:5005/api/v1/userdata/interests", {
        interest,
        action: "remove",
      });
      setInterests(interests.filter((i) => i !== interest));
      toast.success("Interest removed!");
    } catch (error) {
      console.error("Delete Interest Error:", error);
      toast.error(error.message || "Failed to remove interest!");
    }
  };

  const handleAddBucketItem = async () => {
    const trimmedItem = newBucketItem.trim();
    if (!trimmedItem) return toast.error("Bucket list item cannot be empty!");
    if (bucketList.some((item) => item.text === trimmedItem))
      return toast.error("Item already exists!");
    try {
      await fetchAPI("http://localhost:5005/api/v1/userdata/bucket-list", {
        action: "add",
        item: { text: trimmedItem, achieved: false },
      });
      setBucketList([...bucketList, { text: trimmedItem, achieved: false }]);
      setNewBucketItem("");
      toast.success("Bucket list item added!");
    } catch (error) {
      console.error("Add Bucket List Item Error:", error);
      toast.error(error.message || "Failed to add bucket list item!");
    }
  };

  const handleUpdateBucketItem = async (text, currentAchieved) => {
    try {
      const updatedItem = { text, achieved: !currentAchieved };
      await fetchAPI("http://localhost:5005/api/v1/userdata/bucket-list", {
        action: "update",
        item: updatedItem,
      });
      setBucketList(
        bucketList.map((item) =>
          item.text === text ? { ...item, achieved: !currentAchieved } : item
        )
      );
      toast.success(`Item marked as ${!currentAchieved ? "achieved" : "not achieved"}!`);
    } catch (error) {
      console.error("Update Bucket List Item Error:", error);
      toast.error(error.message || "Failed to update bucket list item!");
    }
  };

  const handleDeleteBucketItem = async (text) => {
    try {
      await fetchAPI("http://localhost:5005/api/v1/userdata/bucket-list", {
        action: "remove",
        item: { text },
      });
      setBucketList(bucketList.filter((item) => item.text !== text));
      toast.success("Bucket list item removed!");
    } catch (error) {
      console.error("Delete Bucket List Item Error:", error);
      toast.error(error.message || "Failed to remove bucket list item!");
    }
  };

  return (
    <div className="min-h-screen w-full rounded-2xl bg-gray-900 text-gray-200 p-4 flex flex-col shadow-lg">
      {/* Header Section */}
      <div className="sticky top-0 bg-gray-800 p-4 rounded-xl shadow-md mb-6 border border-gray-700 z-10">
        <div className="flex items-center justify-between">
          <div
            onClick={() => selectedUserHandler(user)}
            className="flex items-center gap-4 cursor-pointer flex-1"
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
              <h1 className="text-2xl font-bold text-teal-400">
                {user?.fullName || "Unknown User"}
              </h1>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <p className="text-sm text-gray-400">
                  <span className="font-medium">Joined:</span> {user?.createdAt?.substring(0, 10) || "N/A"}
                </p>
                <p className="text-sm text-gray-400">
                  <span className="font-medium">Score:</span>{" "}
                  <span className="text-yellow-400">
                    {user?.score !== undefined ? user.score : "N/A"}
                  </span>
                </p>

              </div>
            </div>
          </div>


        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700 mb-6">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'interests' ? 'text-teal-400 border-b-2 border-teal-400' : 'text-gray-400 hover:text-gray-300'}`}
          onClick={() => setActiveTab('interests')}
        >
          Interests
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'bucketlist' ? 'text-teal-400 border-b-2 border-teal-400' : 'text-gray-400 hover:text-gray-300'}`}
          onClick={() => setActiveTab('bucketlist')}
        >
          Bucket List
        </button>

      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'interests' && (
          <div className="bg-gray-800 p-5 rounded-xl shadow-lg border border-gray-700">
            <h2 className="text-xl font-semibold text-teal-400 mb-4">Manage Interests</h2>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Add new interest"
                className="flex-1 p-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                onKeyPress={(e) => e.key === 'Enter' && handleAddInterest()}
              />
              <button
                onClick={handleAddInterest}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-teal-600 scrollbar-track-gray-800">
              {interests.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {interests.map((interest, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-700/50 hover:bg-gray-600/50 px-4 py-2 rounded-lg transition-colors"
                    >
                      <span className="truncate">{interest}</span>
                      <button
                        onClick={() => handleDeleteInterest(interest)}
                        aria-label={`Remove ${interest}`}
                        className="ml-2 text-rose-500 hover:text-rose-600 transition-colors p-1 rounded-full hover:bg-rose-500/10"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-500 mt-2">No interests added yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'bucketlist' && (
          <div className="bg-gray-800 p-5 rounded-xl shadow-lg border border-gray-700">
            <h2 className="text-xl font-semibold text-teal-400 mb-4">Manage Bucket List</h2>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newBucketItem}
                onChange={(e) => setNewBucketItem(e.target.value)}
                placeholder="Add new bucket list item"
                className="flex-1 p-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                onKeyPress={(e) => e.key === 'Enter' && handleAddBucketItem()}
              />
              <button
                onClick={handleAddBucketItem}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-teal-600 scrollbar-track-gray-800">
              {bucketList.length > 0 ? (
                <div className="space-y-2">
                  {bucketList.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-gray-700/50 p-3 rounded-lg hover:bg-gray-600/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <button
                          onClick={() => handleUpdateBucketItem(item.text, item.achieved)}
                          className={`flex-shrink-0 h-5 w-5 rounded border ${item.achieved ? 'bg-teal-500 border-teal-500' : 'border-gray-500'} flex items-center justify-center transition-colors`}
                          aria-label={`Mark as ${item.achieved ? 'not achieved' : 'achieved'}`}
                        >
                          {item.achieved && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                        <span
                          className={`flex-1 truncate ${item.achieved ? 'line-through text-gray-500' : 'text-gray-200'}`}
                        >
                          {item.text}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteBucketItem(item.text)}
                        aria-label={`Remove ${item.text}`}
                        className="text-rose-500 hover:text-rose-600 transition-colors p-1 rounded-full hover:bg-rose-500/10 ml-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <p className="text-gray-500 mt-2">No items in bucket list yet</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default memo(OtherUser_Admin);