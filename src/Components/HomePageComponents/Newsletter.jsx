import React, { useState, useEffect } from "react";
import useAxios from "../../hooks/useAxios";
import { FaPaperPlane, FaCheckCircle, FaTimesCircle, FaNewspaper, FaRocket, FaUsers, FaLightbulb } from 'react-icons/fa';

const Newsletter = ({ user }) => {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const axiosSecure = useAxios();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axiosSecure.post(
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
    <section className="min-h-screen pb-20 bg-zinc-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-800 overflow-hidden transform transition-all duration-300 hover:shadow-3xl">

        {/* Left Content - Enhanced Visuals */}
        <div className="md:flex-1 p-8 md:p-14 flex flex-col justify-center items-start text-left bg-gradient-to-br from-[#faba22] to-yellow-500 text-black relative overflow-hidden">
          <div className="absolute inset-0 bg-pattern-light opacity-10"></div> {/* Subtle background pattern */}
          <h2 className="text-4xl md:text-5xl font-bold font-funnel text-black mb-6 leading-tight drop-shadow-lg">
            Unlock Your Fitness Journey with Our Newsletter!
          </h2>
          <ul className="space-y-4 text-lg text-black mb-8 list-none pl-0">
            <li className="flex items-center gap-3">
              <FaNewspaper className="text-xl text-zinc-900"/> Stay updated with **exclusive fitness tips** and industry news.
            </li>
            <li className="flex items-center gap-3">
              <FaRocket className="text-xl text-zinc-900"/> Be the first to access **new features** and innovations.
            </li>
            <li className="flex items-center gap-3">
              <FaUsers className="text-xl text-zinc-900"/> Get **community-driven motivation** straight to your inbox.
            </li>
            <li className="flex items-center gap-3">
              <FaLightbulb className="text-xl text-zinc-900"/> Connect with a growing network of **fitness enthusiasts**.
            </li>
          </ul>
          <p className="text-zinc-800 text-base leading-relaxed">
            Our platform is dedicated to empowering healthier, more active lifestyles through cutting-edge technology and a passionate fitness community. Join us and stay connected with the pulse of wellness!
          </p>
        </div>

        {/* Right Form - Sleek Design */}
        <div className="md:flex-1 p-8 md:p-14 flex flex-col justify-center bg-zinc-950 text-white relative">
          <h2 className="text-3xl font-bold text-[#faba22] text-center mb-8 font-funnel drop-shadow-md">
            Join Our Exclusive Newsletter
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Name Input Field */}
            <div> {/* Removed 'relative' from here */}
              <label htmlFor="name" className="block text-zinc-400 text-sm font-semibold mb-2">Name</label> {/* Adjusted label classes */}
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your Full Name"
                className="w-full px-5 py-3 bg-zinc-800 text-white border border-zinc-700 rounded-xl focus:ring-2 focus:ring-[#faba22] focus:border-transparent placeholder-zinc-500 transition-all duration-200 text-lg" // Removed 'peer'
              />
            </div>
            {/* Email Input Field */}
            <div> {/* Removed 'relative' from here */}
              <label htmlFor="email" className="block text-zinc-400 text-sm font-semibold mb-2">Email</label> {/* Adjusted label classes */}
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Your Email Address"
                className="w-full px-5 py-3 bg-zinc-800 text-white border border-zinc-700 rounded-xl focus:ring-2 focus:ring-[#faba22] focus:border-transparent placeholder-zinc-500 transition-all duration-200 text-lg" // Removed 'peer'
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-4 px-8 py-3 rounded-full bg-[#faba22] text-black font-extrabold text-lg uppercase tracking-wide transition-all duration-300 hover:bg-yellow-500 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-black" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Subscribing...
                </>
              ) : (
                <>
                  <FaPaperPlane className="text-lg" /> Subscribe Now
                </>
              )}
            </button>
          </form>

          {message && (
            <p className={`text-center mt-6 text-base font-semibold flex items-center justify-center gap-2 ${message.includes("failed") ? "text-red-400" : "text-green-400"}`}>
              {message.includes("failed") ? <FaTimesCircle className="text-xl"/> : <FaCheckCircle className="text-xl"/>}
              {message}
            </p>
          )}
        </div>

      </div>
      {/* Optional: Add a custom style block for the pattern */}
      <style>{`
        .bg-pattern-light {
          background-image: url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23000000" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zm0 30V30h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0 30V60h-2v-4h-4v-2h4v-4h2v4h4v2h-4zM6 54v-4H4v4H0v2h4v4h2v-4h4v-2H6zm0-30V24H4v4H0v2h4v4h2v-4h4v-2H6zm0-30V0H4v4H0v2h4v4h2V6H4V4H0z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');
        }
      `}</style>
    </section>
  );
};

export default Newsletter;