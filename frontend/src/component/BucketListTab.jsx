import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/userSclice.js";
const BucketListTab = () => {
  const [bucketList, setBucketList] = useState([]);
  const [newItem, setNewItem] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchBucketList = async () => {
      try {
        console.log(`Fetching bucket list from http://localhost:5005/api/v1/userdata/bucket-list`);
        const response = await fetch(`http://localhost:5005/api/v1/userdata/bucket-list`, {
          credentials: "include",
        });
        console.log("Response Status:", response.status);
        if (response.status === 401) {
          toast.error("Session expired. Please log in again.");
          dispatch(logoutUser());
          navigate("/signup");
          return;
        }
        if (response.status === 404) {
          throw new Error("Bucket list endpoint not found. Please contact support.");
        }
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          console.error("Non-JSON Response:", text);
          throw new Error("Server returned a non-JSON response");
        }
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch bucket list");
        }
        const data = await response.json();
        console.log("Fetched Bucket List:", data);
        setBucketList(data.bucketList || []);
      } catch (error) {
        console.error("Fetch Bucket List Error:", error);
        toast.error(error.message || "Failed to load bucket list!");
      }
    };
    fetchBucketList();
  }, [navigate, dispatch]);

  const handleAddItem = async () => {
    const trimmedItem = newItem.trim();
    if (!trimmedItem) {
      return toast.error("Item cannot be empty!");
    }
    if (bucketList.some((entry) => entry.text === trimmedItem)) {
      return toast.error("This item already exists in your bucket list!");
    }
    try {
      const response = await fetch(`http://localhost:5005/api/v1/userdata/bucket-list`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "add", item: { text: trimmedItem, achieved: false } }),
      });
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON Response:", text);
        throw new Error("Server returned a non-JSON response");
      }
      const result = await response.json();
      if (response.ok) {
        setBucketList([...bucketList, { text: trimmedItem, achieved: false }]);
        setNewItem("");
        toast.success(result.message || "Item added to bucket list!");
      } else {
        throw new Error(result.error || "Failed to add item");
      }
    } catch (error) {
      console.error("Add Bucket List Item Error:", error);
      toast.error(error.message || "An error occurred!");
    }
  };

  const handleRemoveItem = async (text) => {
    try {
      const response = await fetch(`http://localhost:5005/api/v1/userdata/bucket-list`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "remove", item: { text } }),
      });
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON Response:", text);
        throw new Error("Server returned a non-JSON response");
      }
      const result = await response.json();
      if (response.ok) {
        setBucketList(bucketList.filter((entry) => entry.text !== text));
        toast.success(result.message || "Item removed from bucket list!");
      } else {
        throw new Error(result.error || "Failed to remove item");
      }
    } catch (error) {
      console.error("Remove Bucket List Item Error:", error);
      toast.error(error.message || "An error occurred!");
    }
  };

  const handleUpdateAchieved = async (text, currentAchieved) => {
    try {
      const updatedItem = { text, achieved: !currentAchieved };
      const response = await fetch(`http://localhost:5005/api/v1/userdata/bucket-list`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "update", item: updatedItem }),
      });
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON Response:", text);
        throw new Error("Server returned a non-JSON response");
      }
      const result = await response.json();
      if (response.ok) {
        setBucketList(
          bucketList.map((entry) =>
            entry.text === text ? { ...entry, achieved: !currentAchieved } : entry
          )
        );
        toast.success(result.message || `Item marked as ${!currentAchieved ? "achieved" : "not achieved"}!`);
      } else {
        throw new Error(result.error || "Failed to update item status");
      }
    } catch (error) {
      console.error("Update Bucket List Item Error:", error);
      toast.error(error.message || "An error occurred!");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Bucket List</h2>
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add a new bucket list item"
          className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleAddItem}
          className="px-6 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
        >
          Add
        </button>
      </div>
      <div className="space-y-3">
        {bucketList.map((entry) => (
          <div
            key={entry.text}
            className="flex items-center justify-between bg-gray-100 p-3 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={entry.achieved}
                onChange={() => handleUpdateAchieved(entry.text, entry.achieved)}
                className="h-5 w-5 text-indigo-600 rounded"
              />
              <span className={entry.achieved ? "line-through text-gray-500" : "text-gray-800"}>
                {entry.text}
              </span>
            </div>
            <button
              onClick={() => handleRemoveItem(entry.text)}
              className="text-rose-600 hover:text-rose-800"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BucketListTab;