import React from "react";
import { Link, Outlet } from "react-router";

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-900 text-white w-full">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 flex-shrink-0">
        <div className="p-6 text-center border-b border-gray-700">
          <h2 className="text-2xl font-bold text-[#faba22]">Admin Panel</h2>
        </div>

        <nav className="p-4 space-y-3">
           <Link to="/" className="block hover:text-[#faba22]">Go to Home</Link>
          <Link to="/dashboard/admin/subscriber" className="block hover:text-[#faba22]">All Subscribers</Link>
          <Link to="/dashboard/admin/alltrainers" className="block hover:text-[#faba22]">All Trainers</Link>
          <Link to="/dashboard/admin/appliedtrainers" className="block hover:text-[#faba22]">Applied Trainers</Link>
          <Link to="/dashboard/admin/balancelogs" className="block hover:text-[#faba22]">Balance</Link>
          <Link to="/dashboard/admin/addnewclass" className="block hover:text-[#faba22]">Add New Class</Link>
         
          <Link to="/dashboard/admin/addforum" className="block hover:text-[#faba22]">Forums</Link>

        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
