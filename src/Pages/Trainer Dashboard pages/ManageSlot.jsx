import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../../AuthProvider/useAuth';
import { MdDeleteForever } from 'react-icons/md';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import useAxios from '../../hooks/useAxios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const ManageSlot = () => {
    const { user } = useAuth();
    const axiosSecure = useAxios();
    const queryClient = useQueryClient();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [slotToDelete, setSlotToDelete] = useState(null);

    const {
        data: trainerSlotsData,
        isLoading: isLoadingSlots,
        isError: isSlotsError,
        error: slotsError,
    } = useQuery({
        queryKey: ["trainerSlots", user?.email],
        queryFn: async () => {
            if (!user?.email) {
                return { slotsWithBooking: [], trainerProfileId: null };
            }
            const res = await axiosSecure.get(`${import.meta.env.VITE_API_URL}/trainer-profiles/slots-by-email/${user.email}`);
            return res.data;
        },
        enabled: !!user?.email,
        staleTime: 1000 * 60,
        cacheTime: 1000 * 60 * 5,
        onError: (err) => {
            console.error('Error fetching trainer slots:', err);
        },
    });

    const trainerSlots = trainerSlotsData?.slotsWithBooking || [];
    const trainerProfileId = trainerSlotsData?.trainerProfileId;

    const { mutate: deleteSlotMutation, isPending: isDeletingSlot } = useMutation({
        mutationFn: async ({ trainerProfileId, slotTimeRange, day }) => {
            const encodedSlotTimeRange = encodeURIComponent(slotTimeRange);
            return axiosSecure.patch(
                `${import.meta.env.VITE_API_URL}/trainer-profiles/${trainerProfileId}/slots/${encodedSlotTimeRange}/delete`,
                { day }
            );
        },
        onSuccess: (response) => {
            Swal.fire('Deleted!', response.data?.message || 'The slot has been successfully deleted.', 'success');
            setShowDeleteModal(false);
            setSlotToDelete(null);
            queryClient.invalidateQueries(["trainerSlots", user?.email]);
        },
        onError: (err) => {
            console.error('Error deleting slot:', err);
            Swal.fire('Error', err.response?.data?.error || 'Failed to delete slot.', 'error');
        },
    });

    const openDeleteConfirmationModal = (slot) => {
        setSlotToDelete(slot);
        setShowDeleteModal(true);
    };

    const confirmDeletion = async () => {
        if (!trainerProfileId || !slotToDelete) {
            Swal.fire('Error', 'Trainer ID or slot information missing.', 'error');
            return;
        }

        Swal.fire({
            title: 'Are you absolutely sure?',
            text: "This action cannot be undone! If users have booked this slot, their bookings will be affected.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it permanently!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                deleteSlotMutation({
                    trainerProfileId: trainerProfileId,
                    slotTimeRange: slotToDelete.timeRange,
                    day: slotToDelete.day
                });
            }
        });
    };

    if (isLoadingSlots || isDeletingSlot) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-zinc-950">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[#faba22] my-auto mx-auto"></div>
                <p className="text-[#faba22] ml-4 text-xl">
                    {isDeletingSlot ? "Deleting slot..." : "Loading slots..."}
                </p>
            </div>
        );
    }

    if (isSlotsError) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-zinc-950">
                <p className="text-red-500 text-xl text-center mx-4">
                    Error: {slotsError?.message || 'Failed to load slots. Please try again.'}
                </p>
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
                                        <td className="px-2 py-2 text-left text-xs font-medium">
                                            <button
                                                onClick={() => openDeleteConfirmationModal(slot)}
                                                className="p-2 rounded-full bg-red-700 text-white hover:bg-red-800"
                                                title="Delete Slot"
                                                disabled={isDeletingSlot}
                                            >
                                                <MdDeleteForever size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

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
                                    <div className="text-zinc-400 font-medium">Actions</div>
                                    <div>
                                        <button
                                            onClick={() => openDeleteConfirmationModal(slot)}
                                            className="p-2 rounded-full bg-red-700 text-white hover:bg-red-800"
                                            title="Delete Slot"
                                            disabled={isDeletingSlot}
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

            {showDeleteModal && slotToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-zinc-900 rounded-lg p-6 sm:p-8 w-full max-w-md shadow-2xl border border-zinc-700">
                        <h2 className="text-2xl font-bold text-[#faba22] mb-4">Confirm Slot Deletion</h2>
                        <p className="text-zinc-300 mb-4">
                            You are about to delete the slot: <br />
                            <span className="font-semibold">{slotToDelete.slotName || 'N/A'}</span> on <span className="font-semibold">{slotToDelete.day || 'N/A'}</span> from <span className="font-semibold">{slotToDelete.timeRange || 'N/A'}</span> (Duration: <span className="font-semibold">{slotToDelete.slotTime || 'N/A'}</span>).
                        </p>

                        {slotToDelete.bookedBy && slotToDelete.bookedBy.length > 0 ? (
                            <div className="bg-zinc-800 p-4 rounded-md mb-4 border border-zinc-700">
                                <p className="text-red-400 font-semibold mb-2">Warning: This slot is currently booked! ⚠️</p>
                                <p className="text-zinc-300 mb-2">Booked by the following user(s):</p>
                                <ul className="list-disc list-inside text-zinc-300 space-y-1">
                                    {slotToDelete.bookedBy.map((booking, idx) => (
                                        <li key={idx}>
                                            <span className="font-bold text-white">{booking.userName}</span> (Email: {booking.userEmail})
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <p className="text-green-400 mb-4">This slot is currently available (not booked by any user). ✅</p>
                        )}

                        <p className="text-zinc-300 mb-6">
                            Deleting this slot will remove it permanently. Please confirm your action.
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setSlotToDelete(null);
                                }}
                                className="px-6 py-2 rounded-lg bg-zinc-700 text-white hover:bg-zinc-600 transition-colors duration-200"
                                disabled={isDeletingSlot}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDeletion}
                                className="px-6 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors duration-200"
                                disabled={isDeletingSlot}
                            >
                                {isDeletingSlot ? 'Deleting...' : 'Delete Slot'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageSlot;