import React from 'react';
import { FaUsers, FaUserTie, FaUserCheck, FaDollarSign, FaPlusCircle, FaComments, FaEnvelopeOpenText } from 'react-icons/fa'; // Importing all relevant icons

const DefaulltAdmin = () => {
    // Define the dashboard sections based on your NavLinks
    const dashboardSections = [
        {
            title: "Manage Subscribers",
            description: "View and manage all newsletter subscribers.",
            icon: <FaEnvelopeOpenText className="text-black text-3xl sm:text-4xl" />,
            link: "/dashboard/admin/subscriber" // Optional: if you want to make cards clickable
        },
        {
            title: "Manage Trainers",
            description: "Oversee all registered trainers and their profiles.",
            icon: <FaUserTie className="text-black text-3xl sm:text-4xl" />,
            link: "/dashboard/admin/alltrainers"
        },
        {
            title: "Review Applications",
            description: "Approve or reject new trainer applications.",
            icon: <FaUserCheck className="text-black text-3xl sm:text-4xl" />,
            link: "/dashboard/admin/appliedtrainers"
        },
        {
            title: "View Balance Logs",
            description: "Track financial transactions and trainer balances.",
            icon: <FaDollarSign className="text-black text-3xl sm:text-4xl" />,
            link: "/dashboard/admin/balancelogs"
        },
        {
            title: "Add New Class",
            description: "Create and add new fitness classes to the platform.",
            icon: <FaPlusCircle className="text-black text-3xl sm:text-4xl" />,
            link: "/dashboard/admin/addnewclass"
        },
        {
            title: "Manage Forums",
            description: "Administer forum posts and community discussions.",
            icon: <FaComments className="text-black text-3xl sm:text-4xl" />,
            link: "/dashboard/admin/addforum"
        },
    ];

    return (
        <div className="min-h-screen bg-zinc-950 text-white font-inter p-8 sm:p-12 lg:p-16 flex flex-col items-center">
            {/* Welcome Section */}
            <div className="text-center mb-16 w-full max-w-4xl">
                <h1 className="text-5xl md:text-7xl font-bold font-funnel text-[#faba22] drop-shadow-lg mb-4 animate-fade-in-down">
                    Welcome, Admin!
                </h1>
                <p className="text-lg md:text-xl text-zinc-300 leading-relaxed animate-fade-in delay-200">
                    Your central hub for managing AetherFit's operations. Explore the sections below to get started.
                </p>
            </div>

            {/* Dashboard Functionality Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
                {dashboardSections.map((section, index) => (
                    <div
                        key={index}
                        // You can uncomment the onClick and navigate if you want these cards to be clickable
                        // onClick={() => navigate(section.link)}
                        className="bg-zinc-900 rounded-2xl shadow-xl p-6 sm:p-8 border border-zinc-800 flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300 animate-fade-in"
                        style={{ animationDelay: `${400 + index * 100}ms` }} // Staggered animation
                    >
                        <div className="p-4 bg-[#faba22] rounded-full mb-4 shadow-md">
                            {section.icon}
                        </div>
                        <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">{section.title}</h2>
                        <p className="text-zinc-400 text-sm mt-1">{section.description}</p>
                    </div>
                ))}
            </div>

            {/* Concluding message */}
            <div className="mt-16 text-center w-full max-w-4xl animate-fade-in delay-1000">
                <p className="text-lg text-zinc-400">
                    Click on any of the navigation links in the sidebar to delve into these sections.
                </p>
            </div>
        </div>
    );
};

export default DefaulltAdmin;
