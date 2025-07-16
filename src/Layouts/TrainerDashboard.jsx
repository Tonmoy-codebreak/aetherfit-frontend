import React from "react";
import { Link, Outlet } from "react-router";

const TrainerDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-900 text-white w-full">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 flex-shrink-0">
        <div className="p-6 text-center border-b border-gray-700">
          <h2 className="text-2xl font-bold text-[#faba22]">Trainer Panel</h2>
        </div>

        <nav className="p-4 space-y-3">
          <Link to="/dashboard/trainer/manageslots" className="block hover:text-[#faba22]">Manage Slots</Link>
          <Link to="/dashboard/trainer/addslot" className="block hover:text-[#faba22]">Add New Slot</Link>
          <Link to="/dashboard/trainer/addforumbytrainer" className="block hover:text-[#faba22]">Add New Forum</Link>
          <Link to="/" className="block hover:text-[#faba22]">Go to Home</Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default TrainerDashboard;
