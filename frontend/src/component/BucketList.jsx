import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const BucketList = () => {
  const [bucketList, setBucketList] = useState([]);
  const [newItem, setNewItem] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5005/api/v1/userdata/bucket-list", { withCredentials: true })
      .then((res) => {
        setBucketList(res.data.bucketList || []);
      })
      .catch((err) => {
        console.error("Error fetching bucket list:", err);
        toast.error(err.response?.data?.error || "Failed to fetch bucket list");
      });
  }, []);

  const addItem = () => {
    if (newItem.trim()) {
      const newItemObj = { text: newItem, achieved: false };
      axios
        .post(
          "http://localhost:5005/api/v1/userdata/bucket-list",
          { action: "add", item: newItemObj },
          { withCredentials: true }
        )
        .then((res) => {
          setBucketList(res.data.data || []);
          setNewItem("");
          toast.success("Item added to bucket list!");
        })
        .catch((err) => {
          console.error("Error adding item:", err);
          toast.error(err.response?.data?.error || "Failed to update bucket list");
        });
    }
  };

  const removeItem = (id) => {
    const itemToRemove = bucketList.find((item) => item._id === id);
    if (itemToRemove) {
      axios
        .post(
          "http://localhost:5005/api/v1/userdata/bucket-list",
          { action: "remove", item: itemToRemove },
          { withCredentials: true }
        )
        .then((res) => {
          setBucketList(res.data.data || []);
          toast.success("Item removed from bucket list!");
        })
        .catch((err) => {
          console.error("Error removing item:", err);
          toast.error(err.response?.data?.error || "Failed to remove item");
        });
    }
  };

  const toggleAchieved = (id) => {
    const itemToUpdate = bucketList.find((item) => item._id === id);
    if (itemToUpdate) {
      const updatedItem = { ...itemToUpdate, achieved: !itemToUpdate.achieved };
      axios
        .post(
          "http://localhost:5005/api/v1/userdata/bucket-list",
          { action: "update", item: updatedItem },
          { withCredentials: true }
        )
        .then((res) => {
          setBucketList(res.data.data || []);
          toast.success(updatedItem.achieved ? "Marked as achieved!" : "Marked as not achieved!");
        })
        .catch((err) => {
          console.error("Error updating item:", err);
          toast.error(err.response?.data?.error || "Failed to update item");
        });
    }
  };

  const handleStartAchieving = () => {
    navigate("/set_challenges");
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
   
    >
      <div className="max-w-2xl w-full p-8 bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Your Dream Bucket List ✨</h1>
        <p className="text-xl text-gray-800 mb-6">Because life’s too short for regrets. Add, achieve, and repeat!</p>

        <div className="flex justify-center gap-2 mb-6">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Add your dream goal"
            className="px-4 py-2 bg-white/30 backdrop-blur-md rounded-xl border-none text-gray-800 w-48"
          />
          <button
            onClick={addItem}
            className="px-4 py-2 bg-green-500/80 rounded-xl text-white hover:bg-green-600 transition-all"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <AnimatePresence>
            {bucketList.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`relative px-6 py-3 rounded-xl border cursor-pointer transition-all duration-300 shadow-md flex items-center justify-between w-full max-w-xs backdrop-blur-md ${
                  item.achieved
                    ? "bg-green-400/50 border-green-500 text-white shadow-lg animate-pulse"
                    : "bg-white/30 border-white/40"
                }`}
                onClick={() => toggleAchieved(item._id)}
              >
                <span>{item.text}</span>
                <button
                  className="bg-red-300 p-3 border border-white text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeItem(item._id);
                  }}
                >
                  ❌
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <button
          onClick={handleStartAchieving}
          className="px-6 py-3 bg-purple-500/80 rounded-full text-white hover:bg-purple-600 transition-all"
        >
          Start Achieving 🚀
        </button>
      </div>
    </div>
  );
};

export default BucketList;