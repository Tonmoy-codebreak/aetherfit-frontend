import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";

const packages = [
  {
    id: "basic",
    name: "Basic Membership",
    price: 10,
    benefits: [
      "Access to gym facilities during regular operating hours.",
      "Access to locker rooms and showers.",
    ],
  },
  {
    id: "standard",
    name: "Standard Membership",
    price: 50,
    benefits: [
      "All benefits of the basic membership.",
      "Use of cardio and strength training equipment.",
      "Access to group fitness classes such as yoga, spinning, and Zumba.",
    ],
  },
  {
    id: "premium",
    name: "Premium Membership",
    price: 100,
    benefits: [
      "All benefits of the standard membership.",
      "Access to personal training sessions with certified trainers.",
      "Use of additional amenities like a sauna or steam room.",
      "Discounts on additional services such as massage therapy or nutrition counseling.",
    ],
  },
];

const TrainerBookingPage = () => {
  const { trainerId, day, time } = useParams();
  const navigate = useNavigate();

  const [trainer, setTrainer] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/trainers/${trainerId}`);
        setTrainer(res.data);
      } catch (err) {
        setError("Failed to load trainer details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainer();
  }, [trainerId]);

  const selectedSlot = trainer?.availableSlots?.find(
    (slot) => slot.day === day && slot.time === decodeURIComponent(time)
  );

  const selectedClassName = selectedSlot?.className || "No Class Assigned";

  const handleJoinNow = () => {
    if (!selectedPackage) {
      alert("Please select a membership package.");
      return;
    }

    navigate("/payment", {
      state: {
        trainerId,
        trainerName: trainer?.name,
        slotName: `${day} ${decodeURIComponent(time)}`,
        className: selectedClassName,
        packageId: selectedPackage.id,
        packageName: selectedPackage.name,
        packagePrice: selectedPackage.price,
        userInfo: {
          name: "Fetch from context/auth",
          email: "Fetch from context/auth",
          phone: "Optional",
        },
      },
    });
  };

  if (loading)
    return <p className="text-yellow-400 font-semibold text-center mt-20">Loading trainer info...</p>;

  if (error)
    return <p className="text-red-600 font-semibold text-center mt-20">{error}</p>;

  if (!trainer)
    return <p className="text-yellow-400 font-semibold text-center mt-20">Trainer not found.</p>;

  return (
    <div className="max-w-lg mx-auto mt-20 p-6 bg-black rounded-md font-sans">
      <h1 className="text-3xl font-bold text-[#faba22] text-center mb-6">
        Booking with {trainer.name}
      </h1>

      <p className="text-white mb-4">
        <span className="font-semibold text-[#faba22]">Selected Slot:</span> {day} {decodeURIComponent(time)}
        <br />
        <span className="font-semibold text-[#faba22]">Class:</span> {selectedClassName}
      </p>
{/* 
      <div className="mb-8">

        <ul className="list-disc list-inside text-white">
          {trainer.classes && trainer.classes.length > 0 ? (
            trainer.classes.map((cls, i) => <li key={i}>{cls}</li>)
          ) : (
            <li>General Fitness Training</li>
          )}
        </ul>
      </div> */}

      <div>
        <h2 className="text-2xl font-semibold text-[#faba22] mb-4">Select Membership Package</h2>
        <div>
          {packages.map((pkg) => (
            <label
              key={pkg.id}
              className={`block p-4 mb-4 rounded border cursor-pointer transition ${
                selectedPackage?.id === pkg.id
                  ? "border-[#faba22] bg-yellow-900"
                  : "border-gray-600 hover:border-[#faba22]"
              }`}
            >
              <input
                type="radio"
                name="package"
                value={pkg.id}
                checked={selectedPackage?.id === pkg.id}
                onChange={() => setSelectedPackage(pkg)}
                className="mr-3 accent-[#faba22]"
              />
              <strong className="text-white text-lg">{pkg.name}</strong>{" "}
              <span className="text-[#faba22] font-semibold">${pkg.price}</span>

              <ul className="mt-2 list-disc list-inside text-white text-sm opacity-80">
                {pkg.benefits.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={handleJoinNow}
        className="mt-8 w-full py-3 rounded bg-[#faba22] text-black font-bold text-lg hover:bg-yellow-600 transition-colors"
      >
        Join Now
      </button>
    </div>
  );
};

export default TrainerBookingPage;
