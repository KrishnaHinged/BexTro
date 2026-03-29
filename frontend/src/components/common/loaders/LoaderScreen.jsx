import React from "react";

const LoaderScreen = () => {
  return (
    <div
      id="loader"
      className="fixed inset-0 flex justify-center items-center bg-black z-[999] transition-opacity duration-1000 overflow-hidden h-screen"
    >
      <div className="relative flex flex-col items-center text-white text-3xl font-bold">
        <h1>Welcome</h1>
        <h1>to</h1>
        <h1>BeXtro</h1>
      </div>
    </div>
  );
};

export default LoaderScreen;