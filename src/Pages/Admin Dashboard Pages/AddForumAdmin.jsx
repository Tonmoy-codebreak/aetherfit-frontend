import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { IoEye } from "react-icons/io5";
import { useNavigate } from "react-router";

const AddForumAdmin = () => {
  const [forums, setForums] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newForum, setNewForum] = useState({
    title: "",
    content: "",
    image: "",
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchForums();
  }, []);

  const fetchForums = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/forums`);
      setForums(res.data);
    } catch (err) {
      console.error(err);
    }
  };

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

    try {
      let finalImageURL = newForum.image;

      if (photoFile) {
        const base64Image = await toBase64(photoFile);
        const uploadRes = await axios.post(`${import.meta.env.VITE_API_URL}/upload-image`, {
          imageBase64: base64Image,
        });
        finalImageURL = uploadRes.data.url || finalImageURL;
      }

      const authorId = "admin123";
      const authorName = "Admin User";
      const authorRole = "Admin";

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
      setIsModalOpen(false);
      Swal.fire({
        title: "Forum Added!",
        icon: "success",
        background: "black",
        color: "#faba22",
        confirmButtonColor: "#faba22",
      });

      fetchForums();
    } catch (err) {
      console.error("Forum add error:", err);
      Swal.fire({
        title: "Error",
        text: err.message || "Something went wrong.",
        icon: "error",
        background: "black",
        color: "#faba22",
        confirmButtonColor: "#faba22",
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
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
        await axios.delete(`${import.meta.env.VITE_API_URL}/admin/forums/${id}`);
        Swal.fire({
          title: "Deleted!",
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
          title: "Error",
          text: error.message || "Failed to delete forum.",
          icon: "error",
          background: "black",
          color: "#faba22",
          confirmButtonColor: "#faba22",
        });
      }
    }
  };

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-puppin font-bold">All Forums</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#faba22] hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded-xl transition-all"
        >
          + Add Forum
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl shadow-lg">
        <table className="table-auto w-full border border-gray-700 rounded-xl overflow-hidden">
          <thead className="bg-gray-800 text-gray-200">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Content</th>
              <th className="p-3">Image</th>
              <th className="p-3">Author</th>
              <th className="p-3">Votes</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-gray-900">
            {forums.map((forum) => (
              <tr key={forum._id} className="border-b border-gray-700 hover:bg-gray-800 transition">
                <td className="p-3">{forum.title}</td>
                <td className="p-3">{forum.content.slice(0, 50)}...</td>
                <td className="p-3">
                  {forum.image ? (
                    <img src={forum.image} alt="Forum" className="w-20 h-14 object-cover rounded-lg" />
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="p-3">
                  {forum.authorName} ({forum.authorRole})
                </td>
                <td className="p-3">{forum.totalUpVotes} / {forum.totalDownVotes}</td>
                <td className="p-3 flex items-center gap-2">
                  <button
                    onClick={() => handleDelete(forum._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => navigate(`/forum/${forum._id}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md flex items-center justify-center"
                  >
                    <IoEye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-gray-900 text-white rounded-xl p-8 w-full max-w-lg relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-white text-xl"
            >
              ✕
            </button>
            <h2 className="text-2xl font-puppin font-bold mb-6">Add New Forum</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                value={newForum.title}
                onChange={handleInputChange}
                placeholder="Forum Title"
                required
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#faba22]"
              />
              <textarea
                name="content"
                value={newForum.content}
                onChange={handleInputChange}
                placeholder="Forum Content"
                required
                rows={4}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#faba22]"
              />

              {previewURL && (
                <img
                  src={previewURL}
                  alt="Preview"
                  className="w-32 h-20 object-cover rounded-lg mx-auto"
                />
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="w-full bg-gray-800 border border-gray-700 p-2 rounded-lg file:bg-[#faba22] file:text-black"
              />

              <button
                type="submit"
                className="w-full bg-[#faba22] hover:bg-yellow-500 text-black font-semibold py-3 rounded-lg transition-all"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddForumAdmin;
