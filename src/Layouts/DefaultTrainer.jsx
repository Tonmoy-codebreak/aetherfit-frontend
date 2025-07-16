import React from 'react';
import { FaTasks, FaPlusSquare, FaComments } from 'react-icons/fa'; // Importing relevant icons

const DefaultTrainer = () => {
    // Define the trainer dashboard sections based on your NavLinks
    const trainerSections = [
        {
            title: "Manage Slots",
            description: "View, edit, and manage your available training slots and bookings.",
            icon: <FaTasks className="text-black text-3xl sm:text-4xl" />,
            link: "/dashboard/trainer/manageslots" // Optional: if you want to make cards clickable
        },
        {
            title: "Add New Slot",
            description: "Easily add new time slots for your training sessions.",
            icon: <FaPlusSquare className="text-black text-3xl sm:text-4xl" />,
            link: "/dashboard/trainer/addslot"
        },
        {
            title: "Add New Forum Post",
            description: "Create and contribute to community forum discussions.",
            icon: <FaComments className="text-black text-3xl sm:text-4xl" />,
            link: "/dashboard/trainer/addforumbytrainer"
        },
    ];

    return (
        <div className="min-h-screen bg-zinc-950 text-white font-inter p-8 sm:p-12 lg:p-16 flex flex-col items-center">
            {/* Welcome Section */}
            <div className="text-center mb-16 w-full max-w-4xl">
                <h1 className="text-5xl md:text-7xl font-bold font-funnel text-[#faba22] drop-shadow-lg mb-4 animate-fade-in-down">
                    Welcome, Trainer!
                </h1>
                <p className="text-lg md:text-xl text-zinc-300 leading-relaxed animate-fade-in delay-200">
                    Your personal dashboard to manage your classes, schedule, and community interactions.
                </p>
            </div>

            {/* Trainer Functionality Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
                {trainerSections.map((section, index) => (
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

export default DefaultTrainer;
