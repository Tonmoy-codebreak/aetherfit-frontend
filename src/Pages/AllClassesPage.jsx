import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router"; 
import { FaTimes } from 'react-icons/fa'; 

// Constants
const CLASSES_PER_PAGE = 6; // As per requirement

// Modal Component - NEWLY ADDED
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
                    <FaTimes />
                </button>

                {/* Class Image */}
                <img
                    src={classItem.image || "https://placehold.co/600x400/3f3f46/fafa00?text=No+Image"}
                    alt={classItem.name}
                    className="w-full h-64 object-cover object-center rounded-lg mb-6"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/3f3f46/fafa00?text=No+Image"; }}
                />

                {/* Class Details */}
                <h3 className="text-4xl font-bold text-[#faba22] mb-4 font-funnel">{classItem.name}</h3>
                <p className="text-zinc-300 text-lg mb-6">{classItem.details}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg mb-6">
                    {/* Only show relevant details, NOT trainers */}
                    {classItem.totalBookings !== undefined && (
                        <p className="text-zinc-400">
                            <span className="font-semibold text-[#faba22]">Bookings:</span>{' '}
                            <span className="text-white">{classItem.totalBookings}</span>
                        </p>
                    )}
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
                </div>
            </div>
        </div>
    );
};


// Fetch function with page & search query
const fetchClasses = async ({ queryKey }) => {
    const [, page, search] = queryKey; // Destructure queryKey
    const res = await fetch(
        `${import.meta.env.VITE_API_URL}/classes?page=${page}&limit=${CLASSES_PER_PAGE}&search=${search}`
    );
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch classes");
    }
    return res.json();
};

