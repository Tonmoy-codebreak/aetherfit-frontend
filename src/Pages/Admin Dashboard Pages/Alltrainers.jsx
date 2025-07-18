import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { MdDeleteForever } from "react-icons/md";
import { FaTimes } from "react-icons/fa";
import useAxios from "../../hooks/useAxios";

const AllTrainers = () => {
  const axiosSecure = useAxios();
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const queryClient = useQueryClient();

  const { data: trainers = [], isLoading, error } = useQuery({
    queryKey: ["allTrainers"],
    queryFn: async () => {
      const res = await axiosSecure.get(`${import.meta.env.VITE_API_URL}/trainers`);
      return res.data;
    },
  });

  const { mutate: removeTrainer, isLoading: isRemoving } = useMutation({
    mutationFn: async (trainerId) => {
      await axiosSecure.delete(`${import.meta.env.VITE_API_URL}/trainers/${trainerId}/remove-role`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["allTrainers"]);
      setSelectedTrainer(null);
      Swal.fire({
        icon: "success",
        title: '<span style="color:#faba22">Trainer Removed!</span>',
        background: "black",
        color: "#faba22",
        confirmButtonColor: "#faba22",
        showConfirmButton: false,
        timer: 1500,
      });
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        title: '<span style="color:#faba22">Failed to Remove Trainer</span>',
        text: "Please try again later.",
        background: "black",
        color: "#faba22",
        confirmButtonColor: "#faba22",
      });
    },
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-zinc-950">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[#faba22] my-auto mx-auto"></div>
        <p className="text-[#faba22] ml-4 text-xl font-inter">Loading Trainers...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-zinc-950">
        <p className="text-red-500 text-xl font-inter">Error fetching trainers. Please try again later.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-inter p-8 sm:p-12 lg:p-16">
      <h1 className="text-5xl md:text-6xl font-bold font-funnel text-center mb-12 text-[#faba22] drop-shadow-lg">
        All Trainers
      </h1>

      {trainers.length === 0 ? (
        <div className="bg-zinc-900 p-8 rounded-xl shadow-lg text-center text-lg mt-8 border border-zinc-800">
          <p className="text-zinc-300">No trainers found in the system.</p>
        </div>
      ) : (
        <>
          <div className="hidden md:block bg-zinc-900 p-6 sm:p-8 rounded-xl shadow-lg border border-zinc-800 overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-700">
              <thead className="bg-zinc-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-zinc-400 uppercase tracking-wider rounded-tl-lg">#</th>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-zinc-400 uppercase tracking-wider">Photo</th>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-zinc-400 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-zinc-400 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-zinc-400 uppercase tracking-wider">Experience</th>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-zinc-400 uppercase tracking-wider rounded-tr-lg">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {trainers.map((trainer, index) => (
                  <tr key={trainer._id} className="bg-zinc-900 hover:bg-zinc-800 transition-colors duration-200">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-[#faba22]">{index + 1}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <img
                        src={trainer.photoURL || "https://placehold.co/48x48/363636/DDDDDD?text=No+Photo"}
                        alt={trainer.name || "Trainer"}
                        className="w-12 h-12 object-cover rounded-full border-2 border-zinc-700"
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/48x48/363636/DDDDDD?text=No+Photo"; }}
                      />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-zinc-300">{trainer.name || "N/A"}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-zinc-300">{trainer.email || "N/A"}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-zinc-300">
                      {trainer.yearsOfExperience ? `${trainer.yearsOfExperience} years` : "N/A"}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-left text-sm font-medium">
                      <button
                        className="p-2 bg-red-700 hover:bg-red-800 text-white rounded-full transition-colors duration-200 shadow-md"
                        onClick={() => setSelectedTrainer(trainer)}
                        title="Remove Trainer Role"
                      >
                        <MdDeleteForever size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden flex flex-col gap-6">
            {trainers.map((trainer, index) => (
              <div key={trainer._id} className="bg-zinc-900 p-4 rounded-xl shadow-lg border border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className="text-[#faba22] font-semibold text-lg">{index + 1}.</span>
                  <img
                    src={trainer.photoURL || "https://placehold.co/48x48/363636/DDDDDD?text=No+Photo"}
                    alt={trainer.name || "Trainer"}
                    className="w-14 h-14 rounded-full border-2 border-zinc-700 object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/48x48/363636/DDDDDD?text=No+Photo"; }}
                  />
                </div>

                <div className="flex-1 px-4 min-w-0">
                  <p className="text-lg font-semibold text-white truncate">{trainer.name || "N/A"}</p>
                  <p className="text-zinc-400 text-sm truncate">{trainer.email || "N/A"}</p>
                  <p className="text-zinc-300 text-sm mt-1">
                    <strong>Experience:</strong> {trainer.yearsOfExperience ? `${trainer.yearsOfExperience} years` : "N/A"}
                  </p>
                </div>

                <button
                  className="p-2 bg-red-700 hover:bg-red-800 text-white rounded-full transition-colors duration-200 shadow-md flex-shrink-0"
                  onClick={() => setSelectedTrainer(trainer)}
                  title="Remove Trainer Role"
                >
                  <MdDeleteForever size={22} />
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedTrainer && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedTrainer(null)}
        >
          <div
            className="bg-zinc-900 rounded-2xl w-full max-w-lg p-4 sm:p-6 relative shadow-2xl border border-zinc-700 transform scale-95 animate-scale-in mx-2 sm:mx-0"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedTrainer(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-[#faba22] text-2xl sm:text-3xl font-bold leading-none focus:outline-none transition-colors duration-200"
            >
              <FaTimes />
            </button>

            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-[#faba22] text-center font-funnel">Confirm Removal</h2>

            <div className="space-y-4 text-zinc-300 text-sm sm:text-base">
              <p className="text-center">Are you sure you want to remove the role of trainer from:</p>

              <div className="flex flex-col items-center gap-4 mb-4">
                <img
                  src={selectedTrainer.photoURL || "https://placehold.co/96x96/363636/DDDDDD?text=No+Photo"}
                  alt={selectedTrainer.name}
                  className="w-24 h-24 object-cover rounded-full border-4 border-[#faba22] shadow-md"
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/96x96/363636/DDDDDD?text=No+Photo"; }}
                />
                <p className="text-lg sm:text-xl font-semibold text-white">{selectedTrainer.name}</p>
                <p className="text-zinc-400">{selectedTrainer.email}</p>
              </div>

              <p className="text-center text-red-400 font-semibold text-xs sm:text-base">
                This action is irreversible and will remove all associated trainer data.
              </p>

              {/* Info for md and up */}
              <div className="hidden md:grid grid-cols-2 gap-4 mt-6">
                <div className="p-3 bg-zinc-800 rounded-lg border border-zinc-700">
                  <strong className="text-[#faba22]">Experience:</strong> {selectedTrainer.yearsOfExperience} years
                </div>
                {selectedTrainer.availableDays?.length > 0 && (
                  <div className="p-3 bg-zinc-800 rounded-lg border border-zinc-700">
                    <strong className="text-[#faba22]">Available Days:</strong> {selectedTrainer.availableDays.join(", ")}
                  </div>
                )}
                {selectedTrainer.expertise?.length > 0 && (
                  <div className="p-3 bg-zinc-800 rounded-lg border border-zinc-700 col-span-2">
                    <strong className="text-[#faba22]">Expertise:</strong> {selectedTrainer.expertise.join(", ")}
                  </div>
                )}
                {selectedTrainer.slots?.length > 0 && (
                  <div className="p-3 bg-zinc-800 rounded-lg border border-zinc-700 col-span-2">
                    <strong className="text-[#faba22]">Available Slots:</strong>{" "}
                    {selectedTrainer.slots.map((slot) => `${slot.day} ${slot.timeRange}`).join(", ")}
                  </div>
                )}
                {selectedTrainer.socialLinks?.length > 0 && (
                  <div className="p-3 bg-zinc-800 rounded-lg border border-zinc-700 col-span-2">
                    <strong className="text-[#faba22]">Social Links:</strong>
                    <ul className="list-disc list-inside ml-4 mt-2">
                      {selectedTrainer.socialLinks.map((link, idx) => (
                        <li key={idx}>
                          {link.platform}:{" "}
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            {link.url}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {selectedTrainer.additionalInfo && (
                  <div className="p-3 bg-zinc-800 rounded-lg border border-zinc-700 col-span-2">
                    <strong className="text-[#faba22]">Additional Info:</strong> {selectedTrainer.additionalInfo}
                  </div>
                )}
              </div>

              {/* Info for below md */}
              <div className="grid grid-cols-2 gap-4 mt-6 md:hidden">
                <div className="p-3 bg-zinc-800 rounded-lg border border-zinc-700">
                  <strong className="text-[#faba22]">Experience:</strong> {selectedTrainer.yearsOfExperience} years
                </div>
                {selectedTrainer.availableDays?.length > 0 && (
                  <div className="p-3 bg-zinc-800 rounded-lg border border-zinc-700">
                    <strong className="text-[#faba22]">Available Days:</strong> {selectedTrainer.availableDays.join(", ")}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row justify-end gap-4">
              <button
                className="w-full sm:w-auto px-6 py-3 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg font-semibold transition-colors duration-200 shadow-md"
                onClick={() => setSelectedTrainer(null)}
              >
                Cancel
              </button>
              <button
                className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors duration-200 shadow-md disabled:bg-red-800 disabled:opacity-70 disabled:cursor-not-allowed"
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
