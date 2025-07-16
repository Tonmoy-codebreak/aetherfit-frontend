import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router"; 
import { useAuth } from "../../AuthProvider/useAuth";


const AddForumTrainer = () => {
  const { user: authUser } = useAuth()
  const navigate = useNavigate();

  const [mongoUser, setMongoUser] = useState(null); // State to store MongoDB user data
  const [newForum, setNewForum] = useState({
    title: "",
    content: "",
    image: "",
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true); // New loading state for user data

  // Effect to fetch MongoDB user data
  useEffect(() => {
    const fetchMongoUser = async () => {
      if (!authUser?.email) {
        setIsLoadingUser(false);
        return;
      }
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/users?email=${authUser.email}`);
        setMongoUser(res.data);
      } catch (err) {
        console.error("Error fetching MongoDB user data:", err);
        Swal.fire({
          title: "Error",
          text: "Failed to load your user profile. Please try refreshing.",
          icon: "error",
          background: "black",
          color: "#faba22",
          confirmButtonColor: "#faba22",
        });
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchMongoUser();
  }, [authUser]); // Depend on authUser to refetch if auth state changes

  const handleInputChange = (e) => {
    setNewForum({ ...newForum, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhotoFile(file);
    setPreviewURL(file ? URL.createObjectURL(file) : "");
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Now check mongoUser for _id and email
    if (!mongoUser?._id || !mongoUser?.email) {
      Swal.fire({
        title: "Error",
        text: "Your full user profile is not loaded. Please wait or refresh the page.",
        icon: "error",
        background: "black",
        color: "#faba22",
        confirmButtonColor: "#faba22",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      let finalImageURL = newForum.image;

      if (photoFile) {
        const base64Image = await toBase64(photoFile);
        const uploadRes = await axios.post(`${import.meta.env.VITE_API_URL}/upload-image`, {
          imageBase64: base64Image,
        });
        finalImageURL = uploadRes.data.url || finalImageURL;
      }

      // Use mongoUser._id and mongoUser.email for author details
      const authorId = mongoUser._id;
      const authorName = authUser?.displayName || mongoUser.name || mongoUser.email; // Use authUser.displayName if available, then mongoUser.name
      const authorRole = "Trainer";

      await axios.post(`${import.meta.env.VITE_API_URL}/admin/forums`, {
        ...newForum,
        image: finalImageURL,
        authorId,
        authorName,
        authorRole,
      });

      setNewForum({ title: "", content: "", image: "" });
      setPhotoFile(null);
      setPreviewURL("");

      Swal.fire({
        title: "Forum Added!",
        text: "Your forum post has been submitted.",
        icon: "success",
        background: "black",
        color: "#faba22",
        confirmButtonColor: "#faba22",
      });

    } catch (err) {
      console.error("Forum add error:", err);
      Swal.fire({
        title: "Error",
        text: err.response?.data?.message || err.message || "Something went wrong.",
        icon: "error",
        background: "black",
        color: "#faba22",
        confirmButtonColor: "#faba22",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingUser) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-zinc-950">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[#faba22] my-auto mx-auto"></div>
        <p className="text-[#faba22] ml-4 text-xl">Loading user data...</p>
      </div>
    );
  }

  // If user data failed to load or authUser is not available
  if (!mongoUser || !mongoUser._id) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-zinc-950">
        <p className="text-red-500 text-xl">User profile not found or loaded. Please ensure you are logged in correctly.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-[#faba22] p-8 sm:p-12 lg:p-16">
      <h1 className="text-5xl font-bold font-funnel text-center mb-12 text-white">Create New Forum Post</h1>

      <div className="bg-zinc-900 p-8 rounded-xl shadow-lg border border-zinc-800 w-full lg:w-3/4 xl:w-2/3 mx-auto">
        <h2 className="text-3xl font-semibold mb-8 text-white">Your Forum Details</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-lg font-medium mb-2">Forum Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={newForum.title}
              onChange={handleInputChange}
              placeholder="Enter forum title"
              required
              className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-[#faba22] placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#faba22]"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-lg font-medium mb-2">Content</label>
            <textarea
              id="content"
              name="content"
              value={newForum.content}
              onChange={handleInputChange}
              placeholder="Write your forum post content here..."
              required
              rows={6}
              className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-[#faba22] placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#faba22]"
            ></textarea>
          </div>

          <div>
            <label htmlFor="image" className="block text-lg font-medium mb-2">Upload Image (Optional)</label>
            {previewURL && (
              <div className="mb-4 flex justify-center">
                <img
                  src={previewURL}
                  alt="Image Preview"
                  className="w-48 h-32 object-cover rounded-lg border border-zinc-700"
                />
              </div>
            )}
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handlePhotoChange}
              className="w-full text-[#faba22] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#faba22] file:text-black hover:file:bg-yellow-500 transition-colors duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-lg font-bold text-xl transition-all duration-300 ${
              isSubmitting
                ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
                : 'bg-[#faba22] hover:bg-yellow-500 text-black'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Post Forum'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddForumTrainer;
