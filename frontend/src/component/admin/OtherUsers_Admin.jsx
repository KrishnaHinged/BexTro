import React, { useEffect } from "react";
import OtherUser_Admin from "./OtherUser_Admin";
import useGetAdminUsers from "../../hooks/useGetAdminUsers";

const OtherUsers_Admin = () => {
  const { users, loading, error, deleteUser, updateRole } = useGetAdminUsers();

  // Attach handlers to window for child access (OtherUser_Admin)
  useEffect(() => {
    window.onDeleteUser = deleteUser;
    window.onUpdateRole = updateRole;
    return () => {
      delete window.onDeleteUser;
      delete window.onUpdateRole;
    };
  }, [deleteUser, updateRole]);

  if (loading) {
    return (
      <div className="w-full flex justify-center py-20">
        <span className="loading loading-spinner text-indigo-500 w-16"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-10 text-center border border-red-500/20 rounded-3xl bg-red-500/5">
        <p className="text-red-400 font-bold">Error: {error}</p>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="w-full p-10 text-center border border-white/10 rounded-3xl bg-white/5">
        <p className="text-white/40 font-medium">No users found on the platform.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {users.map((user) => (
        <OtherUser_Admin key={user._id} user={user} />
      ))}
    </div>
  );
};

export default OtherUsers_Admin;