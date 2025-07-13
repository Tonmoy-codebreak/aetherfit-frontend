import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";

const TrainerDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainer();
  }, [id]);

  if (loading)
    return (
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-yellow-500 my-auto mx-auto"></div>
        <h2 className="text-zinc-900 dark:text-white mt-4">Loading...</h2>
        <p className="text-zinc-600 dark:text-zinc-400">
          Your adventure is about to begin
        </p>
      </div>
    );

  if (error)
    return (
      <div
        className="flex justify-center items-center h-screen"
        style={{ color: "#faba22", backgroundColor: "black" }}
      >
        {error}
      </div>
    );

  if (!trainer)
    return (
      <div
        className="p-6 max-w-4xl mx-auto text-center"
        style={{ color: "#faba22", backgroundColor: "black" }}
      >
        <h2>Trainer not found</h2>
      </div>
    );

  const {
    name,
    photoURL,
    bio,
    expertise = [],
    yearsOfExperience,
    socialLinks = {},
    availableSlots = [],
  } = trainer;

  return (
    <div
      className="max-w-5xl mx-auto p-6 pt-20"
      style={{ backgroundColor: "black", color: "#faba22", fontFamily: "Funnel, sans-serif" }}
    >
      <h1 className="text-4xl font-bold mb-10 text-center">{name}</h1>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Trainer Info */}
        <div className="md:w-1/2 space-y-6">
          <img
            src={photoURL || "https://via.placeholder.com/400x400?text=No+Image"}
            alt={name}
            className="w-full rounded-lg object-cover"
            style={{ maxHeight: "400px" }}
            onError={(e) => (e.target.src = "https://via.placeholder.com/400x400?text=No+Image")}
          />

          <div>
            <h2 className="text-2xl font-semibold mb-2">Bio</h2>
            <p style={{ opacity: 0.85 }}>{bio || "No bio available."}</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">Expertise</h2>
            <ul className="list-disc list-inside">
              {expertise.length > 0 ? (
                expertise.map((item, idx) => <li key={idx}>{item}</li>)
              ) : (
                <li>No expertise information</li>
              )}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">Experience</h2>
            <p>{yearsOfExperience ? `${yearsOfExperience} years` : "N/A"}</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">Social Links</h2>
            <div className="flex gap-4">
              {socialLinks.facebook && (
                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="underline">
                  Facebook
                </a>
              )}
              {socialLinks.instagram && (
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="underline">
                  Instagram
                </a>
              )}
              {!socialLinks.facebook && !socialLinks.instagram && (
                <span style={{ opacity: 0.7 }}>No social links available</span>
              )}
            </div>
          </div>
        </div>

        {/* Available Slots */}
        <div className="md:w-1/2">
          <h2 className="text-3xl font-semibold mb-6 text-center">Available Slots</h2>

          {availableSlots.length === 0 && (
            <p style={{ opacity: 0.7, textAlign: "center" }}>No available slots at the moment.</p>
          )}

          <div className="flex flex-wrap gap-4 justify-center">
            {availableSlots.map(({ day, time }, idx) => (
              <button
                key={idx}
                onClick={() => {
                  navigate(`/booking/${id}/${day}/${encodeURIComponent(time)}`);
                }}
                className="px-5 py-2 rounded font-semibold"
                style={{ backgroundColor: "#faba22", color: "black", minWidth: "120px" }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#d99918")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#faba22")}
              >
                {day} {time}
              </button>
            ))}
          </div>

          {/* Be A Trainer Section */}
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-semibold mb-4">Want to Help Others?</h2>
            <p className="mb-6 opacity-80">Join as a certified trainer and share your expertise with the community.</p>
            <button
              onClick={() => navigate("/betrainer")}
              className="px-6 py-3 rounded-lg font-bold bg-[#faba22] text-black hover:bg-black hover:text-[#faba22] transition"
            >
              Become a Trainer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerDetailsPage;
