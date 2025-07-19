import React, { useState } from 'react'; 
import useAxios from '../../hooks/useAxios';
import { useQuery } from '@tanstack/react-query'; 


const ClassDetailsModal = ({ classItem, onClose }) => {
    if (!classItem) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 font-sans">
            <div className="bg-zinc-900 rounded-xl shadow-2xl border border-zinc-800 p-8  max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-zinc-400 hover:text-[#faba22] transition-colors text-3xl font-bold"
                    aria-label="Close"
                >
                    &times;
                </button>

                {/* Class Image */}
                <img
                    src={classItem.image}
                    alt={classItem.name}
                    className="w-full h-64 object-cover object-center rounded-lg mb-6"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/3f3f46/fafa00?text=No+Image"; }}
                />

                {/* Class Details */}
                <h3 className="text-4xl font-bold text-[#faba22] mb-4 font-funnel">{classItem.name}</h3>
                <p className="text-zinc-300 text-lg mb-6">{classItem.details}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg mb-6">
                    <p className="text-zinc-400">
                        <span className="font-semibold text-[#faba22]">Bookings:</span>{' '}
                        <span className="text-white">{classItem.totalBookings}</span>
                    </p>
                    {classItem.durationMinutes && (
                        <p className="text-zinc-400">
                            <span className="font-semibold text-[#faba22]">Duration:</span>{' '}
                            <span className="text-white">{classItem.durationMinutes} minutes</span>
                        </p>
                    )}
                    {classItem.difficulty && (
                        <p className="text-zinc-400">
                            <span className="font-semibold text-[#faba22]">Difficulty:</span>{' '}
                            <span className="text-white">{classItem.difficulty}</span>
                        </p>
                    )}
                    {classItem.trainers && classItem.trainers.length > 0 && (
                        <p className="text-zinc-400 col-span-full">
                            <span className="font-semibold text-[#faba22]">Trainers:</span>{' '}
                            <span className="text-white">
                                {classItem.trainers.map(t => t.name).join(', ')}
                            </span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};


const FeaturedClass = () => {
    // Keep useState only for the modal's selected class
    const [selectedClass, setSelectedClass] = useState(null);
    const axiosSecure = useAxios();

    // 📌 TanStack Query Implementation
    const { 
        data: featuredClasses, 
        isLoading,           
        isError,           
        error               
    } = useQuery({
        queryKey: ['featuredClasses'], // A unique key for this query
        queryFn: async () => {      
            const response = await axiosSecure.get(`${import.meta.env.VITE_API_URL}/featured-classes`);
            return response.data; 
        },
        refetchOnWindowFocus: false, 
    });

    const openModal = (classItem) => {
        setSelectedClass(classItem);
    };

    const closeModal = () => {
        setSelectedClass(null);
    };

    // Use isLoading from TanStack Query for loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 font-sans">
                <p className="text-white text-xl">Loading featured classes...</p>
            </div>
        );
    }

    // Use isError and error from TanStack Query for error state
    if (isError) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 font-sans">
                <p className="text-red-400 text-xl">Failed to load featured classes: {error.message || "An unknown error occurred."}</p>
            </div>
        );
    }

    // Check if data (featuredClasses) is available and not empty after loading
    if (!featuredClasses || featuredClasses.length === 0) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 font-sans">
                <p className="text-zinc-400 text-xl">No featured classes available at the moment.</p>
            </div>
        );
    }

    return (
        <section className="bg-zinc-950 py-32 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold text-[#faba22] text-center mb-12 font-funnel drop-shadow-lg">
                    Featured Classes
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Map over featuredClasses provided by TanStack Query */}
                    {featuredClasses.map((classItem) => (
                        <div
                            key={classItem._id}
                            className="group bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-zinc-700 transition-transform duration-300 hover:scale-[1.03] hover:shadow-yellow-500/20 relative"
                        >
                            <div className="relative">
                                <img
                                    src={classItem.image}
                                    alt={classItem.name}
                                    className="w-full h-56 object-cover object-center rounded-t-3xl group-hover:brightness-110 transition duration-300"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://placehold.co/400x200/3f3f46/fafa00?text=No+Image";
                                    }}
                                />

                                {/* Floating Badge / Class Title */}
                                <div className="absolute -bottom-6 left-4 bg-[#faba22] text-black px-5 py-2 rounded-full shadow-lg font-funnel text-lg font-semibold z-10">
                                    {classItem.name}
                                </div>
                            </div>

                            <div className="pt-10 pb-6 px-6">
                                {/* Class Description */}
                                <p className="text-zinc-400 text-sm mb-5 line-clamp-3 min-h-[72px]">
                                    {classItem.details}
                                </p>

                                {/* Booking + Button */}
                                <div className="flex items-center justify-between mt-auto pt-5 border-t border-zinc-700">
                                    <p className="text-[#faba22] font-bold text-base">
                                        Bookings: <span className="text-white">{classItem.totalBookings}</span>
                                    </p>

                                    <button
                                        onClick={() => openModal(classItem)}
                                        className="px-4 py-2 rounded-full bg-[#faba22] text-black font-semibold text-sm hover:bg-yellow-400 transition-colors"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Class Details Modal */}
            <ClassDetailsModal classItem={selectedClass} onClose={closeModal} />
        </section>
    );
};

export default FeaturedClass;