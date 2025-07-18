import React, { useState } from "react"; // IMPORTED: useState
import { NavLink, Outlet } from "react-router"; 
import { FaUser, FaClipboardList, FaUsers, FaHome, FaBars, FaTimes } from 'react-icons/fa'; // IMPORTED: FaBars and FaTimes icons

const UserDashboard = () => {
    // STATE: Manages the visibility of the sidebar for responsive behavior
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-zinc-950 text-white font-inter w-full">
            {/* Hamburger Button for screens smaller than lg */}
            <div className="lg:hidden fixed top-4 left-4 z-[99] text-white"> {/* Higher z-index to ensure visibility */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)} // TOGGLES sidebar state
                    className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#faba22] bg-zinc-800"
                >
                    {/* Shows FaTimes (X) when open, FaBars (hamburger) when closed */}
                    {isSidebarOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
                </button>
            </div>

            {/* Sidebar */}
            <aside
                className={`w-64 bg-zinc-900 shadow-xl border-r border-zinc-800 p-6 flex flex-col
                           fixed inset-y-0 left-0 overflow-y-auto z-50 /* Fixed position and z-index for overlay */
                           transform transition-transform duration-300 ease-in-out /* Smooth slide transition */
                           ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} /* Hides on mobile by default, slides in when open */
                           lg:translate-x-0 lg:static lg:left-auto lg:w-64 /* On large screens, always visible and takes up space */
                           `}
            >
                <h2 className="text-3xl font-bold text-[#faba22] mb-8 font-funnel drop-shadow-lg">
                    Member Dashboard
                </h2>
                <nav className="flex flex-col gap-4">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium transition-all duration-200
                                ${isActive
                                    ? "bg-[#faba22] text-black shadow-md"
                                    : "text-zinc-300 hover:bg-zinc-800 hover:text-[#faba22]"
                                }`
                        }
                        onClick={() => setIsSidebarOpen(false)} // CLOSES sidebar when a link is clicked
                    >
                        <FaHome className="text-xl" />
                        Go Home
                    </NavLink>
                    <NavLink
                        to="profile"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium transition-all duration-200
                                ${isActive
                                    ? "bg-[#faba22] text-black shadow-md"
                                    : "text-zinc-300 hover:bg-zinc-800 hover:text-[#faba22]"
                                }`
                        }
                        onClick={() => setIsSidebarOpen(false)} // CLOSES sidebar when a link is clicked
                    >
                        <FaUser className="text-xl" />
                        Profile
                    </NavLink>
                    <NavLink
                        to="activity-log"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium transition-all duration-200
                                ${isActive
                                    ? "bg-[#faba22] text-black shadow-md"
                                    : "text-zinc-300 hover:bg-zinc-800 hover:text-[#faba22]"
                                }`
                        }
                        onClick={() => setIsSidebarOpen(false)} // CLOSES sidebar when a link is clicked
                    >
                        <FaClipboardList className="text-xl" />
                        Activity Log
                    </NavLink>
                    <NavLink
                        to="booked-trainer"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium transition-all duration-200
                                ${isActive
                                    ? "bg-[#faba22] text-black shadow-md"
                                    : "text-zinc-300 hover:bg-zinc-800 hover:text-[#faba22]"
                                }`
                        }
                        onClick={() => setIsSidebarOpen(false)} // CLOSES sidebar when a link is clicked
                    >
                        <FaUsers className="text-xl" />
                        Booked Trainer
                    </NavLink>
                </nav>
            </aside>

            {/* Optional Overlay when sidebar is open on smaller devices */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" // Full screen overlay, hidden on lg and up
                    onClick={() => setIsSidebarOpen(false)} // Closes sidebar when overlay is clicked
                ></div>
            )}

            {/* Main Content */}
            <main className={`flex-1 p-8 bg-zinc-950 overflow-y-auto ${isSidebarOpen ? 'hidden lg:block' : 'block'} lg:ml-64`}>
                 {/* Main content is hidden if sidebar is open on non-lg screens. Shifts on lg screens. */}
                <Outlet />
            </main>
        </div>
    );
};

export default UserDashboard;