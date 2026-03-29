import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setAuthUser } from "../../redux/userSlice.js";

const Sign_in = () => {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.post("/user/login", user);

      const loggedInUser = res.data.user;
      console.log("Logged in user:", loggedInUser);
      dispatch(setAuthUser(loggedInUser));

      if (loggedInUser.role === "admin") {
        navigate("/admindashboard");
      } else {
        navigate("/welcome");
      }

      toast.success("Logged in successfully!");

      setUser({
        username: "",
        password: "",
      });
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "An error occurred. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[2rem] shadow-xl border border-white h-auto w-96 transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-3xl font-extrabold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Sign In</h2>
        <form onSubmit={onSubmitHandler} className="space-y-4">
          <input
            type="text"
            value={user.username}
            placeholder="Username"
            className="border-0 bg-white/80 p-3 w-full rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
            required
            onChange={(e) => setUser({ ...user, username: e.target.value })}
          />
          <input
            type="password"
            value={user.password}
            placeholder="Password"
            className="border-0 bg-white/80 p-3 w-full rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
            required
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
          <button
            type="submit"
            disabled={loading}
            className={`bg-indigo-600 text-white mt-8 px-4 py-3 w-full rounded-xl font-bold shadow-lg transition-all ${loading
                ? "opacity-70 cursor-not-allowed scale-95"
                : "hover:bg-indigo-700 hover:scale-105 active:scale-95"
              }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <span className="loading loading-spinner loading-sm"></span>
                Logging in...
              </div>
            ) : "Sign In"}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-indigo-600 font-bold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Sign_in;