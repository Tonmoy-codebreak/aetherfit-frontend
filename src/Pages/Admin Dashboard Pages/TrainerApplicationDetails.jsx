import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const TrainerApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectFeedback, setRejectFeedback] = useState("");

  const { data, isLoading, error: fetchError } = useQuery({
    queryKey: ["trainer-application-details", id],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/trainer-application/${id}`);
      return res.data;
    },
  });

  if (isLoading) return <p className="text-center py-10">Loading...</p>;
  if (fetchError) return <p className="text-center py-10 text-red-500">Failed to load application</p>;

  const {
    fullName,
    email,
    photoURL,
    skills,
    availableDays,
    availableTime,
    yearsOfExperience,
    additionalInfo,
    socialLinks,
  } = data;

  const handleApprove = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/trainer-application/${id}/approve`);
      alert("Trainer approved successfully");
      navigate("/admin/trainer-applications");
    } catch {
      setError("Failed to approve trainer");
    } finally {
      setLoading(false);
    }
  };

  const openRejectModal = () => {
    setRejectFeedback("");
    setShowRejectModal(true);
    setError(null);
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setRejectFeedback("");
    setError(null);
  };

  const submitReject = async () => {
    if (!rejectFeedback.trim()) {
      setError("Please provide feedback for rejection");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/trainer-application/${id}/reject`, { reason: rejectFeedback });
      alert("Trainer rejected successfully");
      setShowRejectModal(false);
      navigate("/dashboard/admin/appliedtrainers");
    } catch {
      setError("Failed to reject trainer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <img src={photoURL} alt={fullName} className="w-28 h-28 rounded-lg" />
        <div>
          <h1 className="text-2xl font-bold">{fullName}</h1>
          <p>{email}</p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <p><strong>Skills:</strong> {skills.join(", ")}</p>
        <p><strong>Available Days:</strong> {availableDays.join(", ")}</p>
        <p><strong>Available Time:</strong> {availableTime}</p>
        <p><strong>Experience:</strong> {yearsOfExperience} years</p>
        <p><strong>About:</strong> {additionalInfo}</p>
        <div>
          <strong>Social Links:</strong>
          <ul className="list-disc list-inside">
            {socialLinks.map((link) => (
              <li key={link.platform}>
                <a href={link.url} target="_blank" rel="noreferrer" className="text-blue-400">
                  {link.platform}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <div className="flex gap-4 mt-6">
          <button
            disabled={loading}
            onClick={handleApprove}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
          >
            {loading ? "Approving..." : "Approve"}
          </button>
          <button
            disabled={loading}
            onClick={openRejectModal}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
          >
            Reject
          </button>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg max-w-lg w-full relative">
            <h2 className="text-xl font-semibold mb-4">Reject Trainer Application</h2>

            <div className="flex items-center gap-4 mb-4">
              <img src={photoURL} alt={fullName} className="w-20 h-20 rounded-lg" />
              <div>
                <p><strong>Name:</strong> {fullName}</p>
                <p><strong>Email:</strong> {email}</p>
              </div>
            </div>

            <textarea
              className="w-full p-2 border border-gray-300 rounded mb-4"
              rows={5}
              placeholder="Provide rejection feedback..."
              value={rejectFeedback}
              onChange={(e) => setRejectFeedback(e.target.value)}
              disabled={loading}
            />

            {error && <p className="text-red-500 mb-2">{error}</p>}

            <div className="flex justify-end gap-3">
              <button
                onClick={closeRejectModal}
                disabled={loading}
                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 rounded"
              >
                Cancel
              </button>
              <button
                onClick={submitReject}
                disabled={loading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
              >
                {loading ? "Submitting..." : "Submit Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerApplicationDetails;
