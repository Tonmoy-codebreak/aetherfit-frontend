import React, { useState } from "react";
import { Link } from "react-router";
import { FcGoogle } from "react-icons/fc";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempt:", { username, password });
    alert("Login functionality not implemented. Check console.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-[#111] text-white font-inter px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-funnel font-extrabold text-[#faba22] mb-2">AetherFit</h1>
          <p className="text-gray-400 text-sm">Fuel your body. Elevate your fitness.</p>
        </div>

        {/* Google Sign In */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 border border-gray-700 rounded-md py-3 hover:bg-[#faba22] hover:text-black transition-colors font-semibold text-white"
        >
          <FcGoogle className="text-xl" />
          Sign in with Google
        </button>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Username */}
          <div className="relative">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-md border border-gray-700 bg-[#111] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#faba22]"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-md border border-gray-700 bg-[#111] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#faba22]"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-md text-black font-semibold bg-[#faba22] hover:bg-yellow-400 transition duration-300"
          >
            Sign In
          </button>
        </form>

        {/* Register */}
        <p className="text-center text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <Link
            to="/auth/register"
            className="text-[#faba22] hover:underline font-medium"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
