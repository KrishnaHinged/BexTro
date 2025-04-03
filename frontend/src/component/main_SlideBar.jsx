import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaHome, FaBell, FaComment, FaUser, FaCog } from "react-icons/fa";

const MainSlideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState("dashboard");

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <FaHome size={24} />, path: "/dashboard" },
    { id: "chat", label: "Chat", icon: <FaComment size={24} />, path: "/chats" }, 
    { id: "notifications", label: "Notifications", icon: <FaBell size={24} />, path: "/notifications" },
    { id: "self_challenges", label: "Self Challenges", icon: <FaUser size={24} />, path: "/self_challenges" }, 
    { id: "settings", label: "Settings", icon: <FaCog size={24} />, path: "/settings" },
  ];

  useEffect(() => {
    const currentPath = location.pathname;
    const activeItem = menuItems.find((item) => item.path === currentPath);
    if (activeItem) {
      setActive(activeItem.id);
    }
  }, [location.pathname]);

  return (
    <div className="bg-white/80 bg-opacity-40 backdrop-blur-lg shadow-lg border-r border-gray-300 h-screen w-20 sticky top-0 py-10">
      <div className="flex flex-col gap-10 items-center">
        {menuItems.map(({ id, label, icon, path }) => (
          <button
            key={id}
            onClick={() => {
              setActive(id);
              navigate(path);
            }}
            className={`transition-all duration-300 rounded-lg p-3 ${
              active === id ? "bg-gray-900 text-white scale-100 shadow-lg" : "text-gray-600 hover:text-gray-900 hover:scale-105"
            }`}
            title={label}
            aria-label={label}
          >
            {icon}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MainSlideBar;