const AllClassesPage = () => {
    useEffect(() => {
        document.title = "AetherFit | Classes"; 
    }, []);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState(""); // Actual search query used in API call
    const [searchInput, setSearchInput] = useState(""); // Input field value
    const [selectedClass, setSelectedClass] = useState(null); // State to hold the class for the modal

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["classes", page, search], // Include search in queryKey
        queryFn: fetchClasses,
        keepPreviousData: true, // Keeps previous data while fetching new page/search
    });

    const handleSearchChange = (e) => {
        setSearchInput(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setPage(1); // Reset to first page on new search
        setSearch(searchInput.trim()); // Update the search query for the API
    };

    const goToPage = (p) => {
        if (p >= 1 && p <= (data?.totalPages || 1)) {
            setPage(p);
        }
    };

    const openModal = (classItem) => {
        setSelectedClass(classItem);
    };

    const closeModal = () => {
        setSelectedClass(null);
    };

    return (
        <div className="min-h-screen pb-32 bg-zinc-950 text-[#faba22] font-inter p-8 sm:p-12 lg:p-16 pt-20"> {/* Added pt-20 for header clearance */}
            <h1 className="text-5xl pt-20 md:text-5xl font-bold mb-12 text-center text-white font-funnel drop-shadow-lg">
                Explore Our Classes
            </h1>

            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="mb-12 flex justify-center max-w-lg mx-auto">
                <input
                    type="text"
                    value={searchInput}
                    onChange={handleSearchChange}
                    placeholder="Search classes by name..."
                    className="flex-grow px-5 py-3 rounded-l-full bg-zinc-800 text-white placeholder-zinc-500
                                focus:outline-none focus:ring-2 focus:ring-[#faba22] border border-zinc-700 text-lg"
                />
                <button
                    type="submit"
                    className="px-6 py-3 rounded-r-full bg-[#faba22] text-black font-bold text-lg
                                hover:bg-yellow-500 transition-colors duration-200 shadow-md"
                >
                    Search
                </button>
            </form>

            {/* Loading/Error States */}
            {isLoading && (
                <div className="flex justify-center items-center py-20">
                    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[#faba22]"></div>
                    <p className="text-[#faba22] ml-4 text-xl">Loading classes...</p>
                </div>
            )}
            {isError && (
                <div className="text-center py-20 text-red-500 text-xl">
                    <p>Error: {error?.message || "Failed to load classes."}</p>
                    <p className="mt-2 text-zinc-400 text-lg">Please try refreshing the page.</p>
                </div>
            )}
            {!isLoading && !isError && (!data || data.classes?.length === 0) && (
                <div className="text-center py-20 text-zinc-400 text-xl">
                    <p>No classes found matching your criteria.</p>
                    <p className="mt-2 text-zinc-500 text-lg">Try a different search or check back later!</p>
                </div>
            )}

            {/* Classes Grid */}
            {data?.classes?.length > 0 && (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"> {/* 3 classes per row on large screens */}
                        {data.classes.map((cls) => (
                            <div
                                key={cls._id}
                                className="bg-zinc-900 rounded-2xl p-4 shadow-2xl border border-zinc-800 
                                       flex flex-col transform transition-all duration-300 hover:scale-[1.02] hover:shadow-yellow-900/50
                                       relative overflow-hidden group"
                            >
                                {/* Class Image */}
                                <div className="relative overflow-hidden rounded-xl mb-4 border border-zinc-700 aspect-w-16 aspect-h-9">
                                    <img
                                        src={cls.image || "https://placehold.co/600x400/363636/DDDDDD?text=No+Class+Image"}
                                        alt={cls.name}
                                        className="w-full h-36 object-cover group-hover:scale-110 transition-transform duration-300"
                                        loading="lazy"
                                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/363636/DDDDDD?text=No+Class+Image"; }}
                                    />
                                </div>

                                {/* Class Details */}
                                <h2 className="text-3xl font-bold mb-2 text-white leading-tight">{cls.name}</h2>
                                <p className="mb-4 text-zinc-300 text-base flex-grow leading-relaxed">
                                    {cls.details.length > 150 ? `${cls.details.substring(0, 150)}...` : cls.details}
                                </p>

                                {/* Trainers Section */}
                                <div className="mt-auto pt-4 border-t border-zinc-800">
                                    <h3 className="font-semibold text-[#faba22] text-lg mb-3">Meet the Trainers:</h3>
                                    {cls.trainers && cls.trainers.length > 0 ? (
                                        <div className="flex flex-wrap gap-3">
                                            {cls.trainers.map((trainer) => (
                                                <Link
                                                    key={trainer._id}
                                                    to={`/trainers/${trainer._id}`}
                                                    title={trainer.name || "Trainer"}
                                                    className="block w-16 h-16 rounded-full overflow-hidden border-2 border-zinc-700
                                                                hover:border-[#faba22] transition-colors duration-200 transform hover:scale-110 shadow-md"
                                                >
                                                    <img
                                                        src={trainer.photoURL || "https://placehold.co/64x64/363636/DDDDDD?text=Trainer"}
                                                        alt={trainer.name || "Trainer"}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/64x64/363636/DDDDDD?text=Trainer"; }}
                                                    />
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-zinc-500 italic text-sm">No trainers assigned yet.</p>
                                    )}
                                </div>
                                {/* View Details Button - NEWLY ADDED */}
                                <button
                                    onClick={() => openModal(cls)}
                                    className="mt-6 w-full bg-[#faba22] text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
                                >
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {data.totalPages > 1 && (
                        <div className="flex justify-center mt-16 space-x-3 flex-wrap">
                            <button
                                onClick={() => goToPage(page - 1)}
                                disabled={page === 1}
                                className="px-6 py-3 bg-[#faba22] text-black font-bold rounded-lg shadow-md
                                                hover:bg-yellow-500 transition-colors duration-200
                                                disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>

                            <div className="flex space-x-1">
                                {[...Array(data.totalPages)].map((_, idx) => {
                                    const p = idx + 1;
                                    return (
                                        <button
                                            key={p}
                                            onClick={() => goToPage(p)}
                                            className={`px-5 py-2 rounded-lg font-semibold shadow-sm
                                                        ${
                                                            page === p
                                                                ? "bg-yellow-600 text-black"
                                                                : "bg-zinc-700 text-white hover:bg-yellow-500 hover:text-black"
                                                        }
                                                        transition-colors duration-200`}
                                        >
                                            {p}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => goToPage(page + 1)}
                                disabled={page === data.totalPages}
                                className="px-6 py-3 bg-[#faba22] text-black font-bold rounded-lg shadow-md
                                                hover:bg-yellow-500 transition-colors duration-200
                                                disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Class Details Modal */}
            <ClassDetailsModal classItem={selectedClass} onClose={closeModal} />
        </div>
    );
};

export default AllClassesPage;