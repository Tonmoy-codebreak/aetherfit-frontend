import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../AuthProvider/useAuth";
import { useQuery, useQueries } from "@tanstack/react-query";
import StarRatings from "react-star-ratings";

const API_URL = import.meta.env.VITE_API_URL;

// Fetch user's reviews for all trainers
const fetchUserReviews = async (userEmail) => {
  const { data } = await axios.get(`${API_URL}/trainer-reviews`, {
    params: { reviewerEmail: userEmail },
  });
  return data;
};

const fetchBookingLogs = async (userEmail) => {
  const { data } = await axios.get(`${API_URL}/booking-logs`, {
    params: { userEmail },
  });
  return data;
};

const fetchTrainerById = async (trainerId) => {
  const { data } = await axios.get(`${API_URL}/trainers/${trainerId}`);
  return data;
};

const BookedTrainersPage = () => {
  const { user } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTrainerEmail, setCurrentTrainerEmail] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [ratingValue, setRatingValue] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  // Track trainer emails already reviewed by the user
  const [reviewedTrainers, setReviewedTrainers] = useState(new Set());

  // Fetch user reviews once
  const {
    data: userReviews = [],
    isLoading: reviewsLoading,
    isError: reviewsError,
  } = useQuery({
    queryKey: ["userReviews", user?.email],
    queryFn: () => fetchUserReviews(user.email),
    enabled: !!user?.email,
  });

  // Update reviewed trainers set when userReviews changes
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
    queryFn: () => fetchBookingLogs(user.email),
    enabled: !!user?.email,
  });

  const trainersQueries = useQueries({
    queries: (bookings || []).map((booking) => ({
      queryKey: ["trainer", booking.trainerId],
      queryFn: () => fetchTrainerById(booking.trainerId),
      enabled: !!booking.trainerId,
    })),
  });

  if (!user) {
    return (
      <p className="text-center mt-20 text-yellow-400">
        You must be logged in to see booked trainers.
      </p>
    );
  }

  if (bookingsLoading || reviewsLoading) {
    return (
      <p className="text-center mt-20 text-white">Loading your bookings...</p>
    );
  }

  if (bookingsError || reviewsError) {
    return (
      <p className="text-center mt-20 text-red-500 font-semibold">
        Failed to load bookings or reviews.
      </p>
    );
  }

  if (bookings.length === 0) {
    return (
      <p className="text-center mt-20 text-white">
        You have no booked trainers yet.
      </p>
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
      await axios.post(`${API_URL}/trainer-reviews`, {
        trainerEmail: currentTrainerEmail,
        reviewerEmail: user.email,
        reviewerName: user.displayName || "Anonymous",
        rating: ratingValue,
        feedback: feedbackText,
      });

      setSubmitSuccess("Review submitted successfully!");

      // Update the reviewed trainers set locally to disable button immediately
      setReviewedTrainers((prev) => new Set(prev).add(currentTrainerEmail));

      setTimeout(() => {
        setIsModalOpen(false);
      }, 1500);
    } catch (error) {
      setSubmitError("Failed to submit review. Try again later.");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 bg-gray-900 rounded-md text-white font-sans">
      <h1 className="text-4xl font-bold mb-8 text-[#faba22]">Your Booked Trainers</h1>

      {bookings.map((booking, index) => {
        const trainerQuery = trainersQueries[index];
        const trainer = trainerQuery?.data;

        const hasReviewed = trainer
          ? reviewedTrainers.has(trainer.email)
          : false;

        return (
          <div
            key={booking._id}
            className="mb-8 p-6 bg-gray-800 rounded-lg shadow-md"
          >
            {trainerQuery?.isLoading ? (
              <p>Loading trainer info...</p>
            ) : trainer ? (
              <div className="flex space-x-6">
                <img
                  src={trainer.photoURL}
                  alt={trainer.name}
                  className="w-24 h-24 rounded-full object-cover border-2 border-[#faba22]"
                />
                <div>
                  <h2 className="text-2xl font-semibold">{trainer.name}</h2>
                  <p className="italic text-gray-400">{trainer.expertise}</p>
                  <p>Experience: {trainer.yearsOfExperience} years</p>
                  <p>Bio: {trainer.bio}</p>
                </div>
              </div>
            ) : (
              <p>Trainer info not found.</p>
            )}

            <div className="mt-4">
              <p>
                <span className="font-semibold text-[#faba22]">Class Name:</span>{" "}
                {booking.className || "N/A"}
              </p>
              <p>
                <span className="font-semibold text-[#faba22]">Package:</span>{" "}
                {booking.packageName} (${booking.packagePrice})
              </p>
              <p>
                <span className="font-semibold text-[#faba22]">Slot:</span>{" "}
                {booking.slotDay}, {booking.slotTime}
              </p>
              <p>
                <span className="font-semibold text-[#faba22]">Booking Date:</span>{" "}
                {new Date(booking.createdAt).toLocaleString()}
              </p>
            </div>

            {hasReviewed ? (
              <button
                disabled
                className="mt-6 px-5 py-2 bg-gray-600 text-gray-400 rounded font-bold cursor-not-allowed"
              >
                Reviewed
              </button>
            ) : (
              <button
                onClick={() => openReviewModal(trainer?.email)}
                className="mt-6 px-5 py-2 bg-[#faba22] text-black rounded font-bold hover:bg-yellow-600 transition"
              >
                Review Trainer
              </button>
            )}
          </div>
        );
      })}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full relative text-white">
            <button
              onClick={closeModal}
              className="absolute top-2 right-3 text-gray-400 hover:text-white text-xl font-bold"
              aria-label="Close"
            >
              &times;
            </button>

            <h2 className="text-2xl font-semibold mb-4">Review Trainer</h2>

            <label className="block mb-2 font-semibold">
              Your Rating:
              <div className="mt-2">
                <StarRatings
                  rating={ratingValue}
                  starRatedColor="#faba22"
                  starEmptyColor="#444"
                  changeRating={(newRating) => setRatingValue(newRating)}
                  numberOfStars={5}
                  name="trainer-rating"
                  starDimension="30px"
                  starSpacing="5px"
                />
              </div>
            </label>

            <label className="block mb-4">
              Your Feedback:
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={4}
                className="w-full mt-1 p-2 rounded bg-gray-700 text-white resize-none"
                placeholder="Write your feedback (optional)"
              />
            </label>

            {submitError && <p className="text-red-500 mb-2">{submitError}</p>}
            {submitSuccess && <p className="text-green-500 mb-2">{submitSuccess}</p>}

            <button
              onClick={handleSubmitReview}
              disabled={submitLoading}
              className="w-full bg-[#faba22] text-black py-2 rounded font-bold hover:bg-yellow-600 transition disabled:opacity-50"
            >
              {submitLoading ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookedTrainersPage;
