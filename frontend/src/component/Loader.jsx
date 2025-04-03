import React from "react";

const Loader = ({ isDarkMode }) => {
    return (
        <div>
            <div
                className="moving-text font-serif text-3xl sm:text-4xl md:text-5xl text-gray-900 text-center mt-6 sm:mt-8 md:mt-11"
                style={{
                    color: isDarkMode ? "white" : "gray-900",
                }}
            >
                <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 md:gap-6">
                    <div className="con flex items-center gap-1 sm:gap-2 md:gap-3">
                        <h1>CHAT</h1>
                        <div className="gola w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full bg-gray-900 dark:bg-white"></div>
                        <h1>CREATE</h1>
                        <div className="gola w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full bg-gray-900 dark:bg-white"></div>
                        <h1>EXPLORE</h1>
                        <div className="gola w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full bg-gray-900 dark:bg-white"></div>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 md:gap-6">
                    <div className="con flex items-center gap-1 sm:gap-2 md:gap-3">
                        <h1>CHAT</h1>
                        <div className="gola w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full bg-gray-900 dark:bg-white"></div>
                        <h1>CREATE</h1>
                        <div className="gola w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full bg-gray-900 dark:bg-white"></div>
                        <h1>EXPLORE</h1>
                        <div className="gola w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full bg-gray-900 dark:bg-white"></div>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 md:gap-6">
                    <div className="con flex items-center gap-1 sm:gap-2 md:gap-3">
                        <h1>CHAT</h1>
                        <div className="gola w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full bg-gray-900 dark:bg-white"></div>
                        <h1>CREATE</h1>
                        <div className="gola w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full bg-gray-900 dark:bg-white"></div>
                        <h1>EXPLORE</h1>
                        <div className="gola w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full bg-gray-900 dark:bg-white"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Loader;