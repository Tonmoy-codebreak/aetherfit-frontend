import React, { useState, useEffect } from 'react';
import useAxios from '../../hooks/useAxios';

const TeamSection = () => {
    const [trainers, setTrainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const axiosSecure = useAxios();

    useEffect(() => {
        const fetchTeamTrainers = async () => {
            try {
                setLoading(true);
                const response = await axiosSecure.get(`${import.meta.env.VITE_API_URL}/team-trainers`);
                setTrainers(response.data);
            } catch (err) {
                console.error("Error fetching team trainers:", err);
                setError("Failed to load our team. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchTeamTrainers();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[400px] bg-zinc-950 flex items-center justify-center p-4 font-sans">
                <p className="text-white text-xl">Loading our expert trainers...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[400px] bg-zinc-950 flex items-center justify-center p-4 font-sans">
                <p className="text-red-400 text-xl">{error}</p>
            </div>
        );
    }

    if (trainers.length === 0) {
        return (
            <div className="min-h-[400px] bg-zinc-950 flex items-center justify-center p-4 font-sans">
                <p className="text-zinc-400 text-xl">No trainers available to display in the team section at the moment.</p>
            </div>
        );
    }

    return (
        <section className="bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold text-[#faba22] text-center mb-12 font-funnel drop-shadow-lg">
                    Meet Our Expert Trainers
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trainers.map((trainer, index) => (
                        <div
                            key={trainer._id}
                            className="group bg-zinc-900 rounded-xl shadow-lg border border-zinc-800 overflow-hidden flex flex-col sm:flex-row
                                       transition-transform duration-300 hover:scale-[1.02] hover:border-[#faba22]"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {/* Left Side */}
                            <div className="flex flex-col items-center justify-center bg-zinc-950 p-4 sm:p-5 w-full sm:w-[40%] flex-shrink-0">
                                <img
                                    src={trainer.photoURL || "https://placehold.co/400x400/3f3f46/fafa00?text=Trainer"}
                                    alt={trainer.name || "Trainer"}
                                    className="w-24 h-24 object-cover rounded-full border-2 border-[#faba22] mb-3"
                                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x400/3f3f46/fafa00?text=Trainer"; }}
                                />
                                <h3 className="text-lg sm:text-xl font-bold text-white text-center">{trainer.name || "N/A"}</h3>
                            </div>

                            {/* Right Side */}
                            <div className="flex-1 flex flex-col justify-between bg-zinc-900 p-4 sm:p-5 group-hover:bg-[#faba22] group-hover:text-black">
                                {trainer.expertise?.length > 0 && (
                                    <div className="mb-3">
                                        <p className="text-[#faba22] font-semibold mb-1 group-hover:text-black">Expertise:</p>
                                        <ul className="flex flex-wrap gap-2">
                                            {trainer.expertise.map((skill, idx) => (
                                                <li key={idx} className="bg-zinc-800 text-zinc-300 text-xs px-2 py-0.5 rounded
                                                    group-hover:bg-black group-hover:text-white transition-colors duration-300">
                                                    {skill}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <p className="text-zinc-400 text-sm line-clamp-4 mb-3 group-hover:text-black">
                                    {trainer.bio || "No biography provided."}
                                </p>

                                {trainer.yearsOfExperience && trainer.yearsOfExperience > 0 && (
                                    <p className="text-zinc-400 text-xs group-hover:text-black">
                                        <span className="font-semibold text-[#faba22] group-hover:text-black">Experience:</span> {trainer.yearsOfExperience} years
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .line-clamp-4 {
                    display: -webkit-box;
                    -webkit-line-clamp: 4;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </section>
    );
};

export default TeamSection;
