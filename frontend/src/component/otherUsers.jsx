import React from "react";
import OtherUser from "./OtherUser";
import useGetOtherUsers from "../hooks/useGetOtherUsers";
import { useSelector } from "react-redux";

const OUsers = () => {
    // custom hooks 
    useGetOtherUsers()
    const { OtherUsers } = useSelector(store => store.user)
    if (!OtherUsers) return;
    return (
        <div className="space-y-2 overflow-y-auto">
            {
                OtherUsers?.map((user) => {
                    return (
                        <OtherUser key={user._id} user={user} />
                    )
                })
            }

        </div>
    );
};

export default OUsers;

