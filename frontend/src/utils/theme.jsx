import { FaRegSun, FaFire , FaMoon } from "react-icons/fa";

export const themes = [
  {
    name: "Light",
    background: "linear-gradient(85deg, #60a5fa 0%, #c084fc 100%)",
    navbarIcon: <FaMoon size={24} />,
    adminBackground: "rgba(255, 255, 255, 0.3)", // For AdminDashboard main content
    adminSidebarBackground: "rgba(255, 255, 255, 0.1)", // For AdminDashboard sidebar
    textColor: "text-gray-800",
    buttonBg: "bg-white/30",
    activeButtonBg: "bg-gradient-to-r from-white/40 to-white/30",
  },
  {
    name: "Dark",
    background: "linear-gradient(62deg, #3730a3 0%, #3b0764 100%)",
    navbarIcon: <FaFire size={24} />,
    adminBackground: "rgba(0, 0, 0, 0.2)",
    adminSidebarBackground: "rgba(0, 0, 0, 0.1)",
    textColor: "text-gray-100",
    buttonBg: "bg-gray-700/30",
    activeButtonBg: "bg-gradient-to-r from-teal-600/30 to-cyan-600/30",
  },
  
  {
    name: "Sunny Sand",
    background: "linear-gradient(85deg, #f97316 0%, #f59e0b 100%)",
    navbarIcon: <FaRegSun size={24} />,
    adminBackground: "rgba(255, 255, 255, 0.3)",
    adminSidebarBackground: "rgba(255, 255, 255, 0.1)",
    textColor: "text-gray-800",
    buttonBg: "bg-white/30",
    activeButtonBg: "bg-gradient-to-r from-white/40 to-white/30",
  },

];