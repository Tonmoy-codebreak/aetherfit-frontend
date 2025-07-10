import React, { useState } from "react";
import { Link, NavLink } from "react-router";
import { RxDashboard } from "react-icons/rx";
import { useAuth } from "../AuthProvider/useAuth";
import Swal from "sweetalert2";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const { user, logoutUser } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutUser();
      setIsProfileDropdownOpen(false);
      Swal.fire("Successfully logged out");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed: " + error.message);
    }
  };

  const navOption = (
    <>
      <li>
        <NavLink to="/" className="text-white hover:text-[#faba22] px-3 py-2 text-lg rounded-md">
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/trainers" className="text-white hover:text-[#faba22] px-3 py-2 text-lg rounded-md">
          Trainers
        </NavLink>
      </li>
      <li>
        <NavLink to="/classes" className="text-white hover:text-[#faba22] px-3 py-2 text-lg rounded-md">
          Classes
        </NavLink>
      </li>
      <li>
        <NavLink to="/forum" className="text-white hover:text-[#faba22] px-3 py-2 text-lg rounded-md">
          Forum
        </NavLink>
      </li>
      {user && (
        <li>
          <NavLink to="/dashboard" className="text-white hover:text-[#faba22] px-3 py-2 text-lg rounded-md">
            Dashboard
          </NavLink>
        </li>
      )}
       {user && (
        <li>
          <NavLink to="/profile" className="text-white hover:text-[#faba22] px-3 py-2 text-lg rounded-md">
            Profile
          </NavLink>
        </li>
      )}
    </>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black shadow-md font-funnel">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img
              src="https://i.ibb.co/QFNxgTVF/aetherfit-logo.png"
              alt="AetherFit Logo"
              className="h-10 w-auto"
              onError={(e) => (e.target.src = "https://placehold.co/120x40/000000/FFFFFF?text=Logo")}
            />
            <span className="text-2xl font-bold text-white">AetherFit</span>
          </div>

          {/* Nav Options + Profile */}
          <div className="hidden lg:flex items-center space-x-5">
            <ul className="flex items-center space-x-5">{navOption}</ul>

            {user ? (
              <div className="flex items-center space-x-4">
                {/* Dashboard Icon */}
                <Link
                  to="/dashboard"
                  className="w-10 h-10 flex items-center justify-center rounded-full text-[#faba22]"
                  title="Dashboard"
                >
                  <RxDashboard className="text-2xl" />
                </Link>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center space-x-2"
                  >
                    <img
                      src={user.photoURL || "https://placehold.co/40x40/666666/FFFFFF?text=U"}
                      alt={user.displayName || "User"}
                      title={user.displayName}
                      className="w-10 h-10 rounded-full border-2 border-[#faba22] object-cover"
                    />
                    {/* <span className="text-white text-sm font-medium hidden sm:block">
                      {user.displayName || "User"}
                    </span> */}
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#111] rounded-md shadow-lg py-1 z-50 border border-gray-700">
                      <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-700">
                        <div className="font-medium text-white">{user.displayName || "User"}</div>
                        <div className="text-gray-400 lg:hidden">{user.email}</div>
                      </div>
                      <Link
                        to="/dashboard/profile"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link
                to="/auth/login"
                className="px-5 py-2 rounded-full text-sm font-funnel text-black"
                style={{ backgroundColor: "#faba22" }}
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-[#faba22] focus:outline-none"
            >
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
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-2 bg-black px-4 pt-4 pb-6 rounded-b-lg shadow-md text-white">
            <ul className="space-y-2">{navOption}</ul>
            {user ? (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={user.photoURL || "https://placehold.co/40x40/666666/FFFFFF?text=U"}
                      alt={user.displayName || "User"}
                      className="w-10 h-10 rounded-full border-2 border-[#faba22] object-cover"
                    />
                    <div>
                      <div className="text-white font-medium">{user.displayName || "User"}</div>
                      <div className="text-gray-400 text-sm">{user.email}</div>
                    </div>
                  </div>
                  
                </div>
                <Link
                  to="/dashboard/profile"
                  className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white mb-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/auth/login"
                className="block w-full text-center mt-3 px-4 py-2 rounded-full bg-[#faba22] text-black font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Log In
              </Link>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
