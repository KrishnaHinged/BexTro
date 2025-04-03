import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { logoutUser } from "../../redux/userSclice.js";
import OtherUsers_Admin from "../component/OtherUsers_Admin";
import { FaUsers, FaChartBar, FaCogs, FaMoon, FaSun, FaSignOutAlt } from "react-icons/fa";
import { FiUser, FiActivity, FiSettings, FiBarChart } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import ProfileTab from "../component/ProfileTab";
import Analytics from "../component/analytics.jsx";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("users");
  const [darkMode, setDarkMode] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      toast.error("An error occurred during logout! 🚨");
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
  };

  return (
    <div 
      className="min-h-screen flex transition-colors duration-300"
      style={{
        background: darkMode 
          ? "linear-gradient(85deg, #003a74 0%, #35006b 100%)" 
          : "linear-gradient(85deg, #8EC5FC 0%, #E0C3FC 100%)"
      }}
    >
      {/* Sidebar */}
      <motion.aside 
  initial={{ x: -20, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ duration: 0.5 }}
  className="sticky top-0 h-screen w-72 p-6 backdrop-blur-lg border-r border-gray-700/30 shadow-xl"
>

        <div className="flex items-center justify-between mb-10">
          <motion.h1 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="text-3xl font-bold bg-white/70 bg-clip-text text-transparent"
          >
            Admin Panel
          </motion.h1>
          
          <button 
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700/30 text-yellow-300' : 'bg-white/30 text-gray-700'} hover:scale-110 transition-all`}
          >
            {darkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
          </button>
        </div>

        <nav className="space-y-2">
          {[
            { id: "users", icon: <FiUser size={20} />, label: "Users" },
            { id: "analytics", icon: <FiActivity size={20} />, label: "Analytics" },
            { id: "settings", icon: <FiSettings size={20} />, label: "Settings" }
          ].map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center w-full p-3 rounded-xl transition-all ${darkMode ? 'hover:bg-gray-700/20' : 'hover:bg-white/30'} ${
                activeSection === item.id ? 
                (darkMode ? 'bg-gradient-to-r from-teal-600/30 to-cyan-600/30 border border-teal-400/20' : 'bg-gradient-to-r from-white/40 to-white/30 border border-white/20') : 
                ''
              }`}
              onClick={() => setActiveSection(item.id)}
            >
              <span className={`mr-3 ${activeSection === item.id ? 'text-teal-400' : darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {item.icon}
              </span>
              <span className={`font-medium ${activeSection === item.id ? 'text-teal-300' : darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                {item.label}
              </span>
            </motion.button>
          ))}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className={`flex items-center w-full p-3 rounded-xl mt-8 ${darkMode ? 'hover:bg-rose-900/20 text-rose-400' : 'hover:bg-rose-100/30 text-rose-600'}`}
          >
            <FaSignOutAlt className="mr-3" />
            <span className="font-medium">Logout</span>
          </motion.button>
        </nav>

      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-6  overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.section
            key={activeSection}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="h-full rounded-2xl backdrop-blur-lg border border-gray-700/30 shadow-xl overflow-hidden"
            style={{
              background: darkMode 
                ? 'rgba(0, 0, 0, 0.2)' 
                : 'rgba(255, 255, 255, 0.3)'
            }}
          >
            {activeSection === "users" && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <motion.h2 
                    initial={{ x: -10 }}
                    animate={{ x: 0 }}
                    className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}
                  >
                    User Management
                  </motion.h2>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`px-3 py-1 rounded-full text-xs ${darkMode ? 'bg-teal-900/30 text-teal-300' : 'bg-white/40 text-teal-800'}`}
                  >
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                  </motion.div>
                </div>
                <OtherUsers_Admin darkMode={darkMode} />
              </div>
            )}

            {activeSection === "analytics" && (
             <Analytics darkMode={darkMode} />
            )}

            {activeSection === "settings" && (
              <div className="p-7 ">
                <motion.h2 
                  className={`text-2xl font-bold mb-6 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}
                >
                  Profile Settings
                </motion.h2>
                <ProfileTab onLogout={handleLogout} darkMode={darkMode} />
              </div>
            )}
          </motion.section>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminDashboard;