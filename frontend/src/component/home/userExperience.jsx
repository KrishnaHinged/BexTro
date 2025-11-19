import React from "react";

const UserExperience = () => {
    return (
        <div className="text-center bg-white/65 items-center justify-center mx-4 sm:mx-8 md:mx-20 lg:mx-30 my-4 sm:my-6 md:my-10 rounded-2xl sm:rounded-3xl md:rounded-4xl py-6 sm:py-8 md:py-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl text-gray-900 font-serif mb-4 sm:mb-6 md:mb-8">
                What You'll Experience
            </h2>
            <div className="flex flex-col justify-center gap-3 sm:gap-4 md:gap-5 px-4 sm:px-6 md:pl-10 md:pr-10">
                <div className="text-left p-6 sm:p-8 md:p-10 bg-white/85 rounded-xl sm:rounded-2xl shadow-lg hover:bg-gray-800 hover:text-white hover:cursor-pointer hover:shadow-lg hover:transform hover:scale-105 hover:transition-all duration-200">
                    <h3 className="text-lg sm:text-xl font-serif font-semibold">
                        Productivity Like Never Before
                    </h3>
                    <p className="text-sm sm:text-base">
                        "Stay on top of your goals with a gamified dashboard, AI-powered insights, and personalized challenges."
                    </p>
                </div>
                <div className="text-left p-6 sm:p-8 md:p-10 bg-white/85 rounded-xl sm:rounded-2xl shadow-lg hover:bg-gray-800 hover:text-white hover:cursor-pointer hover:shadow-lg hover:transform hover:scale-105 hover:transition-all duration-200">
                    <h3 className="text-lg sm:text-xl font-serif font-semibold">
                        AI-Powered Smart Challenges
                    </h3>
                    <p className="text-sm sm:text-base">
                        "Bextro learns from you, tailoring challenges that push your limits and help you grow."
                    </p>
                </div>
                <div className="text-left p-6 sm:p-8 md:p-10 bg-white/85 rounded-xl sm:rounded-2xl shadow-lg hover:bg-gray-800 hover:text-white hover:cursor-pointer hover:shadow-lg hover:transform hover:scale-105 hover:transition-all duration-200">
                    <h3 className="text-lg sm:text-xl font-serif font-semibold">
                        Fun, Engaging, and Rewarding
                    </h3>
                    <p className="text-sm sm:text-base">
                        "Track your progress, earn rewards, and stay motivated with our visually stunning interface."
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserExperience;