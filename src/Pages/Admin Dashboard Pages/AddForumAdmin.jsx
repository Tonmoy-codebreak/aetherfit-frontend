import React, { useState, useEffect } from "react";

import Swal from "sweetalert2";
import { IoEye } from "react-icons/io5";
import { useNavigate } from "react-router";
import { FaPlus, FaTrashAlt, FaTimes, FaRegThumbsUp } from 'react-icons/fa';
import useAxios from "../../hooks/useAxios";

const AddForumAdmin = () => {
  const axiosSecure = useAxios();
  const [forums, setForums] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newForum, setNewForum] = useState({
    title: "",
    content: "",
    image: "",
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const [imageSize, setImageSize] = useState(0); // New state for image size in bytes
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchForums();
  }, []);

  const fetchForums = async () => {
    try {
      const res = await axiosSecure.get(`${import.meta.env.VITE_API_URL}/admin/forums`);
      setForums(res.data);
    } catch (err) {
      console.error("Error fetching forums:", err);
      Swal.fire({
        title: '<span style="color:#faba22">Error</span>',
        text: "Failed to load forums. Please try again later.",
        icon: "error",
        background: "black",
        color: "#faba22",
        confirmButtonColor: "#faba22",
      });
    }
  };

  const handleInputChange = (e) => {
    setNewForum({ ...newForum, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhotoFile(file);
    setPreviewURL(file ? URL.createObjectURL(file) : "");
    setImageSize(file ? file.size : 0); // Set the image size in bytes
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

    try {
      let finalImageURL = newForum.image;

      if (photoFile) {
        const base64Image = await toBase64(photoFile);
        const uploadRes = await axiosSecure.post(
          `${import.meta.env.VITE_API_URL}/upload-image`,
          {
            imageBase64: base64Image,
          },
          {
            timeout: 30000
          }
        );
        finalImageURL = uploadRes.data.url || finalImageURL;
      }

      const authorId = "admin123";
      const authorName = "Admin User";
      const authorRole = "Admin";

      await axiosSecure.post(
        `${import.meta.env.VITE_API_URL}/admin/forums`,
        {
          ...newForum,
          image: finalImageURL,
          authorId,
          authorName,
          authorRole,
        },
        {
          timeout: 30000
        }
      );

      setNewForum({ title: "", content: "", image: "" });
      setPhotoFile(null);
      setPreviewURL("");
      setImageSize(0); // Reset image size after successful upload
      setIsModalOpen(false);
      Swal.fire({
        title: '<span style="color:#faba22">Forum Added!</span>',
        text: "Your forum post has been submitted.",
        icon: "success",
        background: "black",
        color: "#faba22",
        confirmButtonColor: "#faba22",
      });

      fetchForums();
    } catch (err) {
      console.error("Forum add error:", err);
      Swal.fire({
        title: '<span style="color:#faba22">Error</span>',
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
      try {
        await axiosSecure.delete(`${import.meta.env.VITE_API_URL}/admin/forums/${id}`);
        Swal.fire({
          title: '<span style="color:#faba22">Deleted!</span>',
          text: "Forum has been deleted.",
          icon: "success",
          background: "black",
          color: "#faba22",
          confirmButtonColor: "#faba22",
        });
        fetchForums();
      } catch (error) {
        console.error("Delete forum error:", error);
        Swal.fire({
          title: '<span style="color:#faba22">Error</span>',
          text: error.response?.data?.message || error.message || "Failed to delete forum.",
          icon: "error",
          background: "black",
          color: "#faba22",
          confirmButtonColor: "#faba22",
        });
      }
    }
  };

  // Helper function to format bytes into readable units (KB, MB)
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-inter p-8 sm:p-12 lg:p-16">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
        <h1 className="text-5xl md:text-6xl font-bold font-funnel text-center sm:text-left text-[#faba22] drop-shadow-lg">
          All Forums
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-8 py-4 bg-[#faba22] hover:bg-yellow-500 text-black font-bold text-xl rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
        >
          <FaPlus size={20} /> Add New Forum
        </button>
      </div>

      {forums.length === 0 ? (
        <div className="bg-zinc-900 p-8 rounded-xl shadow-lg text-center text-lg mt-8 border border-zinc-800">
          <p className="text-zinc-300">No forums found. Start by adding a new one!</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-lg border border-zinc-800 bg-zinc-900">
          <table className="min-w-full divide-y divide-zinc-700">
            <thead className="bg-zinc-800">
              <tr>
                <th scope="col" className="px-4 py-4 text-left text-xs sm:text-sm font-medium text-zinc-400 uppercase tracking-wider rounded-tl-lg">
                  Title
                </th>
                <th scope="col" className="px-4 py-4 text-left text-xs sm:text-sm font-medium text-zinc-400 uppercase tracking-wider">
                  Content
                </th>
                <th scope="col" className="px-4 py-4 text-left text-xs sm:text-sm font-medium text-zinc-400 uppercase tracking-wider">
                  Image
                </th>
                <th scope="col" className="px-4 py-4 text-left text-xs sm:text-sm font-medium text-zinc-400 uppercase tracking-wider">
                  Author
                </th>
                <th scope="col" className="px-4 py-4 text-left text-xs sm:text-sm font-medium text-zinc-400 uppercase tracking-wider">
                  Votes
                </th>
                <th scope="col" className="px-4 py-4 text-left text-xs sm:text-sm font-medium text-zinc-400 uppercase tracking-wider rounded-tr-lg">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {forums.map((forum) => (
                <tr key={forum._id} className="bg-zinc-900 hover:bg-zinc-800 transition-colors duration-200">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {forum.title}
                  </td>
                  <td className="px-4 py-4 text-sm text-zinc-300">
                    {forum.content.slice(0, 70)}{forum.content.length > 70 ? '...' : ''}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {forum.image ? (
                      <img
                        src={forum.image}
                        alt="Forum"
                        className="w-20 h-14 object-cover rounded-lg border border-zinc-700"
                        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/80x56/363636/DDDDDD?text=No+Img"; }}
                      />
                    ) : (
                      <span className="text-zinc-500">N/A</span>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-zinc-300">
                    {forum.authorName || 'N/A'} ({forum.authorRole || 'N/A'})
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-zinc-300 gap-1">
                    <span className="flex items-center  gap-1 text-green-400">
                      <FaRegThumbsUp /> {forum.totalUpVotes || 0}
                    </span>

                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-left text-sm font-medium">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleDelete(forum._id)}
                        className="p-2 bg-red-700 hover:bg-red-800 text-white rounded-full transition-colors duration-200 shadow-md"
                        title="Delete Forum"
                      >
                        <FaTrashAlt size={18} />
                      </button>
                      <button
                        onClick={() => navigate(`/forum/${forum._id}`)}
                        className="p-2 bg-[#faba22] hover:bg-yellow-500 text-black rounded-full transition-colors duration-200 shadow-md"
                        title="View Forum Details"
                      >
                        <IoEye size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add New Forum Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-forum-modal-title"
        >
          <div
            className="bg-zinc-900 rounded-2xl max-w-lg w-full p-8 relative shadow-2xl border border-zinc-700 transform scale-95 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-[#faba22] text-3xl font-bold leading-none focus:outline-none transition-colors duration-200"
              aria-label="Close add forum modal"
            >
              <FaTimes />
            </button>
            <h2 id="add-forum-modal-title" className="text-3xl font-bold font-funnel mb-8 text-[#faba22] text-center">
              Add New Forum Post
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="modal-title" className="block text-lg font-medium mb-2  text-zinc-300">Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  id="modal-title"
                  name="title"
                  value={newForum.title}
                  onChange={handleInputChange}
                  placeholder="Enter forum title"
                  required
                  className="w-full p-4 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#faba22] text-lg"
                />
              </div>

              <div>
                <label htmlFor="modal-content" className="block text-lg font-medium mb-2 text-zinc-300">Content <span className="text-red-500">*</span></label>
                <textarea
                  id="modal-content"
                  name="content"
                  value={newForum.content}
                  onChange={handleInputChange}
                  placeholder="Write your forum post content here..."
                  required
                  rows={6}
                  className="w-full p-4 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#faba22] text-lg resize-y"
                ></textarea>
              </div>

              <div>
                <label htmlFor="modal-image" className="block text-lg font-medium mb-2 text-zinc-300">Image (Max 2MB Recommended)</label>
                {previewURL && (
                  <div className="mb-4 flex justify-center">
                    <img
                      src={previewURL}
                      alt="Image Preview"
                      className="w-48 h-32 object-cover rounded-lg border-2 border-zinc-700 shadow-md"
                    />
                  </div>
                )}
                <input
                  type="file"
                  id="modal-image"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="w-full text-zinc-300 file:mr-5 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-base file:font-semibold file:bg-[#faba22] file:text-black hover:file:bg-yellow-500 transition-colors duration-200 cursor-pointer"
                />
                {imageSize > 0 && ( // Display size only if an image is selected
                  <p className="text-sm text-zinc-400 mt-2 text-center">
                    Selected Image Size: <span className={`font-semibold ${imageSize > 2 * 1024 * 1024 ? 'text-red-400' : 'text-green-400'}`}>
                      {formatBytes(imageSize)}
                    </span>
                    {imageSize > 2 * 1024 * 1024 && (
                      <span className="text-red-400 ml-2"> (Image is too large!)</span>
                    )}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-[#faba22] text-black font-bold text-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-black" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
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