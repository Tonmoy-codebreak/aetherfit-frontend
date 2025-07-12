import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaFacebookF, FaTwitter, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router"; 

const fetchTrainers = async () => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/trainers`);
  if (!Array.isArray(res.data)) {
    throw new Error("Invalid data format received");
  }
  return res.data;
};

const AllTrainersPage = () => {
  // --- CHANGE IS HERE ---
  const {
    data: trainers = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ["trainers"], // This is the query key
    queryFn: fetchTrainers, // This is the query function
  });
  // --- END OF CHANGE ---

  if (isLoading) {
    return (
      <div
        className="flex justify-center items-center h-screen"
        style={{ fontFamily: "Funnel, sans-serif", backgroundColor: "black", color: "#faba22" }}
      >
        Loading trainers...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex justify-center items-center h-screen"
        style={{ fontFamily: "Funnel, sans-serif", backgroundColor: "black", color: "#faba22" }}
      >
        {error.message || "Failed to load trainers. Please try again later."}
      </div>
    );
  }

  if (trainers.length === 0) {
    return (
      <div
        className="p-6 max-w-7xl mx-auto pt-20 text-center"
        style={{ fontFamily: "Funnel, sans-serif", color: "#faba22", backgroundColor: "black" }}
      >
        <h1 className="text-4xl mb-6">No Trainers Available</h1>
        <p style={{ opacity: 0.8 }}>Please check back later.</p>
      </div>
    );
  }

  return (
    <div
      className="p-6 max-w-7xl pt-20 mx-auto"
      style={{ fontFamily: "Funnel, sans-serif", color: "#faba22", backgroundColor: "black" }}
    >
      <h1 className="text-5xl font-bold mb-12 text-center">Our Trainers</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {trainers.map((trainer) => {
          const {
            _id,
            photoURL = "https://via.placeholder.com/400x300?text=No+Image",
            name = "Unnamed Trainer",
            expertise = [], // Changed to array for consistency
            yearsOfExperience = "N/A",
            social = {},
            availableSlots = [],
          } = trainer || {};

          return (
            <div
              key={_id}
              className="border rounded-lg shadow-lg p-6"
              style={{ backgroundColor: "black", color: "#faba22" }}
            >
              <img
                src={photoURL}
                alt={name}
                className="w-full h-56 object-cover rounded-md mb-4"
                onError={(e) => (e.target.src = "https://via.placeholder.com/400x300?text=No+Image")}
              />
              <h2 className="text-xl font-semibold mb-1">{name}</h2>
              {/* Display expertise as a comma-separated string or first item */}
              <p className="mb-2" style={{ opacity: 0.8 }}>
                {Array.isArray(expertise) && expertise.length > 0 ? expertise.join(', ') : "Expertise info not available"}
              </p>
              <p className="mb-3"><strong>Experience:</strong> {yearsOfExperience} years</p>

              <div className="flex gap-3 mb-4">
                {social.facebook && (
                  <a href={social.facebook} target="_blank" rel="noreferrer" className="hover:opacity-75 transition" style={{ color: "#faba22" }}>
                    <FaFacebookF size={20} />
                  </a>
                )}
                {social.twitter && (
                  <a href={social.twitter} target="_blank" rel="noreferrer" className="hover:opacity-75 transition" style={{ color: "#faba22" }}>
                    <FaTwitter size={20} />
                  </a>
                )}
                {social.linkedin && (
                  <a href={social.linkedin} target="_blank" rel="noreferrer" className="hover:opacity-75 transition" style={{ color: "#faba22" }}>
                    <FaLinkedin size={20} />
                  </a>
                )}
                {!social.facebook && !social.twitter && !social.linkedin && (
                  <span style={{ opacity: 0.5, fontStyle: "italic" }}>No social links available</span>
                )}
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                {availableSlots.length > 0 ? (
                  availableSlots.slice(0, 3).map((slot, idx) => (
                    <span
                      key={idx} // Using index as key is okay if slots don't change order or get added/removed. Unique IDs are better if available.
                      className="px-3 py-1 rounded text-sm font-semibold"
                      style={{ backgroundColor: "#faba22", color: "black" }}
                    >
                      {slot.day} {slot.time}
                    </span>
                  ))
                ) : (
                  <span style={{ opacity: 0.7, fontStyle: "italic" }}>No available slots</span>
                )}
              </div>

              {/* Use Link component for client-side navigation */}
              <Link
                to={`/trainers/${_id}`}
                className="block w-full text-center font-semibold py-2 rounded"
                style={{ backgroundColor: "#faba22", color: "black", cursor: "pointer", transition: "background-color 0.3s" }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#d99918")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#faba22")}
              >
                Know More
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllTrainersPage;