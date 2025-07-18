import React from 'react';
import {
    FaUsers, FaUserTie, FaUserCheck,
    FaDollarSign, FaPlusCircle, FaComments, FaEnvelopeOpenText
} from 'react-icons/fa';

const DefaulltAdmin = () => {
    const dashboardSections = [
        {
            title: "Manage Subscribers",
            description: "View and manage all newsletter subscribers.",
            icon: <FaEnvelopeOpenText className="text-black text-2xl sm:text-3xl lg:text-4xl" />,
            link: "/dashboard/admin/subscriber"
        },
        {
            title: "Manage Trainers",
            description: "Oversee all registered trainers and their profiles.",
            icon: <FaUserTie className="text-black text-2xl sm:text-3xl lg:text-4xl" />,
            link: "/dashboard/admin/alltrainers"
        },
        {
            title: "Review Applications",
            description: "Approve or reject new trainer applications.",
            icon: <FaUserCheck className="text-black text-2xl sm:text-3xl lg:text-4xl" />,
            link: "/dashboard/admin/appliedtrainers"
        },
        {
            title: "View Balance Logs",
            description: "Track financial transactions and trainer balances.",
            icon: <FaDollarSign className="text-black text-2xl sm:text-3xl lg:text-4xl" />,
            link: "/dashboard/admin/balancelogs"
        },
        {
            title: "Add New Class",
            description: "Create and add new fitness classes to the platform.",
            icon: <FaPlusCircle className="text-black text-2xl sm:text-3xl lg:text-4xl" />,
            link: "/dashboard/admin/addnewclass"
        },
        {
            title: "Manage Forums",
            description: "Administer forum posts and community discussions.",
            icon: <FaComments className="text-black text-2xl sm:text-3xl lg:text-4xl" />,
            link: "/dashboard/admin/addforum"
        },
    ];

    return (
        <div className="min-h-screen bg-zinc-950 text-white font-inter px-4 sm:px-8 lg:px-16 py-8 sm:py-12 lg:py-16 flex flex-col items-center">

            {/* Welcome Section */}
            <div className="text-center mb-12 sm:mb-16 w-full max-w-4xl">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-funnel text-[#faba22] drop-shadow-lg mb-4 animate-fade-in-down">
                    Welcome, Admin!
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-zinc-300 leading-relaxed animate-fade-in delay-200">
                    Your central hub for managing AetherFit's operations. Explore the sections below to get started.
                </p>
            </div>

            {/* Dashboard Functionality Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full max-w-6xl">
                {dashboardSections.map((section, index) => (
                    <div
                        key={index}
                        className="bg-zinc-900 rounded-2xl shadow-xl p-6 sm:p-8 border border-zinc-800 flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300 animate-fade-in"
                        style={{ animationDelay: `${400 + index * 100}ms` }}
                    >
                        <div className="p-4 bg-[#faba22] rounded-full mb-4 shadow-md flex items-center justify-center">
                            {section.icon}
                        </div>
                        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-2">{section.title}</h2>
                        <p className="text-zinc-400 text-sm sm:text-base mt-1">{section.description}</p>
                    </div>
                ))}
            </div>

            {/* Concluding message */}
            <div className="mt-12 sm:mt-16 text-center w-full max-w-4xl animate-fade-in delay-1000">
                <p className="text-base sm:text-lg text-zinc-400">
                    Click on any of the navigation links in the sidebar to delve into these sections.
                </p>
            </div>
        </div>
    );
};

export default DefaulltAdmin;
