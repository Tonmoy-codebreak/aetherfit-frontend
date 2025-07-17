import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { Link } from "react-router";

const fetchTrainers = async () => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/trainers`);
  if (!Array.isArray(res.data)) throw new Error("Invalid data format received");
  return res.data;
};

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
  const { data: trainers = [], isLoading, error } = useQuery({
    queryKey: ["trainers"],
    queryFn: fetchTrainers,
  });

  if (isLoading) return <div className="flex justify-center items-center h-screen bg-zinc-950 text-[#faba22] font-semibold text-xl">Loading trainers...</div>;
  if (error) return <div className="flex justify-center items-center h-screen bg-zinc-950 text-red-500 font-semibold text-xl">Error: {error.message || "Failed to load trainers."}</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-[#faba22] p-6 md:p-10 lg:p-16">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 font-funnel pt-10 text-white">Our Certified Trainers</h1>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto">
        {trainers.map(({ _id, photoURL, fullName, name, expertise = [], skills = [], yearsOfExperience = 0, socialLinks = [], slots = [] }) => {
          const displayName = fullName || name || "Unnamed Trainer";
          const displaySkills = expertise.length ? expertise : skills.length ? skills : ["Fitness Enthusiast"];
          return (
            <div key={_id} className="group relative rounded-2xl bg-zinc-900 overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-zinc-800">
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <img src={photoURL || "https://placehold.co/400x300/363636/DDDDDD?text=No+Photo"} alt={displayName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-5">
                <h2 className="text-xl font-bold text-white mb-2">{displayName}</h2>
                <p className="text-sm text-zinc-400 mb-3">{displaySkills.join(", ")}</p>
                <p className="text-sm text-zinc-300 mb-4">Experience: {yearsOfExperience} years</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {slots.length > 0 ? slots.slice(0, 3).map((slot, idx) => (
                    <span key={idx} className="bg-[#faba22] text-black text-xs px-3 py-1 rounded-full">{slot.slotName || "Slot"}</span>
                  )) : <span className="text-xs text-zinc-500 italic">No slots listed</span>}
                </div>
                <div className="flex justify-between items-center border-t pt-4 border-zinc-700">
                  <Link to={`/trainers/${_id}`} className="bg-[#faba22] text-black px-4 py-2 rounded-lg font-medium hover:bg-black hover:text-[#faba22] transition-all border border-[#faba22]">Know More</Link>
                  <div className="flex gap-3">
                    {socialLinks.map(({ url }, idx) => {
                      const Icon = getSocialIcon(url);
                      return Icon ? (
                        <a key={idx} href={url} target="_blank" rel="noreferrer" className="text-[#faba22] hover:text-yellow-400 transition-transform hover:scale-110">
                          <Icon size={20} />
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
