import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router";

const TrainerApplication = () => {
  const { data: applications = [], isLoading, error: fetchError } = useQuery({
    queryKey: ["pendingApplications"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/trainer-applications/admin`
      );
      return res.data;
    },
  });

  if (isLoading) return <p className="text-center py-10">Loading Applications...</p>;
  if (fetchError) return <p className="text-center py-10 text-red-500">Error loading applications</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Pending Trainer Applications</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 rounded-lg">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app, index) => (
              <tr key={app._id} className="border-b border-gray-700 hover:bg-gray-700">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{app.fullName}</td>
                <td className="px-4 py-2">{app.email}</td>
                <td className="px-4 py-2">
                  <Link
                    to={`/dashboard/admin/appliedtrainers/${app._id}`}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
                  >
                    Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrainerApplication;
