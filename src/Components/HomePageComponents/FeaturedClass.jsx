import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Modal Component
const ClassDetailsModal = ({ classItem, onClose }) => {
    if (!classItem) return null; // Don't render if no class item is provided

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 font-sans">
            <div className="bg-zinc-900 rounded-xl shadow-2xl border border-zinc-800 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
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
                    {/* Add other class info if available in classItem from your backend */}
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
                    {/* Example for trainers, assuming classItem.trainers is an array of trainer objects */}
                    {classItem.trainers && classItem.trainers.length > 0 && (
                        <p className="text-zinc-400 col-span-full">
                            <span className="font-semibold text-[#faba22]">Trainers:</span>{' '}
                            <span className="text-white">
                                {classItem.trainers.map(t => t.name).join(', ')}
                            </span>
                        </p>
                    )}
                </div>

                {/* You can add more details or actions here */}
            </div>
        </div>
    );
};


const FeaturedClass = () => {
    const [featuredClasses, setFeaturedClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null); // State to hold the class for the modal

    useEffect(() => {
        const fetchFeaturedClasses = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/featured-classes`);
                setFeaturedClasses(response.data);
            } catch (err) {
                console.error("Error fetching featured classes:", err);
                setError("Failed to load featured classes. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedClasses();
    }, []); // Empty dependency array means this runs once on component mount

    const openModal = (classItem) => {
        setSelectedClass(classItem);
    };

    const closeModal = () => {
        setSelectedClass(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 font-sans">
                <p className="text-white text-xl">Loading featured classes...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 font-sans">
                <p className="text-red-400 text-xl">{error}</p>
            </div>
        );
    }

    if (featuredClasses.length === 0) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 font-sans">
                <p className="text-zinc-400 text-xl">No featured classes available at the moment.</p>
            </div>
        );
    }

    return (
        <section className="bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold text-[#faba22] text-center mb-12 font-funnel drop-shadow-lg">
                    Featured Classes
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredClasses.map((classItem) => (
                        <div
                            key={classItem._id}
                            className="bg-zinc-900 rounded-xl shadow-xl border border-zinc-800 overflow-hidden
                                       transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                        >
                            <img
                                src={classItem.image}
                                alt={classItem.name}
                                className="w-full h-48 object-cover object-center rounded-t-xl"
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x200/3f3f46/fafa00?text=No+Image"; }}
                            />
                            <div className="p-6">
                                <h3 className="text-2xl font-semibold text-white mb-2">{classItem.name}</h3>
                                <p className="text-zinc-400 text-base mb-4 line-clamp-3">{classItem.details}</p>
                                <div className="flex items-center justify-between pt-4 border-t border-zinc-700">
                                    <p className="text-[#faba22] font-bold text-lg">
                                        Bookings: <span className="text-white">{classItem.totalBookings}</span>
                                    </p>
                                    <button
                                        onClick={() => openModal(classItem)}
                                        className="bg-[#faba22] text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
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
