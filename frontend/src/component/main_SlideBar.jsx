import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaHome, FaBell, FaComment, FaChartPie, FaCog, FaGlobe, FaUsers } from "react-icons/fa";

const MainSlideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authUser } = useSelector(store => store.user);
  const [active, setActive] = useState("dashboard");

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <FaHome size={24} />, path: "/dashboard" },
    { id: "feed", label: "Feed", icon: <FaGlobe size={24} />, path: "/feed" },
    { id: "communities", label: "Communities", icon: <FaUsers size={24} />, path: "/communities" },
    { id: "profile", label: "Profile", icon: <FaChartPie size={24} />, path: "/profile" },
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
              active === id
                ? "bg-gray-900 text-white scale-100 shadow-lg"
                : "text-gray-600 hover:text-gray-900 hover:scale-105"
            }`}
            title={label}
            aria-label={label}
          >
            {icon}
          </button>
        ))}
      </div>

      {/* User Session Info */}
      <div className="absolute bottom-10 left-0 w-full flex flex-col items-center gap-6">
        <div 
          onClick={() => navigate("/profile")}
          className="relative cursor-pointer group"
        >
          <img 
            src={authUser?.profilePhoto || `https://ui-avatars.com/api/?name=${authUser?.username}&background=6366f1&color=fff`} 
            alt="User" 
            className="w-12 h-12 rounded-2xl object-cover border-2 border-white/50 shadow-md group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default MainSlideBar;