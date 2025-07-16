import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuth } from '../../AuthProvider/useAuth';
import { MdDeleteForever } from 'react-icons/md';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';

const ManageSlot = () => {
  const { user } = useAuth();
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
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/trainer-profiles/slots-by-email/${user.email}`);
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
  }, [user]);

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
          const response = await axios.patch(
            `${import.meta.env.VITE_API_URL}/trainer-profiles/${trainerProfileId}/slots/${encodeURIComponent(slotTimeRange)}/delete`,
            { day: slotDay }
          );
          if (response.data?.message) {
            Swal.fire(
              'Deleted!',
              'Your slot has been deleted.',
              'success'
            );
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
    <div className="min-h-screen bg-zinc-950 text-[#faba22] p-8 sm:p-12 lg:p-16">
      <h1 className="text-5xl font-bold font-funnel text-center mb-12 text-white">Manage Your Slots</h1>

      {trainerSlots.length === 0 ? (
        <div className="bg-zinc-900 p-8 rounded-xl shadow-lg text-center text-lg mt-8 border border-zinc-800">
          <p className="text-zinc-300">You currently have no slots added. Ready to create some?</p>
          <p className="mt-4">
            <a href="/dashboard/add-slot" className="text-[#faba22] hover:underline">Go to "Add Slot" page</a> to get started!
          </p>
        </div>
      ) : (
        <div className="bg-zinc-900 p-6 sm:p-8 rounded-xl shadow-lg border border-zinc-800">
          <h2 className="text-3xl font-semibold mb-8 text-white">Your Current Slots</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-700">
              <thead className="bg-zinc-800">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-zinc-400 uppercase tracking-wider rounded-tl-lg">
                    #
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-zinc-400 uppercase tracking-wider">
                    Slot Name
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-zinc-400 uppercase tracking-wider">
                    Day
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-zinc-400 uppercase tracking-wider">
                    Time Range
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-zinc-400 uppercase tracking-wider">
                    Duration
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-zinc-400 uppercase tracking-wider">
                    Class
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-zinc-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-zinc-400 uppercase tracking-wider rounded-tr-lg">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {trainerSlots.map((slot, index) => (
                  <tr key={index} className="bg-zinc-900 hover:bg-zinc-800 transition-colors duration-200">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-[#faba22]">
                      {index + 1}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-zinc-300">
                      {slot.slotName || 'N/A'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-zinc-300">
                      {slot.day || 'N/A'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-zinc-300">
                      {slot.timeRange || 'N/A'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-zinc-300">
                      {slot.slotTime || 'N/A'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-zinc-300">
                      {slot.classInfo?.name || 'N/A'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {slot.bookedBy ? (
                        <span className="flex items-center text-green-500 font-semibold">
                          <IoMdCheckmarkCircleOutline className="mr-1" /> Booked by {slot.bookedBy.userName}
                          {slot.bookedBy.userEmail && <span className="ml-1 text-zinc-400 text-xs">({slot.bookedBy.userEmail})</span>}
                        </span>
                      ) : (
                        <span className="text-yellow-500 font-semibold">Available</span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-left text-sm font-medium">
                      <button
                        onClick={() => handleDeleteSlot(slot.day, slot.timeRange)}
                        disabled={!!slot.bookedBy}
                        className={`p-2 rounded-full transition-colors duration-200 ${
                          slot.bookedBy
                            ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                            : 'bg-red-700 text-white hover:bg-red-800'
                        }`}
                        title={slot.bookedBy ? "Cannot delete booked slot" : "Delete Slot"}
                      >
                        <MdDeleteForever size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSlot;
