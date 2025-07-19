import React, { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router"; 
import {
    FaHome, FaUsers, FaUserTie, FaUserCheck,
    FaDollarSign, FaPlusCircle, FaComments,
    FaBars, FaTimes
} from 'react-icons/fa';

const AdminDashboard = () => {
      useEffect(() => {
            document.title = "Admin Dashboard"; 
        }, []);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex min-h-screen bg-zinc-950 text-white w-full font-inter">

            {/* Overlay for mobile when sidebar is open */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-70 z-40 lg:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed inset-y-0 left-0 w-64 bg-zinc-900 shadow-xl border-r border-zinc-800 p-6 flex flex-col
                    transform transition-transform duration-300 ease-in-out z-50
                    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                    lg:translate-x-0 lg:h-screen lg:overflow-y-auto
                `}
            >
                <div className="p-4 text-center border-b border-zinc-700 mb-6 relative">
                    <h2 className="text-3xl font-bold text-[#faba22] font-funnel drop-shadow-lg">
                        Admin Panel
                    </h2>
                    {/* Close button for mobile sidebar, only visible on small screens */}
                    <button
                        onClick={toggleSidebar}
                        className="absolute top-4 right-4 text-zinc-400 hover:text-[#faba22] text-2xl lg:hidden"
                        aria-label="Close sidebar"
                    >
                        <FaTimes />
                    </button>
                </div>

                <nav className="flex flex-col gap-4">
                    {[
                        { to: "/", label: "Go to Home", icon: FaHome },
                        { to: "/dashboard/admin/subscriber", label: "All Subscribers", icon: FaUsers },
                        { to: "/dashboard/admin/alltrainers", label: "All Trainers", icon: FaUserTie },
                        { to: "/dashboard/admin/appliedtrainers", label: "Applied Trainers", icon: FaUserCheck },
                        { to: "/dashboard/admin/balancelogs", label: "Balance", icon: FaDollarSign },
                        { to: "/dashboard/admin/addnewclass", label: "Add New Class", icon: FaPlusCircle },
                        { to: "/dashboard/admin/addforum", label: "Forums", icon: FaComments },
                    ].map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium transition-all duration-200
                                ${isActive
                                    ? "bg-[#faba22] text-black shadow-md"
                                    : "text-zinc-300 hover:bg-zinc-800 hover:text-[#faba22]"}`
                            }
                            onClick={() => setIsSidebarOpen(false)} // Close sidebar on link click
                        >
                            <Icon className="text-xl" />
                            {label}
                        </NavLink>
                    ))}
                </nav>
            </aside>

            {/* Main content area */}
            <div className="flex-1 lg:ml-64 relative"> {/* Added relative to position hamburger button */}
                {/* Hamburger button for mobile, only visible when sidebar is CLOSED */}
                {!isSidebarOpen && (
                    <button
                        onClick={toggleSidebar}
                        className="fixed top-4 left-4 z-30 p-3 bg-[#faba22] text-black rounded-full shadow-lg lg:hidden"
                        aria-label="Open sidebar"
                    >
                        <FaBars size={20} />
                    </button>
                )}

                <main className="p-4 sm:p-6 md:p-8 bg-zinc-950 overflow-y-auto min-h-screen">
                    {/* Add padding-left to main content when sidebar is closed on small screens to prevent overlap with hamburger */}
                    {!isSidebarOpen && (
                        <div className="pt-16 lg:pt-0"> {/* Adjust top padding to clear the fixed hamburger button */}
                            <Outlet />
                        </div>
                    )}
                    {isSidebarOpen && (
                        <Outlet />
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
