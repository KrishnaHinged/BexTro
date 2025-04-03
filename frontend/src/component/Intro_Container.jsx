import React from "react";
import { Link } from "react-router-dom";

const IntroContainer = () => {
    return (
        <div>
            <div className="h-full min-h-[400px] bg-white/65 flex items-center justify-center mx-4 sm:mx-8 md:mx-20 lg:mx-30 my-4 sm:my-6 md:my-10 rounded-2xl sm:rounded-3xl md:rounded-4xl shadow-xl md:shadow-2xl">
                <div className="text-center px-4 sm:px-6 md:px-8">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-900 font-serif">
                        Turn Your Goals into Reality
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg text-gray-900 font-sans mt-3 sm:mt-4 md:mt-5 mb-8 sm:mb-12 md:mb-26">
                        Break big dreams into small steps, track your journey, and stay on the path to success
                    </p>
                    <div>
                        <Link
                            to="/signup"
                            className="bg-white/85 text-gray-900 px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 text-sm sm:text-base rounded-xl sm:rounded-2xl hover:bg-black hover:text-white hover:cursor-pointer border border-white inline-block"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IntroContainer;