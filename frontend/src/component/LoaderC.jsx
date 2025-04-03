import React from "react";

const LoaderC = ({ isVisible }) => {
    if (!isVisible) return null;

    return (
        <div
            id="loader_c"
            className="fixed inset-0 flex justify-center items-center bg-black z-[999] transition-opacity duration-1000 overflow-hidden"
        >
            <div className="flex flex-col items-center max-w-[90vw] text-center">
                <h1 className="text-white text-3xl font-bold whitespace-nowrap overflow-hidden text-ellipsis">
                    Do_It_For_Your_Future_Self
                </h1>
                <h1 className="text-white text-3xl font-bold whitespace-nowrap overflow-hidden text-ellipsis">
                    And
                </h1>
                <h1 className="text-white text-3xl font-bold whitespace-nowrap overflow-hidden text-ellipsis">
                    You_are_All_Set..
                </h1>
            </div>
            {/* Inline CSS to ensure no horizontal scrollbar */}
            <style >{`
                #loader_c {
                    overflow: hidden !important;
                    max-width: 100vw;
                    max-height: 100vh;
                    -ms-overflow-style: none; /* IE and Edge */
                    scrollbar-width: none; /* Firefox */
                }
                #loader_c::-webkit-scrollbar {
                    display: none; /* Chrome, Safari, Opera */
                }
                #loader_c > div {
                    max-width: 90vw;
                    overflow: hidden !important;
                }
                #loader_c h1 {
                    max-width: 100%;
                    overflow: hidden !important;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    
                }
            `}</style>
        </div>
    );
};

export default LoaderC;