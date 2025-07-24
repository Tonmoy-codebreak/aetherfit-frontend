import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { IoEye } from "react-icons/io5";
import { useNavigate } from "react-router";
import { FaPlus, FaTrashAlt, FaTimes } from "react-icons/fa";
import useAxios from "../../hooks/useAxios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = (error) => reject(error);
  });

const AddForumAdmin = () => {
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newForum, setNewForum] = useState({ title: "", content: "", image: "" });
  const [photoFile, setPhotoFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const [imageSize, setImageSize] = useState(0); // Size in bytes
  const [imageSizeError, setImageSizeError] = useState(""); // New state for image size error
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // New state for form processing
  const [isFormProcessing, setIsFormProcessing] = useState(false);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { data: forums = [], isLoading, error } = useQuery({
    queryKey: ["adminForums"],
    queryFn: async () => {
      const res = await axiosSecure.get(`${import.meta.env.VITE_API_URL}/admin/forums`);
      if (!Array.isArray(res.data)) throw new Error("Invalid data format received");
      return res.data;
    },
    onError: (err) => {
      Swal.fire({
        title: '<span style="color:#faba22">Error</span>',
        text: err.response?.data?.message || "Failed to load forums.",
        icon: "error",
        background: "black",
        color: "#faba22",
        confirmButtonColor: "#faba22",
      });
    },
  });

  const addForumMutation = useMutation({
    mutationFn: async (forumData) => {
      let finalImageURL = forumData.image;
      if (photoFile) {
        if (imageSize > 2 * 1024 * 1024) {
          throw new Error("Image size cannot be more than 2MB.");
        }
        const base64Image = await toBase64(photoFile);
        const uploadRes = await axiosSecure.post(
          `${import.meta.env.VITE_API_URL}/upload-image`,
          { imageBase64: base64Image },

        );
        finalImageURL = uploadRes.data.url || finalImageURL;
      }

      await axiosSecure.post(
        `${import.meta.env.VITE_API_URL}/admin/forums`,
        {
          title: forumData.title,
          content: forumData.content,
          image: finalImageURL,
          authorId: "admin123",
          authorName: "Admin User",
          authorRole: "Admin",
        },
        { timeout: 30000 }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["adminForums"]);
      setNewForum({ title: "", content: "", image: "" });
      setPhotoFile(null);
      setPreviewURL("");
      setImageSize(0);
      setImageSizeError(""); // Clear error on success
      setIsModalOpen(false);
      Swal.fire({
        title: '<span style="color:#faba22">Forum Added!</span>',
        text: "Your forum post has been submitted.",
        icon: "success",
        background: "black",
        color: "#faba22",
        confirmButtonColor: "#faba22",
      });
      setIsFormProcessing(false); // Set to false on success
    },
    onError: (err) => {
      Swal.fire({
        title: '<span style="color:#faba22">Error</span>',
        text: err.message || err.response?.data?.message || "Something went wrong.",
        icon: "error",
        background: "black",
        color: "#faba22",
        confirmButtonColor: "#faba22",
      });
      setIsFormProcessing(false); // Set to false on error
    },
  });

  const deleteForumMutation = useMutation({
    mutationFn: async (id) => {
      await axiosSecure.delete(`${import.meta.env.VITE_API_URL}/admin/forums/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["adminForums"]);
      Swal.fire({
        title: '<span style="color:#faba22">Deleted!</span>',
        text: "Forum has been deleted.",
        icon: "success",
        background: "black",
        color: "#faba22",
        confirmButtonColor: "#faba22",
      });
    },
    onError: (error) => {
      Swal.fire({
        title: '<span style="color:#faba22">Error</span>',
        text: error.response?.data?.message || error.message || "Failed to delete forum.",
        icon: "error",
        background: "black",
        color: "#faba22",
        confirmButtonColor: "#faba22",
      });
    },
  });

  const handleInputChange = (e) => {
    setNewForum({ ...newForum, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhotoFile(file);
    setPreviewURL(file ? URL.createObjectURL(file) : "");
    const size = file ? file.size : 0;
    setImageSize(size);

    // Check size and set error message
    if (size > 2 * 1024 * 1024) {
      setImageSizeError("Image size cannot be more than 2MB.");
    } else {
      setImageSizeError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Prevent submission if there's an image size error
    if (imageSizeError) {
      Swal.fire({
        title: '<span style="color:#faba22">Image Error</span>',
        text: imageSizeError,
        icon: "error",
        background: "black",
        color: "#faba22",
        confirmButtonColor: "#faba22",
      });
      return;
    }
    setIsFormProcessing(true); // Set to true at the beginning of submission
    addForumMutation.mutate(newForum);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '<span style="color:#faba22">Are you sure?</span>',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#faba22",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      background: "black",
      color: "#faba22",
    });

    if (result.isConfirmed) {
      deleteForumMutation.mutate(id);
    }
  };

  // Helper to format file size for display
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen bg-zinc-950 text-[#faba22] font-semibold text-xl">Loading forums...</div>;
  if (error) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-inter p-4 sm:p-8 lg:p-16">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-funnel text-center sm:text-left text-[#faba22]">
          All Forums
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-[#faba22] hover:bg-yellow-500 text-black font-bold text-lg rounded-xl transition-all duration-300 flex items-center gap-2"
        >
          <FaPlus size={20} /> Add New Forum
        </button>
      </div>

      {forums.length === 0 ? (
        <div className="bg-zinc-900 p-8 rounded-xl text-center mt-8 border border-zinc-800">
          <p className="text-zinc-300">No forums found. Start by adding a new one!</p>
        </div>
      ) : windowWidth >= 1024 ? (
        <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900">
          <table className="min-w-full text-xs sm:text-sm">
            <thead className="bg-zinc-800">
              <tr>
                <th className="px-3 py-3 text-left text-zinc-400 uppercase tracking-wider">Title</th>
                <th className="px-3 py-3 text-left text-zinc-400 uppercase tracking-wider">Image</th>
                <th className="px-3 py-3 text-left text-zinc-400 uppercase tracking-wider">Author</th>
                <th className="px-3 py-3 text-left text-zinc-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {forums.map((forum) => (
                <tr key={forum._id} className="bg-zinc-900 hover:bg-zinc-800">
                  <td className="px-3 py-3 truncate">{forum.title}</td>
                  <td className="px-3 py-3">
                    {forum.image ? (
                      <img
                        src={forum.image}
                        alt="Forum"
                        className="w-16 h-12 object-cover rounded-lg"
                      />
                    ) : (
                      <span className="text-zinc-500">N/A</span>
                    )}
                  </td>
                  <td className="px-3 py-3 truncate">
                    {forum.authorName || "N/A"} ({forum.authorRole || "N/A"})
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => handleDelete(forum._id)} className="p-2 bg-red-700 rounded-full" disabled={deleteForumMutation.isLoading}>
                        <FaTrashAlt size={12} />
                      </button>
                      <button onClick={() => navigate(`/forum/${forum._id}`)} className="p-2 bg-[#faba22] text-black rounded-full">
                        <IoEye size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {forums.map((forum) => (
            <div key={forum._id} className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 flex flex-col">
              <div className="flex justify-between items-center">
                <span className="font-bold">{forum.title}</span>
                <div className="flex gap-2">
                  <button onClick={() => handleDelete(forum._id)} className="p-2 bg-red-700 rounded-full" disabled={deleteForumMutation.isLoading}>
                    <FaTrashAlt size={12} />
                  </button>
                  <button onClick={() => navigate(`/forum/${forum._id}`)} className="p-2 bg-[#faba22] text-black rounded-full">
                    <IoEye size={12} />
                  </button>
                </div>
              </div>
              {forum.image && (
                <img
                  src={forum.image}
                  alt="Forum"
                  className="w-full h-32 object-cover rounded-lg mt-2"
                />
              )}
              <div className="text-sm text-zinc-400 mt-2">
                {forum.authorName || "N/A"} ({forum.authorRole || "N/A"})
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div onClick={(e) => e.stopPropagation()} className="bg-zinc-900 max-w-md w-full p-6 rounded-xl border border-zinc-700 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-3 right-3 text-zinc-400 hover:text-[#faba22] text-2xl">
              <FaTimes />
            </button>
            <h2 className="text-2xl font-bold text-center text-[#faba22] mb-4">Add New Forum Post</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Forum Title Section */}
              <div>
                <label htmlFor="forumTitle" className="block text-zinc-300 text-sm font-semibold mb-2">Forum Title</label>
                <input
                  type="text"
                  id="forumTitle"
                  name="title"
                  value={newForum.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter a compelling title for your forum post"
                  className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-[#faba22]"
                />
              </div>

              {/* Content Section */}
              <div>
                <label htmlFor="forumContent" className="block text-zinc-300 text-sm font-semibold mb-2">Content</label>
                <textarea
                  id="forumContent"
                  name="content"
                  value={newForum.content}
                  onChange={handleInputChange}
                  required
                  placeholder="Share your insights, questions, or discussions here..."
                  rows="5"
                  className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white resize-y placeholder-zinc-500 focus:outline-none focus:border-[#faba22]"
                ></textarea>
              </div>

              {/* Upload Image Section */}
              <div>
                <label htmlFor="forumImage" className="block text-zinc-300 text-sm font-semibold mb-2">
                  Upload Image <span className="text-zinc-500">(Max 2MB)</span>
                </label>
                {previewURL && <img src={previewURL} alt="Preview" className="w-full max-h-40 object-cover rounded-lg mb-2" />}
                <input
                  type="file"
                  id="forumImage"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="w-full text-zinc-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#faba22] file:text-black hover:file:bg-yellow-500 file:cursor-pointer"
                />
                {photoFile && (
                  <p className={`mt-2 text-xs ${imageSizeError ? 'text-red-500' : 'text-zinc-400'}`}>
                    Image Size: {formatFileSize(imageSize)}
                  </p>
                )}
                {imageSizeError && (
                  <p className="mt-2 text-red-500 text-sm">{imageSizeError}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isFormProcessing || !!imageSizeError} // Disable if processing or image size error
                className={`w-full py-3 bg-[#faba22] text-black rounded-xl font-bold transition-colors duration-300 ${
                  isFormProcessing || !!imageSizeError ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-500'
                } flex items-center justify-center gap-2`} // Add flex for spinner
              >
                {isFormProcessing ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-black" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting (it may take a while)
                  </>
                ) : (
                  'Post Forum'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddForumAdmin;