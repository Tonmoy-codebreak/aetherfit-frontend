import React, { useEffect, useContext } from "react";
import { useParams, Link } from "react-router";
import Swal from 'sweetalert2';

import {
    BiUpvote,
    BiSolidUpvote,
    BiDownvote,
    BiSolidDownvote,
} from "react-icons/bi";
import { AuthContext } from "../AuthProvider/Authcontext";
import useAxios from "../hooks/useAxios";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const ForumPostDetails = () => {
    useEffect(() => {
        document.title = "AetherFit | Forum Details";
    }, []);

    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxios();
    const queryClient = useQueryClient();

    const {
        data,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['forumDetails', id, user?.email],
        queryFn: async () => {
            if (!id) throw new Error("Forum ID is missing.");
            const params = user?.email ? { params: { userEmail: user.email } } : {};
            const res = await axiosSecure.get(`${import.meta.env.VITE_API_URL}/forums/${id}`, params);
            return res.data;
        },
        enabled: !!id,
        staleTime: 1000 * 60,
    });

    const forum = data?.forum || null;
    const userVote = data?.userVote || null;

    const { mutate: voteMutate } = useMutation({
        mutationFn: async (votePayload) => {
            const res = await axiosSecure.patch(
                `${import.meta.env.VITE_API_URL}/forums/${id}/vote`,
                votePayload
            );
            return res.data;
        },
        onMutate: async (newVotePayload) => {
            await queryClient.cancelQueries(['forumDetails', id, user?.email]);

            const previousForumData = queryClient.getQueryData(['forumDetails', id, user?.email]);

            queryClient.setQueryData(['forumDetails', id, user?.email], (oldData) => {
                if (!oldData || !oldData.forum) return oldData;

                const currentForum = oldData.forum;
                let newTotalUpVotes = currentForum.totalUpVotes || 0;
                let newTotalDownVotes = currentForum.totalDownVotes || 0;
                let newUserVote = oldData.userVote;
                const type = newVotePayload.voteType;
                const hasVoted = oldData.userVote === type;

                if (type === 'upvote') {
                    if (hasVoted) {
                        newTotalUpVotes--;
                        newUserVote = null;
                    } else {
                        newTotalUpVotes++;
                        if (oldData.userVote === 'downvote') {
                            newTotalDownVotes--;
                        }
                        newUserVote = 'upvote';
                    }
                } else if (type === 'downvote') {
                    if (hasVoted) {
                        newTotalDownVotes--;
                        newUserVote = null;
                    } else {
                        newTotalDownVotes++;
                        if (oldData.userVote === 'upvote') {
                            newTotalUpVotes--;
                        }
                        newUserVote = 'downvote';
                    }
                }

                return {
                    ...oldData,
                    forum: {
                        ...currentForum,
                        totalUpVotes: newTotalUpVotes,
                        totalDownVotes: newTotalDownVotes,
                    },
                    userVote: newUserVote,
                };
            });

            return { previousForumData };
        },
        onError: (err, newVotePayload, context) => {
            if (context?.previousForumData) {
                queryClient.setQueryData(['forumDetails', id, user?.email], context.previousForumData);
            }
            Swal.fire('Error', err.response?.data?.message || 'Failed to submit vote.', 'error');
        },
        onSettled: () => {
            queryClient.invalidateQueries(['forumDetails', id, user?.email]);
        },
    });


    const handleVote = (type) => {
        if (!user?.email) {
            Swal.fire({
                title: 'Login Required',
                text: 'You need to be logged in to vote on forum posts.',
                icon: 'info',
                background: 'black',
                color: '#faba22',
                confirmButtonColor: '#faba22',
            });
            return;
        }

        if (!forum) return;

        const voteTypeToSend = userVote === type ? "remove" : type;

        voteMutate({
            userEmail: user.email,
            voteType: voteTypeToSend,
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-zinc-950 text-white">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[#faba22]"></div>
                <p className="ml-4 text-lg">Loading forum details...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center text-white bg-zinc-950 p-6">
                <p className="text-xl font-medium text-red-500 mb-4">Error loading forum: {error.message || 'Unknown error'}</p>
                <Link
                    to="/forum"
                    className="mt-4 bg-[#faba22] hover:bg-yellow-400 px-6 py-3 rounded-lg text-black font-semibold transition shadow-lg"
                >
                    Go Back to Forums
                </Link>
            </div>
        );
    }

    if (!forum) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center text-white bg-zinc-950 p-6">
                <p className="text-xl font-medium text-red-500 mb-4">Forum post not found.</p>
                <Link
                    to="/forum"
                    className="mt-4 bg-[#faba22] hover:bg-yellow-400 px-6 py-3 rounded-lg text-black font-semibold transition shadow-lg"
                >
                    Go Back to Forums
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white pt-20 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                <h1 className="text-3xl md:text-5xl font-bold leading-tight">{forum.title}</h1>

                {forum.image && (
                    <img
                        src={forum.image}
                        alt={forum.title}
                        className="w-full rounded-2xl shadow-lg object-cover max-h-[500px] transition-transform hover:scale-105 duration-300"
                    />
                )}

                <p className="text-gray-300 text-lg leading-relaxed">{forum.content}</p>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-gray-400 border-t border-b border-gray-700 py-4 gap-2">
                    <p>
                        Author: <span className="text-white font-semibold">{forum.authorName}</span> (<span className="text-[#faba22] font-medium">{forum.authorRole}</span>)
                    </p>
                    <p className="text-right sm:text-left">
                        <span className="text-green-400">Upvotes: {forum.totalUpVotes || 0}</span> /{" "}
                        <span className="text-red-400">Downvotes: {forum.totalDownVotes || 0}</span>
                    </p>
                </div>

                <div className="flex gap-4 flex-wrap">
                    <button
                        type="button"
                        onClick={() => handleVote("upvote")}
                        disabled={userVote === "downvote" && user?.email}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold shadow-md transition-all duration-300 text-sm
                            ${
                                !user?.email
                                ? "bg-zinc-700 cursor-not-allowed text-zinc-400"
                                : userVote === "downvote"
                                    ? "bg-gray-700 cursor-not-allowed text-gray-400"
                                    : "bg-[#faba22] hover:bg-yellow-400 text-black"
                            }`}
                    >
                        {userVote === "upvote" && user?.email ? <BiSolidUpvote size={20} /> : <BiUpvote size={20} />}
                        {userVote === "upvote" && user?.email ? "Upvoted" : "Upvote"}
                    </button>

                    <button
                        type="button"
                        onClick={() => handleVote("downvote")}
                        disabled={userVote === "upvote" && user?.email}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold shadow-md transition-all duration-300 text-sm
                            ${
                                !user?.email
                                ? "bg-zinc-700 cursor-not-allowed text-zinc-400"
                                : userVote === "upvote"
                                    ? "bg-gray-700 cursor-not-allowed text-gray-400"
                                    : "bg-[#faba22] hover:bg-yellow-400 text-black"
                            }`}
                    >
                        {userVote === "downvote" && user?.email ? <BiSolidDownvote size={20} /> : <BiDownvote size={20} />}
                        {userVote === "downvote" && user?.email ? "Downvoted" : "Downvote"}
                    </button>
                </div>

                <Link
                    to="/forum"
                    className="inline-block mt-8 bg-[#faba22] hover:bg-yellow-400 px-6 py-3 rounded-lg text-black font-semibold shadow-lg transition"
                >
                    Back to Forums
                </Link>
            </div>
        </div>
    );
};

export default ForumPostDetails;