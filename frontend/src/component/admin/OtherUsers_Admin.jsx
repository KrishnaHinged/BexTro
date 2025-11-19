import React from "react";
import { useSelector } from "react-redux";
import OtherUser_Admin from "./OtherUser_Admin";
import useGetOtherUsers from "../../hooks/useGetOtherUsers";
import FadeInWhenVisible from "../common/FadeInWhenVisible";

const OtherUsers_Admin = () => {
  const { OtherUsers } = useSelector((store) => store.user);
  const { loading, error } = useGetOtherUsers();

  if (loading) {
    return (
      <p className="text-gray-400 text-center text-lg animate-pulse">
        Loading users...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-red-400 text-center text-lg">
        Error: {error}
      </p>
    );
  }

  if (!OtherUsers || OtherUsers.length === 0) {
    return (
      <p className="text-gray-400 text-center text-lg">
        No users available.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {OtherUsers.map((user) => (
    <OtherUser_Admin key={user._id} user={user} />
      ))}
    </div>
  );
};

export default OtherUsers_Admin;