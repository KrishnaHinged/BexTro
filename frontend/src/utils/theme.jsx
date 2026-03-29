import { FaRegSun, FaFire, FaMoon } from "react-icons/fa";

export const themes = [
{
name: "Light",
// ✨ Soft Instagram-style light background
background: "linear-gradient(135deg, #c0e4ffff 0%, #b0ccffff 100%)",


navbarIcon: <FaMoon size={22} />,

// ✨ Clean glass UI
adminBackground: "rgba(66, 110, 255, 0.7)",
adminSidebarBackground: "rgba(255, 255, 255, 0.5)",

textColor: "text-gray-900",

// ✨ Soft buttons like Insta
buttonBg: "bg-white/60 backdrop-blur-md border border-gray-200",
activeButtonBg:
  "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white shadow-md",

cardBg: "bg-white/70 backdrop-blur-xl border border-gray-200",

},

{
name: "Dark",
// ✨ Deep premium dark (not harsh)
background: "linear-gradient(135deg, #0f172a 0%, #020617 100%)",
navbarIcon: <FaFire size={22} />,

adminBackground: "rgba(15, 23, 42, 0.8)",
adminSidebarBackground: "rgba(15, 23, 42, 0.6)",

textColor: "text-gray-100",

// ✨ Dark glass buttons
buttonBg: "bg-white/10 backdrop-blur-md border border-white/10",
activeButtonBg:
  "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-lg",

cardBg: "bg-white/5 backdrop-blur-xl border border-white/10",


},

{
name: "Sunny Sand",
// ✨ Warm creator vibe (like travel + lifestyle apps)
background: "linear-gradient(135deg, #ffcc8dff 0%, #fdb28aff 100%)",


navbarIcon: <FaRegSun size={22} />,

adminBackground: "rgba(255, 255, 255, 0.6)",
adminSidebarBackground: "rgba(255, 255, 255, 0.4)",

textColor: "text-gray-900",

buttonBg: "bg-white/60 backdrop-blur-md border border-orange-200",
activeButtonBg:
  "bg-gradient-to-r from-orange-400 to-pink-500 text-white shadow-md",

cardBg: "bg-white/70 backdrop-blur-xl border border-orange-200",


},
];
