import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import axios from "axios";
import { FaEye } from "react-icons/fa"; 

const ActivityLogPage = () => {
  const auth = getAuth();
  const [applications, setApplications] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [loadingApplications, setLoadingApplications] = useState(true); // New loading state for applications

  useEffect(() => {
    const user = auth.currentUser;
    if (user?.email) {
      setAuthEmail(user.email);
      setLoadingApplications(true); // Set loading true before fetching
      const url = `${import.meta.env.VITE_API_URL}/trainer-applications?email=${user.email}`;

      axios
        .get(url)
        .then((res) => {
          setApplications(res.data);
          setLoadingApplications(false); // Set loading false after successful fetch
        })
        .catch((err) => {
          console.error("API Error:", err);
          setLoadingApplications(false); // Set loading false on error too
        });
    } else {
      setLoadingApplications(false); // If no user email, stop loading
    }
  }, []);

  const openFeedbackModal = (feedback) => {
    setSelectedFeedback(feedback || "No feedback provided.");
    setIsModalOpen(true);
  };

  // Loading state for initial user info or applications
  if (!authEmail || loadingApplications) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[#faba22]"></div>
        <p className="text-[#faba22] ml-4 text-xl font-semibold font-inter">
          Loading applications...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-inter px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="max-w-5xl mx-auto bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 p-8 md:p-12">
        <h1 className="text-4xl md:text-5xl font-bold text-[#faba22] text-center mb-10 font-funnel drop-shadow-lg">
          Trainer Application Status
        </h1>

        {applications.length === 0 ? (
          <p className="text-zinc-400 text-center text-xl mt-20 italic p-10 rounded-xl bg-zinc-800 border border-zinc-700 shadow-inner">
            You have no pending or rejected applications.
          </p>
        ) : (
          <div className="space-y-6">
            {applications.map((app) => (
              <div
                key={app._id}
                className="bg-zinc-800 rounded-xl p-7 flex flex-col sm:flex-row justify-between items-center sm:items-start shadow-lg border border-zinc-700 transition-all duration-300 hover:shadow-yellow-500/30 hover:border-[#faba22] transform hover:-translate-y-1"
              >
                <div className="flex-grow text-center sm:text-left mb-4 sm:mb-0">
                  <h2 className="text-2xl font-semibold text-white tracking-wide leading-tight">
                    {app.fullName || "Unknown Name"}
                  </h2>
                  <p className="text-base text-zinc-400 truncate mt-1">{app.email}</p>
                  <p
                    className={`mt-3 font-bold uppercase tracking-wider text-lg ${
                      app.status === "pending"
                        ? "text-yellow-400"
                        : "text-red-500"
                    }`}
                  >
                    Status: {app.status}
                  </p>
                </div>

                {app.status === "rejected" && (
                  <button
                    onClick={() => openFeedbackModal(app.feedback)}
                    className="p-3.5 bg-[#faba22] hover:bg-yellow-500 text-zinc-900 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 flex-shrink-0"
                    title="View Feedback"
                    aria-label="View admin feedback"
                  >
                    <FaEye size={22} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="bg-zinc-900 rounded-2xl max-w-md w-full p-8 relative shadow-2xl border border-zinc-700 transform scale-95 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-[#faba22] text-4xl font-bold leading-none focus:outline-none transition-colors duration-200"
              aria-label="Close feedback modal"
            >
              &times;
            </button>

            <h3
              id="modal-title"
              className="text-3xl font-bold mb-5 text-[#faba22] tracking-wide font-funnel"
            >
              Admin Feedback
            </h3>
            <p className="text-zinc-300 whitespace-pre-wrap leading-relaxed text-lg">
              {selectedFeedback}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityLogPage;
