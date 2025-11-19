import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiActivity, FiLogOut } from "react-icons/fi";
import { FaComment, FaUsers, FaCog } from "react-icons/fa";
import { motion } from "framer-motion";

const AdminSlideBar = ({ onLogout, setActiveSection }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [active, setActive] = useState("users");

  const menuItems = [
    { id: "users", label: "Users", icon: <FaUsers size={24} />, section: "users" },
    { id: "analytics", label: "Analytics", icon: <FiActivity size={24} />, section: "analytics" },
    { id: "chat", label: "Chat", icon: <FaComment size={24} />, path: "/adminchats" },
    { id: "settings", label: "Settings", icon: <FaCog size={24} />, section: "settings" },
    { id: "logout", label: "Logout", icon: <FiLogOut size={24} />, section: null },
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
    <div className="bg-white/80 bg-opacity-40 backdrop-blur-lg shadow-lg border-r border-gray-300 h-screen w-20 sticky top-0 py-10">
      <div className="flex flex-col gap-10 items-center">
        {menuItems.map(({ id, label, icon, section, path }) => (
          <motion.button
            key={id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleClick(id, section, path)}
            className={`transition-all duration-300 rounded-lg p-3 ${
              active === id
                ? "bg-gray-900 text-white scale-100 shadow-lg"
                : "text-gray-600 hover:text-gray-900 hover:scale-105"
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