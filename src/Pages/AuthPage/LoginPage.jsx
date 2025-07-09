import React from "react";
import { Link } from "react-router";
import { FcGoogle } from "react-icons/fc";
import { GiHeartBeats, GiMuscleUp } from "react-icons/gi";
import { MdSelfImprovement } from "react-icons/md";
import { CgGym } from "react-icons/cg";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col lg:pt-20 lg:flex-row items-center justify-center bg-gradient-to-br from-black via-gray-900 to-[#111] text-white font-inter">
      {/* Left: Logo & Welcome */}
      <div className="w-full md:w-1/2 lg:flex flex-col items-center justify-center px-6 py-10 md:py-0 text-center hidden">
        <img
          src="https://i.ibb.co/QFNxgTVF/aetherfit-logo.png"
          alt="AetherFit Logo"
          className="h-32 mb-6"
        />
        <h1 className="text-4xl font-bold mb-2 font-funnel">Welcome to AetherFit</h1>
        <p className="text-gray-400 max-w-md mb-6">
          Fuel your body. Elevate your fitness. Let’s sign in and crush some goals.
        </p>

        {/* Motivational Line */}
        <p className="italic text-sm text-[#faba22] mb-4">
          "Progress, not perfection."
        </p>

        {/* Icon Row */}
        <div className="flex gap-6 text-[#faba22] text-3xl mt-4">
          <CgGym title="Strength" />
          <GiHeartBeats title="Cardio" />
          <GiMuscleUp title="Power" />
          <MdSelfImprovement title="Flexibility" />
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 py-12 rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none shadow-2xl">
        <div className="w-full max-w-md mx-auto">
          <h2 className="text-3xl font-extrabold mb-8 text-black dark:text-white text-center">
            Welcome Back
          </h2>

          {/* Google Sign-in */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 border border-gray-300 dark:border-gray-600 rounded-md py-3 mb-6 hover:bg-[#faba22] hover:text-black transition-colors font-semibold text-gray-700 dark:text-white"
          >
            <FcGoogle className="text-xl" />
            Sign in with Google
          </button>

          {/* Email */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#222] text-black dark:text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#faba22]"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#222] text-black dark:text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#faba22]"
            />
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full bg-[#faba22] text-black py-3 rounded-md font-semibold hover:bg-yellow-400 transition-colors mb-4"
          >
            Sign In
          </button>

          {/* Register Link */}
          <p className="text-center text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/auth/register"
              className="text-[#faba22] font-semibold hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
