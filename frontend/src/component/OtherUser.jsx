import React from "react";
import { useDispatch,useSelector } from "react-redux";
import {setSelectedUser} from '../../redux/userSclice'
const OtherUser = ({ user }) => {
    const dispatch =useDispatch();
    const {selectedUser} = useSelector (store=>store.user);
    const selectedUserHandeler = (user) => {
        // console.log(user)
        dispatch(setSelectedUser(user));
    }
    const profilePhotoUrl = user?.profilePhoto?.startsWith("http")
        ? user.profilePhoto
        : user?.profilePhoto
            ? `http://localhost:5005${user.profilePhoto}`
            : "https://via.placeholder.com/150"; // Fallback image if profilePhoto is not available

    return (
        <>

            <div onClick={() => selectedUserHandeler(user)} className={` ${selectedUser?._id === user?._id ? 'bg-gray-800/70':''}   flex items-center gap-3 p-3 hover:bg-gray-800/70 rounded-lg transition-all duration-200 cursor-pointer`}>
                {/* Avatar with Online Indicator */}
                <div className="relative">
                    <img
                        className="w-10 h-10 rounded-full border-2 border-gray-600 object-cover"
                        src={profilePhotoUrl}
                        alt="profile"
                        onError={(e) => (e.target.src = "https://via.placeholder.com/150")} // Fallback on error
                    />
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-gray-800 rounded-full">
                        <span className="absolute w-full h-full bg-green-400 opacity-75 rounded-full animate-ping"></span>
                    </span>
                </div>

                {/* Username */}
                <div>
                    <p className="text-gray-200 font-medium">{user?.fullName || "Unknown User"}</p>
                    <p className="text-sm text-gray-400">Last message preview...</p>
                </div>
            </div>
        </>
    );
};

export default OtherUser;
