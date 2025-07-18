import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";

import Swal from "sweetalert2"; // Import Swal for beautiful alerts
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaCalendarAlt, FaClock, FaAward, FaInfoCircle, FaTimes, FaCheckCircle, FaBan } from "react-icons/fa"; // Importing icons
import useAxios from "../../hooks/useAxios";

// Helper function to get social media icon (unchanged logic)
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

const TrainerApplicationDetails = () => {
  const axiosSecure = useAxios()
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false); // For approve/reject actions
  const [error, setError] = useState(null); // For approve/reject errors
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectFeedback, setRejectFeedback] = useState("");

  const { data, isLoading, error: fetchError } = useQuery({
    queryKey: ["trainer-application-details", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`${import.meta.env.VITE_API_URL}/trainer-application/${id}`);
      return res.data;
    },
  });

  // Loading state UI
  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-zinc-950">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[#faba22] my-auto mx-auto"></div>
        <p className="text-[#faba22] ml-4 text-xl font-inter">Loading application details...</p>
      </div>
    );

  // Error state UI
  if (fetchError)
    return (
      <div className="flex justify-center items-center min-h-screen bg-zinc-950">
        <p className="text-red-500 text-xl font-inter">Failed to load application details. Please try again later.</p>
      </div>
    );

  // Destructure data with robust fallbacks
  const {
    fullName = "N/A",
    email = "N/A",
    photoURL = "https://placehold.co/150x150/363636/DDDDDD?text=No+Photo",
    skills = [],
    availableDays = [],
    availableTime = "N/A",
    yearsOfExperience = "N/A",
    additionalInfo = "No additional information provided.",
    socialLinks = [],
  } = data;

  // Handle Approve logic (replaced alert with Swal.fire)
  const handleApprove = async () => {
    setLoading(true);
    setError(null);
    try {
      await axiosSecure.post(`${import.meta.env.VITE_API_URL}/trainer-application/${id}/approve`);
      Swal.fire({
        icon: "success",
        title: '<span style="color:#faba22">Trainer Approved!</span>',
        text: `${fullName} has been successfully approved as a trainer.`,
        background: "black",
        color: "#faba22",
        confirmButtonColor: "#faba22",
      }).then(() => {
        navigate("/dashboard/admin/appliedtrainers"); // Navigate after success
      });
    } catch (err) {
      setError("Failed to approve trainer.");
      Swal.fire({
        icon: "error",
        title: '<span style="color:#faba22">Approval Failed</span>',
        text: err.response?.data?.message || "Something went wrong.",
        background: "black",
        color: "#faba22",
        confirmButtonColor: "#faba22",
      });
    } finally {
      setLoading(false);
    }
  };

  // Open Reject Modal logic (unchanged)
  const openRejectModal = () => {
    setRejectFeedback("");
    setShowRejectModal(true);
    setError(null);
  };

  // Close Reject Modal logic (unchanged)
  const closeRejectModal = () => {
    setShowRejectModal(false);
    setRejectFeedback("");
    setError(null);
  };

  // Submit Reject logic (replaced alert with Swal.fire)
  const submitReject = async () => {
    if (!rejectFeedback.trim()) {
      setError("Please provide feedback for rejection.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await axiosSecure.post(`${import.meta.env.VITE_API_URL}/trainer-application/${id}/reject`, { reason: rejectFeedback });
      Swal.fire({
        icon: "success",
        title: '<span style="color:#faba22">Trainer Rejected!</span>',
        text: `Application for ${fullName} has been rejected.`,
        background: "black",
        color: "#faba22",
        confirmButtonColor: "#faba22",
      }).then(() => {
        setShowRejectModal(false);
        navigate("/dashboard/admin/appliedtrainers"); // Navigate after success
      });
    } catch (err) {
      setError("Failed to reject trainer.");
      Swal.fire({
        icon: "error",
        title: '<span style="color:#faba22">Rejection Failed</span>',
        text: err.response?.data?.message || "Something went wrong.",
        background: "black",
        color: "#faba22",
        confirmButtonColor: "#faba22",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-inter p-8 sm:p-12 lg:p-16">
      <h1 className="text-5xl md:text-6xl font-bold font-funnel text-center mb-12 text-[#faba22] drop-shadow-lg">
        Application Details
      </h1>

      <div className="bg-zinc-900 p-8 rounded-2xl shadow-2xl border border-zinc-800 max-w-4xl mx-auto">
        {/* Trainer Header and Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center sm:justify-between sm:items-start gap-8 pb-8 mb-8 border-b border-zinc-700">
          {/* Trainer Info (Image + Name/Email) */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 text-center sm:text-left">
            <img
              src={photoURL}
              alt={fullName}
              className="w-36 h-36 object-cover rounded-full border-4 border-[#faba22] shadow-lg flex-shrink-0"
              onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/150x150/363636/DDDDDD?text=No+Photo"; }}
            />
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{fullName}</h2> {/* Adjusted font size */}
              <p className="text-lg text-zinc-400">{email}</p> {/* Adjusted font size */}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4 sm:mt-0">
            <button
              disabled={loading}
              onClick={handleApprove}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:bg-green-800 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Approving...
                </>
              ) : (
                <>
                  <FaCheckCircle size={20} /> Approve
                </>
              )}
            </button>
            <button
              disabled={loading}
              onClick={openRejectModal}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:bg-red-800 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <FaBan size={20} /> Reject
            </button>
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-6 text-zinc-300 text-lg">
          <p className="flex items-center gap-3">
            <FaAward className="text-[#faba22] text-2xl" />
            <strong className="text-white">Experience:</strong> {yearsOfExperience} years
          </p>
          <p className="flex items-center gap-3">
            <FaInfoCircle className="text-[#faba22] text-2xl" />
            <strong className="text-white">Skills:</strong> {skills.length > 0 ? skills.join(", ") : "N/A"}
          </p>
          <p className="flex items-center gap-3">
            <FaCalendarAlt className="text-[#faba22] text-2xl" />
            <strong className="text-white">Available Days:</strong> {availableDays.length > 0 ? availableDays.join(", ") : "N/A"}
          </p>
          <p className="flex items-center gap-3">
            <FaClock className="text-[#faba22] text-2xl" />
            <strong className="text-white">Available Time:</strong> {availableTime}
          </p>
          <div>
            <strong className="text-white block mb-2">About:</strong>
            <p className="bg-zinc-800 p-4 rounded-lg border border-zinc-700 leading-relaxed">
              {additionalInfo}
            </p>
          </div>

          {socialLinks && socialLinks.length > 0 && (
            <div>
              <strong className="text-white block mb-3">Social Links:</strong>
              <div className="flex flex-wrap gap-5">
                {socialLinks.map((link, idx) => {
                  const Icon = getSocialIcon(link.url);
                  if (!Icon) return null; // Only render if an icon is found
                  return (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#faba22] hover:text-yellow-400 transition-colors duration-200 transform hover:scale-125"
                      title={link.platform}
                    >
                      <Icon size={30} />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons (Moved into header section, but kept here for error display if needed) */}
        {error && <p className="text-red-500 text-center mt-6">{error}</p>}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in"
          onClick={closeRejectModal} // Close modal when clicking outside
          role="dialog"
          aria-modal="true"
          aria-labelledby="reject-modal-title"
        >
          <div
            className="bg-zinc-900 rounded-2xl max-w-md w-full p-8 relative shadow-2xl border border-zinc-700 transform scale-95 animate-scale-in"
            onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside
          >
            <button
              onClick={closeRejectModal}
              className="absolute top-4 right-4 text-zinc-400 hover:text-[#faba22] text-3xl font-bold leading-none focus:outline-none transition-colors duration-200"
              aria-label="Close rejection modal"
            >
              <FaTimes />
            </button>

            <h2 id="reject-modal-title" className="text-2xl font-bold mb-6 text-[#faba22] text-center font-funnel"> {/* Adjusted font size */}
              Reject Application
            </h2>

            <div className="flex flex-col items-center gap-4 mb-6">
              <img
                src={photoURL}
                alt={fullName}
                className="w-24 h-24 object-cover rounded-full border-4 border-zinc-700 shadow-md"
                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/96x96/363636/DDDDDD?text=No+Photo"; }}
              />
              <div className="text-center">
                <p className="text-xl font-semibold text-white">{fullName}</p>
                <p className="text-base text-zinc-400">{email}</p>
              </div>
            </div>

            <textarea
              className="w-full p-4 bg-zinc-800 border border-zinc-700 rounded-lg mb-6 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#faba22] text-lg resize-y"
              rows={6}
              placeholder="Provide detailed feedback for rejection (e.g., missing documents, insufficient experience, etc.)"
              value={rejectFeedback}
              onChange={(e) => setRejectFeedback(e.target.value)}
              disabled={loading}
            />

            {error && <p className="text-red-500 text-center mb-4 text-sm">{error}</p>}

            <div className="flex justify-end gap-4">
              <button
                onClick={closeRejectModal}
                disabled={loading}
                className="px-6 py-3 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg font-semibold transition-colors duration-200 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={submitReject}
                disabled={loading}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors duration-200 shadow-md disabled:bg-red-800 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit Rejection"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerApplicationDetails;
