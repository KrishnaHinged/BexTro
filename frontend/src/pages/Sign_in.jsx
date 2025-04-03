import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setAuthUser } from "../../redux/userSclice.js"; // Fixed typo

const Sign_in = () => {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5005/api/v1/user/login",
        user,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const loggedInUser = res.data.user;
      console.log("Logged in user:", loggedInUser); // Debug log
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
      console.error("Login error:", error); // Debug log
      toast.error(
        error.response?.data?.message || "An error occurred. Try again."
      );
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white/60 p-8 rounded-4xl shadow-lg border border-white h-90 w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>
        <form onSubmit={onSubmitHandler}>
          <input
            type="text"
            value={user.username}
            placeholder="Username"
            className="border p-2 w-full mb-2 rounded"
            required
            onChange={(e) => setUser({ ...user, username: e.target.value })}
          />
          <input
            type="password"
            value={user.password}
            placeholder="Password"
            className="border p-2 w-full mb-4 rounded"
            required
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white mt-12.5 px-4 py-2 w-full rounded hover:bg-blue-700"
          >
            Sign In
          </button>
        </form>
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Sign_in;