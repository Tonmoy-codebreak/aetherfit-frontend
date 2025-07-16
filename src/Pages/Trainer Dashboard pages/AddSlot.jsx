import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { useAuth } from '../../AuthProvider/useAuth';

const hourOptions = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: i + 1 }));
const ampmOptions = [
  { value: 'AM', label: 'AM' },
  { value: 'PM', label: 'PM' },
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

  useEffect(() => {
    const fetchTrainerDataAndClasses = async () => {
      if (!user?.email) return;

      try {
        const trainerRes = await axios.get(`${import.meta.env.VITE_API_URL}/trainer-profiles/by-email?email=${user.email}`);
        setTrainerData(trainerRes.data);

        const classesRes = await axios.get(`${import.meta.env.VITE_API_URL}/classes`);
        // FIX: Access the 'classes' array from the response data object
        setClasses(classesRes.data.classes); 

      } catch (err) {
        console.error('Error fetching data:', err);
        Swal.fire('Error', 'Failed to load trainer data or classes.', 'error');
      }
    };

    fetchTrainerDataAndClasses();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, selectedOption) => {
    setFormData((prev) => ({ ...prev, [name]: selectedOption }));
  };

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

  if (!trainerData) {
    return <div className="text-center pt-20 text-[#faba22]">Loading trainer data...</div>;
  }

  const availableDaysOptions = trainerData.availableDays?.map(day => ({ value: day, label: day })) || [];
  const classOptions = classes.map(cls => ({ value: cls._id, label: cls.name }));

  return (
    <div className="max-w-4xl mx-auto p-6 pt-20 bg-black min-h-screen text-[#faba22]">
      <h1 className="text-4xl font-bold font-funnel text-center mb-10">Add New Slot</h1>

      <div className="bg-zinc-900 p-8 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-semibold mb-6">Trainer Information (Read-Only)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="text" value={trainerData.email || ''} readOnly className="w-full px-4 py-2 bg-zinc-800 rounded-md opacity-80 cursor-not-allowed text-[#faba22]" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Years of Experience</label>
            <input type="text" value={trainerData.yearsOfExperience || '0'} readOnly className="w-full px-4 py-2 bg-zinc-800 rounded-md opacity-80 cursor-not-allowed text-[#faba22]" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Skills</label>
            <input type="text" value={trainerData.skills?.join(', ') || 'N/A'} readOnly className="w-full px-4 py-2 bg-zinc-800 rounded-md opacity-80 cursor-not-allowed text-[#faba22]" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea value={trainerData.bio || ''} readOnly rows="3" className="w-full px-4 py-2 bg-zinc-800 rounded-md opacity-80 cursor-not-allowed text-[#faba22]"></textarea>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6">Add New Slot Form</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="slotName" className="block text-lg font-medium mb-2">Slot Name</label>
            <input
              type="text"
              id="slotName"
              name="slotName"
              value={formData.slotName}
              onChange={handleInputChange}
              placeholder="e.g., Morning Strength Slot"
              className="w-full px-4 py-3 bg-zinc-800 rounded-md text-[#faba22] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#faba22]"
              required
            />
          </div>

          <div>
            <label htmlFor="selectedDay" className="block text-lg font-medium mb-2">Select Day</label>
            <Select
              id="selectedDay"
              name="selectedDay"
              options={availableDaysOptions}
              value={formData.selectedDay}
              onChange={(option) => handleSelectChange('selectedDay', option)}
              placeholder="Select an available day"
              classNamePrefix="react-select"
              className="text-black"
              required
            />
          </div>

          <div>
            <label htmlFor="slotDuration" className="block text-lg font-medium mb-2">Slot Time (Hours)</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                id="slotDuration"
                name="slotDuration"
                value={formData.slotDuration}
                onChange={handleInputChange}
                min="1"
                placeholder="e.g., 1"
                className="w-24 px-4 py-3 bg-zinc-800 rounded-md text-[#faba22] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#faba22]"
                required
              />
              <span className="text-lg">hour(s)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-medium mb-2">Start Time</label>
              <div className="flex gap-4">
                <Select
                  options={hourOptions}
                  value={formData.startTimeHour}
                  onChange={(option) => handleSelectChange('startTimeHour', option)}
                  placeholder="Hour"
                  classNamePrefix="react-select"
                  className="flex-1 text-black"
                  required
                />
                <Select
                  options={ampmOptions}
                  value={formData.startTimeAMPM}
                  onChange={(option) => handleSelectChange('startTimeAMPM', option)}
                  placeholder="AM/PM"
                  classNamePrefix="react-select"
                  className="flex-1 text-black"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-lg font-medium mb-2">End Time (Auto-calculated)</label>
              <input
                type="text"
                value={timeRange || 'Select start time and duration'}
                readOnly
                className="w-full px-4 py-3 bg-zinc-800 rounded-md opacity-80 cursor-not-allowed text-[#faba22]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="selectedClass" className="block text-lg font-medium mb-2">Class to include</label>
            <Select
              id="selectedClass"
              name="selectedClass"
              options={classOptions}
              value={formData.selectedClass}
              onChange={(option) => handleSelectChange('selectedClass', option)}
              placeholder="Select a class"
              classNamePrefix="react-select"
              className="text-black"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#faba22] hover:bg-black hover:text-[#faba22] border-2 border-[#faba22] text-black font-bold py-4 rounded-md transition duration-300 ease-in-out text-xl"
          >
            Add Slot
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSlot;
