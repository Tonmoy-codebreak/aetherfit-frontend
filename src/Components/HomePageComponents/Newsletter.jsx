import React, { useState, useContext } from "react";
import useAxios from "../../hooks/useAxios";

const Newsletter = ({ user }) => {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const axiosSecure = useAxios()

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
    <section className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-3xl mx-auto bg-zinc-900 rounded-xl shadow-xl border border-zinc-800 p-6 md:p-8">
        {/* Title and Description */}
        <h2 className="text-2xl font-bold text-[#faba22] text-center mb-3 font-funnel">
          Join Our Newsletter
        </h2>
        <p className="text-zinc-300 text-base text-center mb-6">
          Stay updated with exclusive fitness tips and offers.
        </p>

        {/* Newsletter Form */}
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-center justify-center">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Your Name"
            className="flex-1 min-w-[150px] bg-zinc-800 text-white border border-zinc-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#faba22] transition-all duration-200 placeholder-zinc-500 text-base"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Your Email"
            className="flex-1 min-w-[150px] bg-zinc-800 text-white border border-zinc-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#faba22] transition-all duration-200 placeholder-zinc-500 text-base"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto px-6 py-3 rounded-lg bg-[#faba22] text-black font-bold text-base
                       hover:bg-yellow-500 transition-colors duration-300 shadow-md
                       disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-black" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Subscribing...
              </>
            ) : (
              "Subscribe"
            )}
          </button>
        </form>
        {message && (
          <p className={`text-center mt-4 text-sm font-semibold ${message.includes("failed") ? "text-red-400" : "text-green-400"}`}>
            {message}
          </p>
        )}
      </div>
    </section>
  );
};

export default Newsletter;
