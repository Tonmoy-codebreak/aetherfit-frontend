import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import Swal from "sweetalert2";
import { useAuth } from "../AuthProvider/useAuth";
import useAxios from "../hooks/useAxios";

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
  useEffect(() => {
    document.title = "AetherFit | Book Trainer";
  }, []);

  const { trainerId, day, time } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosSecure = useAxios();

  const [trainer, setTrainer] = useState(null);
  const [classInfo, setClassInfo] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null);

  useEffect(() => {
    const fetchTrainerAndClass = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get(`${import.meta.env.VITE_API_URL}/trainers/${trainerId}`);
        const trainerData = res.data;
        setTrainer(trainerData);

        const decodedTime = decodeURIComponent(time);
        const matchedSlot = trainerData.slots?.find(
          (slot) => slot.day === day && slot.timeRange === decodedTime
        );

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

    const fetchUserRole = async () => {
      if (!user?.email) {
        setCurrentUserRole(null);
        return;
      }
      try {
        const userRes = await axiosSecure.get(`${import.meta.env.VITE_API_URL}/users?email=${user.email}`);
        setCurrentUserRole(userRes.data.role);
      } catch (err) {
        console.error("Error fetching user role:", err);
        setCurrentUserRole(null);
      }
    };

    fetchTrainerAndClass();
    fetchUserRole();
  }, [trainerId, day, time, user?.email]);

  const handleJoinNow = () => {
    if (!selectedPackage) {
      Swal.fire({
        icon: "warning",
        title: "No Package Selected",
        text: "Please select a membership package before proceeding.",
        background: "black",
        color: "#faba22",
        confirmButtonColor: "#faba22",
      });
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
          name: user?.displayName || "N/A",
          email: user?.email || "N/A",
          phone: "Optional",
        },
      },
    });
  };

  const isJoinNowDisabled = currentUserRole === "admin" || currentUserRole === "trainer";

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
    <div className="min-h-screen bg-zinc-950 text-[#faba22] font-sans p-4 sm:p-6 md:p-10 pt-24">
      <div className="max-w-6xl mx-auto rounded-2xl shadow-2xl p-4 sm:p-8 md:p-12">

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 text-center text-white font-funnel drop-shadow-lg leading-tight">
          Booking with <span className="text-[#faba22]">{trainer.name}</span>
        </h1>

        <section className="mb-10 p-4 sm:p-6 bg-zinc-800 rounded-xl shadow-inner border border-zinc-700">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-white font-funnel text-center">
            Session Details
          </h2>

          <div className="space-y-4 text-center sm:text-left">
            <p className="text-zinc-300 text-base sm:text-lg md:text-xl">
              <span className="font-bold text-[#faba22]">Selected Slot: </span>
              <span className="text-white">{day} {decodeURIComponent(time)}</span>
            </p>
            <p className="text-zinc-300 text-base sm:text-lg md:text-xl">
              <span className="font-bold text-[#faba22]">Class: </span>
              <span className="text-white">{classInfo?.name || "No Class Assigned"}</span>
            </p>
            {classInfo?.difficulty && classInfo?.durationMinutes && (
              <>
                <p className="text-zinc-300 text-base sm:text-lg md:text-xl">
                  <span className="font-bold text-[#faba22]">Difficulty: </span>
                  <span className="text-white">{classInfo.difficulty}</span>
                </p>
                {/* <p className="text-zinc-300 text-base sm:text-lg md:text-xl">
                  <span className="font-bold text-[#faba22]">Duration: </span>
                  <span className="text-white">{classInfo.durationMinutes} minutes</span>
                </p> */}
              </>
            )}
          </div>

          {classInfo?.details && (
            <div className="mt-6 pt-4 border-t border-zinc-700 text-center sm:text-left">
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3">Class Description:</h3>
              <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap text-base sm:text-lg">{classInfo.details}</p>
            </div>
          )}
        </section>

        <section className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-funnel font-bold text-white mb-6 text-center drop-shadow-lg">
            Choose Your Membership
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <label
                key={pkg.id}
                className={`relative block p-5 rounded-xl border-2 cursor-pointer transition-all flex flex-col h-full
                  ${selectedPackage?.id === pkg.id
                    ? "border-[#faba22] bg-yellow-900/20 shadow-xl ring-2 ring-[#faba22]"
                    : "border-zinc-700 bg-zinc-800 hover:border-[#faba22] hover:shadow-lg"
                  }`}
              >
                <div className="flex justify-between items-center mb-4">
                  <strong className="text-white text-lg sm:text-xl">{pkg.name}</strong>
                  <input
                    type="radio"
                    name="package"
                    value={pkg.id}
                    checked={selectedPackage?.id === pkg.id}
                    onChange={() => setSelectedPackage(pkg)}
                    className="accent-[#faba22] w-6 h-6"
                  />
                </div>

                <span className="text-[#faba22] font-bold text-2xl mb-4">${pkg.price}</span>

                <ul className="space-y-2 text-zinc-300 text-sm sm:text-base flex-grow">
                  {pkg.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#faba22] mt-1">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </label>
            ))}
          </div>
        </section>

        <button
          onClick={handleJoinNow}
          disabled={isJoinNowDisabled}
          className={`w-full py-4 rounded-lg font-bold text-lg sm:text-xl transition duration-300
            ${isJoinNowDisabled
              ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
              : "bg-[#faba22] text-black hover:bg-yellow-500 hover:shadow-xl"
            }`}
        >
          {isJoinNowDisabled ? "Not Available for Trainers/Admins" : "Join Now"}
        </button>
      </div>
    </div>
  );
};

export default TrainerBookingPage;
