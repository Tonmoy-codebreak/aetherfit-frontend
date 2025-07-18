import React from "react";
import { useQuery } from "@tanstack/react-query";
import { NavLink } from "react-router";
import { FaInfoCircle } from "react-icons/fa";
import useAxios from "../../hooks/useAxios";

const TrainerApplication = () => {
  const axiosSecure = useAxios();
  const { data: applications = [], isLoading, error: fetchError } = useQuery({
    queryKey: ["pendingApplications"],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `${import.meta.env.VITE_API_URL}/trainer-applications/admin`
      );
      return res.data;
    },
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-zinc-950">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[#faba22] my-auto mx-auto"></div>
        <p className="text-[#faba22] ml-4 text-xl font-inter">Loading Applications...</p>
      </div>
    );

  if (fetchError)
    return (
      <div className="flex justify-center items-center min-h-screen bg-zinc-950">
        <p className="text-red-500 text-xl font-inter">Error loading applications. Please try again later.</p>
      </div>
    );

  return (
    <div className="min-h-screen pt-20 bg-zinc-950 text-white font-inter p-8 sm:p-12 lg:p-16">
      <h1 className="text-3xl font-bold font-funnel text-center mb-12 text-[#faba22] drop-shadow-lg">
        Pending Trainer Applications
      </h1>

      {applications.length === 0 ? (
        <div className="bg-zinc-900 p-8 rounded-xl shadow-lg text-center text-lg mt-8 border border-zinc-800">
          <p className="text-zinc-300">No pending trainer applications found.</p>
        </div>
      ) : (
        <>
          <div className="hidden md:block bg-zinc-900 p-6 sm:p-8 rounded-xl shadow-lg border border-zinc-800">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-zinc-700">
                <thead className="bg-zinc-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-zinc-400 uppercase tracking-wider rounded-tl-lg">
                      #
                    </th>
                    <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-zinc-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-zinc-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-zinc-400 uppercase tracking-wider rounded-tr-lg">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {applications.map((app, index) => (
                    <tr key={app._id} className="bg-zinc-900 hover:bg-zinc-800 transition-colors duration-200">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-[#faba22]">
                        {index + 1}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-zinc-300">
                        {app.fullName || "N/A"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-zinc-300">
                        {app.email || "N/A"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-left text-sm font-medium">
                        <NavLink
                          to={`/dashboard/admin/appliedtrainers/${app._id}`}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-[#faba22] hover:bg-yellow-500 text-black rounded-lg font-semibold transition-colors duration-200 shadow-md"
                          title="View Application Details"
                        >
                          <FaInfoCircle size={18} />
                          Details
                        </NavLink>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col gap-6 md:hidden">
            {applications.map((app, index) => (
              <div
                key={app._id}
                className="bg-zinc-900 p-4 rounded-xl shadow-lg border border-zinc-800 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[#faba22] font-semibold">{index + 1}.</span>
                  <NavLink
                    to={`/dashboard/admin/appliedtrainers/${app._id}`}
                    className="flex items-center gap-2 px-3 py-2 bg-[#faba22] hover:bg-yellow-500 text-black rounded-lg font-semibold transition-colors duration-200 shadow-md"
                    title="View Application Details"
                  >
                    <FaInfoCircle size={16} />
                    Details
                  </NavLink>
                </div>

                <p className="text-lg font-semibold text-white">{app.fullName || "N/A"}</p>
                <p className="text-sm text-zinc-400">{app.email || "N/A"}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TrainerApplication;
