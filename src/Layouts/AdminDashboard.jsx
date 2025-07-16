import React, { useState } from "react"; // Import useState
import { NavLink, Outlet } from "react-router"; 
import { FaHome, FaUsers, FaUserTie, FaUserCheck, FaDollarSign, FaPlusCircle, FaComments, FaBars, FaTimes } from 'react-icons/fa'; // Added FaBars and FaTimes for menu icon

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to manage sidebar visibility

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white font-inter w-full">
      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 w-64 bg-zinc-900 shadow-xl border-r border-zinc-800 p-6 flex flex-col flex-shrink-0
          transform transition-transform duration-300 ease-in-out z-50
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0 md:h-screen md:overflow-y-auto
        `}
      >
        <div className="p-4 text-center border-b border-zinc-700 mb-6">
          <h2 className="text-3xl font-bold text-[#faba22] font-funnel drop-shadow-lg">
            Admin Panel
          </h2>
          {/* Close button for mobile sidebar */}
          <button
            onClick={toggleSidebar}
            className="absolute top-4 right-4 text-zinc-400 hover:text-[#faba22] text-2xl md:hidden"
            aria-label="Close sidebar"
          >
            <FaTimes />
          </button>
        </div>

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
            onClick={() => setIsSidebarOpen(false)} // Close sidebar on link click
          >
            <FaHome className="text-xl" />
            Go to Home
          </NavLink>
          <NavLink
            to="/dashboard/admin/subscriber"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium transition-all duration-200
               ${isActive
                 ? "bg-[#faba22] text-black shadow-md"
                 : "text-zinc-300 hover:bg-zinc-800 hover:text-[#faba22]"
               }`
            }
            onClick={() => setIsSidebarOpen(false)}
          >
            <FaUsers className="text-xl" />
            All Subscribers
          </NavLink>
          <NavLink
            to="/dashboard/admin/alltrainers"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium transition-all duration-200
               ${isActive
                 ? "bg-[#faba22] text-black shadow-md"
                 : "text-zinc-300 hover:bg-zinc-800 hover:text-[#faba22]"
               }`
            }
            onClick={() => setIsSidebarOpen(false)}
          >
            <FaUserTie className="text-xl" />
            All Trainers
          </NavLink>
          <NavLink
            to="/dashboard/admin/appliedtrainers"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium transition-all duration-200
               ${isActive
                 ? "bg-[#faba22] text-black shadow-md"
                 : "text-zinc-300 hover:bg-zinc-800 hover:text-[#faba22]"
               }`
            }
            onClick={() => setIsSidebarOpen(false)}
          >
            <FaUserCheck className="text-xl" />
            Applied Trainers
          </NavLink>
          <NavLink
            to="/dashboard/admin/balancelogs"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium transition-all duration-200
               ${isActive
                 ? "bg-[#faba22] text-black shadow-md"
                 : "text-zinc-300 hover:bg-zinc-800 hover:text-[#faba22]"
               }`
            }
            onClick={() => setIsSidebarOpen(false)}
          >
            <FaDollarSign className="text-xl" />
            Balance
          </NavLink>
          <NavLink
            to="/dashboard/admin/addnewclass"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium transition-all duration-200
               ${isActive
                 ? "bg-[#faba22] text-black shadow-md"
                 : "text-zinc-300 hover:bg-zinc-800 hover:text-[#faba22]"
               }`
            }
            onClick={() => setIsSidebarOpen(false)}
          >
            <FaPlusCircle className="text-xl" />
            Add New Class
          </NavLink>
          <NavLink
            to="/dashboard/admin/addforum"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium transition-all duration-200
               ${isActive
                 ? "bg-[#faba22] text-black shadow-md"
                 : "text-zinc-300 hover:bg-zinc-800 hover:text-[#faba22]"
               }`
            }
            onClick={() => setIsSidebarOpen(false)}
          >
            <FaComments className="text-xl" />
            Forums
          </NavLink>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 sm:p-8 bg-zinc-950 overflow-y-auto">
        {/* Hamburger menu button for mobile */}
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-3 bg-[#faba22] text-black rounded-full shadow-lg md:hidden"
          aria-label="Open sidebar"
        >
          <FaBars size={20} />
        </button>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
