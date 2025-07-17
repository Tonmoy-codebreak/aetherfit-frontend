import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { useAuth } from '../../AuthProvider/useAuth';

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

// Social platforms (unchanged logic)
const socialPlatforms = [
    { value: "Facebook", label: "Facebook" },
    { value: "Instagram", label: "Instagram" },
    { value: "Twitter", label: "Twitter" },
];

const AddSlot = () => {
    const { user } = useAuth();
    const [trainerData, setTrainerData] = useState(null);
    const [classes, setClasses] = useState([]);
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

    // Data fetching logic - MODIFIED
    useEffect(() => {
        const fetchTrainerDataAndClasses = async () => {
            if (!user?.email) return;

            try {
                const trainerRes = await axios.get(`${import.meta.env.VITE_API_URL}/trainer-profiles/by-email?email=${user.email}`);
                setTrainerData(trainerRes.data);

                // MODIFIED: Use the new /classes/all route to get all classes
                const classesRes = await axios.get(`${import.meta.env.VITE_API_URL}/classes/all`);
                setClasses(classesRes.data); // The new route directly returns an array of classes

            } catch (err) {
                console.error('Error fetching data:', err);
                Swal.fire('Error', 'Failed to load trainer data or classes.', 'error');
            }
        };

        fetchTrainerDataAndClasses();
    }, [user]);

    // Input change handlers (unchanged)
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, selectedOption) => {
        setFormData((prev) => ({ ...prev, [name]: selectedOption }));
    };

    // Form submission logic (unchanged)
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

        try {
            const response = await axios.patch(
                `${import.meta.env.VITE_API_URL}/trainer-profiles/${trainerData._id}/add-slot`,
                newSlot
            );

            if (response.data?.message) {
                Swal.fire('Success', response.data.message, 'success');
                setFormData({
                    slotName: '',
                    selectedDay: null,
                    slotDuration: 1,
                    startTimeHour: hourOptions[7],
                    startTimeAMPM: ampmOptions[0],
                    selectedClass: null,
                });
                // Refetch trainerData to update the UI with the new slot
                const trainerRes = await axios.get(`${import.meta.env.VITE_API_URL}/trainer-profiles/by-email?email=${user.email}`);
                setTrainerData(trainerRes.data);
            }
        } catch (err) {
            console.error('Error adding slot:', err);
            Swal.fire('Error', err.response?.data?.error || 'Failed to add slot.', 'error');
        }
    };

    // Helper for social platforms (unchanged)
    const getAvailableSocialPlatforms = (currentIndex) => {
        return socialPlatforms.map((platform) => ({
            ...platform,
            isDisabled: formData.socialLinks.some(
                (link, idx) => idx !== currentIndex && link.platform === platform.value
            ),
        }));
    };

    // Loading state UI (enhanced)
    if (!trainerData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[#faba22]"></div>
                <p className="text-[#faba22] ml-4 text-xl font-semibold font-inter">Loading trainer data...</p>
            </div>
        );
    }

    // Derived data for display (unchanged logic)
    const availableDaysOptions = trainerData.availableDays?.map(day => ({ value: day, label: day })) || [];
    const classOptions = classes.map(cls => ({ value: cls._id, label: cls.name }));

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
                <div className="bg-zinc-800 p-8 rounded-xl shadow-inner border border-zinc-700 mb-10">
                    <h2 className="text-3xl font-semibold mb-6 text-white">Trainer Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
                        <div>
                            <label className="block text-zinc-300 font-medium mb-1">Email</label>
                            <input type="text" value={trainerData.email || 'N/A'} readOnly className="w-full px-4 py-3 bg-zinc-700 rounded-lg text-white opacity-80 cursor-not-allowed border border-zinc-600" />
                        </div>
                        <div>
                            <label className="block text-zinc-300 font-medium mb-1">Years of Experience</label>
                            <input type="text" value={`${trainerData.yearsOfExperience || '0'} years`} readOnly className="w-full px-4 py-3 bg-zinc-700 rounded-lg text-white opacity-80 cursor-not-allowed border border-zinc-600" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-zinc-300 font-medium mb-1">Skills</label>
                            <input type="text" value={trainerData.skills?.join(', ') || 'N/A'} readOnly className="w-full px-4 py-3 bg-zinc-700 rounded-lg text-white opacity-80 cursor-not-allowed border border-zinc-600" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-zinc-300 font-medium mb-1">Bio</label>
                            <textarea value={trainerData.bio || 'No bio available.'} readOnly rows="3" className="w-full px-4 py-3 bg-zinc-700 rounded-lg text-white opacity-80 cursor-not-allowed resize-none border border-zinc-600"></textarea>
                        </div>
                    </div>
                </div>

                {/* Add New Slot Form Section */}
                <div className="bg-zinc-800 p-8 rounded-xl shadow-inner border border-zinc-700">
                    <h2 className="text-3xl font-semibold mb-6 text-white">Add New Slot Form</h2>
                    <form onSubmit={handleSubmit} className="space-y-8"> {/* Increased space-y */}
                        <div>
                            <label htmlFor="slotName" className="block text-lg font-medium mb-2 text-zinc-300">Slot Name</label>
                            <input
                                type="text"
                                id="slotName"
                                name="slotName"
                                value={formData.slotName}
                                onChange={handleInputChange}
                                placeholder="e.g., Morning Strength Slot"
                                className="w-full px-5 py-4 bg-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#faba22] border border-zinc-600 text-lg"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="selectedDay" className="block text-lg font-medium mb-2 text-zinc-300">Select Day</label>
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
                            <label htmlFor="slotDuration" className="block text-lg font-medium mb-2 text-zinc-300">Slot Duration</label>
                            <div className="flex items-center gap-4"> {/* Increased gap */}
                                <input
                                    type="number"
                                    id="slotDuration"
                                    name="slotDuration"
                                    value={formData.slotDuration}
                                    onChange={handleInputChange}
                                    min="1"
                                    placeholder="e.g., 1"
                                    className="w-28 px-5 py-4 bg-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#faba22] border border-zinc-600 text-lg"
                                    required
                                />
                                <span className="text-xl font-medium text-zinc-300">hour(s)</span> {/* Larger text */}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8"> {/* Increased gap */}
                            <div>
                                <label className="block text-lg font-medium mb-2 text-zinc-300">Start Time</label>
                                <div className="flex gap-4"> {/* Increased gap */}
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
                                <label className="block text-lg font-medium mb-2 text-zinc-300">End Time (Auto-calculated)</label>
                                <input
                                    type="text"
                                    value={timeRange || 'Select start time and duration'}
                                    readOnly
                                    className="w-full px-5 py-4 bg-zinc-700 rounded-lg text-white opacity-80 cursor-not-allowed border border-zinc-600 text-lg"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="selectedClass" className="block text-lg font-medium mb-2 text-zinc-300">Class to include</label>
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
                            className="w-full py-4 rounded-xl bg-[#faba22] text-black font-bold text-xl
                                         hover:bg-yellow-500 transition-all duration-300 shadow-lg hover:shadow-xl
                                         transform hover:-translate-y-1"
                        >
                            Add Slot
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddSlot;