import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router"; // Keeping original import for useNavigate
import axios from "axios";

// NOTE: Added more benefits to make the cards look more substantial for UI purposes.
const packages = [
  {
    id: "basic",
    name: "Basic Membership",
    price: 10,
    benefits: [
      "Access to gym facilities during regular operating hours.",
      "Access to locker rooms and showers.",
      "Basic fitness tracking via app.",
      "Monthly newsletter with fitness tips.",
    ],
  },
  {
    id: "standard",
    name: "Standard Membership",
    price: 50,
    benefits: [
      "All benefits of the Basic membership.",
      "Unlimited use of cardio and strength training equipment.",
      "Access to all group fitness classes (yoga, spinning, Zumba, HIIT).",
      "One complimentary guest pass per month.",
      "Access to exclusive online workout library.",
    ],
  },
  {
    id: "premium",
    name: "Premium Membership",
    price: 100,
    benefits: [
      "All benefits of the Standard membership.",
      "Two personal training sessions with certified trainers per month.",
      "Full access to additional amenities like sauna, steam room, and hydrotherapy.",
      "20% discounts on all additional services (massage therapy, nutrition counseling, merchandise).",
      "Priority booking for all classes and facilities.",
      "Dedicated membership support.",
    ],
  },
];

const TrainerBookingPage = () => {
  const { trainerId, day, time } = useParams();
  const navigate = useNavigate();

  const [trainer, setTrainer] = useState(null);
  const [classInfo, setClassInfo] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/trainers/${trainerId}`);
        const trainerData = res.data;
        setTrainer(trainerData);

        const decodedTime = decodeURIComponent(time);
        const matchedSlot = trainerData.slots?.find(
          (slot) => slot.day === day && slot.timeRange === decodedTime
        );

        // Keeping the logic exactly as it was: matchedSlot.classInfo
        // The backend's /trainers/:id route should embed classInfo directly here.
        if (matchedSlot && matchedSlot.classInfo) {
          setClassInfo(matchedSlot.classInfo);
        } else {
          setClassInfo(null);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load trainer details.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrainer();
  }, [trainerId, day, time]);

  const handleJoinNow = () => {
    // Keeping the original alert() as requested not to touch logic
    if (!selectedPackage) {
      alert("Please select a membership package.");
      return;
    }

    navigate("/payment", {
      state: {
        trainerId,
        trainerName: trainer?.name,
        slotName: `${day} ${decodeURIComponent(time)}`,
        classId: classInfo?._id,
        className: classInfo?.name,
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
    return (
      <div className="flex justify-center items-center min-h-screen bg-zinc-950">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[#faba22]"></div>
        <p className="text-[#faba22] ml-4 text-lg font-sans">Loading trainer info...</p>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-zinc-950 text-red-500 text-lg font-sans">
        {error}
      </div>
    );
  if (!trainer)
    return (
      <div className="flex justify-center items-center min-h-screen bg-zinc-950 text-[#faba22] text-lg font-sans">
        <p>Trainer not found.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-zinc-950 text-[#faba22] font-sans p-8 sm:p-12 lg:p-16 pt-20">
      <div className="max-w-6xl mx-auto bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 p-8 md:p-12">
        <h1 className="text-5xl md:text-6xl font-bold mb-10 text-center text-white font-funnel drop-shadow-lg">
          Booking with {trainer.name}
        </h1>

        {/* Section: Selected Slot & Class Info (Image Removed, UI Refined) */}
        <section className="mb-12 p-8 bg-zinc-800 rounded-xl shadow-inner border border-zinc-700"> {/* Increased padding for more spacious feel */}
          <h2 className="text-3xl font-semibold mb-6 text-white font-funnel text-center">Session Details</h2> {/* Increased mb for title */}
          <div className="space-y-4 text-center md:text-left"> {/* Centered text for smaller screens, left-aligned for md+ */}
            <p className="text-zinc-300 text-xl"> {/* Increased text size */}
              <span className="font-bold text-[#faba22]">Selected Slot: </span>
              <span className="text-white">{day} {decodeURIComponent(time)}</span>
            </p>
            <p className="text-zinc-300 text-xl"> {/* Increased text size */}
              <span className="font-bold text-[#faba22]">Class: </span>
              <span className="text-white">{classInfo?.name || "No Class Assigned"}</span>
            </p>
            {/* Only show difficulty and duration if classInfo is available and has these properties */}
            {classInfo?.difficulty && classInfo?.durationMinutes && (
              <>
                <p className="text-zinc-300 text-xl"> {/* Increased text size */}
                  <span className="font-bold text-[#faba22]">Difficulty: </span>
                  <span className="text-white">{classInfo.difficulty}</span>
                </p>
                <p className="text-zinc-300 text-xl"> {/* Increased text size */}
                  <span className="font-bold text-[#faba22]">Duration: </span>
                  <span className="text-white">{classInfo.durationMinutes} minutes</span>
                </p>
              </>
            )}
          </div>
          {/* Class Details moved to be a full-width block below main session details */}
          {classInfo?.details && (
            <div className="mt-8 pt-6 border-t border-zinc-700 text-center md:text-left"> {/* Increased mt/pt for separation, centered text for small screens */}
              <h3 className="text-2xl font-semibold text-white mb-3">Class Description:</h3> {/* Larger heading for description */}
              <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap text-lg"> {/* Increased text size for details */}
                {classInfo.details}
              </p>
            </div>
          )}
        </section>

        {/* Section: Select Membership Package */}
        <section className="mb-12">
          <h2 className="text-4xl font-funnel font-bold text-white mb-8 text-center drop-shadow-lg">
            Choose Your Membership
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> {/* Responsive grid for packages */}
            {packages.map((pkg) => (
              <label
                key={pkg.id}
                className={`
                  relative block p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 flex flex-col h-full
                  ${
                    selectedPackage?.id === pkg.id
                      ? "border-[#faba22] bg-yellow-900/20 shadow-xl ring-2 ring-[#faba22]"
                      : "border-zinc-700 bg-zinc-800 hover:border-[#faba22] hover:shadow-lg"
                  }
                `}
              >
                {/* Header for title and radio button */}
                <div className="flex justify-between items-start w-full">
                  {/* Package Name (Title) */}
                  <strong className="text-white text-2xl font-semibold leading-tight mr-4">
                    {pkg.name}
                  </strong>
                  {/* Radio Button on the right */}
                  <input
                    type="radio"
                    name="package"
                    value={pkg.id}
                    checked={selectedPackage?.id === pkg.id}
                    onChange={() => setSelectedPackage(pkg)}
                    className="accent-[#faba22] w-6 h-6 transform scale-125 flex-shrink-0"
                  />
                </div>

                {/* Price below the title/radio row */}
                <span className="text-[#faba22] font-bold text-3xl mt-2 mb-6 block">
                  ${pkg.price}
                </span>

                {/* Benefits List */}
                <ul className="list-disc list-inside text-zinc-300 text-base space-y-2 flex-grow">
                  {pkg.benefits.map((b, i) => (
                    <li key={i} className="flex items-start">
                      <span className="mr-2 text-[#faba22]">&#x2022;</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </label>
            ))}
          </div>
        </section>

        {/* Join Now Button */}
        <button
          onClick={handleJoinNow}
          className="w-full py-4 rounded-lg bg-[#faba22] text-black font-bold text-xl
                     hover:bg-yellow-500 transition-colors duration-300 shadow-lg hover:shadow-xl
                     transform hover:-translate-y-1"
        >
          Join Now
        </button>
      </div>
    </div>
  );
};

export default TrainerBookingPage;
