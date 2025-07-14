import React from "react";
import { NavLink, Outlet } from "react-router";

const UserDashboard = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-4">
        <h2 className="text-2xl font-bold mb-6">Member Dashboard</h2>
        <nav className="flex flex-col gap-4">
          <NavLink
            to="profile"
            className={({ isActive }) =>
              isActive ? "font-semibold text-yellow-400" : "hover:text-yellow-400"
            }
          >
            Profile
          </NavLink>
          <NavLink
            to="activity-log"
            className={({ isActive }) =>
              isActive ? "font-semibold text-yellow-400" : "hover:text-yellow-400"
            }
          >
            Activity Log
          </NavLink>
          <NavLink
            to="booked-trainer"
            className={({ isActive }) =>
              isActive ? "font-semibold text-yellow-400" : "hover:text-yellow-400"
            }
          >
            Booked Trainer
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default UserDashboard;
