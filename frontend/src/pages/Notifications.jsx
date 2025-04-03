import React, { useState, useEffect } from "react";
import MainSlideBar from "../component/main_SlideBar.jsx";
import PageLoader from "../component/pagesLoader.jsx"; // Import the loader

const Notifications = () => {
    const [step, setStep] = useState(1);

    useEffect(() => {
        const timer = setTimeout(() => setStep(2), 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex min-h-screen">
            {step === 1 && <PageLoader message=" Notifications..." />}
            {step === 2 && (
                <>
                    <MainSlideBar />
                    <div className="flex-1 p-8 overflow-auto">
                        <h1 className="text-3xl font-bold text-white/80 mb-6">Notifications</h1>
                        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                            <p className="text-gray-600">Your notifications will appear here.</p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Notifications;
