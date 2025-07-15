import React, { useState, useContext } from "react";
import axios from "axios";
// Example: if you're using context for auth
// import { AuthContext } from "../context/AuthProvider";

const Newsletter = ({ user }) => {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Example: if using context instead of props
  // const { user } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");

  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/newsletter-subscribe`,
      {
        name: formData.name,
        email: formData.email,
        userName: user?.displayName || "",
        userEmail: user?.email || "",
      }
    );

    setMessage(res.data.message);
    setFormData({ name: "", email: "" });
  } catch (err) {
    setMessage(err.response?.data?.message || "Subscription failed. Try again later.");
  } finally {
    setLoading(false);
  }
};


  return (
    <section className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
        Join Our Newsletter
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Your Name"
          className="border p-3 rounded-lg"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="Your Email"
          className="border p-3 rounded-lg"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition"
        >
          {loading ? "Subscribing..." : "Subscribe Now"}
        </button>
      </form>
      {message && (
        <p className="text-center mt-4 text-sm text-gray-600">{message}</p>
      )}
    </section>
  );
};

export default Newsletter;
