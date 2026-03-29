import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import gsap from "gsap";
import Confetti from "react-confetti";
import { motion } from "framer-motion";
import io from "socket.io-client";

// Pages
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Chats from "./pages/Chat";
import AdminChat from "./pages/AdminChat.jsx";
import Welcome from "./pages/Welcome";
import IntroToChallenges from "./pages/IntroToChallenges";
import Dashboard from "./pages/Dashboard";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/AdminDashboard";
import FeedPage from "./pages/FeedPage";
import UserProfile from "./pages/UserProfile";
import Community from "./pages/Community";

// Redux
import { setSocket } from "./redux/socketSlice";
import { setOnlineUser } from "./redux/userSlice";

// Utils
import axiosInstance from "./api/axios";
import { ROOT_URL } from "./api/axios";

// Components - Layout
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer";

// Components - Features
import UserExperience from "./components/features/home/userExperience";
import IntroContainer from "./components/features/home/Intro_Container";
import Reviews from "./components/features/home/Reviews";
import Services from "./components/features/home/Services";

// Components - Common
import Loader from "./components/common/loaders/Loader";
import Loader_2 from "./components/common/loaders/Loader2";
import FadeInWhenVisible from "./components/common/FadeInWhenVisible";

import { toast } from "react-hot-toast";
import { themes } from "./utils/theme";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const isRehydrated = useSelector((state) => state._persist?.rehydrated);

  if (!isRehydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="loading loading-spinner text-info w-16 h-16"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="bg-white/40 backdrop-blur-md rounded-3xl p-8 shadow-sm border border-white/60 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to access this page.</p>
          <a href="/signin" className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return children;
};

const App = () => {
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const [showSplash, setShowSplash] = useState(true);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const appRef = useRef(null);
  const splashRef = useRef(null);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const user = useSelector((state) => state.user.authUser);
  const dispatch = useDispatch();

  const toggleTheme = () => {
    setCurrentThemeIndex((prevIndex) => (prevIndex + 1) % themes.length);
  };

  // Handle window resize for Confetti
  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Initialize Socket.IO
  useEffect(() => {
    if (isAuthenticated && user) {
      const socket = io(ROOT_URL, {
        withCredentials: true,
        query: { userId: user._id },
      });

      dispatch(setSocket(socket));

      socket.on("connect", () => {
        console.log("Connected to Socket.IO server");
      });

      socket.on("onlineUsers", (onlineUsers) => {
        dispatch(setOnlineUser(onlineUsers));
      });

      socket.on("newNotification", (notification) => {
        const message = notification.type === "follow" 
          ? `${notification.sender.username} followed you!` 
          : notification.type === "like" 
          ? `${notification.sender.username} liked your post!` 
          : notification.type === "comment"
          ? `${notification.sender.username} commented on your post!`
          : notification.type === "message"
          ? `New message from ${notification.sender.username}!`
          : `New post in community from ${notification.sender.username}!`;
        
        toast.success(message, {
          icon: '🔔',
          duration: 4000,
          position: 'top-right',
        });
      });

      socket.on("connect_error", (error) => {
        console.error("Socket.IO connection error:", error);
      });

      return () => {
        socket.disconnect();
        dispatch(setSocket(null));
        console.log("Socket.IO disconnected");
      };
    }
  }, [isAuthenticated, user, dispatch]);

  // Splash screen animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          onComplete: () => setShowSplash(false),
        })
        .fromTo(
          splashRef.current,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 1, ease: "power3.out" }
        )
        .fromTo(
          ".splash-logo",
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
          "-=0.5"
        )
        .fromTo(
          ".splash-tagline",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
          "-=0.4"
        )
        .to(splashRef.current, {
          opacity: 0,
          scale: 0.9,
          duration: 0.5,
          ease: "power3.in",
          delay: 1.1,
        });
    });

    return () => ctx.revert();
  }, []);

  // Fade in main app content
  useEffect(() => {
    if (!showSplash && !hasAnimated) {
      const ctx = gsap.context(() => {
        gsap.fromTo(appRef.current, { opacity: 0 }, { opacity: 1, duration: 1, ease: "power3.out" });
      });
      setHasAnimated(true);
      return () => ctx.revert();
    }
  }, [showSplash, hasAnimated]);

  const currentTheme = themes[currentThemeIndex];

  return (
    <Router>
      {showSplash && (
        <div
          ref={splashRef}
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: "#000000", fontFamily: "'Poppins', sans-serif" }}
        >
          <Confetti width={dimensions.width} height={dimensions.height} recycle={false} numberOfPieces={500} />
          <div className="text-center">
            <motion.h1
              className="splash-logo text-6xl md:text-8xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-blue-400 drop-shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              BeXtro
            </motion.h1>
            <p className="splash-tagline text-xl md:text-4xl text-white/80 mt-4 font-medium">
              Work hard in silence, let success make the noise.
            </p>
          </div>
        </div>
      )}

      <div
        ref={appRef}
        className="min-h-screen transition-all duration-500"
        style={{
          background: currentTheme.background,
          opacity: showSplash ? 0 : 1,
        }}
      >
        {!isAuthenticated && !showSplash && (
          <Navbar toggleTheme={toggleTheme} currentTheme={currentTheme} />
        )}

        <Routes>
          <Route
            path="/"
            element={
              !isAuthenticated ? (
                <>
                  <FadeInWhenVisible><IntroContainer /></FadeInWhenVisible>
                  <FadeInWhenVisible><Loader currentTheme={currentTheme} /></FadeInWhenVisible>
                  <FadeInWhenVisible><Reviews /></FadeInWhenVisible>
                  <FadeInWhenVisible><Loader_2 currentTheme={currentTheme} /></FadeInWhenVisible>
                  <FadeInWhenVisible><UserExperience /></FadeInWhenVisible>
                  <FadeInWhenVisible><Services currentTheme={currentTheme} /></FadeInWhenVisible>
                  <FadeInWhenVisible><Footer /></FadeInWhenVisible>
                </>
              ) : (
                <Dashboard />
              )
            }
          />
          <Route
            path="/signin"
            element={
              <SignIn toggleTheme={toggleTheme} currentTheme={themes[currentThemeIndex]} />
            }
          />
          <Route
            path="/signup"
            element={
              <SignUp toggleTheme={toggleTheme} currentTheme={themes[currentThemeIndex]} />
            }
          />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/feed"
            element={
              <ProtectedRoute>
                <FeedPage />
              </ProtectedRoute>
            }
          />
          <Route path="/communities" element={<ProtectedRoute><Community /></ProtectedRoute>} />
          <Route path="/chats" element={<ProtectedRoute><Chats /></ProtectedRoute>} />
          <Route path="/user/:userId" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings toggleTheme={toggleTheme} currentTheme={currentTheme} />
              </ProtectedRoute>
            }
          />
          <Route path="/welcome" element={<ProtectedRoute><Welcome /></ProtectedRoute>} />
          <Route path="/set_challenges" element={<ProtectedRoute><IntroToChallenges /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route
            path="/admindashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard toggleTheme={toggleTheme} currentTheme={currentTheme} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

