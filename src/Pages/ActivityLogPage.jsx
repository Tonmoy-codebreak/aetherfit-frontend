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

  useEffect(() => {
    const user = auth.currentUser;
    if (user?.email) {
      setAuthEmail(user.email);
      const url = `${import.meta.env.VITE_API_URL}/trainer-applications?email=${user.email}`;

      axios
        .get(url)
        .then((res) => {
          setApplications(res.data);
        })
        .catch((err) => console.error("API Error:", err));
    }
  }, []);

  const openFeedbackModal = (feedback) => {
    setSelectedFeedback(feedback || "No feedback provided.");
    setIsModalOpen(true);
  };

  if (!authEmail) {
    return (
      <p className="text-white text-center mt-20 text-lg font-semibold animate-pulse">
        Loading user information...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 border-b-4 border-yellow-400 pb-3 tracking-wide">
          Trainer Application Status
        </h1>

        {applications.length === 0 ? (
          <p className="text-gray-400 text-center text-lg mt-20 italic select-none">
            You have no pending or rejected applications.
          </p>
        ) : (
          <div className="space-y-6">
            {applications.map((app) => (
              <div
                key={app._id}
                className="bg-gray-800 rounded-xl p-6 flex justify-between items-center shadow-xl hover:shadow-yellow-400 transition-shadow duration-300"
              >
                <div className="max-w-[80%]">
                  <h2 className="text-xl font-semibold tracking-wide">{app.fullName || "Unknown Name"}</h2>
                  <p className="text-sm text-gray-400 truncate">{app.email}</p>
                  <p
                    className={`mt-2 font-semibold ${
                      app.status === "pending"
                        ? "text-yellow-400"
                        : "text-red-500"
                    } uppercase tracking-wide`}
                  >
                    Status: {app.status}
                  </p>
                </div>

                {app.status === "rejected" && (
                  <button
                    onClick={() => openFeedbackModal(app.feedback)}
                    className="p-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-full shadow-lg transition-colors"
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
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
          onClick={() => setIsModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="bg-gray-900 rounded-xl max-w-md w-full p-7 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-5 text-gray-400 hover:text-yellow-400 text-3xl font-bold leading-none focus:outline-none"
              aria-label="Close feedback modal"
            >
              &times;
            </button>

            <h3
              id="modal-title"
              className="text-2xl font-bold mb-5 text-yellow-400 tracking-wide"
            >
              Admin Feedback
            </h3>
            <p className="text-gray-300 whitespace-pre-wrap leading-relaxed text-lg">
              {selectedFeedback}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityLogPage;
