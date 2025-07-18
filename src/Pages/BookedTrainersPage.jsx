import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthProvider/useAuth";
import { useQuery, useQueries } from "@tanstack/react-query";
import StarRatings from "react-star-ratings";
import {
  FaCalendarAlt,
  FaDumbbell,
  FaDollarSign,
  FaUserCircle,
  FaEnvelope,
  FaStar,
} from "react-icons/fa";
import useAxios from "../hooks/useAxios";

const API_URL = import.meta.env.VITE_API_URL;

const fetchUserReviews = async (userEmail, axiosSecure) => {
  const { data } = await axiosSecure.get(`${API_URL}/trainer-reviews`, {
    params: { reviewerEmail: userEmail },
  });
  return data;
};

const fetchBookingLogs = async (userEmail, axiosSecure) => {
  const { data } = await axiosSecure.get(`${API_URL}/booking-logs`, {
    params: { userEmail },
  });
  return data;
};

const fetchTrainerById = async (trainerId, axiosSecure) => {
  const { data } = await axiosSecure.get(`${API_URL}/trainers/${trainerId}`);
  return data;
};

const BookedTrainersPage = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTrainerEmail, setCurrentTrainerEmail] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [ratingValue, setRatingValue] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [reviewedTrainers, setReviewedTrainers] = useState(new Set());

  const {
    data: userReviews = [],
    isLoading: reviewsLoading,
    isError: reviewsError,
  } = useQuery({
    queryKey: ["userReviews", user?.email],
    queryFn: () => fetchUserReviews(user.email, axiosSecure),
    enabled: !!user?.email,
  });

  useEffect(() => {
    if (userReviews && userReviews.length > 0) {
      const reviewedEmails = new Set(userReviews.map((r) => r.trainerEmail));
      setReviewedTrainers(reviewedEmails);
    }
  }, [userReviews]);

  const {
    data: bookings = [],
    isLoading: bookingsLoading,
    isError: bookingsError,
  } = useQuery({
    queryKey: ["bookingLogs", user?.email],
    queryFn: () => fetchBookingLogs(user.email, axiosSecure),
    enabled: !!user?.email,
  });

  const trainersQueries = useQueries({
    queries: (bookings || []).map((booking) => ({
      queryKey: ["trainer", booking.trainerId],
      queryFn: () => fetchTrainerById(booking.trainerId, axiosSecure),
      enabled: !!booking.trainerId,
    })),
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <p className="text-center text-yellow-400 text-xl font-semibold font-inter">
          You must be logged in to see booked trainers.
        </p>
      </div>
    );
  }

  if (bookingsLoading || reviewsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[#faba22]"></div>
        <p className="text-center ml-4 text-white text-xl font-inter">
          Loading your bookings...
        </p>
      </div>
    );
  }

  if (bookingsError || reviewsError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <p className="text-center text-red-500 font-semibold text-xl font-inter">
          Failed to load bookings or reviews. Please try again.
        </p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <p className="text-center text-zinc-400 text-xl font-inter p-8 bg-zinc-800 rounded-xl shadow-lg border border-zinc-700">
          You have no booked trainers yet. Start your fitness journey!
        </p>
      </div>
    );
  }

  const openReviewModal = (trainerEmail) => {
    setCurrentTrainerEmail(trainerEmail);
    setFeedbackText("");
    setRatingValue(0);
    setSubmitError(null);
    setSubmitSuccess(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitReview = async () => {
    if (ratingValue === 0) {
      setSubmitError("Please select a rating.");
      return;
    }
    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      await axiosSecure.post(`${API_URL}/trainer-reviews`, {
        trainerEmail: currentTrainerEmail,
        reviewerEmail: user.email,
        reviewerName: user.displayName || "Anonymous",
        rating: ratingValue,
        feedback: feedbackText,
      });

      setSubmitSuccess("Review submitted successfully!");
      setReviewedTrainers((prev) => new Set(prev).add(currentTrainerEmail));

      setTimeout(() => {
        setIsModalOpen(false);
      }, 1500);
    } catch {
      setSubmitError("Failed to submit review. Try again later.");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-inter px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="max-w-5xl mx-auto bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 p-5 sm:p-8 md:p-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#faba22] text-center mb-8 font-funnel drop-shadow-lg">
          Your Booked Trainers
        </h1>

        <div className="space-y-8">
          {bookings.map((booking, index) => {
            const trainerQuery = trainersQueries[index];
            const trainer = trainerQuery?.data;
            const hasReviewed = trainer
              ? reviewedTrainers.has(trainer.email)
              : false;

            return (
              <div
                key={booking._id}
                className="bg-zinc-800 rounded-xl p-5 sm:p-6 shadow-lg border border-zinc-700 transition-all duration-300 hover:shadow-yellow-500/30 hover:border-[#faba22] transform hover:-translate-y-1"
              >
                {trainerQuery?.isLoading ? (
                  <div className="flex items-center justify-center p-4">
                    <div className="w-8 h-8 border-t-2 border-r-2 border-[#faba22] rounded-full animate-spin"></div>
                    <p className="ml-3 text-zinc-400">Loading trainer info...</p>
                  </div>
                ) : trainer ? (
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-5 md:gap-6 mb-6 pb-6 border-b border-zinc-700">
                    <img
                      src={
                        trainer.photoURL ||
                        "https://placehold.co/100x100/363636/DDDDDD?text=No+Photo"
                      }
                      alt={trainer.name || "Trainer"}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-[#faba22] shadow-md"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://placehold.co/100x100/363636/DDDDDD?text=No+Photo";
                      }}
                    />
                    <div className="text-center md:text-left w-full">
                      <h2 className="text-2xl sm:text-3xl font-semibold mb-2">
                        {trainer.name || "Unknown Trainer"}
                      </h2>
                      <p className="italic text-zinc-400 text-base sm:text-lg mb-2">
                        {trainer.expertise ||
                          trainer.skills?.join(", ") ||
                          "No expertise listed"}
                      </p>
                      <p className="text-zinc-300 text-sm sm:text-base mb-1">
                        <span className="font-semibold text-[#faba22]">
                          Experience:
                        </span>{" "}
                        {trainer.yearsOfExperience || "N/A"} years
                      </p>
                      <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                        {trainer.bio || "No biography available."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-red-400 p-4">
                    Trainer info not found for this booking.
                  </p>
                )}

                <div className="flex flex-col gap-4 text-zinc-300 text-base sm:text-lg">
                  <p className="flex flex-col gap-1 sm:flex-row sm:items-center">
                    <span className="flex items-center gap-2">
                      <FaDumbbell className="text-[#faba22]" />
                      <span className="font-semibold text-[#faba22]">
                        Class:
                      </span>
                    </span>
                    {booking.className || "N/A"}
                  </p>
                  <p className="flex flex-col gap-1 sm:flex-row sm:items-center">
                    <span className="flex items-center gap-2">
                      <FaStar className="text-[#faba22]" />
                      <span className="font-semibold text-[#faba22]">
                        Package:
                      </span>
                    </span>
                    {booking.packageName}{" "}
                    <span className="flex items-center gap-1">
                      (<FaDollarSign className="text-[#faba22]" />
                      {booking.packagePrice})
                    </span>
                  </p>
                  <p className="flex flex-col gap-1 sm:flex-row sm:items-center">
                    <span className="flex items-center gap-2">
                      <FaCalendarAlt className="text-[#faba22]" />
                      <span className="font-semibold text-[#faba22]">
                        Slot:
                      </span>
                    </span>
                    {booking.slotDay}, {booking.slotTime}
                  </p>
                  <p className="flex flex-col gap-1 sm:flex-row sm:items-center">
                    <span className="flex items-center gap-2">
                      <FaCalendarAlt className="text-[#faba22]" />
                      <span className="font-semibold text-[#faba22]">
                        Booked On:
                      </span>
                    </span>
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex justify-center mt-8">
                  {hasReviewed ? (
                    <button
                      disabled
                      className="px-8 py-3 bg-zinc-700 text-zinc-400 rounded-full font-bold text-lg cursor-not-allowed shadow-md transition-all duration-200"
                    >
                      Reviewed
                    </button>
                  ) : (
                    <button
                      onClick={() => openReviewModal(trainer?.email)}
                      className="px-8 py-3 bg-[#faba22] text-black rounded-full font-bold text-lg hover:bg-yellow-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      Review Trainer
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="bg-zinc-900 rounded-2xl max-w-md w-full p-8 relative shadow-2xl border border-zinc-700 transform scale-95 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-zinc-400 hover:text-[#faba22] text-4xl font-bold leading-none focus:outline-none transition-colors duration-200"
            >
              &times;
            </button>

            <h2 className="text-3xl font-bold mb-6 text-[#faba22] tracking-wide font-funnel text-center">
              Review Trainer
            </h2>

            <div className="space-y-5">
              <label className="block font-semibold text-zinc-300 text-lg">
                Your Rating:
                <div className="mt-3 flex justify-center">
                  <StarRatings
                    rating={ratingValue}
                    starRatedColor="#faba22"
                    starEmptyColor="#444"
                    changeRating={(newRating) => setRatingValue(newRating)}
                    numberOfStars={5}
                    name="trainer-rating"
                    starDimension="35px"
                    starSpacing="7px"
                  />
                </div>
              </label>

              <label className="block font-semibold text-zinc-300 text-lg">
                Your Feedback:
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  rows={5}
                  className="w-full mt-2 p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 resize-none focus:outline-none focus:ring-2 focus:ring-[#faba22] transition-colors duration-200 text-base"
                  placeholder="Share your experience with the trainer (optional)"
                />
              </label>

              {submitError && (
                <p className="text-red-500 text-center mt-3 text-sm">
                  {submitError}
                </p>
              )}
              {submitSuccess && (
                <p className="text-green-500 text-center mt-3 text-sm">
                  {submitSuccess}
                </p>
              )}

              <button
                onClick={handleSubmitReview}
                disabled={submitLoading}
                className="w-full py-3 rounded-lg bg-[#faba22] text-black font-bold text-lg hover:bg-yellow-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {submitLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-black"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit Review"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookedTrainersPage;
