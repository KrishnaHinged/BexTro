import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/userSclice.js";

const InterestsTab = () => {
  const [interests, setInterests] = useState([]);
  const [newInterest, setNewInterest] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        console.log("Fetching interests from http://localhost:5005/api/v1/userdata/interests");
        const response = await fetch("http://localhost:5005/api/v1/userdata/interests", {
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
          throw new Error("Interests endpoint not found. Please contact support.");
        }
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          console.error("Non-JSON Response:", text);
          throw new Error("Server returned a non-JSON response");
        }
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch interests");
        }
        const data = await response.json();
        console.log("Fetched Interests:", data);
        setInterests(data.interests || []);
      } catch (error) {
        console.error("Fetch Interests Error:", error);
        toast.error(error.message || "Failed to load interests!");
      }
    };
    fetchInterests();
  }, [navigate, dispatch]);

  const handleAddInterest = async () => {
    const trimmedInterest = newInterest.trim();
    if (!trimmedInterest) {
      return toast.error("Interest cannot be empty!");
    }
    if (interests.includes(trimmedInterest)) {
      return toast.error("This interest already exists!");
    }
    try {
      const response = await fetch("http://localhost:5005/api/v1/userdata/interests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ interest: trimmedInterest, action: "add" }),
      });
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON Response:", text);
        throw new Error("Server returned a non-JSON response");
      }
      const result = await response.json();
      if (response.ok) {
        setInterests([...interests, trimmedInterest]);
        setNewInterest("");
        toast.success(result.message || "Interest added!");
      } else {
        throw new Error(result.error || "Failed to add interest");
      }
    } catch (error) {
      console.error("Add Interest Error:", error);
      toast.error(error.message || "An error occurred!");
    }
  };

  const handleRemoveInterest = async (interest) => {
    try {
      const response = await fetch("http://localhost:5005/api/v1/userdata/interests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ interest, action: "remove" }),
      });
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON Response:", text);
        throw new Error("Server returned a non-JSON response");
      }
      const result = await response.json();
      if (response.ok) {
        setInterests(interests.filter((i) => i !== interest));
        toast.success(result.message || "Interest removed!");
      } else {
        throw new Error(result.error || "Failed to remove interest");
      }
    } catch (error) {
      console.error("Remove Interest Error:", error);
      toast.error(error.message || "An error occurred!");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Interests</h2>
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          value={newInterest}
          onChange={(e) => setNewInterest(e.target.value)}
          placeholder="Add a new interest"
          className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleAddInterest}
          className="px-6 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-3">
        {interests.map((interest) => (
          <div
            key={interest}
            className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full flex items-center"
          >
            {interest}
            <button
              onClick={() => handleRemoveInterest(interest)}
              className="ml-2 text-rose-600 hover:text-rose-800"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterestsTab;