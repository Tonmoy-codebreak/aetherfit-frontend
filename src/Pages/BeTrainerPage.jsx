import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { useAuth } from "../AuthProvider/useAuth";
import Select from "react-select";
import Swal from "sweetalert2";

const skillsList = [
  "Strength Training",
  "HIIT",
  "Cardio",
  "Yoga",
  "Weight Loss",
  "Nutrition",
];

const hourOptions = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: i + 1,
}));

const ampmOptions = [
  { value: "AM", label: "AM" },
  { value: "PM", label: "PM" },
];

const daysOptions = [
  { value: "Sun", label: "Sun" },
  { value: "Mon", label: "Mon" },
  { value: "Tue", label: "Tue" },
  { value: "Wed", label: "Wed" },
  { value: "Thu", label: "Thu" },
  { value: "Fri", label: "Fri" },
  { value: "Sat", label: "Sat" },
];

const socialPlatforms = [
  { value: "Facebook", label: "Facebook" },
  { value: "Instagram", label: "Instagram" },
  { value: "Twitter", label: "Twitter" },
];

const experienceOptions = Array.from({ length: 30 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1}`,
}));

const BeTrainerPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [mongoUser, setMongoUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    photoURL: "",
    skills: [],
    availableDays: [],
    fromHour: hourOptions[6],
    fromAMPM: ampmOptions[0],
    toHour: hourOptions[9],
    toAMPM: ampmOptions[0],
    yearsOfExperience: experienceOptions[0],
    additionalInfo: "",
    socialLinks: [
      { platform: null, url: "" },
      { platform: null, url: "" },
    ],
  });

  useEffect(() => {
    if (!user?.email) return;

    axios
      .get(`${import.meta.env.VITE_API_URL}/users?email=${user.email}`)
      .then(({ data }) => {
        setMongoUser(data);
        setFormData((prev) => ({
          ...prev,
          fullName: data.name || user.displayName || "",
          email: data.email || user.email || "",
          photoURL: data.photoURL || user.photoURL || "",
        }));
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
      });
  }, [user]);

  const handleCheckboxChange = (key, value) => {
    setFormData((prev) => {
      const list = prev[key].includes(value)
        ? prev[key].filter((item) => item !== value)
        : [...prev[key], value];
      return { ...prev, [key]: list };
    });
  };

  const handleSocialPlatformChange = (index, selectedOption) => {
    setFormData((prev) => {
      const newSocialLinks = [...prev.socialLinks];
      const selectedValue = selectedOption ? selectedOption.value : null;

      const otherIndex = index === 0 ? 1 : 0;
      if (
        selectedValue &&
        newSocialLinks[otherIndex].platform === selectedValue
      ) {
        Swal.fire(
          "Warning",
          `You already selected ${selectedOption.label} in the other slot.`,
          "warning"
        );
        return prev;
      }

      newSocialLinks[index].platform = selectedValue;
      return { ...prev, socialLinks: newSocialLinks };
    });
  };

  const handleSocialUrlChange = (index, url) => {
    setFormData((prev) => {
      const newSocialLinks = [...prev.socialLinks];
      newSocialLinks[index].url = url;
      return { ...prev, socialLinks: newSocialLinks };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mongoUser?._id) {
      Swal.fire("Error", "User information not loaded. Please refresh the page.", "error");
      return;
    }

    if (formData.skills.length === 0) {
      Swal.fire("Error", "Please select at least one skill.", "error");
      return;
    }
    if (formData.availableDays.length === 0) {
      Swal.fire("Error", "Please select at least one available day.", "error");
      return;
    }
    
    const invalidSocialLinks = formData.socialLinks.some(link => link.platform && link.url.trim() === "");
    if (invalidSocialLinks) {
      Swal.fire("Error", "Please enter URLs for all selected social platforms.", "error");
      return;
    }

    const timeString = `${formData.fromHour.value} ${formData.fromAMPM.value} - ${formData.toHour.value} ${formData.toAMPM.value}`;

    const payload = {
      ...formData,
      availableDays: formData.availableDays.map((item) => item.value),
      fromHour: formData.fromHour.value,
      fromAMPM: formData.fromAMPM.value,
      toHour: formData.toHour.value,
      toAMPM: formData.toAMPM.value,
      availableTime: timeString,
      yearsOfExperience: formData.yearsOfExperience.value,
      userId: mongoUser._id,
      status: "pending", // Always submit as pending
      socialLinks: formData.socialLinks.filter(
        (link) => link.platform && link.url.trim() !== ""
      ),
    };

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/trainer-application`,
        payload
      );

      if (data?.insertedId) {
        await axios.patch(`${import.meta.env.VITE_API_URL}/users/${mongoUser._id}`, {
          trainerApplicationStatus: "pending",
        });

        Swal.fire("Success", "Your trainer application has been submitted.", "success").then(() => {
          navigate("/");
        });
      }
    } catch (err) {
      console.error("Application failed", err);
      Swal.fire("Error", "Failed to apply as trainer.", "error");
    }
  };

  const getAvailableSocialPlatforms = (currentIndex) => {
    return socialPlatforms.map((platform) => ({
      ...platform,
      isDisabled: formData.socialLinks.some(
        (link, idx) => idx !== currentIndex && link.platform === platform.value
      ),
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white font-inter  p-4 sm:p-6 lg:p-8">
      {/* Custom styles for react-select components */}
      <style>{`
        .react-select__control {
          background-color: #27272a !important; /* zinc-800 */
          border-color: #3f3f46 !important; /* zinc-700 */
          color: #fff !important;
          padding: 0.5rem 0.75rem; /* py-3 px-4 */
          border-radius: 0.5rem; /* rounded-md */
          font-size: 1.125rem; /* text-lg */
          min-height: 56px; /* Adjust height */
        }
        .react-select__control--is-focused {
          border-color: #faba22 !important; /* faba22 */
          box-shadow: 0 0 0 2px #faba22 !important; /* ring-2 ring-[#faba22] */
        }
        .react-select__single-value,
        .react-select__placeholder {
          color: #fff !important;
        }
        .react-select__placeholder {
          color: #a1a1aa !important; /* zinc-400 */
        }
        .react-select__menu {
          background-color: #27272a !important; /* zinc-800 */
          border-radius: 0.5rem;
          z-index: 100;
        }
        .react-select__option {
          background-color: #27272a !important; /* zinc-800 */
          color: #fff !important;
          font-size: 1.125rem; /* text-lg */
          padding: 0.75rem 1.25rem; /* py-3 px-5 */
        }
        .react-select__option--is-focused,
        .react-select__option--is-selected {
          background-color: #faba22 !important; /* faba22 */
          color: #000 !important; /* black */
        }
        .react-select__multi-value {
          background-color: #faba22 !important; /* faba22 */
          border-radius: 0.375rem; /* rounded-md */
          color: #000 !important;
        }
        .react-select__multi-value__label {
          color: #000 !important;
          font-size: 1rem; /* text-base */
        }
        .react-select__multi-value__remove {
          color: #000 !important;
        }
        .react-select__multi-value__remove:hover {
          background-color: #d97706 !important; /* yellow-700 */
          color: #000 !important;
        }
        .react-select__indicator-separator {
          background-color: #52525b !important; /* zinc-600 */
        }
        .react-select__indicator {
          color: #a1a1aa !important; /* zinc-400 */
        }
      `}</style>

      <form onSubmit={handleSubmit} className="w-full max-w-7xl mx-auto bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 p-8 md:p-12 space-y-10">
        {formData.photoURL && (
          <div className="flex justify-center mb-8">
            <img
              src={formData.photoURL}
              alt="Profile Preview"
              className="w-36 h-36 rounded-full object-cover border-4 border-[#faba22] shadow-lg"
            />
          </div>
        )}

        <h1 className="text-4xl md:text-5xl font-funnel font-bold mb-12 text-center text-[#faba22] drop-shadow-lg">
          Become a Trainer
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Column */}
          <div className="space-y-8 bg-zinc-800 p-8 rounded-xl shadow-inner border border-zinc-700">
            <h2 className="text-3xl font-semibold text-white mb-6">Personal Details</h2>
            <div>
              <label className="block mb-3 font-semibold text-lg text-zinc-300">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                readOnly
                className="w-full px-5 py-4 bg-zinc-700 rounded-lg opacity-80 cursor-not-allowed text-white text-lg font-medium border border-zinc-600"
              />
            </div>

            <div>
              <label className="block mb-3 font-semibold text-lg text-zinc-300">Email</label>
              <input
                type="email"
                value={formData.email}
                readOnly
                className="w-full px-5 py-4 bg-zinc-700 rounded-lg opacity-80 cursor-not-allowed text-white text-lg font-medium border border-zinc-600"
              />
            </div>

            <div>
              <label className="block mb-3 font-semibold text-lg text-zinc-300">Available Days</label>
              <Select
                isMulti
                options={daysOptions}
                value={formData.availableDays}
                onChange={(value) => setFormData({ ...formData, availableDays: value })}
                placeholder="Select days you are available"
                classNamePrefix="react-select"
                required
              />
            </div>

            <div>
              <label className="block mb-3 font-semibold text-lg text-zinc-300">Social Links (Choose up to 2)</label>
              {[0, 1].map((idx) => (
                <div key={idx} className="mb-6 space-y-3">
                  <Select
                    options={getAvailableSocialPlatforms(idx)}
                    value={
                      formData.socialLinks[idx].platform
                        ? socialPlatforms.find(
                            (p) => p.value === formData.socialLinks[idx].platform
                          )
                        : null
                    }
                    onChange={(selectedOption) =>
                      handleSocialPlatformChange(idx, selectedOption)
                    }
                    placeholder={`Select platform #${idx + 1}`}
                    classNamePrefix="react-select"
                  />
                  <input
                    type="url"
                    placeholder={`Enter ${
                      formData.socialLinks[idx].platform || "social"
                    } URL`}
                    value={formData.socialLinks[idx].url}
                    onChange={(e) => handleSocialUrlChange(idx, e.target.value)}
                    className="w-full px-5 py-4 bg-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#faba22] border border-zinc-700 text-lg"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8 bg-zinc-800 p-8 rounded-xl shadow-inner border border-zinc-700">
            <h2 className="text-3xl font-semibold text-white mb-6">Professional Details</h2>
            <div>
              <label className="block mb-3 font-semibold text-lg text-zinc-300">Skills</label>
              <div className="flex flex-wrap gap-5 p-4 bg-zinc-700 rounded-lg border border-zinc-600">
                {skillsList.map((skill) => (
                  <label key={skill} className="flex items-center gap-3 text-lg text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.skills.includes(skill)}
                      onChange={() => handleCheckboxChange("skills", skill)}
                      className="accent-[#faba22] w-5 h-5 transform scale-110"
                    />
                    <span>{skill}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block mb-3 font-semibold text-lg text-zinc-300">Available Time Range</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="text-base mb-2 font-medium text-zinc-400">From</label>
                  <div className="flex gap-3">
                    <Select
                      options={hourOptions}
                      value={formData.fromHour}
                      onChange={(value) => setFormData({ ...formData, fromHour: value })}
                      placeholder="Hour"
                      classNamePrefix="react-select"
                      required
                    />
                    <Select
                      options={ampmOptions}
                      value={formData.fromAMPM}
                      onChange={(value) => setFormData({ ...formData, fromAMPM: value })}
                      placeholder="AM/PM"
                      classNamePrefix="react-select"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-base mb-2 font-medium text-zinc-400">To</label>
                  <div className="flex gap-3">
                    <Select
                      options={hourOptions}
                      value={formData.toHour}
                      onChange={(value) => setFormData({ ...formData, toHour: value })}
                      placeholder="Hour"
                      classNamePrefix="react-select"
                      required
                    />
                    <Select
                      options={ampmOptions}
                      value={formData.toAMPM}
                      onChange={(value) => setFormData({ ...formData, toAMPM: value })}
                      placeholder="AM/PM"
                      classNamePrefix="react-select"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block mb-3 font-semibold text-lg text-zinc-300">Years of Experience</label>
              <Select
                options={experienceOptions}
                value={formData.yearsOfExperience}
                onChange={(value) =>
                  setFormData({ ...formData, yearsOfExperience: value })
                }
                placeholder="Select years of experience"
                classNamePrefix="react-select"
                required
              />
            </div>

            <div>
              <label className="block mb-3 font-semibold text-lg text-zinc-300">Trainer Bio</label>
              <textarea
                value={formData.additionalInfo}
                onChange={(e) =>
                  setFormData({ ...formData, additionalInfo: e.target.value })
                }
                className="w-full px-5 py-4 bg-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#faba22] border border-zinc-700 text-lg resize-y"
                rows="6"
                placeholder="Describe yourself as a trainer, your philosophy, and what you offer..."
                required
              ></textarea>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-4 rounded-xl bg-[#faba22] text-black font-bold text-xl
                      hover:bg-yellow-500 transition-all duration-300 shadow-lg hover:shadow-xl
                      transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          Apply to Be a Trainer
        </button>
      </form>
    </div>
  );
};

export default BeTrainerPage;
