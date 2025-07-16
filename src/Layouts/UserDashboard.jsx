import React from "react";
import { NavLink, Outlet } from "react-router"; 
import { FaUser, FaClipboardList, FaUsers, FaHome } from 'react-icons/fa'; 

const UserDashboard = () => {
  return (
    <div className="flex min-h-screen bg-zinc-950 text-white font-inter w-full">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 shadow-xl border-r border-zinc-800 p-6 flex flex-col">
        <h2 className="text-3xl font-bold text-[#faba22] mb-8 font-funnel drop-shadow-lg">
          Member Dashboard
        </h2>
        <nav className="flex flex-col gap-4">
          <NavLink
            to="/" // Link to the home page
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium transition-all duration-200
               ${isActive 
                 ? "bg-[#faba22] text-black shadow-md" 
                 : "text-zinc-300 hover:bg-zinc-800 hover:text-[#faba22]"
               }`
            }
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
          >
            <FaUsers className="text-xl" />
            Booked Trainer
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-zinc-950 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default UserDashboard;
