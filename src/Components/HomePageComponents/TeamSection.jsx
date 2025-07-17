import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TeamSection = () => {
    const [trainers, setTrainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeamTrainers = async () => {
            try {
                setLoading(true);
                // Fetch data from the backend route that provides trainer profiles
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/team-trainers`);
                setTrainers(response.data);
            } catch (err) {
                console.error("Error fetching team trainers:", err);
                setError("Failed to load our team. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchTeamTrainers();
    }, []); // Empty dependency array means this runs once on component mount

    // Loading state UI
    if (loading) {
        return (
            <div className="min-h-[400px] bg-zinc-950 flex items-center justify-center p-4 font-sans">
                <p className="text-white text-xl">Loading our expert trainers...</p>
            </div>
        );
    }

    // Error state UI
    if (error) {
        return (
            <div className="min-h-[400px] bg-zinc-950 flex items-center justify-center p-4 font-sans">
                <p className="text-red-400 text-xl">{error}</p>
            </div>
        );
    }

    // No trainers found state UI
    if (trainers.length === 0) {
        return (
            <div className="min-h-[400px] bg-zinc-950 flex items-center justify-center p-4 font-sans">
                <p className="text-zinc-400 text-xl">No trainers available to display in the team section at the moment.</p>
            </div>
        );
    }

    return (
        <section className="bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Section Title */}
                <h2 className="text-4xl md:text-5xl font-bold text-[#faba22] text-center mb-12 font-funnel drop-shadow-lg">
                    Meet Our Expert Trainers
                </h2>

                {/* Trainers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {trainers.map((trainer) => (
                        <div
                            key={trainer._id}
                            className="bg-zinc-900 rounded-xl shadow-xl border border-zinc-800 overflow-hidden
                                       transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                        >
                            {/* Trainer Photo */}
                            <img
                                src={trainer.photoURL || "https://placehold.co/400x300/3f3f46/fafa00?text=Trainer+Photo"}
                                alt={trainer.name || "Trainer"}
                                className="w-full h-64 object-cover object-center rounded-t-xl"
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x300/3f3f46/fafa00?text=Trainer+Photo"; }}
                            />
                            <div className="p-6">
                                {/* Trainer Name */}
                                <h3 className="text-2xl font-semibold text-white mb-2">{trainer.name || "N/A"}</h3>
                                {/* Trainer Bio */}
                                <p className="text-zinc-400 text-base mb-4 line-clamp-3">{trainer.bio || "No biography provided."}</p>
                                {/* Trainer Expertise (Skills) */}
                                {trainer.expertise && trainer.expertise.length > 0 && (
                                    <div className="pt-4 border-t border-zinc-700">
                                        <p className="text-[#faba22] font-bold text-lg mb-2">Expertise:</p>
                                        <ul className="flex flex-wrap gap-2">
                                            {trainer.expertise.map((skill, idx) => (
                                                <li key={idx} className="bg-zinc-800 text-zinc-300 text-sm px-3 py-1 rounded-full">
                                                    {skill}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {/* Optional: Display years of experience if available */}
                                {trainer.yearsOfExperience && trainer.yearsOfExperience > 0 && (
                                    <p className="text-zinc-400 text-sm mt-4">
                                        <span className="font-semibold text-[#faba22]">Experience:</span> {trainer.yearsOfExperience} years
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TeamSection;