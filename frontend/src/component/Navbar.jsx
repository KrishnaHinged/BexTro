import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = ({ toggleTheme, isDarkMode }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="h-16 px-3 sm:px-5 text-gray-900 flex items-center justify-between font-serif py-6 sm:py-10">
            <h2>
                <img
                    src="/main_logo.svg"
                    alt="Logo"
                    className="w-24 sm:w-30 h-auto logo-glow"
                />
            </h2>
            {/* Hamburger Button for Small Screens */}
            <button
                className="sm:hidden text-gray-900 text-2xl focus:outline-none"
                onClick={toggleMenu}
            >
                ≡
            </button>
            {/* Navigation Links */}
            <div
                className={`${
                    isMenuOpen ? "flex" : "hidden"
                } sm:flex flex-col sm:flex-row gap-4 sm:gap-8 bg-white/85 px-6 sm:px-10 md:px-14 py-2 sm:py-3.5 absolute sm:static top-16 left-0 w-full sm:w-auto rounded-2xl sm:rounded-3xl md:rounded-4xl shadow border border-white sm:shadow sm:border sm:bg-white/85 z-10`}
            >
                <Link to="/" className="hover:text-gray-500 text-sm sm:text-base" onClick={() => setIsMenuOpen(false)}>
                    Home
                </Link>
                <Link to="/signup" className="hover:text-gray-500 text-sm sm:text-base" onClick={() => setIsMenuOpen(false)}>
                    Goal Tracker
                </Link>
                <Link to="/signup" className="hover:text-gray-500 text-sm sm:text-base" onClick={() => setIsMenuOpen(false)}>
                    Chat
                </Link>
                <Link to="/signup" className="hover:text-gray-500 text-sm sm:text-base" onClick={() => setIsMenuOpen(false)}>
                    Challenges
                </Link>
            </div>
            {/* Right Section */}
            <div className="hidden sm:flex items-center gap-3 sm:gap-4">
                <div
                    className="bg-white/85 p-1.5 sm:p-2 rounded-full border border-white cursor-pointer"
                    onClick={toggleTheme}
                >
                    <img
                        src={isDarkMode ? "/light.svg" : "/dark.svg"}
                        alt="Theme Toggle"
                        className="w-5 h-5 sm:w-6 sm:h-6"
                    />
                </div>
                <button className="bg-white/85 text-gray-900 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border border-white text-sm sm:text-base">
                    <Link to="/signup" className="hover:text-gray-300">
                        Get Started
                    </Link>
                </button>
            </div>
        </div>
    );
};

export default Navbar;