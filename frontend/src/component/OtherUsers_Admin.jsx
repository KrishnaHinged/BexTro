import React from "react";
import { useSelector } from "react-redux";
import OtherUser_Admin from "./OtherUser_Admin";
import useGetOtherUsers from "../hooks/useGetOtherUsers"; // Import the hook

const OtherUsers_Admin = () => {
  const { OtherUsers } = useSelector((store) => store.user);
  const { loading, error } = useGetOtherUsers(); // Use the hook

  if (loading) {
    return <p className="text-gray-400 text-center">Loading users...</p>;
  }

  if (error) {
    return <p className="text-red-400 text-center">Error: {error}</p>;
  }

  if (!OtherUsers || OtherUsers.length === 0) {
    return <p className="text-gray-400 text-center">No users available.</p>;
  }

  return (
    <div className="space-y-2 overflow-y-auto rounded-4xl p-4">
      {OtherUsers.map((user) => (
        <OtherUser_Admin key={user._id} user={user} />
      ))}
    </div>
  );
};

export default OtherUsers_Admin;