import React, { useState } from "react";
import { NavLink, Link } from "react-router";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navOption = (
    <>
      <li>
        <NavLink
          to="/"
          className="text-white hover:text-[#faba22] transition-colors px-3 py-2 text-lg rounded-md"
          activeClassName="active"
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/trainers"
          className="text-white hover:text-[#faba22] transition-colors px-3 py-2 text-lg rounded-md"
          activeClassName="active"
        >
          Trainers
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/classes"
          className="text-white hover:text-[#faba22] transition-colors px-3 py-2 text-lg rounded-md"
          activeClassName="active"
        >
          Classes
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/forum"
          className="text-white hover:text-[#faba22] transition-colors px-3 py-2 text-lg rounded-md"
          activeClassName="active"
        >
          Forum
        </NavLink>
      </li>
    </>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black shadow-md font-funnel">
      <nav className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <img
              src="https://i.ibb.co/QFNxgTVF/aetherfit-logo.png"
              alt="AetherFit Logo"
              className="h-10 w-auto"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/120x40/000000/FFFFFF?text=Logo";
              }}
            />
            <span className="text-2xl font-bold text-white">AetherFit</span>
          </div>

          {/* Right side: Nav options + Login */}
          <div className="hidden md:flex items-center space-x-5">
            <ul className="flex items-center space-x-5">{navOption}</ul>
            <Link
              to="/auth/login"
              className="px-5 py-2 rounded-full text-sm font-funnel text-black"
              style={{ backgroundColor: "#faba22" }}
            >
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-[#faba22] focus:outline-none"
            >
              {isMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-2 bg-black px-4 pt-4 pb-6 rounded-b-lg shadow-md text-white">
            <ul className="space-y-2">{navOption}</ul>
            <Link
              to="/auth/login"
              className="block w-full text-center mt-3 px-4 py-2 rounded-full bg-[#faba22] text-black font-medium"
            >
              Log In
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
