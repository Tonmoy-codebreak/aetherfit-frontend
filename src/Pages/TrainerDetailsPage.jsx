import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router"; 

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
    const axiosSecure = useAxios()
    const [trainer, setTrainer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [bookedSlots, setBookedSlots] = useState([]);
    // This state will now check if the user is already a trainer OR has a pending application
    const [isUserAlreadyTrainerOrApplied, setIsUserAlreadyTrainerOrApplied] = useState(false);
    const [currentUserRole, setCurrentUserRole] = useState(null); // State to store the logged-in user's role

    useEffect(() => {
        const fetchTrainer = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await axiosSecure.get(`${import.meta.env.VITE_API_URL}/trainers/${id}`);
                if (!res.data || !res.data._id) {
                    throw new Error("Trainer data not found");
                }
                setTrainer(res.data);
            } catch (err) {
                setError("Failed to load trainer details. Please try again later.");
                console.error("Fetch trainer error:", err);
            } finally {
                setLoading(false);
            }
        };

        const fetchBookedSlots = async () => {
            try {
                if (!user?.email) {
                    setBookedSlots([]); // Clear if no user
                    return;
                }
                const res = await axiosSecure.get(
                    `${import.meta.env.VITE_API_URL}/booking-logs`,
                    { params: { userEmail: user.email } }
                );
                // Filter bookings specific to this trainer
                const bookingsForThisTrainer = res.data.filter(
                    (booking) => booking.trainerId === id
                );
                setBookedSlots(bookingsForThisTrainer);
            } catch (err) {
                console.error("Failed to fetch booked slots:", err);
                // Optionally show a user-friendly error for booked slots
            }
        };

        const checkUserStatus = async () => {
            try {
                if (!user?.email) {
                    setCurrentUserRole(null);
                    setIsUserAlreadyTrainerOrApplied(false);
                    return;
                }

                // Fetch current user's role from your backend
                const userRes = await axiosSecure.get(`${import.meta.env.VITE_API_URL}/users?email=${user.email}`);
                const userDbData = userRes.data;
                setCurrentUserRole(userDbData.role); // Set the user's role

                // Check for pending applications
                const applicationsRes = await axiosSecure.get(
                    `${import.meta.env.VITE_API_URL}/trainer-applications?email=${user.email}`
                );
                const hasPendingApplication = applicationsRes.data.some((app) => app.email === user.email && app.status === "pending");

                // Set the combined status: true if user is a trainer OR has a pending application
                setIsUserAlreadyTrainerOrApplied(userDbData.role === "trainer" || hasPendingApplication);

            } catch (err) {
                console.error("User status check error:", err);
                setCurrentUserRole(null); // Reset role on error
                setIsUserAlreadyTrainerOrApplied(false);
            }
        };

        fetchTrainer();
        fetchBookedSlots();
        checkUserStatus(); // Call the new combined check
    }, [id, user?.email, axiosSecure]); // Re-run if trainer ID or user email changes

    const isSlotBooked = (day, timeRange) => {
        return bookedSlots.some(
            (slot) => slot.slotDay === day && slot.slotTime === timeRange
        );
    };

    // Loading state UI
    if (loading)
        return (
            <div className="flex justify-center items-center min-h-screen bg-zinc-950">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[#faba22] my-auto mx-auto"></div>
                <p className="text-[#faba22] ml-4 text-xl font-inter">Loading trainer details...</p>
            </div>
        );

    // Error state UI
    if (error)
        return (
            <div className="flex justify-center items-center min-h-screen bg-zinc-950 text-red-500 text-xl font-inter">
                {error}
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
                {/* Main Title */}
                <h1 className="text-5xl md:text-6xl font-extrabold mb-12 text-center text-white font-funnel drop-shadow-lg">
                    Trainer <span className="text-[#faba22]">Profile</span>
                </h1>

                {/* Main Content Sections (Left and Right) */}
                <div className="flex flex-col md:flex-row gap-12 mb-16">
                    {/* Left Column: Trainer Info */}
                    <div className="md:w-1/2 space-y-8">
                        {/* Trainer Photo */}
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

                        {/* Bio Section */}
                        <div className="bg-zinc-800 p-6 rounded-xl shadow-inner border border-zinc-700">
                            <h3 className="text-2xl font-semibold mb-4 text-[#faba22]">About Me</h3>
                            <p className="text-zinc-300 leading-relaxed text-base">{bio}</p>
                        </div>

                        {/* Skills Section */}
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

                        {/* Experience & Availability Section */}
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

                        {/* Social Links */}
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

                    {/* Right Column: Available Slots */}
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
                                        const isDisabledForTrainer = currentUserRole === "trainer"; // Disable if current user is a trainer
                                        return (
                                            <button
                                                key={idx}
                                                disabled={booked || isDisabledForTrainer} // Disable if booked OR if current user is a trainer
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
                                                <span className="text-xl mb-1">{slot.slotName}</span>
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

                {/* NEW: Standalone "Want to Help Others?" CTA Section */}
                {currentUserRole !== "admin" && ( // Only show if user is logged in and not an admin
                    <div className="mt-16 p-10 bg-gradient-to-br from-zinc-800 to-zinc-950 rounded-2xl shadow-2xl text-center border border-zinc-700 animate-fade-in">
                        <h2 className="text-4xl font-extrabold mb-5 text-white font-funnel">Want to Help Others? 💪</h2>
                        <p className="mb-8 text-zinc-300 leading-relaxed text-lg max-w-2xl mx-auto">
                            Join our vibrant team of certified trainers and share your expertise to inspire and guide our community towards their fitness goals. Make a real impact!
                        </p>

                        {!isUserAlreadyTrainerOrApplied ? ( // This condition now correctly checks if user is trainer OR has pending application
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