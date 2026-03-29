import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-hot-toast";

const SignUp = () => {
  const [user, setUser] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmpassword: "",
    gender: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (user.password !== user.confirmpassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (!user.gender) {
      toast.error("Please select a gender!");
      return;
    }

    setLoading(true);

    try {
      const res = await axiosInstance.post("/user/register", user);

      if (res.data.success) {
        toast.success(res.data.message || "Account created successfully!");
        navigate("/signin");
      }

      setUser({
        fullName: "",
        username: "",
        password: "",
        confirmpassword: "",
        gender: "",
      });
    } catch (error) {
      console.error("Signup error:", error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "An error occurred. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen ">
      <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[2rem] shadow-xl border border-white h-auto w-96 transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-3xl font-extrabold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Sign Up</h2>

        <form onSubmit={onSubmitHandler} className="space-y-3">
          <input type="text" value={user.fullName} placeholder="Fullname" className="border-0 bg-white/80 p-3 w-full rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none" required onChange={(e) => setUser({ ...user, fullName: e.target.value })} />
          <input type="text" value={user.username} placeholder="Username" className="border-0 bg-white/80 p-3 w-full rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none" required onChange={(e) => setUser({ ...user, username: e.target.value })} />
          <input type="password" value={user.password} placeholder="Password" className="border-0 bg-white/80 p-3 w-full rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none" required onChange={(e) => setUser({ ...user, password: e.target.value })} />
          <input type="password" value={user.confirmpassword} placeholder="Confirm Password" className="border-0 bg-white/80 p-3 w-full rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none" required onChange={(e) => setUser({ ...user, confirmpassword: e.target.value })} />

          <div className="py-2">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">Select Gender</h3>
            <div className="flex justify-center items-center gap-4">
              <label htmlFor="male" className={`flex-1 text-center py-2.5 rounded-xl cursor-pointer border-2 transition-all font-bold ${user.gender === "Male" ? "bg-indigo-600 border-indigo-600 text-white shadow-lg" : "bg-white/50 border-transparent text-gray-500 hover:bg-white"}`}>Male</label>
 
               <input type="radio" name="gender" id="female" value="Female" className="hidden" onChange={() => setUser({ ...user, gender: "Female" })} checked={user.gender === "Female"} />
               <label htmlFor="female" className={`flex-1 text-center py-2.5 rounded-xl cursor-pointer border-2 transition-all font-bold ${user.gender === "Female" ? "bg-indigo-600 border-indigo-600 text-white shadow-lg" : "bg-white/50 border-transparent text-gray-500 hover:bg-white"}`}>Female</label>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`bg-indigo-600 text-white px-4 py-3 mt-4 w-full rounded-xl font-bold shadow-lg transition-all ${
              loading 
                ? "opacity-70 cursor-not-allowed scale-95" 
                : "hover:bg-indigo-700 hover:scale-105 active:scale-95"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <span className="loading loading-spinner loading-sm"></span>
                Creating account...
              </div>
            ) : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account? <Link to="/signin" className="text-indigo-600 font-bold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;