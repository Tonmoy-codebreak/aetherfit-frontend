import React from "react";
import { NavLink, Outlet } from "react-router"; 
import { FaHome, FaTasks, FaPlusSquare, FaComments } from 'react-icons/fa';

const TrainerDashboard = () => {
  return (
    <div className="flex min-h-screen bg-zinc-950 text-white font-inter w-full">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 shadow-xl border-r border-zinc-800 p-6 flex flex-col flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
        <div className="p-4 text-center border-b border-zinc-700 mb-6">
          <h2 className="text-3xl font-bold text-[#faba22] font-funnel drop-shadow-lg">
            Trainer Panel
          </h2>
        </div>

        <nav className="flex flex-col gap-4">
          <NavLink
            to="/dashboard/trainer/manageslots"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium transition-all duration-200
               ${isActive
                 ? "bg-[#faba22] text-black shadow-md"
                 : "text-zinc-300 hover:bg-zinc-800 hover:text-[#faba22]"
               }`
            }
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
                 : "text-zinc-300 hover:bg-zinc-800 hover:text-[#faba22]"
               }`
            }
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
                 : "text-zinc-300 hover:bg-zinc-800 hover:text-[#faba22]"
               }`
            }
          >
            <FaComments className="text-xl" />
            Add New Forum
          </NavLink>

          {/* Go Home Link */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium transition-all duration-200 mt-6 border-t border-zinc-700 pt-4
               ${isActive
                 ? "bg-[#faba22] text-black shadow-md"
                 : "text-zinc-300 hover:bg-zinc-800 hover:text-[#faba22]"
               }`
            }
          >
            <FaHome className="text-xl" />
            Go Home
          </NavLink>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 bg-zinc-950 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default TrainerDashboard;
