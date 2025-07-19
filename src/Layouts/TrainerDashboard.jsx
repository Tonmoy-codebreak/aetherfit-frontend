import React, { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router";
import { FaHome, FaTasks, FaPlusSquare, FaComments, FaBars, FaTimes } from 'react-icons/fa';

const TrainerDashboard = () => {
    useEffect(() => {
            document.title = "Trainer Dashboard"; 
        }, []);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white font-inter w-full">
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
          fixed inset-y-0 left-0 w-64 bg-zinc-900 shadow-xl border-r border-zinc-800 p-6 flex flex-col flex-shrink-0
          transform transition-transform duration-300 ease-in-out z-50
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:h-screen lg:overflow-y-auto
        `}
      >
        <div className="p-4 text-center border-b border-zinc-700 mb-6 relative">
          <h2 className="text-3xl font-bold text-[#faba22] font-funnel drop-shadow-lg">
            Trainer Panel
          </h2>
          {/* Close button for mobile sidebar */}
          <button
            onClick={toggleSidebar}
            className="absolute top-4 right-4 text-zinc-400 hover:text-[#faba22] text-2xl lg:hidden"
            aria-label="Close sidebar"
          >
            <FaTimes />
          </button>
        </div>

        <nav className="flex flex-col gap-4">
          <NavLink
            to="/dashboard/trainer/manageslots"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium transition-all duration-200
              ${isActive
                ? "bg-[#faba22] text-black shadow-md"
                : "text-zinc-300 hover:bg-zinc-800 hover:text-[#faba22]"}`
            }
            onClick={() => setIsSidebarOpen(false)}
          >
            <FaTasks className="text-xl" />
            Manage Slots
          </NavLink>

          <NavLink
            to="/dashboard/trainer/addslot"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium transition-all duration-200
              ${isActive
                ? "bg-[#faba22] text-black shadow-md"
                : "text-zinc-300 hover:bg-zinc-800 hover:text-[#faba22]"}`
            }
            onClick={() => setIsSidebarOpen(false)}
          >
            <FaPlusSquare className="text-xl" />
            Add New Slot
          </NavLink>

          <NavLink
            to="/dashboard/trainer/addforumbytrainer"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium transition-all duration-200
              ${isActive
                ? "bg-[#faba22] text-black shadow-md"
                : "text-zinc-300 hover:bg-zinc-800 hover:text-[#faba22]"}`
            }
            onClick={() => setIsSidebarOpen(false)}
          >
            <FaComments className="text-xl" />
            Add New Forum
          </NavLink>

          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium transition-all duration-200 mt-6 border-t border-zinc-700 pt-4
              ${isActive
                ? "bg-[#faba22] text-black shadow-md"
                : "text-zinc-300 hover:bg-zinc-800 hover:text-[#faba22]"}`
            }
            onClick={() => setIsSidebarOpen(false)}
          >
            <FaHome className="text-xl" />
            Go Home
          </NavLink>
        </nav>
      </aside>

      {/* Main content area */}
      <div className="flex-1 lg:ml-64 relative"> {/* Added relative to position hamburger button */}
        {/* Hamburger button for mobile, only visible when sidebar is closed */}
        {!isSidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="absolute top-4 left-4 z-30 p-3 bg-[#faba22] text-black rounded-full shadow-lg lg:hidden"
            aria-label="Open sidebar"
          >
            <FaBars size={20} />
          </button>
        )}
        <main className="p-4 sm:p-8 bg-zinc-950 overflow-y-auto lg:pl-4"> {/* Adjusted padding for lg screens */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TrainerDashboard;
