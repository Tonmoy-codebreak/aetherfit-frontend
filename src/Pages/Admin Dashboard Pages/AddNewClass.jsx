import React, { useState } from "react";
import Swal from "sweetalert2";
import useAxios from "../../hooks/useAxios";
import { FaPlusCircle, FaBook, FaClock, FaChartLine, FaEnvelope, FaImage, FaInfoCircle } from 'react-icons/fa';

const AddNewClass = () => {
  const axios = useAxios();

  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [trainerEmails, setTrainerEmails] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageSize, setImageSize] = useState(""); // New state for image size
  const [imageSizeWarning, setImageSizeWarning] = useState(""); // New state for image size warning
  const [loading, setLoading] = useState(false);

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });

  // Helper function to format file size
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setImageSize(formatBytes(file.size)); // Set the formatted size

      // Check for image size limit (2MB)
      if (file.size > 2 * 1024 * 1024) { // 2MB in bytes
        setImageSizeWarning("Image size cannot be more than 2MB.");
      } else {
        setImageSizeWarning(""); // Clear warning if size is okay
      }
    } else {
      setImagePreview("");
      setImageSize(""); // Clear size if no file
      setImageSizeWarning(""); // Clear warning if no file
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !details || !durationMinutes || !difficulty || !imageFile) {
      Swal.fire({
        icon: "error",
        title: '<span style="color:#faba22">Missing Fields!</span>',
        text: "Please fill all required fields including image.",
        background: "black",
        color: "#faba22",
        confirmButtonColor: "#faba22",
      });
      return;
    }

    setLoading(true);

    try {
      const base64Image = await toBase64(imageFile);
      const uploadRes = await axios.post("/upload-image", {
        imageBase64: base64Image,
      });

      if (!uploadRes.data.url) {
        throw new Error("Image upload failed");
      }

      const emailsArray = trainerEmails
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email.length > 0);

      const classData = {
        name,
        image: uploadRes.data.url,
        details,
        totalBookings: 0,
        trainerEmails: emailsArray,
        durationMinutes: parseInt(durationMinutes, 10),
        difficulty,
      };

      await axios.post("/classes", classData);

      Swal.fire({
        icon: "success",
        title: '<span style="color:#faba22">Class Added!</span>',
        text: "Class added successfully!",
        background: "black",
        color: "#faba22",
        confirmButtonColor: "#faba22",
      });

      setName("");
      setDetails("");
      setDurationMinutes("");
      setDifficulty("Beginner");
      setTrainerEmails("");
      setImageFile(null);
      setImagePreview("");
      setImageSize(""); // Clear image size on successful submission
      setImageSizeWarning(""); // Clear warning on successful submission
    } catch (error) {
      console.error("Add class error:", error);
      Swal.fire({
        icon: "error",
        title: '<span style="color:#faba22">Failed to Add Class</span>',
        text: error.message || "Something went wrong.",
        background: "black",
        color: "#faba22",
        confirmButtonColor: "#faba22",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-inter flex items-center justify-center p-4 sm:p-8 lg:p-16">
      <div className="w-full max-w-xs sm:max-w-lg md:max-w-xl lg:max-w-2xl bg-zinc-900 p-6 sm:p-8 md:p-10 rounded-2xl shadow-2xl border border-zinc-800">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-funnel text-center mb-8 sm:mb-10 text-[#faba22] drop-shadow-lg">
          Add New Class
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Class Name */}
          <div>
            <label htmlFor="name" className="block text-base sm:text-lg font-medium mb-2 text-zinc-300">
              <FaBook className="inline-block mr-2 text-[#faba22]" /> Class Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter class name (e.g., Yoga Flow, HIIT Cardio)"
              className="w-full p-3 sm:p-4 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#faba22] text-base sm:text-lg"
            />
          </div>

          {/* Details */}
          <div>
            <label htmlFor="details" className="block text-base sm:text-lg font-medium mb-2 text-zinc-300">
              <FaInfoCircle className="inline-block mr-2 text-[#faba22]" /> Details <span className="text-red-500">*</span>
            </label>
            <textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              required
              placeholder="Provide a detailed description of the class, its benefits, and what participants can expect."
              rows={5}
              className="w-full p-3 sm:p-4 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#faba22] text-base sm:text-lg resize-y"
            ></textarea>
          </div>

          {/* Duration */}
          <div>
            <label htmlFor="durationMinutes" className="block text-base sm:text-lg font-medium mb-2 text-zinc-300">
              <FaClock className="inline-block mr-2 text-[#faba22]" /> Duration (minutes) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="durationMinutes"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              min="1"
              required
              placeholder="e.g., 60 (for a 1-hour class)"
              className="w-full p-3 sm:p-4 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#faba22] text-base sm:text-lg"
            />
          </div>

          {/* Difficulty */}
          <div>
            <label htmlFor="difficulty" className="block text-base sm:text-lg font-medium mb-2 text-zinc-300">
              <FaChartLine className="inline-block mr-2 text-[#faba22]" /> Difficulty <span className="text-red-500">*</span>
            </label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              required
              className="w-full p-3 sm:p-4 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#faba22] text-base sm:text-lg appearance-none cursor-pointer"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Trainer Emails (commented out) */}
          {/* <div>
            <label htmlFor="trainerEmails" className="block text-base sm:text-lg font-medium mb-2 text-zinc-300">
              <FaEnvelope className="inline-block mr-2 text-[#faba22]" /> Trainer Emails (comma separated)
            </label>
            <input
              type="text"
              id="trainerEmails"
              value={trainerEmails}
              onChange={(e) => setTrainerEmails(e.target.value)}
              placeholder="trainer1@example.com, trainer2@example.com"
              className="w-full p-3 sm:p-4 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#faba22] text-base sm:text-lg"
            />
          </div>
          */}

          {/* Class Image */}
          <div>
            <label htmlFor="imageFile" className="block text-base sm:text-lg font-medium mb-2 text-zinc-300">
              <FaImage className="inline-block mr-2 text-[#faba22]" /> Class Image <span className="text-red-500">*</span>
            </label>
            {imagePreview ? (
              <div className="relative w-full max-h-52 mb-4">
                <img
                  src={imagePreview}
                  alt="Class Image Preview"
                  className="w-full max-h-52 object-cover rounded-lg border-2 border-zinc-700 shadow-md"
                  style={{ maxHeight: '208px' }}
                />
                {imageSize && (
                  <span className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-md">
                    Size: {imageSize}
                  </span>
                )}
              </div>
            ) : (
              <div className="w-full h-52 bg-zinc-800 flex flex-col items-center justify-center rounded-lg mb-4 text-zinc-400 border-2 border-zinc-700">
                <FaImage className="text-5xl mb-3" />
                <p className="text-lg">No Image Selected</p>
              </div>
            )}
            <input
              type="file"
              id="imageFile"
              accept="image/*"
              onChange={handleImageChange}
              required={!imagePreview}
              className="w-full text-zinc-300 file:mr-5 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-base file:font-semibold file:bg-[#faba22] file:text-black hover:file:bg-yellow-500 transition-colors duration-200 cursor-pointer"
            />
            {imageSizeWarning && (
              <p className="text-red-500 text-sm mt-2 text-center">{imageSizeWarning}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-[#faba22] text-black font-bold text-lg sm:text-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-black" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Adding...
              </>
            ) : (
              <>
                <FaPlusCircle size={24} /> Add Class
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNewClass;