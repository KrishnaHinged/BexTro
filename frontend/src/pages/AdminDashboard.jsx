import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom"; // Add useLocation
import { toast } from "react-hot-toast";
import { logoutUser } from "../../redux/userSclice.js";
import OtherUsers_Admin from "../component/admin/OtherUsers_Admin.jsx";
import ProfileTab from "../component/setting_tab/ProfileTab.jsx";
import Analytics from "../component/admin/analytics.jsx";
import { AnimatePresence, motion } from "framer-motion";
import AdminSlideBar from "../component/admin/AdminSlideBar.jsx";
import axios from "axios";

const AdminDashboard = ({ toggleTheme, currentTheme }) => {
  const [activeSection, setActiveSection] = useState("users");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Add useLocation to read query params

  useEffect(() => {
    // Read the 'section' query parameter from the URL
    const queryParams = new URLSearchParams(location.search);
    const section = queryParams.get("section");
    if (section && ["users", "analytics", "settings"].includes(section)) {
      setActiveSection(section);
    }
  }, [location.search]); // Run when query params change

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5005/api/v1/user/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        localStorage.clear();
        dispatch(logoutUser());
        toast.success("Logged out successfully! ✌️");
        navigate("/signup");
      } else {
        toast.error("Logout failed! 😢");
      }
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("An error occurred during logout! 😓");
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  const glassStyle = {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
  };

  const darkGlassStyle = {
    background: "rgba(15, 15, 25, 0.5)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
  };

  return (
    <div className="min-h-screen flex transition-colors duration-300">
      <AdminSlideBar
        onLogout={handleLogout}
        setActiveSection={setActiveSection}
      />
      <main className="flex-1 p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="text-3xl font-bold text-white"
          >
            Admin Panel
          </motion.h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white hover:scale-110"
          >
            {currentTheme.navbarIcon}
          </button>
        </div>
        <AnimatePresence mode="wait">
          <motion.section
            key={activeSection}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="h-full rounded-2xl overflow-hidden"
            style={currentTheme.mode === "dark" ? darkGlassStyle : glassStyle}
          >
            {activeSection === "users" && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <motion.h2
                    initial={{ x: -10 }}
                    animate={{ x: 0 }}
                    className="text-2xl font-bold text-white"
                  >
                    User Details
                  </motion.h2>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="px-3 py-1 rounded-full text-xs bg-white/10 text-white"
                  >
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </motion.div>
                </div>
                <OtherUsers_Admin />
              </div>
            )}
            {activeSection === "analytics" && <Analytics />}
            {activeSection === "settings" && (
              <div className="p-7">
                <motion.h2 className="text-2xl font-bold mb-6 text-white">
                  Profile Settings
                </motion.h2>
                <ProfileTab onLogout={handleLogout} />
              </div>
            )}
          </motion.section>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminDashboard;