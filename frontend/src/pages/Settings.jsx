import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { logoutUser } from "../../redux/userSclice.js";
import MainSlideBar from "../component/main_SlideBar.jsx";
import PageLoader from "../component/pagesLoader.jsx";
import ProfileTab from "../component/setting_tab/ProfileTab.jsx";
import InterestsTab from "../component/setting_tab/InterestsTab.jsx";
import BucketListTab from "../component/setting_tab/BucketListTab.jsx";
import ChallengesTab from "../component/setting_tab/ChallengesTab.jsx";

const Settings = ({ toggleTheme, currentTheme }) => {
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState("profile");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    setTimeout(() => setStep(2), 2000);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5005/api/v1/user/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        localStorage.clear();
        dispatch(logoutUser());
        toast.success("Logged out successfully!");
        navigate("/signup");
      } else {
        toast.error("Logout failed!");
      }
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("An error occurred during logout!");
    }
  };

  return (
    <div className="flex min-h-screen">
      {step === 1 && <PageLoader message="Settings..." />}
      {step === 2 && (
        <>
          <MainSlideBar />
          <div className="flex-1 p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-extrabold text-white/80 tracking-tight">
                Settings
              </h1>
              <div
                className="bg-white/85 p-2 rounded-full border border-white cursor-pointer"
                onClick={toggleTheme}
              >
                {typeof currentTheme.navbarIcon === "string" ? (
                  <img
                    src={currentTheme.navbarIcon}
                    alt="Theme Toggle"
                    className="w-6 h-6"
                  />
                ) : (
                  <div className="w-6 h-6 flex items-center justify-center">
                    {currentTheme.navbarIcon}
                  </div>
                )}
              </div>
            </div>

           {/* Tabs */}
           <div className="flex flex-col sm:flex-row gap-2  sm:gap-4 border-b border-white/50 mb-6">
              {["profile", "interests", "bucketlist", "challenges"].map((tab) => (
                <button
                  key={tab}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 text-base sm:text-lg font-medium transition-colors rounded-t ${
                    activeTab === tab
                      ? "border-b-2 border-indigo-600 text-indigo-600"
                      : "text-white/80 hover:text-indigo-300"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white/30 rounded-xl shadow-xl p-4 sm:p-6 backdrop-blur-md">
              {activeTab === "profile" && <ProfileTab onLogout={handleLogout} />}
              {activeTab === "interests" && <InterestsTab />}
              {activeTab === "bucketlist" && <BucketListTab />}
              {activeTab === "challenges" && <ChallengesTab />}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Settings;