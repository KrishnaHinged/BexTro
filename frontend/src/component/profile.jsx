import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Score from "./score";

const Profile = ({ refetchTrigger }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get("http://localhost:5005/api/v1/user/profile", {
                    withCredentials: true,
                });
                setUser(res.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchUser();
    }, [refetchTrigger]);

    if (!user) {
        return (
            <div className="flex justify-center items-center h-64">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="rounded-full h-12 w-12 border-t-4 border-blue-500 border-r-4 border-r-transparent"
                ></motion.div>
            </div>
        );
    }

    const profilePhotoUrl = user.profilePhoto?.startsWith("http")
        ? user.profilePhoto
        : user.profilePhoto
        ? `http://localhost:5005${user.profilePhoto}`
        : "https://avatars.dicebear.com/api/initials/" + (user.fullName || "User") + ".svg";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl shadow-lg border border-white/80 text-center max-w-sm mx-auto"
        >
            <motion.div 
                whileHover={{ scale: 1.05 }}
                className="relative mx-auto w-32 h-32 mb-4"
            >
                <img
                    src={profilePhotoUrl}
                    alt="Profile"
                    onError={(e) => (e.target.src = "https://avatars.dicebear.com/api/initials/User.svg")}
                    className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {user.fullName || "User"}
            </h2>
            <p className="text-gray-600 mb-6">{user.email || ""}</p>
            <div className="w-full">
                <Score score={user.score || 0} />
            </div>
        </motion.div>
    );
};

export default Profile;