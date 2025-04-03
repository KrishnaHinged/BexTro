import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const ProfileTab = ({ onLogout }) => {
  const [profileData, setProfileData] = useState({ fullName: "", username: "", profilePhoto: "" });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:5005/api/v1/user/profile", {
          credentials: "include",
        });
  
        if (response.status === 401) {
          console.warn("User not logged in, skipping profile fetch.");
          return; // Stop execution if unauthorized
        }
  
        if (!response.ok) throw new Error("Failed to fetch profile");
  
        const data = await response.json();
        setProfileData(data);
        setPreviewUrl(data.profilePhoto);
      } catch (error) {
        console.error("Fetch Profile Error:", error);
        toast.error("Failed to load profile!");
      }
    };
  
    fetchProfile();
  }, []);
  

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    // Check if user is logged in before updating
    const responseCheck = await fetch("http://localhost:5005/api/v1/user/profile", {
        credentials: "include",
    });

    if (!responseCheck.ok) {
        toast.error("You are not logged in. Please log in again.");
        return;
    }

    try {
        const formData = new FormData();
        formData.append("fullName", profileData.fullName);
        formData.append("username", profileData.username);
        if (selectedFile) {
            formData.append("profilePhoto", selectedFile);
        }

        const response = await fetch("http://localhost:5005/api/v1/user/profile", {
            method: "PUT",
            credentials: "include",
            body: formData,
        });

        const result = await response.json();
        if (response.ok) {
            toast.success(result.message || "Profile updated successfully!");
            setProfileData(result.user);
            setSelectedFile(null);
        } else {
            throw new Error(result.message || "Failed to update profile");
        }
    } catch (error) {
        console.error("Update Profile Error:", error);
        toast.error(error.message || "An error occurred!");
    }
};

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5005/api/v1/user/logout", {
        method: "POST",
        credentials: "include",
      });

      const result = await response.json();
      if (response.ok) {
        toast.success(result.message || "Logged out successfully!");

        // **Clear all profile-related state after logout**
        setProfileData({ fullName: "", username: "", profilePhoto: "" });
        setSelectedFile(null);
        setPreviewUrl("");

        // **Call the logout handler to clear authentication state**
        if (onLogout) {
          onLogout();
        }
      } else {
        throw new Error(result.message || "Failed to logout");
      }
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error(error.message || "An error occurred during logout!");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-white/70 mb-6">Profile</h2>
      <form onSubmit={handleProfileUpdate} className="space-y-4">
        <div>
          <label className="block text-white/70 font-medium mb-1">Full Name</label>
          <input
            type="text"
            value={profileData.fullName}
            onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-white/70 font-medium mb-1">Username</label>
          <input
            type="text"
            value={profileData.username}
            onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-white/70 font-medium mb-1">Profile Photo</label>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-200 rounded-lg"
          />
          {previewUrl && (
            <div className="mt-2">
              <img
                src={previewUrl.startsWith("http") ? previewUrl : `http://localhost:5005${previewUrl}`}
                alt="Profile Preview"
                className="w-24 h-24 rounded-full object-cover border border-gray-200"
              />
            </div>
          )}
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Update Profile
          </button>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileTab;
