import React from 'react';
import { FaUser, FaClipboardList, FaUsers } from 'react-icons/fa';

const DefaultMember = () => {
    const memberSections = [
        {
            title: "My Profile",
            description: "View and update your personal profile information.",
            icon: <FaUser className="text-black text-3xl sm:text-4xl" />,
            link: "/dashboard/member/profile"
        },
        {
            title: "Activity Log",
            description: "Review your past activities, bookings, and interactions.",
            icon: <FaClipboardList className="text-black text-3xl sm:text-4xl" />,
            link: "/dashboard/member/activity-log"
        },
        {
            title: "Booked Trainers",
            description: "See details of trainers you have booked sessions with.",
            icon: <FaUsers className="text-black text-3xl sm:text-4xl" />,
            link: "/dashboard/member/booked-trainer"
        },
    ];

    return (
        <div className="min-h-screen bg-zinc-950 text-white font-inter flex flex-col items-center justify-center px-4 sm:px-8 py-12">
            {/* Welcome Section */}
            <div className="w-full max-w-4xl text-center mb-12">
                <h1 className="text-4xl md:text-6xl font-bold font-funnel text-[#faba22] drop-shadow-lg mb-4 animate-fade-in-down">
                    Welcome, Member!
                </h1>
                <p className="text-base md:text-lg text-zinc-300 leading-relaxed animate-fade-in delay-200">
                    Your personal dashboard to track your fitness journey and manage your account.
                </p>
            </div>

            {/* Cards Section */}
            <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {memberSections.map((section, index) => (
                    <div
                        key={index}
                        className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-lg flex flex-col items-center justify-between p-6 sm:p-8 transition-transform hover:scale-[1.03] animate-fade-in"
                        style={{ animationDelay: `${400 + index * 100}ms` }}
                    >
                        <div className="p-4 bg-[#faba22] rounded-full mb-4">
                            {section.icon}
                        </div>
                        <div className="flex flex-col items-center text-center flex-grow">
                            <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">{section.title}</h2>
                            <p className="text-sm text-zinc-400">{section.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Note */}
            <div className="w-full max-w-4xl text-center mt-12 animate-fade-in delay-1000">
                <p className="text-sm md:text-base text-zinc-400">
                    Click on any of the navigation links in the sidebar to delve into these sections.
                </p>
            </div>
        </div>
    );
};

export default DefaultMember;
