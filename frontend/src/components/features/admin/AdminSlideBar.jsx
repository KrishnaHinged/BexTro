import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiActivity, FiLogOut } from "react-icons/fi";
import { FaComment, FaUsers, FaCog, FaFlag, FaStream } from "react-icons/fa";
import { motion } from "framer-motion";

const AdminSlideBar = ({ onLogout, setActiveSection, currentTheme }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [active, setActive] = useState("users");

  const menuItems = [
    { id: "users", label: "Users", icon: <FaUsers size={22} />, section: "users" },
    { id: "reports", label: "Reports", icon: <FaFlag size={20} />, section: "reports" },
    { id: "posts", label: "Posts", icon: <FaStream size={20} />, section: "posts" },
    { id: "analytics", label: "Analytics", icon: <FiActivity size={22} />, section: "analytics" },
    { id: "chat", label: "Chat", icon: <FaComment size={20} />, path: "/adminchats" },
    { id: "settings", label: "Settings", icon: <FaCog size={22} />, section: "settings" },
    { id: "logout", label: "Logout", icon: <FiLogOut size={22} />, section: null },
  ];

  useEffect(() => {
    const currentPath = location.pathname;
    const queryParams = new URLSearchParams(location.search);
    const section = queryParams.get("section");

    let activeItem;

    if (currentPath === "/admindashboard" && section) {
      activeItem = menuItems.find((item) => item.section === section);
    } else {
      activeItem = menuItems.find((item) => item.path === currentPath || `/admin/${item.section}` === currentPath);
    }

    if (activeItem) {
      setActive(activeItem.id);
      if (activeItem.section) {
        setActiveSection(activeItem.section);
      }
    } else {
      // Default to "users" if no match is found
      setActive("users");
      setActiveSection("users");
    }
  }, [location.pathname, location.search, setActiveSection]);

  const handleClick = (id, section, path) => {
    setActive(id);
    if (id === "logout") {
      onLogout();
    } else if (path) {
      navigate(path);
    } else {
      navigate(`/admindashboard?section=${section}`);
    }
  };

  return (
    <div 
      className="backdrop-blur-3xl shadow-2xl border-r border-white/10 h-screen w-24 sticky top-0 py-12 flex flex-col items-center transition-all duration-500"
      style={{ background: currentTheme?.adminSidebarBackground || "rgba(255, 255, 255, 0.05)" }}
    >
      <div className="flex flex-col gap-8 items-center w-full px-2">
        {menuItems.map(({ id, label, icon, section, path }) => (
          <motion.button
            key={id}
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleClick(id, section, path)}
            className={`w-14 h-14 flex items-center justify-center rounded-2xl transition-all duration-300 ${
              active === id
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/40"
                : `${currentTheme?.textColor || "text-white"} opacity-40 hover:opacity-100 hover:bg-white/5`
            }`}
            title={label}
            aria-label={label}
          >
            {icon}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default AdminSlideBar;