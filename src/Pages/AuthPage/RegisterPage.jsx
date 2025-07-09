import React from "react";
import { Link } from "react-router";
import { FcGoogle } from "react-icons/fc";

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-[#111] text-white font-inter px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold font-funnel text-[#faba22] mb-2">AetherFit</h1>
          <p className="text-gray-400 text-sm">Create your account and begin your journey</p>
        </div>

        {/* Google Sign-up */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 border border-gray-700 rounded-md py-3 hover:bg-[#faba22] hover:text-black transition-colors font-semibold text-white"
        >
          <FcGoogle className="text-xl" />
          Sign up with Google
        </button>

        {/* Registration Form */}
        <form className="space-y-5">
          {/* Full Name */}
          <input
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-3 rounded-md border border-gray-700 bg-[#111] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#faba22]"
            required
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-md border border-gray-700 bg-[#111] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#faba22]"
            required
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-md border border-gray-700 bg-[#111] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#faba22]"
            required
          />

          {/* Create Account */}
          <button
            type="submit"
            className="w-full py-3 rounded-md text-black font-semibold bg-[#faba22] hover:bg-black hover:text-[#faba22] transition duration-300"
          >
            Create Account
          </button>
        </form>

        {/* Log In Link */}
        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="text-[#faba22] hover:underline font-medium"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
