import React from 'react';
import { Link } from 'react-router'; 

const UnAuthorizedPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white p-6 font-inter relative overflow-hidden">
      
      {/* Background Gradients/Shapes - kept for visual interest, still subtle */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-red-800 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#faba22] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-red-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Content Container - now solid and clean */}
      <div className="relative z-10 bg-zinc-900 p-10 md:p-16 rounded-xl shadow-2xl text-center max-w-2xl mx-auto border border-zinc-700">
        
        {/* Large, impactful icon */}
        <span className="text-8xl md:text-9xl text-red-500 mb-6 block drop-shadow-lg animate-bounce-slow">
          ⛔️
        </span>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-red-400 mb-4 tracking-tight leading-tight">
          Access Denied
        </h1>

        {/* Sub-text message */}
        <p className="text-lg md:text-xl text-zinc-300 mb-10 leading-relaxed">
          It looks like you don't have the necessary permissions to view this page.
          Please ensure you are logged in with the correct account or return to the home page.
        </p>

        {/* Call to Action Button - no hover effects, solid color */}
        <Link
          to="/"
          className="inline-flex items-center justify-center px-8 py-4 bg-[#faba22] text-black font-bold rounded-lg shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-[#faba22] focus:ring-opacity-50 hover:bg-black hover:text-[#faba22] hover:text-2xl "
        >
          Go to Home
        </Link>
      </div>

      {/* Optional Footer Text */}
      <p className="absolute bottom-4 text-zinc-500 text-sm z-10">
        AetherFit | Secure Access Control
      </p>
    </div>
  );
};

export default UnAuthorizedPage;