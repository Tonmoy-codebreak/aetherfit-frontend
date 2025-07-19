import React from 'react';
import { Link } from 'react-router'; 

const ErrorPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white p-4">
            <div className="text-center space-y-6">
                <h1 className="text-6xl sm:text-8xl md:text-9xl font-extrabold text-[#faba22]">
                    404
                </h1>
                <p className="text-xl font-funnel sm:text-2xl md:text-3xl font-semibold text-zinc-300">
                    Oops! Page Not Found
                </p>
                <p className="text-base sm:text-lg text-zinc-400 max-w-lg mx-auto">
                    The page you're looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>
                <Link
                    to="/" // Link to your home page
                    className="inline-block mt-8 px-8 py-3 bg-[#faba22] text-zinc-900 font-bold rounded-lg shadow-lg 
                               hover:bg-yellow-500 transition-colors duration-300 transform hover:scale-105
                               focus:outline-none focus:ring-4 focus:ring-[#faba22] focus:ring-opacity-50"
                >
                    Go Home
                </Link>
            </div>
        </div>
    );
};

export default ErrorPage;