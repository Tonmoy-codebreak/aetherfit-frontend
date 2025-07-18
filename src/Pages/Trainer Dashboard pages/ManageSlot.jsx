import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../../AuthProvider/useAuth';
import { MdDeleteForever } from 'react-icons/md';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import useAxios from '../../hooks/useAxios';

const ManageSlot = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const [trainerSlots, setTrainerSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trainerProfileId, setTrainerProfileId] = useState(null);

  const fetchTrainerSlots = async () => {
    if (!user?.email) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await axiosSecure.get(`${import.meta.env.VITE_API_URL}/trainer-profiles/slots-by-email/${user.email}`);
      setTrainerSlots(res.data.slotsWithBooking);
      setTrainerProfileId(res.data.trainerProfileId);
    } catch (err) {
      console.error('Error fetching trainer slots:', err);
      setError('Failed to load slots. Please try again.');
      Swal.fire('Error', 'Failed to load slots.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainerSlots();
  }, [user, axiosSecure]);

  const handleDeleteSlot = async (slotDay, slotTimeRange) => {
    if (!trainerProfileId) {
      Swal.fire('Error', 'Trainer ID not found. Cannot delete slot.', 'error');
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axiosSecure.patch(
            `${import.meta.env.VITE_API_URL}/trainer-profiles/${trainerProfileId}/slots/${encodeURIComponent(slotTimeRange)}/delete`,
            { day: slotDay }
          );
          if (response.data?.message) {
            Swal.fire('Deleted!', 'Your slot has been deleted.', 'success');
            fetchTrainerSlots();
          }
        } catch (err) {
          console.error('Error deleting slot:', err);
          Swal.fire('Error', err.response?.data?.error || 'Failed to delete slot.', 'error');
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-zinc-950">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[#faba22] my-auto mx-auto"></div>
        <p className="text-[#faba22] ml-4 text-xl">Loading slots...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-zinc-950">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-[#faba22] p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-funnel text-center mb-8 lg:mb-12 text-white">Manage Your Slots</h1>

      {trainerSlots.length === 0 ? (
        <div className="bg-zinc-900 p-6 sm:p-8 rounded-xl shadow-lg text-center text-base sm:text-lg mt-6 border border-zinc-800">
          <p className="text-zinc-300">You currently have no slots added. Ready to create some?</p>
          <p className="mt-4">
            <a href="/dashboard/add-slot" className="text-[#faba22] hover:underline">Go to "Add Slot" page</a> to get started!
          </p>
        </div>
      ) : (
        <div className="bg-zinc-900 p-4 sm:p-6 rounded-xl shadow-lg border border-zinc-800">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6 lg:mb-8 text-white">Your Current Slots</h2>

          {/* Table for md and larger screens */}
          <div className="hidden md:block overflow-x-auto">
            <table className="table-auto w-full divide-y divide-zinc-700">
              <thead className="bg-zinc-800">
                <tr>
                  <th className="px-2 py-2 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">#</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Slot Name</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Day</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Time Range</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Duration</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Class</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Status</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {trainerSlots.map((slot, index) => (
                  <tr key={index} className="bg-zinc-900 hover:bg-zinc-800 transition-colors duration-200">
                    <td className="px-2 py-2 text-xs font-medium text-[#faba22]">{index + 1}</td>
                    <td className="px-2 py-2 text-xs text-zinc-300 break-words max-w-[120px]">{slot.slotName || 'N/A'}</td>
                    <td className="px-2 py-2 text-xs text-zinc-300">{slot.day || 'N/A'}</td>
                    <td className="px-2 py-2 text-xs text-zinc-300 break-words max-w-[100px]">{slot.timeRange || 'N/A'}</td>
                    <td className="px-2 py-2 text-xs text-zinc-300">{slot.slotTime || 'N/A'}</td>
                    <td className="px-2 py-2 text-xs text-zinc-300">{slot.classInfo?.name || 'N/A'}</td>
                    <td className="px-2 py-2 text-xs">
                      {slot.bookedBy ? (
                        <span className="flex flex-col text-green-500 font-semibold text-xs">
                          <IoMdCheckmarkCircleOutline className="inline-block mr-1" size={14} /> {slot.bookedBy.userName}
                        </span>
                      ) : (
                        <span className="text-yellow-500 font-semibold text-xs">Available</span>
                      )}
                    </td>
                    <td className="px-2 py-2 text-left text-xs font-medium">
                      <button
                        onClick={() => handleDeleteSlot(slot.day, slot.timeRange)}
                        disabled={!!slot.bookedBy}
                        className={`p-2 rounded-full ${
                          slot.bookedBy
                            ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                            : 'bg-red-700 text-white hover:bg-red-800'
                        }`}
                        title={slot.bookedBy ? "Cannot delete booked slot" : "Delete Slot"}
                      >
                        <MdDeleteForever size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Card layout for screens smaller than md */}
          <div className="md:hidden space-y-4">
            {trainerSlots.map((slot, index) => (
              <div key={index} className="bg-zinc-900 p-4 rounded-xl shadow-lg border border-zinc-800 text-sm">
                <div className="grid grid-cols-2 gap-y-2">
                  <div className="text-zinc-400 font-medium">#</div>
                  <div className="text-[#faba22]">{index + 1}</div>
                  <div className="text-zinc-400 font-medium">Slot Name</div>
                  <div className="text-zinc-300">{slot.slotName || 'N/A'}</div>
                  <div className="text-zinc-400 font-medium">Day</div>
                  <div className="text-zinc-300">{slot.day || 'N/A'}</div>
                  <div className="text-zinc-400 font-medium">Time Range</div>
                  <div className="text-zinc-300">{slot.timeRange || 'N/A'}</div>
                  <div className="text-zinc-400 font-medium">Duration</div>
                  <div className="text-zinc-300">{slot.slotTime || 'N/A'}</div>
                  <div className="text-zinc-400 font-medium">Class</div>
                  <div className="text-zinc-300">{slot.classInfo?.name || 'N/A'}</div>
                  <div className="text-zinc-400 font-medium">Status</div>
                  <div>
                    {slot.bookedBy ? (
                      <span className="flex flex-col items-start text-green-500 font-semibold">
                        <IoMdCheckmarkCircleOutline className="mr-1 inline-block" size={14} /> {slot.bookedBy.userName}
                      </span>
                    ) : (
                      <span className="text-yellow-500 font-semibold">Available</span>
                    )}
                  </div>
                  <div className="text-zinc-400 font-medium">Actions</div>
                  <div>
                    <button
                      onClick={() => handleDeleteSlot(slot.day, slot.timeRange)}
                      disabled={!!slot.bookedBy}
                      className={`p-2 rounded-full ${
                        slot.bookedBy
                          ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                          : 'bg-red-700 text-white hover:bg-red-800'
                      }`}
                      title={slot.bookedBy ? "Cannot delete booked slot" : "Delete Slot"}
                    >
                      <MdDeleteForever size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSlot;
