import React, { useState } from 'react'; // Removed useEffect
import Select from 'react-select';
import Swal from 'sweetalert2';
import { useAuth } from '../../AuthProvider/useAuth';
import useAxios from '../../hooks/useAxios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; 

// Options for dropdowns (unchanged logic)
const hourOptions = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: i + 1 }));
const ampmOptions = [
    { value: 'AM', label: 'AM' },
    { value: 'PM', label: 'PM' },
];

// Days options (unchanged logic)
const daysOptions = [
    { value: "Sun", label: "Sun" },
    { value: "Mon", label: "Mon" },
    { value: "Tue", label: "Tue" },
    { value: "Wed", label: "Wed" },
    { value: "Thu", label: "Thu" },
    { value: "Fri", label: "Fri" },
    { value: "Sat", label: "Sat" },
];

// Social platforms (unchanged logic - though not used in this component, keeping it as per original)
const socialPlatforms = [
    { value: "Facebook", label: "Facebook" },
    { value: "Instagram", label: "Instagram" },
    { value: "Twitter", label: "Twitter" },
];

const AddSlot = () => {
    const axiosSecure = useAxios();
    const { user } = useAuth();
    const queryClient = useQueryClient(); // Get query client for invalidation

    const [formData, setFormData] = useState({
        slotName: '',
        selectedDay: null,
        slotDuration: 1,
        startTimeHour: hourOptions[7],
        startTimeAMPM: ampmOptions[0],
        selectedClass: null,
    });

    // Logic to calculate end time (unchanged)
    const calculateEndTime = () => {
        if (!formData.startTimeHour || !formData.startTimeAMPM || !formData.slotDuration) {
            return '';
        }

        let hour = formData.startTimeHour.value;
        let ampm = formData.startTimeAMPM.value;
        const duration = parseInt(formData.slotDuration);

        if (isNaN(duration) || duration <= 0) return '';

        let totalHours = hour + duration;

        if (ampm === 'AM' && totalHours >= 12) {
            if (totalHours > 12) {
                totalHours -= 12;
            }
            ampm = 'PM';
        } else if (ampm === 'PM' && totalHours >= 12) {
            if (totalHours > 12) {
                totalHours -= 12;
            }
            if (hour !== 12 && totalHours === 12) {
                // This empty block can be removed
            } else if (totalHours > 12) {
                totalHours -= 12;
            }
        }

        if (hour === 12 && totalHours > 12 && ampm === 'AM') {
            totalHours -= 12;
        }
        if (hour === 12 && totalHours > 12 && ampm === 'PM') {
            totalHours -= 12;
        }

        return `${totalHours} ${ampm}`;
    };

    const endTime = calculateEndTime();
    const timeRange = formData.startTimeHour?.value && endTime ?
        `${formData.startTimeHour.value} ${formData.startTimeAMPM.value} - ${endTime}` : '';

    // TanStack Query for fetching trainer data
    const { data: trainerData, isLoading: isLoadingTrainer, isError: isTrainerError } = useQuery({
        queryKey: ["trainerProfile", user?.email], // Unique key for trainer data
        queryFn: async () => {
            if (!user?.email) {
                return null;
            }
            const res = await axiosSecure.get(`${import.meta.env.VITE_API_URL}/trainer-profiles/by-email?email=${user.email}`);
            return res.data;
        },
        enabled: !!user?.email, // Only fetch if user email is available
        staleTime: 1000 * 60 * 5, // Data considered fresh for 5 minutes
        cacheTime: 1000 * 60 * 10, // Keep cached for 10 minutes
        onError: (err) => {
            console.error('Error fetching trainer data:', err);
            Swal.fire('Error', 'Failed to load trainer data.', 'error');
        },
    });

    // TanStack Query for fetching all classes
    const { data: classes, isLoading: isLoadingClasses, isError: isClassesError } = useQuery({
        queryKey: ["classes"], // Unique key for classes data
        queryFn: async () => {
            const res = await axiosSecure.get(`${import.meta.env.VITE_API_URL}/classes/all`);
            return res.data;
        },
        staleTime: 1000 * 60 * 30, // Classes data might be relatively stable, 30 min fresh
        cacheTime: 1000 * 60 * 60, // Keep cached for 1 hour
        onError: (err) => {
            console.error('Error fetching classes:', err);
            Swal.fire('Error', 'Failed to load classes.', 'error');
        },
    });

    // TanStack Query for adding a new slot (mutation)
    const { mutate: addSlotMutation, isPending: isAddingSlot } = useMutation({
        mutationFn: async (newSlotData) => {
            return axiosSecure.patch(
                `${import.meta.env.VITE_API_URL}/trainer-profiles/${trainerData._id}/add-slot`,
                newSlotData
            );
        },
        onSuccess: (response) => {
            Swal.fire('Success', response.data?.message || 'Slot added successfully!', 'success');
            setFormData({
                slotName: '',
                selectedDay: null,
                slotDuration: 1,
                startTimeHour: hourOptions[7],
                startTimeAMPM: ampmOptions[0],
                selectedClass: null,
            });
            // Invalidate the trainerProfile query to refetch updated trainerData (with new slot)
            queryClient.invalidateQueries(["trainerProfile", user?.email]);
            // You might also invalidate a 'slots' query if you had one showing all trainer's slots
        },
        onError: (err) => {
            console.error('Error adding slot:', err);
            Swal.fire('Error', err.response?.data?.error || 'Failed to add slot.', 'error');
        },
    });

    // Input change handlers (unchanged)
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, selectedOption) => {
        setFormData((prev) => ({ ...prev, [name]: selectedOption }));
    };

    // Form submission logic (now triggers the mutation)
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!trainerData) {
            Swal.fire('Error', 'Trainer data not loaded. Please wait.', 'error');
            return;
        }
        if (!formData.slotName.trim() || !formData.selectedDay || !formData.slotDuration || !formData.startTimeHour || !formData.startTimeAMPM || !formData.selectedClass) {
            Swal.fire('Error', 'Please fill in all required fields.', 'error');
            return;
        }
        if (isNaN(parseInt(formData.slotDuration)) || parseInt(formData.slotDuration) <= 0) {
            Swal.fire('Error', 'Slot time must be a positive number of hours.', 'error');
            return;
        }
        if (!timeRange) {
            Swal.fire('Error', 'Could not calculate slot time range. Please check start time and duration.', 'error');
            return;
        }

        const newSlot = {
            day: formData.selectedDay.value,
            slotName: formData.slotName.trim(),
            time: timeRange,
            duration: formData.slotDuration,
            classId: formData.selectedClass.value,
        };

        // Trigger the mutation
        addSlotMutation(newSlot);
    };

    // Helper for social platforms (unchanged - though not used in this component, keeping it as per original)
    const getAvailableSocialPlatforms = (currentIndex) => {
        return socialPlatforms.map((platform) => ({
            ...platform,
            isDisabled: false,
        }));
    };

    // Loading state UI (enhanced with TanStack Query states)
    if (isLoadingTrainer || isLoadingClasses) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[#faba22]"></div>
                <p className="text-[#faba22] ml-4 text-xl font-semibold font-inter">Loading data...</p>
            </div>
        );
    }

    // Error state UI
    if (isTrainerError || isClassesError || !trainerData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950">
                <p className="text-red-500 text-xl font-semibold font-inter text-center mx-4">
                    Failed to load required data. Please try again later.
                </p>
            </div>
        );
    }

    // Derived data for display (unchanged logic)
    const availableDaysOptions = trainerData.availableDays?.map(day => ({ value: day, label: day })) || [];
    const classOptions = classes?.map(cls => ({ value: cls._id, label: cls.name })) || []; // Ensure classes is defined before mapping

    return (
        <div className="min-h-screen bg-zinc-950 text-white font-inter p-4 sm:p-6 lg:p-8">
            {/* Custom styles for react-select components to match theme */}
            <style>{`
                .react-select__control {
                    background-color: #27272a !important; /* zinc-800 */
                    border-color: #3f3f46 !important; /* zinc-700 */
                    color: #fff !important;
                    padding: 0.5rem 0.75rem; /* py-3 px-4 */
                    border-radius: 0.5rem; /* rounded-md */
                    font-size: 1.125rem; /* text-lg */
                    min-height: 56px; /* Adjust height for consistency */
                }
                .react-select__control--is-focused {
                    border-color: #faba22 !important; /* faba22 */
                    box-shadow: 0 0 0 2px #faba22 !important; /* ring-2 ring-[#faba22] */
                }
                .react-select__single-value,
                .react-select__placeholder {
                    color: #fff !important;
                }
                .react-select__placeholder {
                    color: #a1a1aa !important; /* zinc-400 */
                }
                .react-select__menu {
                    background-color: #27272a !important; /* zinc-800 */
                    border-radius: 0.5rem;
                    z-index: 100;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-lg */
                }
                .react-select__option {
                    background-color: #27272a !important; /* zinc-800 */
                    color: #fff !important;
                    font-size: 1.125rem; /* text-lg */
                    padding: 0.75rem 1.25rem; /* py-3 px-5 */
                }
                .react-select__option--is-focused,
                .react-select__option--is-selected {
                    background-color: #faba22 !important; /* faba22 */
                    color: #000 !important; /* black */
                }
                .react-select__multi-value {
                    background-color: #faba22 !important; /* faba22 */
                    border-radius: 0.375rem; /* rounded-md */
                    color: #000 !important;
                }
                .react-select__multi-value__label {
                    color: #000 !important;
                    font-size: 1rem; /* text-base */
                }
                .react-select__multi-value__remove {
                    color: #000 !important;
                }
                .react-select__multi-value__remove:hover {
                    background-color: #d97706 !important; /* yellow-700 */
                    color: #000 !important;
                }
                .react-select__indicator-separator {
                    background-color: #52525b !important; /* zinc-600 */
                }
                .react-select__indicator {
                    color: #a1a1aa !important; /* zinc-400 */
                }
            `}</style>

            <div className="max-w-6xl mx-auto bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 p-8 md:p-12">
                <h1 className="text-4xl md:text-5xl font-bold font-funnel text-center mb-10 text-[#faba22] drop-shadow-lg">
                    Add New Slot
                </h1>

                {/* Trainer Information Section */}
                <div className="bg-zinc-800 p-6 rounded-xl shadow-inner border border-zinc-700 mb-10">
                    <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-white">Trainer Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-base sm:text-lg">
                        <div>
                            <label className="block text-zinc-300 font-medium mb-1">Email</label>
                            <input type="text" value={trainerData.email || 'N/A'} readOnly className="w-full px-4 py-3 bg-zinc-700 rounded-lg text-white opacity-80 cursor-not-allowed border border-zinc-600" />
                        </div>
                        <div>
                            <label className="block text-zinc-300 font-medium mb-1">Years of Experience</label>
                            <input type="text" value={`${trainerData.yearsOfExperience || '0'} years`} readOnly className="w-full px-4 py-3 bg-zinc-700 rounded-lg text-white opacity-80 cursor-not-allowed border border-zinc-600" />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-zinc-300 font-medium mb-1">Skills</label>
                            <input type="text" value={trainerData.skills?.join(', ') || 'N/A'} readOnly className="w-full px-4 py-3 bg-zinc-700 rounded-lg text-white opacity-80 cursor-not-allowed border border-zinc-600" />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-white font-medium mb-1">Bio</label>
                            <textarea value={trainerData.bio || 'No bio available.'} readOnly rows="3" className="w-full px-4 py-3 bg-zinc-700 rounded-lg text-white opacity-100 cursor-not-allowed resize-none border border-zinc-600"></textarea>
                        </div>
                    </div>
                </div>

                {/* Add New Slot Form Section */}
                <div className="bg-zinc-800 p-6 rounded-xl shadow-inner border border-zinc-700">
                    <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-white">Add New Slot Form</h2>
                    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                        <div>
                            <label htmlFor="slotName" className="block text-base sm:text-lg font-medium mb-2 text-zinc-300">Slot Name</label>
                            <input
                                type="text"
                                id="slotName"
                                name="slotName"
                                value={formData.slotName}
                                onChange={handleInputChange}
                                placeholder="e.g., Morning Strength Slot"
                                className="w-full px-4 py-3 sm:px-5 sm:py-4 bg-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#faba22] border border-zinc-600 text-base sm:text-lg"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="selectedDay" className="block text-base sm:text-lg font-medium mb-2 text-zinc-300">Select Day</label>
                            <Select
                                id="selectedDay"
                                name="selectedDay"
                                options={availableDaysOptions}
                                value={formData.selectedDay}
                                onChange={(option) => handleSelectChange('selectedDay', option)}
                                placeholder="Select an available day"
                                classNamePrefix="react-select"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="slotDuration" className="block text-base sm:text-lg font-medium mb-2 text-zinc-300">Slot Duration</label>
                            <div className="flex items-center gap-3 sm:gap-4">
                                <input
                                    type="number"
                                    id="slotDuration"
                                    name="slotDuration"
                                    value={formData.slotDuration}
                                    onChange={handleInputChange}
                                    min="1"
                                    placeholder="e.g., 1"
                                    className="w-24 sm:w-28 px-4 py-3 sm:px-5 sm:py-4 bg-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#faba22] border border-zinc-600 text-base sm:text-lg"
                                    required
                                />
                                <span className="text-base sm:text-xl font-medium text-zinc-300">hour(s)</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                            <div>
                                <label className="block text-base sm:text-lg font-medium mb-2 text-zinc-300">Start Time</label>
                                <div className="flex flex-col md:flex gap-3 md:gap-4">
                                    <Select
                                        options={hourOptions}
                                        value={formData.startTimeHour}
                                        onChange={(option) => handleSelectChange('startTimeHour', option)}
                                        placeholder="Hour"
                                        classNamePrefix="react-select"
                                        required
                                    />
                                    <Select
                                        options={ampmOptions}
                                        value={formData.startTimeAMPM}
                                        onChange={(option) => handleSelectChange('startTimeAMPM', option)}
                                        placeholder="AM/PM"
                                        classNamePrefix="react-select"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-base sm:text-lg font-medium mb-2 text-zinc-300">End Time (Auto-calculated)</label>
                                <input
                                    type="text"
                                    value={timeRange || 'Select start time and duration'}
                                    readOnly
                                    className="w-full px-4 py-3 sm:px-5 sm:py-4 bg-zinc-700 rounded-lg text-white opacity-80 cursor-not-allowed border border-zinc-600 text-base sm:text-lg"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="selectedClass" className="block text-base sm:text-lg font-medium mb-2 text-zinc-300">Class to include</label>
                            <Select
                                id="selectedClass"
                                name="selectedClass"
                                options={classOptions}
                                value={formData.selectedClass}
                                onChange={(option) => handleSelectChange('selectedClass', option)}
                                placeholder="Select a class for this slot"
                                classNamePrefix="react-select"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isAddingSlot} // Disable button when mutation is pending
                            className="w-full py-3 sm:py-4 rounded-xl bg-[#faba22] text-black font-bold text-lg sm:text-xl
                                    hover:bg-yellow-500 transition-all duration-300 shadow-lg hover:shadow-xl
                                    transform hover:-translate-y-1"
                        >
                            {isAddingSlot ? (
                                <div className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-black" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Adding Slot...
                                </div>
                            ) : (
                                'Add Slot'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddSlot;