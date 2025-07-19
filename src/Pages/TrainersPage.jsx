import React, { useEffect } from "react";
import {useQuery} from "@tanstack/react-query";
import useAxios from "../hooks/useAxios";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { Link } from "react-router"; 

const getSocialIcon = (url) => {
  if (!url || typeof url !== "string") return null;
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes("facebook.com")) return FaFacebookF;
  if (lowerUrl.includes("instagram.com")) return FaInstagram;
  if (lowerUrl.includes("twitter.com") || lowerUrl.includes("x.com")) return FaTwitter;
  if (lowerUrl.includes("linkedin.com")) return FaLinkedinIn;
  return null;
};

const AllTrainersPage = () => {
  useEffect(() => {
    document.title = "AetherFit | Trainers";
  }, []);

  const axiosSecure = useAxios();

  const fetchTrainers = async () => {
    const res = await axiosSecure.get(`${import.meta.env.VITE_API_URL}/trainers`);
    if (!Array.isArray(res.data)) throw new Error("Invalid data format received");
    return res.data;
  };

  const { data: trainers = [], isLoading, error } = useQuery({
    queryKey: ["allTrainers"], // Unique query key
    queryFn: fetchTrainers,
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });

  if (isLoading) return <div className="flex justify-center items-center h-screen bg-zinc-950 text-[#faba22] font-semibold text-xl">Loading trainers...</div>;
  if (error) return <div className="flex justify-center items-center h-screen bg-zinc-950 text-red-500 font-semibold text-xl">Error: {error.message || "Failed to load trainers."}</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-[#faba22] p-6 md:p-10 lg:p-16">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 font-funnel pt-10 text-white tracking-wide">
        Meet Our <span className="text-[#faba22]">Elite Trainers</span>
      </h1>
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto">
        {trainers.map(({ _id, photoURL, fullName, name, expertise = [], skills = [], yearsOfExperience = 0, socialLinks = [], slots = [] }) => {
          const displayName = fullName || name || "Unnamed Trainer";
          const displaySkills = expertise.length ? expertise : skills.length ? skills : ["Fitness Enthusiast"];
          return (
            <div key={_id} className="group relative rounded-3xl bg-zinc-900 overflow-hidden shadow-xl
                                     transform transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl
                                     border border-zinc-800 hover:border-[#faba22]">
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <img
                  src={photoURL || "https://placehold.co/400x300/363636/DDDDDD?text=No+Photo"}
                  alt={displayName}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                  onError={(e) => (e.target.src = "https://placehold.co/400x300/363636/DDDDDD?text=No+Photo")}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/70 via-transparent to-transparent"></div>
              </div>

              <div className="p-6 pt-3 relative -mt-12 z-10">
                <h2 className="text-2xl font-bold text-white mb-2 truncate" title={displayName}>{displayName}</h2>
                <p className="text-sm text-zinc-400 mb-3 font-medium">{displaySkills.join(", ")}</p>
                <p className="text-xs text-zinc-300 mb-4 font-light">Experience: <span className="font-semibold text-[#faba22]">{yearsOfExperience}</span> years</p>

                <div className="flex flex-wrap gap-2 mb-5">
                  {slots.length > 0 ? slots.slice(0, 3).map((slot, idx) => (
                    <span key={idx} className="bg-[#faba22] text-zinc-950 text-xs px-3 py-1 rounded-full font-semibold opacity-90
                                           hover:opacity-100 transition-opacity duration-200 cursor-default">
                      {slot.slotName || "Slot"}
                    </span>
                  )) : <span className="text-xs text-zinc-500 italic">No available slots</span>}
                </div>

                <div className="flex justify-between items-center border-t pt-5 border-zinc-700">
                  <Link
                    to={`/trainers/${_id}`}
                    className="bg-[#faba22] text-zinc-950 px-5 py-2.5 rounded-full font-semibold text-sm
                               transition-all duration-300 hover:bg-black hover:text-[#faba22]
                               hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#faba22] focus:ring-opacity-75"
                  >
                    Know More
                  </Link>
                  <div className="flex gap-4">
                    {socialLinks.map(({ url }, idx) => {
                      const Icon = getSocialIcon(url);
                      return Icon ? (
                        <a
                          key={idx}
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-zinc-500 hover:text-[#faba22] transition-transform hover:scale-125 duration-300"
                          title={`Visit ${displayName}'s ${Icon.name.replace('Fa', '')} profile`}
                        >
                          <Icon size={22} />
                        </a>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllTrainersPage;