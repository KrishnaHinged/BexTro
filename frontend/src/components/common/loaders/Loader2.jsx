import React from "react";
const Loader_2 = () => {
    return (
        <div>
            <div className="moving-text font-serif text-white text-3xl sm:text-4xl md:text-5xl text-center mt-6 sm:mt-8 md:mt-11">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 md:gap-6"
                    >
                        <div className="con flex items-center gap-1 sm:gap-2 md:gap-3">
                            <h1>Challenge</h1>
                            <div className="gola w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full bg-white"></div>
                            <h1>Your</h1>
                            <div className="gola w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full bg-white"></div>
                            <h1>Own Dream</h1>
                            <div className="gola w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full bg-white"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Loader_2;
