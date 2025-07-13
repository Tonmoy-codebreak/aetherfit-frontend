import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { useAuth } from "../AuthProvider/useAuth";

const skillsList = ["Strength Training", "HIIT", "Cardio", "Yoga", "Weight Loss", "Nutrition"];
const daysList = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const BeTrainerPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    age: "",
    photoURL: "",
    skills: [],
    availableDays: [],
    availableTimeFrom: "",
    availableTimeTo: "",
    additionalInfo: "",
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || "",
        email: user.email || "",
        photoURL: user.photoURL || "",
      }));
    }
  }, [user]);

  const handleCheckboxChange = (key, value) => {
    setFormData(prev => {
      const list = prev[key].includes(value)
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value];
      return { ...prev, [key]: list };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const availableTime = `${formData.availableTimeFrom} - ${formData.availableTimeTo}`;

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/trainer-application`, {
        ...formData,
        availableTime,
        userId: user._id,
        status: "pending",
      });
      if (data?.insertedId) {
        await axios.patch(`${import.meta.env.VITE_API_URL}/users/${user._id}`, { trainerApplicationStatus: "pending" });
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Application failed", err);
      alert("Failed to apply as trainer.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 pt-20 text-[#faba22] bg-black min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center font-funnel">Become a Trainer</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 font-semibold">Full Name</label>
          <input
            type="text"
            value={formData.fullName}
            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full px-4 py-3 bg-zinc-900 rounded focus:outline-none focus:ring-2 focus:ring-[#faba22]"
            required
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold">Email</label>
          <input
            type="email"
            value={formData.email}
            readOnly
            className="w-full px-4 py-3 bg-zinc-900 rounded opacity-70 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold">Age</label>
          <input
            type="number"
            value={formData.age}
            onChange={e => setFormData({ ...formData, age: e.target.value })}
            className="w-full px-4 py-3 bg-zinc-900 rounded focus:outline-none focus:ring-2 focus:ring-[#faba22]"
            required
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold">Profile Image URL</label>
          <input
            type="url"
            value={formData.photoURL}
            onChange={e => setFormData({ ...formData, photoURL: e.target.value })}
            className="w-full px-4 py-3 bg-zinc-900 rounded focus:outline-none focus:ring-2 focus:ring-[#faba22]"
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold">Skills</label>
          <div className="flex flex-wrap gap-4">
            {skillsList.map(skill => (
              <label key={skill} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.skills.includes(skill)}
                  onChange={() => handleCheckboxChange("skills", skill)}
                  className="accent-[#faba22]"
                />
                {skill}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block mb-2 font-semibold">Available Days</label>
          <div className="flex flex-wrap gap-4">
            {daysList.map(day => (
              <label key={day} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.availableDays.includes(day)}
                  onChange={() => handleCheckboxChange("availableDays", day)}
                  className="accent-[#faba22]"
                />
                {day}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-2 font-semibold">Available Time</label>
          <div className="flex gap-4">
            <div className="flex flex-col flex-1">
              <label className="text-sm mb-1">From</label>
              <input
                type="time"
                value={formData.availableTimeFrom}
                onChange={e => setFormData({ ...formData, availableTimeFrom: e.target.value })}
                className="w-full px-4 py-3 bg-white rounded focus:outline-none focus:ring-2 focus:ring-[#faba22]"
                required
              />
            </div>
            <div className="flex flex-col flex-1">
              <label className="text-sm mb-1">To</label>
              <input
                type="time"
                value={formData.availableTimeTo}
                onChange={e => setFormData({ ...formData, availableTimeTo: e.target.value })}
                className="w-full px-4 py-3 bg-white rounded focus:outline-none focus:ring-2 focus:ring-[#faba22]"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block mb-2 font-semibold">Additional Info</label>
          <textarea
            value={formData.additionalInfo}
            onChange={e => setFormData({ ...formData, additionalInfo: e.target.value })}
            className="w-full px-4 py-3 bg-zinc-900 rounded focus:outline-none focus:ring-2 focus:ring-[#faba22]"
            rows="4"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-[#faba22] text-black font-bold py-3 rounded hover:bg-black hover:text-[#faba22] border border-[#faba22] transition"
        >
          Apply
        </button>
      </form>
    </div>
  );
};

export default BeTrainerPage;
