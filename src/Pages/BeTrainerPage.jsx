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
  // Removed: const [applications, setApplications] = useState([]); // Not needed if not checking pending/rejected applications
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
        // Removed: return axios.get(`${import.meta.env.VITE_API_URL}/trainer-applications?email=${data.email}`);
      })
      // Removed: .then(({ data }) => { setApplications(data); })
      .catch((err) => {
        console.error("Error fetching user data:", err); // Adjusted error message
      });
  }, [user]);

  // Removed: const pendingApplication = applications.find((app) => app.status === "pending");
  // Removed: const rejectedApplications = applications.filter((app) => app.status === "rejected").sort((a, b) => (a._id > b._id ? -1 : 1));

  // Removed: This entire useEffect block that triggered the SweetAlert
  /*
  useEffect(() => {
    if (rejectedApplications.length > 0) {
      const latestRejectedApp = rejectedApplications[0];
      const displayedRejections = JSON.parse(localStorage.getItem('displayedRejections') || '{}');

      if (!displayedRejections[latestRejectedApp._id]) {
        Swal.fire({
          icon: "info",
          title: "Trainer Application Rejected",
          html: `<p>${latestRejectedApp.feedback || "No feedback provided."}</p>`,
        }).then(() => {
          displayedRejections[latestRejectedApp._id] = true;
          localStorage.setItem('displayedRejections', JSON.stringify(displayedRejections));
        });
      }
    }
  }, [rejectedApplications]);
  */

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
        // You might still want to update the user's status in your DB
        // to reflect they have a pending application, even if the frontend
        // doesn't block them from submitting more. This is up to your backend logic.
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
    <div className="max-w-6xl mx-auto p-6 pt-20 bg-black min-h-screen text-[#faba22]">
      {formData.photoURL && (
        <div className="flex justify-center mb-8">
          <img
            src={formData.photoURL}
            alt="Profile Preview"
            className="w-32 h-32 rounded-full object-cover border-4 border-[#faba22]"
          />
        </div>
      )}

      <h1 className="text-5xl font-funnel font-bold mb-12 text-center">
        Become a Trainer
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1 space-y-8">
          <div>
            <label className="block mb-3 font-semibold text-lg">Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              readOnly
              className="w-full px-5 py-4 bg-white rounded-md opacity-80 cursor-not-allowed text-[#faba22] text-lg font-medium"
            />
          </div>

          <div>
            <label className="block mb-3 font-semibold text-lg">Email</label>
            <input
              type="email"
              value={formData.email}
              readOnly
              className="w-full px-5 py-4 bg-zinc-900 rounded-md opacity-80 cursor-not-allowed text-[#faba22] text-lg font-medium"
            />
          </div>

          <div>
            <label className="block mb-3 font-semibold text-lg">Available Days</label>
            <Select
              isMulti
              options={daysOptions}
              value={formData.availableDays}
              onChange={(value) => setFormData({ ...formData, availableDays: value })}
              className="text-black"
              classNamePrefix="react-select"
            />
          </div>

          <div>
            <label className="block mb-3 font-semibold text-lg">Social Links (Choose up to 2)</label>
            {[0, 1].map((idx) => (
              <div key={idx} className="mb-6 flex flex-col gap-2">
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
                  className="px-4 py-3 rounded-md bg-zinc-900 text-[#faba22]"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 space-y-8">
          <div>
            <label className="block mb-3 font-semibold text-lg">Skills</label>
            <div className="flex flex-wrap gap-5">
              {skillsList.map((skill) => (
                <label key={skill} className="flex items-center gap-3 text-lg">
                  <input
                    type="checkbox"
                    checked={formData.skills.includes(skill)}
                    onChange={() => handleCheckboxChange("skills", skill)}
                    className="accent-[#faba22] w-5 h-5"
                  />
                  <span>{skill}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-3 font-semibold text-lg">Available Time</label>
            <div className="flex gap-6">
              <div className="flex flex-col flex-1">
                <label className="text-sm mb-1 font-medium">From</label>
                <div className="flex gap-3">
                  <Select
                    options={hourOptions}
                    value={formData.fromHour}
                    onChange={(value) => setFormData({ ...formData, fromHour: value })}
                    className="flex-1 text-black"
                    classNamePrefix="react-select"
                  />
                  <Select
                    options={ampmOptions}
                    value={formData.fromAMPM}
                    onChange={(value) => setFormData({ ...formData, fromAMPM: value })}
                    className="flex-1 text-black"
                    classNamePrefix="react-select"
                  />
                </div>
              </div>

              <div className="flex flex-col flex-1">
                <label className="text-sm mb-1 font-medium">To</label>
                <div className="flex gap-3">
                  <Select
                    options={hourOptions}
                    value={formData.toHour}
                    onChange={(value) => setFormData({ ...formData, toHour: value })}
                    className="flex-1 text-black"
                    classNamePrefix="react-select"
                  />
                  <Select
                    options={ampmOptions}
                    value={formData.toAMPM}
                    onChange={(value) => setFormData({ ...formData,toAMPM: value })}
                    className="flex-1 text-black"
                    classNamePrefix="react-select"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block mb-3 font-semibold text-lg">Years of Experience</label>
            <Select
              options={experienceOptions}
              value={formData.yearsOfExperience}
              onChange={(value) =>
                setFormData({ ...formData, yearsOfExperience: value })
              }
              className="text-black"
              classNamePrefix="react-select"
            />
          </div>

          <div>
            <label className="block mb-3 font-semibold text-lg">Trainer Bio</label>
            <textarea
              value={formData.additionalInfo}
              onChange={(e) =>
                setFormData({ ...formData, additionalInfo: e.target.value })
              }
              className="w-full px-5 py-4 bg-zinc-900 rounded-md text-[#faba22]"
              rows="5"
              placeholder="Describe yourself as a trainer..."
            ></textarea>
          </div>

          <button
            type="submit"
            // Removed: disabled={!!pendingApplication}
            className={`w-full bg-[#faba22] hover:bg-black hover:text-[#faba22] border-2 border-[#faba22]
              text-black font-bold py-4 rounded-md transition`}
          >
            Apply
          </button>
        </div>
      </form>
    </div>
  );
};

export default BeTrainerPage;