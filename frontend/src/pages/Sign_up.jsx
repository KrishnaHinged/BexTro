import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const SignUp = () => {
  const [user, setUser] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmpassword: "",
    gender: "",
  });

  const navigate = useNavigate();
  const [error, setError] = useState(""); // Error message state
  const [success, setSuccess] = useState(""); // Success message state

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (user.password !== user.confirmpassword) {
      setError("Passwords do not match!");
      return;
    }

    setError(""); // Clear previous errors
    setSuccess(""); // Clear success messages

    try {
      const res = await axios.post("http://localhost:5005/api/v1/user/register", user, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.success) {
        navigate("/welcome");
        toast.success(res.data.message);
      }

      console.log(res.data);
      setSuccess("Account created successfully! Please sign in.");

      // Reset form only after success
      setUser({
        fullName: "",
        username: "",
        password: "",
        confirmpassword: "",
        gender: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred. Try again.");
      setError(error.response?.data?.message || "An error occurred. Try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white/60 p-8 rounded-4xl shadow-lg border border-white h-130 w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>

        {/* Show error or success message */}
        {error && <p className="text-red-500 text-center mb-2">{error}</p>}
        {success && <p className="text-green-500 text-center mb-2">{success}</p>}

        <form onSubmit={onSubmitHandler}>
          <input type="text" value={user.fullName} placeholder="Fullname" className="border p-2 w-full mb-2 rounded" required onChange={(e) => setUser({ ...user, fullName: e.target.value })} />
          <input type="text" value={user.username} placeholder="Username" className="border p-2 w-full mb-2 rounded" required onChange={(e) => setUser({ ...user, username: e.target.value })} />
          <input type="password" value={user.password} placeholder="Password" className="border p-2 w-full mb-2 rounded" required onChange={(e) => setUser({ ...user, password: e.target.value })} />
          <input type="password" value={user.confirmpassword} placeholder="Confirm Password" className="border p-2 w-full mb-4 rounded" required onChange={(e) => setUser({ ...user, confirmpassword: e.target.value })} />

          <h3 className="text-lg font-semibold text-center mb-2">Select Your Gender</h3>
          <div className="flex justify-center items-center mb-4 gap-4">
            <input type="radio" name="gender" id="male" value="Male" className="hidden" onChange={() => setUser({ ...user, gender: "Male" })} checked={user.gender === "Male"} />
            <label htmlFor="male" className={`px-4 py-2 rounded-lg cursor-pointer border ${user.gender === "Male" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-neutral-800 hover:text-white"}`}>Male</label>

            <input type="radio" name="gender" id="female" value="Female" className="hidden" onChange={() => setUser({ ...user, gender: "Female" })} checked={user.gender === "Female"} />
            <label htmlFor="female" className={`px-4 py-2 rounded-lg cursor-pointer border ${user.gender === "Female" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-neutral-800 hover:text-white"}`}>Female</label>
          </div>

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 mt-2 w-full rounded hover:bg-blue-700">Sign Up</button>
        </form>

        <p className="mt-4 text-center">
          Already have an account? <Link to="/signin" className="text-blue-600">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;