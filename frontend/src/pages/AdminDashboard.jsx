import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { logoutUser } from "../../redux/userSlice.js";
import OtherUsers_Admin from "../component/admin/OtherUsers_Admin.jsx";
import ProfileTab from "../component/setting_tab/ProfileTab.jsx";
import Analytics from "../component/admin/analytics.jsx";
import ReportManagement from "../component/admin/ReportManagement.jsx";
import PostManagement from "../component/admin/PostManagement.jsx";
import { AnimatePresence, motion } from "framer-motion";
import AdminSlideBar from "../component/admin/AdminSlideBar.jsx";
import axios from "axios";
import { FaUsers, FaFlag, FaStream, FaProjectDiagram } from "react-icons/fa";

const AdminDashboard = ({ toggleTheme, currentTheme }) => {
  const [activeSection, setActiveSection] = useState("users");
  const [stats, setStats] = useState({ users: 0, posts: 0, communities: 0, pendingReports: 0 });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const section = queryParams.get("section");
    if (section && ["users", "analytics", "settings", "reports", "posts"].includes(section)) {
      setActiveSection(section);
    }
    fetchStats();
  }, [location.search]);

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:5005/api/v1/admin/stats", { withCredentials: true });
      setStats(res.data);
    } catch (error) {
      console.error("Fetch stats error:", error);
    }
  };

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

  const StatsCard = ({ title, value, icon, color }) => (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-5 flex-1 min-w-[200px] shadow-lg`}
    >
      <div className={`p-4 rounded-2xl ${color} bg-opacity-20 text-white shadow-inner`}>
        {icon}
      </div>
      <div>
        <p className="text-white/60 text-xs font-bold uppercase tracking-widest">{title}</p>
        <p className="text-white text-3xl font-black">{value}</p>
      </div>
    </motion.div>
  );

  return (
    <div 
      className="min-h-screen flex transition-all duration-500"
      style={{ background: currentTheme.background }}
    >
      <AdminSlideBar
        onLogout={handleLogout}
        setActiveSection={setActiveSection}
        currentTheme={currentTheme}
      />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <motion.h1
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={`text-4xl font-black ${currentTheme.textColor || 'text-white'} tracking-tight`}
            >
              Management Console
            </motion.h1>
            <p className={`${currentTheme.textColor || 'text-white'} opacity-40 text-sm font-medium mt-1`}>
              Welcome back, Admin. System is running at optimal capacity.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className={`p-3 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/20 transition-all ${currentTheme.textColor || 'text-white'} shadow-xl`}
            >
              {currentTheme.navbarIcon}
            </button>
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/20">
              AD
            </div>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="flex flex-wrap gap-6 mb-10">
          <StatsCard title="Total Users" value={stats.users} icon={<FaUsers size={24} />} color="bg-blue-500" />
          <StatsCard title="Global Posts" value={stats.posts} icon={<FaStream size={24} />} color="bg-indigo-500" />
          <StatsCard title="Communities" value={stats.communities} icon={<FaProjectDiagram size={24} />} color="bg-purple-500" />
          <StatsCard title="Pending Reports" value={stats.pendingReports} icon={<FaFlag size={24} />} color="bg-red-500" />
        </div>

        <div className="h-px bg-white/10 w-full mb-10" />

        <AnimatePresence mode="wait">
          <motion.section
            key={activeSection}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="rounded-[3rem] overflow-hidden min-h-[500px]"
            style={{
              background: currentTheme.adminBackground || "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)"
            }}
          >
            {activeSection === "users" && (
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className={`text-3xl font-black ${currentTheme.textColor || 'text-white'} tracking-tighter`}>
                    User Management
                  </h2>
                  <div className={`px-4 py-2 rounded-2xl text-xs font-bold bg-white/10 ${currentTheme.textColor || 'text-white'} opacity-60 border border-white/10`}>
                    {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                  </div>
                </div>
                <OtherUsers_Admin />
              </div>
            )}
            {activeSection === "reports" && <ReportManagement />}
            {activeSection === "posts" && <PostManagement />}
            {activeSection === "analytics" && <Analytics />}
            {activeSection === "settings" && (
              <div className="p-10">
                <h2 className={`text-3xl font-black mb-8 ${currentTheme.textColor || 'text-white'} tracking-tighter`}>
                  Administrative Settings
                </h2>
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