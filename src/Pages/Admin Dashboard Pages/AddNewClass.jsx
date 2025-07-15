import React, { useState } from "react";
import Swal from "sweetalert2";
import useAxios from "../../hooks/useAxios";


const AddNewClass = () => {
  const axios = useAxios();

  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [trainerEmails, setTrainerEmails] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  // Convert file to base64 (without prefix)
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !details || !durationMinutes || !difficulty || !imageFile) {
      Swal.fire({
        icon: "error",
        title: "Please fill all required fields including image.",
        background: "black",
        color: "#faba22",
        confirmButtonColor: "#faba22",
      });
      return;
    }

    setLoading(true);

    try {
      // 1. Upload image to /upload-image endpoint
      const base64Image = await toBase64(imageFile);
      const uploadRes = await axios.post("/upload-image", {
        imageBase64: base64Image,
      });

      if (!uploadRes.data.url) {
        throw new Error("Image upload failed");
      }

      // 2. Prepare trainerEmails array from comma separated input
      const emailsArray = trainerEmails
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email.length > 0);

      // 3. POST class data to backend
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
        title: "Class added successfully!",
        background: "black",
        color: "#faba22",
        confirmButtonColor: "#faba22",
      });

      // Clear form
      setName("");
      setDetails("");
      setDurationMinutes("");
      setDifficulty("Beginner");
      setTrainerEmails("");
      setImageFile(null);
      setImagePreview("");
    } catch (error) {
      console.error("Add class error:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to add class",
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-[#111] text-white font-inter p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-[#111] p-6 rounded-md space-y-5"
      >
        <h2 className="text-2xl font-bold text-[#faba22] text-center mb-4">
          Add New Class
        </h2>

        <label className="block">
          <span className="text-gray-300">Class Name *</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter class name"
            className="mt-1 block w-full rounded-md bg-[#222] border border-gray-700 p-2 text-white focus:outline-none focus:border-[#faba22]"
          />
        </label>

        <label className="block">
          <span className="text-gray-300">Details *</span>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            required
            placeholder="Describe the class"
            rows={4}
            className="mt-1 block w-full rounded-md bg-[#222] border border-gray-700 p-2 text-white focus:outline-none focus:border-[#faba22]"
          ></textarea>
        </label>

        <label className="block">
          <span className="text-gray-300">Duration (minutes) *</span>
          <input
            type="number"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value)}
            min="1"
            required
            placeholder="e.g. 60"
            className="mt-1 block w-full rounded-md bg-[#222] border border-gray-700 p-2 text-white focus:outline-none focus:border-[#faba22]"
          />
        </label>

        <label className="block">
          <span className="text-gray-300">Difficulty *</span>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            required
            className="mt-1 block w-full rounded-md bg-[#222] border border-gray-700 p-2 text-white focus:outline-none focus:border-[#faba22]"
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </label>

        {/* <label className="block">
          <span className="text-gray-300">
            Trainer Emails (comma separated)
          </span>
          <input
            type="text"
            value={trainerEmails}
            onChange={(e) => setTrainerEmails(e.target.value)}
            placeholder="trainer1@example.com, trainer2@example.com"
            className="mt-1 block w-full rounded-md bg-[#222] border border-gray-700 p-2 text-white focus:outline-none focus:border-[#faba22]"
          />
        </label> */}

        <label className="block">
          <span className="text-gray-300">Class Image *</span>
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-md mb-2"
            />
          ) : (
            <div className="w-full h-48 bg-gray-700 flex items-center justify-center rounded-md mb-2 text-gray-400">
              No Image Selected
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required={!imagePreview}
            className="w-full text-gray-300 cursor-pointer"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#faba22] text-black font-semibold rounded-md hover:bg-black hover:text-[#faba22] transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Adding..." : "Add Class"}
        </button>
      </form>
    </div>
  );
};

export default AddNewClass;
