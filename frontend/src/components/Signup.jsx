import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const [name, setname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const navigateTo=useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:4001/user/signup",
        { name, email, password },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );

      console.log("Response data:", response.data);
      setSuccessMsg("User registered successfully.");
      setname("");
      setEmail("");
      setPassword("");
      navigateTo("/login")
    } 
    catch (err) {
  console.error("Axios error:", err);

  // Safely extract message from backend
  let serverMessage =
    err.response?.data?.message ||
    err.response?.data?.errors ||
    err.response?.data?.error ||
    err.message ||
    "Unknown error occurred.";

  // If backend sends an object like { errors: { name: "...", email: "..." } }
  if (typeof serverMessage === "object") {
    serverMessage = JSON.stringify(serverMessage);
  }

  setErrorMsg("Registration failed: " + serverMessage);
} finally {
  setLoading(false);
}
  };

  return (
    <div className="flex h-screen items-center justify-center bg-green-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="font-bold text-3xl text-center p-6">SignUp</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2 font-semibold">name</label>
            <input id="name" type="text" required
              className="w-full p-3 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your user name" value={name} onChange={e => setname(e.target.value)} />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 font-semibold">Email</label>
            <input id="email" type="email" required
              className="w-full p-3 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 font-semibold">Password</label>
            <input id="password" type="password" required
              className="w-full p-3 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>

          {errorMsg && <div className="text-red-600 mb-2">{errorMsg}</div>}
          {successMsg && <div className="text-green-600 mb-2">{successMsg}</div>}

          <div className="flex justify-center p-4">
            <button type="submit" disabled={loading}
              className="bg-blue-400 hover:bg-blue-500 duration-300 p-2 text-xl rounded-lg font-semibold text-white">
              {loading ? "Signing up..." : "Signup"}
            </button>
          </div>

          <p className="mt-4 text-center text-gray-600">
            Already have an account? <Link to="/login" className="text-blue-600 hover:underline ">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
