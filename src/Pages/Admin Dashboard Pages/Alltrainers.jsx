import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";

const AllTrainers = () => {
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const queryClient = useQueryClient();

  const { data: trainers = [], isLoading, error } = useQuery({
    queryKey: ["allTrainers"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/trainers`);
      return res.data;
    },
  });

  const { mutate: removeTrainer, isLoading: isRemoving } = useMutation({
    mutationFn: async (trainerId) => {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/trainers/${trainerId}/remove-role`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["allTrainers"]);
      setSelectedTrainer(null);
      Swal.fire({
        icon: "success",
        title: "Trainer removed successfully!",
        showConfirmButton: false,
        timer: 1500,
      });
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        title: "Failed to remove trainer",
        text: "Please try again later.",
      });
    },
  });

  if (isLoading) return <p className="text-center py-10">Loading Trainers...</p>;
  if (error) return <p className="text-center py-10 text-red-500">Error fetching trainers</p>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">All Trainers</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 rounded-lg">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Photo</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Experience</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trainers.map((trainer, index) => (
              <tr key={trainer._id} className="border-b border-gray-700 hover:bg-gray-700">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">
                  <img
                    src={trainer.photoURL}
                    alt={trainer.name}
                    className="w-12 h-12 object-cover rounded-full"
                  />
                </td>
                <td className="px-4 py-2">{trainer.name}</td>
                <td className="px-4 py-2">{trainer.email}</td>
                <td className="px-4 py-2">{trainer.yearsOfExperience} years</td>
                <td className="px-4 py-2">
                  <button
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                    onClick={() => setSelectedTrainer(trainer)}
                  >
                    Remove Role
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedTrainer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg w-full max-w-lg text-white max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Confirm Remove Trainer</h2>

            <div className="space-y-2">
              <img
                src={selectedTrainer.photoURL}
                alt={selectedTrainer.name}
                className="w-24 h-24 object-cover rounded-full mx-auto mb-4"
              />
              <p><strong>Name:</strong> {selectedTrainer.name}</p>
              <p><strong>Email:</strong> {selectedTrainer.email}</p>
              <p><strong>Experience:</strong> {selectedTrainer.yearsOfExperience} years</p>

              {selectedTrainer.expertise?.length > 0 && (
                <p><strong>Expertise:</strong> {selectedTrainer.expertise.join(", ")}</p>
              )}

              {selectedTrainer.availableDays?.length > 0 && (
                <p><strong>Available Days:</strong> {selectedTrainer.availableDays.join(", ")}</p>
              )}

              {selectedTrainer.availableSlots?.length > 0 && (
                <p><strong>Available Slots:</strong> {selectedTrainer.availableSlots.join(", ")}</p>
              )}

              {selectedTrainer.socialLinks && (
                <div>
                  <strong>Social Links:</strong>
                  <ul className="list-disc list-inside">
                    {Object.entries(selectedTrainer.socialLinks).map(([platform, link]) => (
                      <li key={platform}>
                        {platform}:{" "}
                        <a
                          href={typeof link === "string" ? link : link?.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          {typeof link === "string" ? link : link?.url}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedTrainer.additionalInfo && (
                <p><strong>Additional Info:</strong> {selectedTrainer.additionalInfo}</p>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-600 rounded"
                onClick={() => setSelectedTrainer(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
                onClick={() => removeTrainer(selectedTrainer._id)}
                disabled={isRemoving}
              >
                {isRemoving ? "Removing..." : "Confirm Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllTrainers;
