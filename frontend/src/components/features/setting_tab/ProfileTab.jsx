import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import axiosInstance, { ROOT_URL } from "../../../api/axios";

const ProfileTab = ({ onLogout }) => {
  const [profileData, setProfileData] = useState({ fullName: "", username: "", profilePhoto: "", isPrivate: false });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("/user/profile");
        setProfileData(res.data);
        setPreviewUrl(res.data.profilePhoto);
      } catch (error) {
        console.error("Fetch Profile Error:", error);
        // Unauthorized is handled by the interceptor or protected route usually
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
    setLoading(true);

    try {
        const formData = new FormData();
        formData.append("fullName", profileData.fullName);
        formData.append("username", profileData.username);
        if (selectedFile) {
            formData.append("profilePhoto", selectedFile);
        }
        formData.append("isPrivate", profileData.isPrivate);

        const res = await axiosInstance.put("/user/profile", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });

        toast.success(res.data.message || "Profile updated successfully!");
        setProfileData(res.data.user);
        setSelectedFile(null);
    } catch (error) {
        console.error("Update Profile Error:", error);
        toast.error(error.response?.data?.message || "An error occurred!");
    } finally {
        setLoading(false);
    }
};

  const handleLogout = async () => {
    try {
      const res = await axiosInstance.post("/user/logout");

      if (res.status === 200 || res.data.success) {
        toast.success(res.data.message || "Logged out successfully!");

        setProfileData({ fullName: "", username: "", profilePhoto: "" });
        setSelectedFile(null);
        setPreviewUrl("");

        if (onLogout) {
          onLogout();
        }
      }
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error(error.response?.data?.message || "An error occurred during logout!");
    }
  };

  return (
    <div >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 font-primary">Profile</h2>
      <form onSubmit={handleProfileUpdate} className="space-y-4">
        <div>
          <label className="block text-gray-800 font-medium mb-1">Full Name</label>
          <input
            type="text"
            value={profileData.fullName}
            onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
            className="w-full p-3 border text-gray-800 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/50"
          />
        </div>
        <div>
          <label className="block text-gray-800 font-medium mb-1">Username</label>
          <input
            type="text"
            value={profileData.username}
            onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
            className="w-full p-3 border text-gray-800 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/50"
          />
        </div>
        <div>
          <label className="block text-gray-800 font-medium mb-1">Profile Photo</label>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleFileChange}
            className="w-full p-2 border text-gray-800 border-gray-200 rounded-lg bg-white/50"
          />
          {previewUrl && (
            <div className="mt-2">
              <img
                src={previewUrl.startsWith("blob") ? previewUrl : previewUrl.startsWith("http") ? previewUrl : `${ROOT_URL}${previewUrl}`}
                alt="Profile Preview"
                className="w-24 h-24 rounded-full object-cover border border-gray-200 shadow-sm"
              />
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 shadow-sm">
          <input
            type="checkbox"
            id="isPrivate"
            checked={profileData.isPrivate}
            onChange={(e) => setProfileData({ ...profileData, isPrivate: e.target.checked })}
            className="w-5 h-5 accent-indigo-600 rounded-md cursor-pointer transition-all hover:ring-4 hover:ring-indigo-100"
          />
          <div className="flex flex-col">
            <label htmlFor="isPrivate" className="text-indigo-900 font-bold cursor-pointer flex items-center gap-2">
              Private Account <span className="text-lg">🔐</span>
            </label>
            <p className="text-xs text-indigo-700/70 font-medium">
              Only your connections can see your profile details and challenge proofs.
            </p>
          </div>
        </div>
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-bold shadow-lg transition-all ${
                loading ? "opacity-70 cursor-not-allowed" : "hover:bg-indigo-700 hover:scale-105 active:scale-95"
            }`}
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="px-6 py-2.5 bg-rose-500 text-white rounded-lg font-bold shadow-lg hover:bg-rose-600 transition-all hover:scale-105 active:scale-95"
          >
            Logout
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileTab;
