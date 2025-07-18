import React, { useEffect, useState } from "react";
import { MdVerified } from "react-icons/md";
import useAxios from "../../hooks/useAxios";

const Subscriber = () => {
  const axiosSecure = useAxios();
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosSecure
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
      <h1 className="text-2xl sm:text-3xl font-funnel text-[#faba22] mb-6">
        Newsletter Subscribers
      </h1>

      {loading ? (
        <p className="text-center text-base sm:text-lg">Loading Subscribers...</p>
      ) : (
        <div className="w-full rounded-lg shadow-lg border border-[#faba22]">
          {/* Table view for md and up */}
          <table className="hidden md:table min-w-full w-full">
            <thead className="bg-[#faba22] text-black text-sm sm:text-base">
              <tr>
                <th className="px-2 sm:px-4 py-2 text-left min-w-[50px]">#</th>
                <th className="px-2 sm:px-4 py-2 text-left min-w-[120px]">Name</th>
                <th className="px-2 sm:px-4 py-2 text-left min-w-[180px]">Email</th>
                <th className="px-2 sm:px-4 py-2 text-left min-w-[180px]">Subscribed At</th>
                <th className="px-2 sm:px-4 py-2 text-left min-w-[120px]">Type</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center px-4 py-8 text-gray-400">
                    No subscribers found
                  </td>
                </tr>
              ) : (
                subscribers.map((sub, index) => (
                  <tr
                    key={sub._id}
                    className="border-b border-gray-700 hover:bg-[#1a1a1a] transition-colors text-sm sm:text-base"
                  >
                    <td className="px-2 sm:px-4 py-2">{index + 1}</td>
                    <td className="px-2 sm:px-4 py-2 break-words">{sub.name}</td>
                    <td className="px-2 sm:px-4 py-2 break-words">{sub.email}</td>
                    <td className="px-2 sm:px-4 py-2 break-words">
                      {new Date(sub.subscribedAt).toLocaleString()}
                    </td>
                    <td className="px-2 sm:px-4 py-2 flex items-center gap-1 sm:gap-2">
                      {sub.type === "Registered User" ? (
                        <>
                          <span>Registered</span>
                          <MdVerified className="text-[#faba22] text-lg sm:text-xl" />
                        </>
                      ) : (
                        <span>Guest</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Card/List view for below md */}
          <div className="md:hidden flex flex-col gap-4 p-4">
            {subscribers.length === 0 && !loading ? (
              <p className="text-center text-gray-400 py-8">No subscribers found</p>
            ) : (
              subscribers.map((sub, idx) => (
                <div
                  key={sub._id}
                  className="bg-zinc-900 rounded-lg p-4 shadow hover:bg-[#1a1a1a] transition"
                >
                  <p>
                    <strong>#{idx + 1}</strong>
                  </p>
                  <p>
                    <strong>Name:</strong> {sub.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {sub.email}
                  </p>
                  <p>
                    <strong>Subscribed At:</strong>{" "}
                    {new Date(sub.subscribedAt).toLocaleString()}
                  </p>
                  <p className="flex items-center gap-2">
                    <strong>Type:</strong>
                    {sub.type === "Registered User" ? (
                      <>
                        <span>Registered</span>
                        <MdVerified className="text-[#faba22] text-lg" />
                      </>
                    ) : (
                      <span>Guest</span>
                    )}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscriber;
