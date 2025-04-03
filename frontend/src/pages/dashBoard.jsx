// Dashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import MainSlideBar from "../component/main_SlideBar";
import DailyQuotes from "../component/dailyQuotes";
import Profile from "../component/profile";
import Startup from "../component/startup";
import PageLoader from "../component/pagesLoader";

const DashBoard = () => {
    const [user, setUser] = useState(null);
    const [step, setStep] = useState(1);
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    useEffect(() => {
        const stepTimer = setTimeout(() => setStep(2), 2000);

        const fetchUser = async () => {
            try {
                const res = await axios.get("http://localhost:5005/api/v1/user/profile", { 
                    withCredentials: true 
                });
                setUser(res.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUser();

        return () => clearTimeout(stepTimer);
    }, [refetchTrigger]);

    const handleChallengeAction = () => {
        setRefetchTrigger(prev => prev + 1);
    };

    return (
        <div className="flex min-h-screen ">
            <MainSlideBar />
            
            <div className="flex-1 p-4 md:p-8">
                <AnimatePresence>
                    {step === 1 && <PageLoader message="Dashboard..." />}
                </AnimatePresence>

                {step === 2 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
                            {user ? `Welcome back, ${user.fullName.split(' ')[0]}` : "Welcome!"}
                            <span className="text-blue-500">!</span>
                        </h1>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-1 space-y-6">
                                <Profile refetchTrigger={refetchTrigger} />
                            </div>
                            
                            <div className="lg:col-span-2 space-y-6">
                                <DailyQuotes />
                                <Startup onChallengeAction={handleChallengeAction} />
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default DashBoard;