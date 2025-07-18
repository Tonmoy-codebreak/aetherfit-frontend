import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { IoEye } from "react-icons/io5";
import { useNavigate } from "react-router";
import { FaPlus, FaTrashAlt, FaTimes } from "react-icons/fa";
import useAxios from "../../hooks/useAxios";

const AddForumAdmin = () => {
  const axiosSecure = useAxios();
  const [forums, setForums] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newForum, setNewForum] = useState({ title: "", image: "" });
  const [photoFile, setPhotoFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const [imageSize, setImageSize] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchForums();
  }, []);

  const fetchForums = async () => {
    try {
      const res = await axiosSecure.get(`${import.meta.env.VITE_API_URL}/admin/forums`);
      setForums(res.data);
    } catch (err) {
      Swal.fire({
        title: '<span style="color:#faba22">Error</span>',
        text: err.response?.data?.message || "Failed to load forums.",
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
    setImageSize(file ? file.size : 0);
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
        if (imageSize > 2 * 1024 * 1024) {
          Swal.fire({
            icon: "error",
            title: '<span style="color:#faba22">Image Too Large!</span>',
            text: "Image size cannot be more than 2MB.",
            background: "black",
            color: "#faba22",
            confirmButtonColor: "#faba22",
          });
          setIsSubmitting(false);
          return;
        }

        const base64Image = await toBase64(photoFile);
        const uploadRes = await axiosSecure.post(
          `${import.meta.env.VITE_API_URL}/upload-image`,
          { imageBase64: base64Image },
          { timeout: 30000 }
        );
        finalImageURL = uploadRes.data.url || finalImageURL;
      }

      await axiosSecure.post(
        `${import.meta.env.VITE_API_URL}/admin/forums`,
        {
          title: newForum.title,
          image: finalImageURL,
          authorId: "admin123",
          authorName: "Admin User",
          authorRole: "Admin",
        },
        { timeout: 30000 }
      );

      setNewForum({ title: "", image: "" });
      setPhotoFile(null);
      setPreviewURL("");
      setImageSize(0);
      setIsModalOpen(false);
      fetchForums();

      Swal.fire({
        title: '<span style="color:#faba22">Forum Added!</span>',
        text: "Your forum post has been submitted.",
        icon: "success",
        background: "black",
        color: "#faba22",
        confirmButtonColor: "#faba22",
      });
    } catch (err) {
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
        fetchForums();
        Swal.fire({
          title: '<span style="color:#faba22">Deleted!</span>',
          text: "Forum has been deleted.",
          icon: "success",
          background: "black",
          color: "#faba22",
          confirmButtonColor: "#faba22",
        });
      } catch (error) {
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
                      <button onClick={() => handleDelete(forum._id)} className="p-2 bg-red-700 rounded-full">
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
                  <button onClick={() => handleDelete(forum._id)} className="p-2 bg-red-700 rounded-full">
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
              <input
                type="text"
                name="title"
                value={newForum.title}
                onChange={handleInputChange}
                required
                placeholder="Forum title"
                className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
              />
              {previewURL && <img src={previewURL} alt="Preview" className="w-full max-h-40 object-cover rounded-lg" />}
              <input type="file" accept="image/*" onChange={handlePhotoChange} className="w-full" />
              <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-[#faba22] text-black rounded-xl font-bold">
                {isSubmitting ? "Submitting..." : "Post Forum"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddForumAdmin;
