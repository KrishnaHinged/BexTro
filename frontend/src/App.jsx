import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import gsap from "gsap";
import Confetti from "react-confetti";
import { motion } from "framer-motion";

import Navbar from "./component/Navbar";
import IntroContainer from "./component/Intro_Container";
import Loader from "./component/Loader";
import Reviews from "./component/Reviews";
import Services from "./component/Services";
import Footer from "./component/Footer";
import Sign_in from "./pages/Sign_in";
import Sign_up from "./pages/Sign_up";
import Chats from "./pages/Chat";
import Welcome from "./pages/welcome";
import IntroToChallenges from "./pages/intro_to_Challenges";
import DashBoard from "./pages/dashBoard";
import Notifications from "./pages/Notifications";
import SelfChallenges from "./pages/SelfChallenges";
import Settings from "./pages/Settings";
import UserExperience from "./component/userExperience";
import Loader_2 from "./component/Loader2";
import DailyQuotes from "./component/dailyQuotes";
import AdminDashboard from "./pages/AdminDashboard";
import { store } from "../redux/store";
// import NotFound from "./pages/NotFound"; // Custom 404 Page
import io from "socket.io-client"
import { setSocket } from "../redux/socketSlice";
import { setOnlineUser } from "../redux/userSclice";
// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/signin" />;
};

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const appRef = useRef(null);
  const splashRef = useRef(null);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  // Handle window resize for Confetti
  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Splash screen animation (total duration: 4 seconds)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline({
        onComplete: () => setShowSplash(false),
      })
        .fromTo(splashRef.current, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1, ease: "power3.out" })
        .fromTo(".splash-logo", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.5")
        .fromTo(".splash-tagline", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }, "-=0.4")
        .to(splashRef.current, { opacity: 0, scale: 0.9, duration: 0.5, ease: "power3.in", delay: 1.1 });
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
// socket 

// const {authUser}= useSelector(store=>store.user);
// const dispatch= useDispatch()
// useEffect(()=>{
//   if(authUser){
//     const socket= io(`http://localhost:5005`,{
//       query:{
//         userId:authUser._id
//       }
//     })
//     dispatch(setSocket(socket));
//     socket.on('getOnlineUsers',(onlineUsers)=>{
//       dispatch(setOnlineUser(onlineUsers))
//     })
//   }
// },[authUser])
  return (
    <Router>
      {/* Splash Screen */}
      {showSplash && (
        <div
          ref={splashRef}
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: "#000000", fontFamily: "'Poppins', sans-serif" }}
        >
          <Confetti width={dimensions.width} height={dimensions.height} recycle={false} numberOfPieces={500} />
          <div className="text-center">
            <motion.h1
              className="splash-logo text-6xl md:text-8xl font-extrabold  bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-blue-400 drop-shadow-lg"
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

      {/* Main App Content */}
      <div
        ref={appRef}
        className="min-h-screen transition-all duration-500"
        style={{
          background: isDarkMode
            ? "linear-gradient(85deg, #003a74 0%, #35006b 100%)"
            : "linear-gradient(85deg, #8EC5FC 0%, #E0C3FC 100%)",
          opacity: showSplash ? 0 : 1,
        }}
      >
        {!isAuthenticated && !showSplash && <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />}

        <Routes>
          <Route
            path="/"
            element={
              !isAuthenticated ? (
                <>
                  <IntroContainer />
                  <Loader isDarkMode={isDarkMode} />
                  <Reviews />
                  <Loader_2 isDarkMode={isDarkMode} />
                  <UserExperience />
                  <Services isDarkMode={isDarkMode} />
                  <Footer />
                </>
              ) : (
                <DashBoard />
              )
            }
          />
          <Route path="/signin" element={<Sign_in />} />
          <Route path="/signup" element={<Sign_up />} />
          <Route path="/chats" element={<ProtectedRoute><Chats /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/self_challenges" element={<ProtectedRoute><SelfChallenges /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings toggleTheme={toggleTheme} isDarkMode={isDarkMode} /></ProtectedRoute>} />
          <Route path="/welcome" element={<ProtectedRoute><Welcome /></ProtectedRoute>} />
          <Route path="/set_challenges" element={<ProtectedRoute><IntroToChallenges /></ProtectedRoute>} />
          
          <Route path="/dashboard" element={<ProtectedRoute><DashBoard /></ProtectedRoute>} />
          <Route path="/admindashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
