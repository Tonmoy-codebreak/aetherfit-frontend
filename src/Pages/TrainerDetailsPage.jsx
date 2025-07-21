import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query"; 

import { IoMdDoneAll } from "react-icons/io";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { useAuth } from "../AuthProvider/useAuth";
import useAxios from "../hooks/useAxios";

const getSocialIcon = (url) => {
    if (!url || typeof url !== 'string') return null;
    const lowerUrl = url.toLowerCase();

    if (lowerUrl.includes("facebook.com")) {
        return FaFacebookF;
    }
    if (lowerUrl.includes("instagram.com")) {
        return FaInstagram;
    }
    if (lowerUrl.includes("twitter.com") || lowerUrl.includes("x.com")) {
        return FaTwitter;
    }
    if (lowerUrl.includes("linkedin.com")) {
        return FaLinkedinIn;
    }
    return null;
};

const TrainerDetailsPage = () => {
    useEffect(() => {
        document.title = "AetherFit | Trainer";
    }, []);
    const { id } = useParams();
    const navigate = useNavigate();

    const { user } = useAuth();
    const axiosSecure = useAxios();

    // Query to fetch trainer details
    const {
        data: trainer,
        isLoading: isTrainerLoading,
        isError: isTrainerError,
        error: trainerError,
    } = useQuery({
        queryKey: ["trainerDetails", id],
        queryFn: async () => {
            if (!id) throw new Error("Trainer ID is missing.");
            const res = await axiosSecure.get(`${import.meta.env.VITE_API_URL}/trainers/${id}`);
            if (!res.data || !res.data._id) {
                throw new Error("Trainer data not found");
            }
            return res.data;
        },
        enabled: !!id, // Only run if id exists
        staleTime: 1000 * 60 * 5, // Cache trainer data for 5 minutes
        retry: 1, // Retry once on failure
    });

    // Query to fetch booked slots for the current user and trainer
    const {
        data: bookedSlotsData,
        isLoading: isBookedSlotsLoading,
        isError: isBookedSlotsError,
    } = useQuery({
        queryKey: ["bookedSlots", user?.email, id],
        queryFn: async () => {
            if (!user?.email || !id) return []; // Return empty array if no user or trainer ID
            const res = await axiosSecure.get(
                `${import.meta.env.VITE_API_URL}/booking-logs`,
                { params: { userEmail: user.email } }
            );
            return res.data.filter((booking) => booking.trainerId === id);
        },
        enabled: !!user?.email && !!id, // Only run if user email and trainer ID exist
        staleTime: 1000 * 30, // Shorter cache for booked slots
        retry: 1,
    });
    const bookedSlots = bookedSlotsData || [];

    // Query to check user's role and trainer application status
    const {
        data: userStatusData,
        isLoading: isUserStatusLoading,
        isError: isUserStatusError,
    } = useQuery({
        queryKey: ["userStatus", user?.email],
        queryFn: async () => {
            if (!user?.email) {
                return { role: null, hasPendingApplication: false };
            }
            const [userRes, applicationsRes] = await Promise.all([
                axiosSecure.get(`${import.meta.env.VITE_API_URL}/users?email=${user.email}`),
                axiosSecure.get(`${import.meta.env.VITE_API_URL}/trainer-applications?email=${user.email}`),
            ]);
            const userDbData = userRes.data;
            const hasPendingApplication = applicationsRes.data.some(
                (app) => app.email === user.email && app.status === "pending"
            );
            return { role: userDbData.role, hasPendingApplication };
        },
        enabled: !!user?.email, // Only run if user email exists
        staleTime: 1000 * 60, // Cache user status for 1 minute
        retry: 1,
    });

    const currentUserRole = userStatusData?.role || null;
    const isUserAlreadyTrainerOrApplied = userStatusData?.hasPendingApplication || currentUserRole === "trainer";

    const isSlotBooked = (day, timeRange) => {
        return bookedSlots.some(
            (slot) => slot.slotDay === day && slot.slotTime === timeRange
        );
    };

    // Combined loading state
    if (isTrainerLoading || isBookedSlotsLoading || isUserStatusLoading)
        return (
            <div className="flex justify-center items-center min-h-screen bg-zinc-950">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[#faba22] my-auto mx-auto"></div>
                
            </div>
        );

    // Combined error state
    if (isTrainerError || isBookedSlotsError || isUserStatusError)
        return (
            <div className="flex justify-center items-center min-h-screen bg-zinc-950 text-red-500 text-xl font-inter">
                {trainerError?.message || "Failed to load details. Please try again later."}
            </div>
        );

    // Trainer not found UI
    if (!trainer)
        return (
            <div className="p-6 pt-20 min-h-screen flex flex-col justify-center items-center bg-zinc-950 text-[#faba22] font-funnel">
                <h2 className="text-4xl font-bold text-white mb-4">Trainer Not Found</h2>
                <p className="text-lg text-zinc-300">The trainer you are looking for does not exist.</p>
            </div>
        );

    // Destructure trainer data with robust fallbacks
    const {
        name = "Unnamed Trainer",
        photoURL = "https://placehold.co/400x400/363636/DDDDDD?text=No+Image",
        bio = "No bio available.",
        expertise = [],
        skills = [],
        yearsOfExperience,
        availableDays = [],
        availableTime,
        fromHour,
        toHour,
        fromAMPM,
        toAMPM,
        socialLinks = [],
        slots = [],
    } = trainer;

    // Determine which skills array to display
    const displaySkills = Array.isArray(expertise) && expertise.length > 0 ? expertise : skills;

    // Format available time if it's not already a single string
    const formattedAvailableTime =
        availableTime ||
        (fromHour && toHour && fromAMPM && toAMPM
            ? `${fromHour} ${fromAMPM} - ${toHour} ${toAMPM}`
            : "N/A");

    return (
        <div className="min-h-screen bg-zinc-950 text-[#faba22] font-inter p-8 sm:p-12 lg:p-16">
            <div className="max-w-7xl mx-auto rounded-2xl shadow-2xl p-8 md:p-12 ">
                <h1 className="text-5xl md:text-6xl font-extrabold mb-12 text-center text-white font-funnel drop-shadow-lg">
                    Trainer <span className="text-[#faba22]">Profile</span>
                </h1>

                <div className="flex flex-col md:flex-row gap-12 mb-16">
                    <div className="md:w-1/2 space-y-8">
                        <div className="relative overflow-hidden rounded-xl border border-zinc-700 shadow-xl transform transition-transform duration-300 hover:scale-[1.01]">
                            <img
                                src={photoURL}
                                alt={name}
                                className="w-full h-96 object-cover rounded-xl"
                                onError={(e) => (e.target.src = "https://placehold.co/600x400/363636/DDDDDD?text=No+Image")}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent opacity-80"></div>
                            <h2 className="absolute bottom-6 left-6 text-4xl font-bold text-white drop-shadow-lg">{name}</h2>
                        </div>

                        <div className="bg-zinc-800 p-6 rounded-xl shadow-inner border border-zinc-700">
                            <h3 className="text-2xl font-semibold mb-4 text-[#faba22]">About Me</h3>
                            <p className="text-zinc-300 leading-relaxed text-base">{bio}</p>
                        </div>

                        <div className="bg-zinc-800 p-6 rounded-xl shadow-inner border border-zinc-700">
                            <h3 className="text-2xl font-semibold mb-4 text-[#faba22]">Expertise</h3>
                            {displaySkills.length > 0 ? (
                                <div className="flex flex-wrap gap-3">
                                    {displaySkills.map((skill, idx) => (
                                        <span key={idx} className="px-5 py-2 rounded-full bg-zinc-700 text-zinc-200 text-sm font-medium shadow-md
                                                transition-all duration-300 hover:bg-[#faba22] hover:text-black cursor-default">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-zinc-400 italic">No specific skills listed.</p>
                            )}
                        </div>

                        <div className="bg-zinc-800 p-6 rounded-xl shadow-inner border border-zinc-700 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-2xl font-semibold mb-4 text-[#faba22]">Experience</h3>
                                <p className="text-zinc-300 text-lg">{yearsOfExperience ? `${yearsOfExperience} years of experience` : "N/A"}</p>
                            </div>
                            <div>
                                <h3 className="text-2xl font-semibold mb-4 text-[#faba22]">Availability</h3>
                                <p className="text-zinc-300 text-lg">
                                    <strong className="text-white">Days:</strong> {availableDays.length > 0 ? availableDays.join(", ") : "N/A"}
                                </p>
                                <p className="text-zinc-300 text-lg">
                                    <strong className="text-white">Time:</strong> {formattedAvailableTime}
                                </p>
                            </div>
                        </div>

                        <div className="bg-zinc-800 p-6 rounded-xl shadow-inner border border-zinc-700">
                            <h3 className="text-2xl font-semibold mb-4 text-[#faba22]">Connect with {name.split(' ')[0]}</h3>
                            <div className="flex gap-6 flex-wrap">
                                {Array.isArray(socialLinks) && socialLinks.length > 0 ? (
                                    socialLinks.map((linkObj, idx) => {
                                        const Icon = getSocialIcon(linkObj.url);
                                        if (!Icon || !linkObj.url) return null;
                                        return (
                                            <a
                                                key={idx}
                                                href={linkObj.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-zinc-400 hover:text-[#faba22] transition-colors duration-200 transform hover:scale-125"
                                                title={`Visit ${name.split(' ')[0]}'s ${linkObj.platform || 'Social'} profile`}
                                            >
                                                <Icon size={32} />
                                            </a>
                                        );
                                    })
                                ) : (
                                    <p className="text-zinc-400 italic">No social links available.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="md:w-1/2 bg-zinc-900 p-8 rounded-xl shadow-xl border border-zinc-800">
                        <h2 className="text-4xl font-extrabold mb-8 text-center text-white font-funnel">Available Slots</h2>

                        {slots.length === 0 ? (
                            <p className="text-zinc-400 text-center text-lg italic py-16 rounded-lg bg-zinc-800 border border-zinc-700 shadow-inner">
                                No available slots at the moment. Please check back later!
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 bg-zinc-800 rounded-lg border border-zinc-700 shadow-inner">
                                {slots
                                    .filter(slot => slot && slot.day && slot.timeRange)
                                    .map((slot, idx) => {
                                        const booked = isSlotBooked(slot.day, slot.timeRange);
                                        const isDisabledForTrainer = currentUserRole === "trainer" || currentUserRole === "admin"; // Also disable for admins
                                        return (
                                            <button
                                                key={idx}
                                                disabled={booked || isDisabledForTrainer}
                                                onClick={() => !booked && !isDisabledForTrainer && navigate(`/booking/${id}/${slot.day}/${encodeURIComponent(slot.timeRange)}`)}
                                                className={`
                                                    px-6 py-4 rounded-xl font-bold flex flex-col items-center justify-center text-lg text-center
                                                    transition-all duration-300 shadow-md transform hover:-translate-y-1 hover:shadow-lg
                                                    ${
                                                        booked || isDisabledForTrainer
                                                            ? "bg-zinc-700 text-zinc-400 cursor-not-allowed opacity-70"
                                                            : "bg-[#faba22] text-black hover:bg-yellow-500"
                                                    }
                                                `}
                                                title={slot.slotName || `${slot.day} ${slot.timeRange}`}
                                            >
                                                <span className="text-xl mb-1">{slot.slotName || slot.timeRange}</span>
                                                <span className="text-sm font-normal opacity-80">{slot.day}</span>
                                                {booked && (
                                                    <div className="mt-2 flex items-center text-green-400">
                                                        <IoMdDoneAll size={24} className="mr-2" /> Booked
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                            </div>
                        )}
                    </div>
                </div>

                {currentUserRole !== "admin" && (
                    <div className="mt-16 p-10 bg-gradient-to-br from-zinc-800 to-zinc-950 rounded-2xl shadow-2xl text-center border border-zinc-700 animate-fade-in">
                        <h2 className="text-4xl font-extrabold mb-5 text-white font-funnel">Want to Help Others? 💪</h2>
                        <p className="mb-8 text-zinc-300 leading-relaxed text-lg max-w-2xl mx-auto">
                            Join our vibrant team of certified trainers and share your expertise to inspire and guide our community towards their fitness goals. Make a real impact!
                        </p>

                        {!isUserAlreadyTrainerOrApplied ? (
                            <button
                                onClick={() => navigate("/betrainer")}
                                className="px-10 py-5 rounded-full font-extrabold text-xl bg-[#faba22] text-black hover:bg-yellow-500
                                        transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-2
                                        focus:outline-none focus:ring-4 focus:ring-[#faba22] focus:ring-opacity-50"
                            >
                                Become a Trainer Today!
                            </button>
                        ) : (
                            <button
                                disabled
                                className="px-10 py-5 rounded-full font-bold text-xl bg-zinc-700 text-zinc-400 cursor-not-allowed shadow-lg"
                            >
                                {currentUserRole === "trainer" ? "You are already a Trainer!" : "Trainer Application Pending"}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrainerDetailsPage;