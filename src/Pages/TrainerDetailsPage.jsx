import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { IoMdDoneAll } from "react-icons/io";
import { useAuth } from "../AuthProvider/useAuth";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";

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
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [trainerApplied, setTrainerApplied] = useState(false); // This state will now specifically check for PENDING applications

  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(`${import.meta.env.VITE_API_URL}/trainers/${id}`);
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
        const res = await axios.get(
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

    const checkTrainerApplication = async () => {
      try {
        if (!user?.email) {
          setTrainerApplied(false);
          return;
        }
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/trainer-applications?email=${user.email}`
        );
        // MODIFIED LOGIC: Check if ANY application has a 'pending' status for the current user
        const hasPendingApplication = res.data.some((app) => app.email === user.email && app.status === "pending");
        setTrainerApplied(hasPendingApplication);
      } catch (err) {
        console.error("Trainer application check error:", err);
      }
    };

    fetchTrainer();
    fetchBookedSlots();
    checkTrainerApplication();
  }, [id, user?.email]); // Re-run if trainer ID or user email changes

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
    fromAMPM,
    toHour,
    toAMPM,
    socialLinks = [],
    additionalInfo = "None",
    bookingCount = 0, // Keeping these for potential future display
    status = "N/A",   // Keeping these for potential future display
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
      <div className="max-w-6xl mx-auto bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 p-8 md:p-12">
        <h1 className="text-5xl md:text-6xl font-bold mb-10 text-center text-white font-funnel drop-shadow-lg">
          {name}
        </h1>

        <div className="flex flex-col md:flex-row gap-12 mb-12"> {/* Added mb-12 to separate from CTA */}
          {/* Left Column: Trainer Info */}
          <div className="md:w-1/2 space-y-8">
            <div className="relative overflow-hidden rounded-xl border border-zinc-700 shadow-lg">
              <img
                src={photoURL}
                alt={name}
                className="w-full h-80 object-cover rounded-xl"
                onError={(e) => (e.target.src = "https://placehold.co/600x400/363636/DDDDDD?text=No+Image")}
              />
            </div>

            {/* Bio Section */}
            <div>
              <h2 className="text-3xl font-semibold mb-3 text-white">Bio</h2>
              <p className="text-zinc-300 leading-relaxed">{bio}</p>
            </div>

            {/* Skills Section */}
            <div>
              <h2 className="text-3xl font-semibold mb-3 text-white">Skills</h2>
              {displaySkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {displaySkills.map((skill, idx) => (
                    <span key={idx} className="px-4 py-1.5 rounded-full bg-zinc-700 text-zinc-200 text-sm font-medium shadow-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-400 italic">No specific skills listed.</p>
              )}
            </div>

            {/* Experience */}
            <div>
              <h2 className="text-3xl font-semibold mb-3 text-white">Experience</h2>
              <p className="text-zinc-300">{yearsOfExperience ? `${yearsOfExperience} years` : "N/A"}</p>
            </div>

            {/* Availability */}
            <div>
              <h2 className="text-3xl font-semibold mb-3 text-white">Availability</h2>
              <p className="text-zinc-300">
                <strong className="text-white">Days:</strong> {availableDays.length > 0 ? availableDays.join(", ") : "N/A"}
              </p>
              <p className="text-zinc-300">
                <strong className="text-white">Time:</strong> {formattedAvailableTime}
              </p>
            </div>

            {/* Social Links */}
            <div>
              <h2 className="text-3xl font-semibold mb-3 text-white">Connect with {name.split(' ')[0]}</h2>
              <div className="flex gap-5 flex-wrap">
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
                        className="text-[#faba22] hover:text-yellow-400 transition-colors duration-200 transform hover:scale-125"
                        title={linkObj.platform || 'Social Link'}
                      >
                        <Icon size={30} />
                      </a>
                    );
                  })
                ) : (
                  <p className="text-zinc-400 italic">No social links available.</p>
                )}
              </div>
            </div>

            {/* Additional Info */}
            <div>
              <h2 className="text-3xl font-semibold mb-3 text-white">Additional Info</h2>
              <p className="text-zinc-300 leading-relaxed">{additionalInfo}</p>
            </div>
          </div>

          {/* Right Column: Available Slots */}
          <div className="md:w-1/2"> {/* Removed flex-col as it's no longer needed for vertical stacking with CTA */}
            <h2 className="text-4xl font-semibold mb-8 text-center text-white font-funnel">Available Slots</h2>

            {slots.length === 0 ? (
              <p className="text-zinc-400 text-center text-lg italic py-10 rounded-lg bg-zinc-800 border border-zinc-700 shadow-inner">
                No available slots at the moment. Please check back later!
              </p>
            ) : (
              <div className="flex flex-wrap gap-4 justify-center p-4 bg-zinc-800 rounded-lg border border-zinc-700 shadow-inner">
                {slots
                  .filter(slot => slot && slot.day && slot.timeRange)
                  .map((slot, idx) => {
                    const booked = isSlotBooked(slot.day, slot.timeRange);
                    return (
                      <button
                        key={idx}
                        disabled={booked}
                        onClick={() => !booked && navigate(`/booking/${id}/${slot.day}/${encodeURIComponent(slot.timeRange)}`)}
                        className={`
                          px-6 py-3 rounded-lg font-semibold flex items-center gap-2 text-lg
                          transition-all duration-300 shadow-md transform hover:-translate-y-1
                          ${
                            booked
                              ? "bg-zinc-700 text-zinc-400 cursor-not-allowed opacity-70"
                              : "bg-[#faba22] text-black hover:bg-yellow-500 hover:shadow-lg"
                          }
                        `}
                        title={slot.slotName || `${slot.day} ${slot.timeRange}`}
                      >
                        {slot.day} {slot.timeRange} {booked && <IoMdDoneAll size={24} color="#22c55e" />}
                      </button>
                    );
                  })}
              </div>
            )}
          </div>
        </div>

        {/* NEW: Standalone "Become a Trainer" CTA Section */}
        <div className="mt-16 p-8 bg-zinc-800 rounded-xl shadow-xl text-center border border-zinc-700">
          <h2 className="text-3xl font-semibold mb-4 text-white font-funnel">Want to Help Others?</h2>
          <p className="mb-6 text-zinc-300 leading-relaxed">Join our team of certified trainers and share your expertise to inspire and guide our community towards their fitness goals.</p>

          {!trainerApplied ? ( // This condition now correctly checks for PENDING applications only
            <button
              onClick={() => navigate("/betrainer")}
              className="px-8 py-4 rounded-xl font-bold text-xl bg-[#faba22] text-black hover:bg-yellow-500
                          transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Become a Trainer
            </button>
          ) : (
            <button
              disabled
              className="px-8 py-4 rounded-xl font-bold text-xl bg-zinc-700 text-zinc-400 cursor-not-allowed shadow-lg"
            >
              Trainer Application Pending
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainerDetailsPage;
