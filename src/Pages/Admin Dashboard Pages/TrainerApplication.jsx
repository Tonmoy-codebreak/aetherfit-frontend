import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router";

const TrainerApplication = () => {
  const queryClient = useQueryClient();
  const [rejectModal, setRejectModal] = useState({ open: false, appId: null });
  const [rejectReason, setRejectReason] = useState("");
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState(null);

  const { data: applications = [], isLoading, error: fetchError } = useQuery({
    queryKey: ["pendingApplications"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/trainer-applications/admin`
      );
      return res.data;
    },
  });

  if (isLoading) return <p className="text-center py-10">Loading Applications...</p>;
  if (fetchError) return <p className="text-center py-10 text-red-500">Error loading applications</p>;

  const handleApprove = async (id) => {
    setLoadingId(id);
    setError(null);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/trainer-application/${id}/approve`);
      alert("Trainer approved successfully");
      queryClient.invalidateQueries(["pendingApplications"]);
    } catch {
      setError("Failed to approve trainer");
    } finally {
      setLoadingId(null);
    }
  };

  const openRejectModal = (id) => {
    setRejectReason("");
    setError(null);
    setRejectModal({ open: true, appId: id });
  };

  const closeRejectModal = () => {
    setRejectReason("");
    setError(null);
    setRejectModal({ open: false, appId: null });
  };

  const submitReject = async () => {
    if (!rejectReason.trim()) {
      setError("Please provide a rejection reason");
      return;
    }
    setLoadingId(rejectModal.appId);
    setError(null);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/trainer-application/${rejectModal.appId}/reject`, { reason: rejectReason });
      alert("Trainer rejected successfully");
      closeRejectModal();
      queryClient.invalidateQueries(["pendingApplications"]);
    } catch {
      setError("Failed to reject trainer");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Pending Trainer Applications</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 rounded-lg">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app, index) => (
              <tr key={app._id} className="border-b border-gray-700 hover:bg-gray-700">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{app.fullName}</td>
                <td className="px-4 py-2">{app.email}</td>
                <td className="px-4 py-2 flex gap-2">
                  <Link
                    to={`/dashboard/admin/appliedtrainers/${app._id}`}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
                  >
                    Details
                  </Link>
                  <button
                    disabled={loadingId === app._id}
                    onClick={() => handleApprove(app._id)}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded"
                  >
                    {loadingId === app._id ? "Approving..." : "Approve"}
                  </button>
                  <button
                    disabled={loadingId === app._id}
                    onClick={() => openRejectModal(app._id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reject Modal */}
      {rejectModal.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg max-w-md w-full relative">
            <h2 className="text-xl font-semibold mb-4">Reject Trainer Application</h2>

            <textarea
              className="w-full p-2 border border-gray-300 rounded mb-4"
              rows={5}
              placeholder="Provide rejection reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              disabled={loadingId === rejectModal.appId}
            />

            {error && <p className="text-red-500 mb-2">{error}</p>}

            <div className="flex justify-end gap-3">
              <button
                onClick={closeRejectModal}
                disabled={loadingId === rejectModal.appId}
                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 rounded"
              >
                Cancel
              </button>
              <button
                onClick={submitReject}
                disabled={loadingId === rejectModal.appId}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
              >
                {loadingId === rejectModal.appId ? "Submitting..." : "Submit Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerApplication;
