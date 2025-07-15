import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdVerified } from "react-icons/md";

const Subscriber = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/admin/newsletter-subscribers`)
      .then((res) => {
        setSubscribers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching subscribers:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-3xl font-funnel text-[#faba22] mb-6">
        Newsletter Subscribers
      </h1>

      {loading ? (
        <p className="text-center text-lg">Loading Subscribers...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-lg border border-[#faba22]">
          <table className="min-w-full">
            <thead className="bg-[#faba22] text-black">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Subscribed At</th>
                <th className="px-4 py-2 text-left">Type</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub, index) => (
                <tr
                  key={sub._id}
                  className="border-b border-gray-700 hover:bg-[#1a1a1a] transition-colors"
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{sub.name}</td>
                  <td className="px-4 py-2">{sub.email}</td>
                  <td className="px-4 py-2">
                    {new Date(sub.subscribedAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 flex items-center gap-2">
                    {sub.type === "Registered User" ? (
                      <>
                        <span>Registered</span>
                        <MdVerified className="text-[#faba22] text-xl" />
                      </>
                    ) : (
                      <span>Guest</span>
                    )}
                  </td>
                </tr>
              ))}
              {subscribers.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center px-4 py-8 text-gray-400"
                  >
                    No subscribers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Subscriber;
