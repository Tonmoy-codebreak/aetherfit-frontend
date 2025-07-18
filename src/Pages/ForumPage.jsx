import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { BiUpvote, BiDownvote } from 'react-icons/bi';
import { FaUserShield, FaUserTie } from 'react-icons/fa';
import { useAuth } from '../AuthProvider/useAuth';
import useAxios from '../hooks/useAxios';

const ForumPage = () => {
    useEffect(() => {
        document.title = "AetherFit | Forum";
    }, []);

    const { user } = useAuth();
    const axiosSecure = useAxios();
    const [forums, setForums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const postsPerPage = 6;

    const fetchForums = async (page) => {
        setLoading(true);
        setError(null);
        try {
            const userEmailQuery = user?.email ? `&userEmail=${user.email}` : '';
            const res = await axiosSecure.get(`${import.meta.env.VITE_API_URL}/forums?page=${page}&limit=${postsPerPage}${userEmailQuery}`);
            setForums(res.data.forums);
            setTotalPages(res.data.totalPages);
            setCurrentPage(res.data.page);
        } catch (err) {
            setError('Failed to load forum posts. Please try again.');
            Swal.fire('Error', 'Failed to load forum posts.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchForums(1);
    }, [user, axiosSecure]);

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            fetchForums(page);
        }
    };

    const handleVote = async (forumId, voteType) => {
        if (!user?.email) {
            Swal.fire({
                title: 'Login Required',
                text: 'You need to be logged in to vote.',
                icon: 'info',
                background: 'black',
                color: '#faba22',
                confirmButtonColor: '#faba22',
            });
            return;
        }

        try {
            setForums(prevForums =>
                prevForums.map(forum =>
                    forum._id === forumId
                        ? {
                            ...forum,
                            totalUpVotes: forum.userVote === 'upvote' ? forum.totalUpVotes - 1 : voteType === 'upvote' ? forum.totalUpVotes + 1 : forum.totalUpVotes,
                            totalDownVotes: forum.userVote === 'downvote' ? forum.totalDownVotes - 1 : voteType === 'downvote' ? forum.totalDownVotes + 1 : forum.totalDownVotes,
                            userVote: forum.userVote === voteType ? null : voteType
                        }
                        : forum
                )
            );

            await axiosSecure.patch(`${import.meta.env.VITE_API_URL}/forums/${forumId}/vote`, {
                userEmail: user.email,
                voteType,
            });

            fetchForums(currentPage);
        } catch (err) {
            Swal.fire('Error', err.response?.data?.message || 'Failed to submit vote.', 'error');
            fetchForums(currentPage);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-zinc-950">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[#faba22]" />
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
        <div className="bg-zinc-950 pt-8 pb-20 lg:pt-24">
            <div className="min-h-screen text-[#faba22] px-4 sm:px-8 lg:px-16 w-full max-w-[1400px] mx-auto">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-funnel text-center mb-10 text-white">
                    Community Forum
                </h1>

                {forums.length === 0 ? (
                    <div className="bg-zinc-900 p-6 sm:p-8 rounded-xl text-center mt-8 border border-zinc-800">
                        <p className="text-zinc-300">No forum posts available yet. Be the first to post!</p>
                        <p className="mt-4">
                            {user ? (
                                <a href="/dashboard/add-forum" className="text-[#faba22] hover:underline">Create a new post</a>
                            ) : (
                                <a href="/login" className="text-[#faba22] hover:underline">Login to create a post</a>
                            )}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {forums.map(forum => (
                                <div key={forum._id} className="bg-zinc-900 rounded-xl border border-zinc-800 flex flex-col">
                                    {forum.image && (
                                        <img
                                            src={forum.image}
                                            alt={forum.title}
                                            className="w-full h-48 object-cover object-center"
                                            onError={(e) => {
                                                e.target.src = "https://placehold.co/600x400/363636/DDDDDD?text=No+Image";
                                            }}
                                        />
                                    )}
                                    <div className="p-4 sm:p-6 flex flex-col flex-grow">
                                        <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white">{forum.title}</h3>
                                        <p className="text-sm text-zinc-300 flex-grow mb-3">
                                            {forum.content?.length > 150 ? `${forum.content.substring(0, 150)}...` : forum.content}
                                        </p>
                                        <div className="flex items-center text-xs text-zinc-400 mb-3 flex-wrap">
                                            <span className="mr-2">By {forum.authorName}</span>
                                            {forum.authorRole === 'Admin' && (
                                                <span className="flex items-center bg-blue-700 text-white px-2 py-0.5 rounded-full">
                                                    <FaUserShield className="mr-1" /> Admin
                                                </span>
                                            )}
                                            {forum.authorRole === 'Trainer' && (
                                                <span className="flex items-center bg-purple-700 text-white px-2 py-0.5 rounded-full">
                                                    <FaUserTie className="mr-1" /> Trainer
                                                </span>
                                            )}
                                            <span className="ml-auto">{new Date(forum.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center mt-auto pt-2 border-t border-zinc-700">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleVote(forum._id, forum.userVote === 'upvote' ? 'remove' : 'upvote')}
                                                    className={`p-2 rounded-full ${forum.userVote === 'upvote' ? 'bg-green-600' : 'bg-zinc-700 hover:bg-green-500'} transition`}
                                                >
                                                    <BiUpvote size={18} />
                                                </button>
                                                <span className="text-sm text-white">{forum.totalUpVotes}</span>
                                                <button
                                                    onClick={() => handleVote(forum._id, forum.userVote === 'downvote' ? 'remove' : 'downvote')}
                                                    className={`p-2 rounded-full ${forum.userVote === 'downvote' ? 'bg-red-600' : 'bg-zinc-700 hover:bg-red-500'} transition`}
                                                >
                                                    <BiDownvote size={18} />
                                                </button>
                                                <span className="text-sm text-white">{forum.totalDownVotes}</span>
                                            </div>
                                            <a
                                                href={`/forum/${forum._id}`}
                                                className="ml-2 px-3 py-1 bg-[#faba22] text-black text-xs sm:text-sm rounded-lg hover:bg-yellow-500 transition"
                                            >
                                                Read More
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center items-center gap-4 mt-10 flex-wrap">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 disabled:opacity-50 transition"
                            >
                                Previous
                            </button>
                            <span className="text-white text-sm sm:text-base">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 disabled:opacity-50 transition"
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ForumPage;
