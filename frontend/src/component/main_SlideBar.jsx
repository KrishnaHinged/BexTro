import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaHome, FaCog, FaGlobe, FaUsers, FaBell } from "react-icons/fa";
import NotificationTray from "./NotificationTray";
import { ROOT_URL } from "../utils/axiosInstance";

const MainSlideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authUser } = useSelector(store => store.user);
  const { socket } = useSelector(store => store.socket);
  const [active, setActive] = useState("dashboard");
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (socket) {
        socket.on("newNotification", () => {
            setUnreadCount(prev => prev + 1);
        });
        return () => socket.off("newNotification");
    }
  }, [socket]);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <FaHome size={24} />, path: "/dashboard" },
    { id: "feed", label: "Feed", icon: <FaGlobe size={24} />, path: "/feed" },
    { id: "communities", label: "Communities", icon: <FaUsers size={24} />, path: "/communities" },
    // { id: "settings", label: "Settings", icon: <FaCog size={24} />, path: "/settings" },
  ];

  useEffect(() => {
    const currentPath = location.pathname;

    const activeItem = menuItems.find((item) => item.path === currentPath);

    if (activeItem) {
      setActive(activeItem.id);
    } else if (currentPath.startsWith("/user/")) {
      setActive("feed");
    } else if (currentPath === "/profile") {
      setActive("profile"); // 👈 important
    }
  }, [location.pathname]);

  // ✅ Profile photo logic
  const profilePhotoUrl = authUser?.profilePhoto?.startsWith("http")
    ? authUser.profilePhoto
    : authUser?.profilePhoto
    ? `${ROOT_URL}${authUser.profilePhoto}`
    : `https://ui-avatars.com/api/?name=${authUser?.username || "User"}`;

  return (
    <div className="bg-white/80 backdrop-blur-lg shadow-lg border-r border-gray-300 h-screen w-20 sticky top-0 py-10 z-50">

      {/* MENU */}
      <div className="flex flex-col gap-10 items-center">
        {menuItems.map(({ id, label, icon, path }) => (
          <button
            key={id}
            onClick={() => {
              setActive(id);
              setShowNotifications(false);
              navigate(path);
            }}
            className={`transition-all duration-300 rounded-lg p-3 ${
              active === id
                ? "bg-gray-900 text-white shadow-lg"
                : "text-gray-600 hover:text-gray-900 hover:scale-105"
            }`}
            title={label}
          >
            {icon}
          </button>
        ))}

        {/* NOTIFICATION BELL */}
        <div className="relative">
            <button
                onClick={() => {
                    setShowNotifications(!showNotifications);
                    setUnreadCount(0); // Clear count on open
                }}
                className={`transition-all duration-300 rounded-lg p-3 ${
                    showNotifications
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900 hover:scale-105"
                }`}
                title="Notifications"
            >
                <FaBell size={24} />
            </button>
            {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                    {unreadCount}
                </div>
            )}
        </div>
      </div>

      {/* NOTIFICATION TRAY */}
      {showNotifications && (
          <div className="absolute left-24 top-20 z-50">
              <NotificationTray onClose={() => setShowNotifications(false)} />
          </div>
      )}

      {/* 🔥 USER PROFILE (BOTTOM WITH ACTIVE STATE) */}
      {/* 🔥 USER PROFILE + SETTINGS (PILL STYLE) */}

<div className="absolute bottom-6 left-0 w-full flex flex-col items-center">

  <div className="bg-gray-100 rounded-3xl px-2 py-3 flex flex-col items-center gap-3 shadow-sm border border-gray-200">

{/* PROFILE */}
<div
  onClick={() => {
    setActive("profile");
    navigate("/profile");
  }}
  className="relative cursor-pointer group"
>
  <img
    src={profilePhotoUrl}
    alt="User"
    onError={(e) =>
      (e.target.src = `https://ui-avatars.com/api/?name=${authUser?.username || "User"}`)
    }
    className={`w-11 h-11 rounded-xl object-cover border-2 transition ${
      active === "profile"
        ? "border-gray-900"
        : "border-gray-300"
    }`}
  />

  {/* ONLINE DOT */}
  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
</div>

{/* SETTINGS */}
<button
  onClick={() => {
    setActive("settings");
    setShowNotifications(false);
    navigate("/settings");
  }}
  className={`transition-all duration-200 rounded-xl p-2 ${
    active === "settings"
      ? "bg-gray-900 text-white shadow-md scale-105"
      : "text-gray-500 hover:text-gray-900 hover:scale-105"
  }`}
  title="Settings"
>
  <FaCog size={18} />
</button>


  </div>
</div>

    </div>
  );
};

export default MainSlideBar;