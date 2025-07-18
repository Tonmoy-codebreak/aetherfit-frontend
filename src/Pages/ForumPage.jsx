import React, { useEffect, useState } from 'react';

import Swal from 'sweetalert2';
import { BiUpvote, BiDownvote } from 'react-icons/bi'; // Icons for voting
import { FaUserShield, FaUserTie } from 'react-icons/fa'; // Icons for Admin/Trainer badges
import { useAuth } from '../AuthProvider/useAuth';
import useAxios from '../hooks/useAxios';

const ForumPage = () => {
  const { user } = useAuth()
  const axiosSecure = useAxios()
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const postsPerPage = 6; // As per requirement

  const fetchForums = async (page , axiosSecure) => {
    setLoading(true);
    setError(null);
    try {
      // Pass user email to backend to get their vote status for each forum
      const userEmailQuery = user?.email ? `&userEmail=${user.email}` : '';
      const res = await axiosSecure.get(`${import.meta.env.VITE_API_URL}/forums?page=${page}&limit=${postsPerPage}${userEmailQuery}`);
      setForums(res.data.forums);
      setTotalPages(res.data.totalPages);
      setCurrentPage(res.data.page);
    } catch (err) {
      console.error('Error fetching forums:', err);
      setError('Failed to load forum posts. Please try again.');
      Swal.fire('Error', 'Failed to load forum posts.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForums(1 , axiosSecure); // Fetch first page on component mount
  }, [user , axiosSecure]); // Re-fetch if user changes (e.g., logs in/out)

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      fetchForums(page, axiosSecure);
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
      // Optimistically update UI
      setForums(prevForums => prevForums.map(forum => {
        if (forum._id === forumId) {
          let newUpVotes = forum.totalUpVotes;
          let newDownVotes = forum.totalDownVotes;
          let newUserVote = voteType;

          if (forum.userVote === 'upvote') {
            newUpVotes--; // Remove previous upvote
          } else if (forum.userVote === 'downvote') {
            newDownVotes--; // Remove previous downvote
          }

          if (voteType === 'upvote') {
            newUpVotes++;
          } else if (voteType === 'downvote') {
            newDownVotes++;
          } else if (voteType === 'remove') {
            newUserVote = null; // Clear vote
          }

          return {
            ...forum,
            totalUpVotes: newUpVotes,
            totalDownVotes: newDownVotes,
            userVote: newUserVote
          };
        }
        return forum;
      }));

      await axiosSecure.patch(`${import.meta.env.VITE_API_URL}/forums/${forumId}/vote`, {
        userEmail: user.email,
        voteType: voteType,
      });

      // Re-fetch to ensure data consistency after optimistic update
      fetchForums(currentPage,axiosSecure);

    } catch (err) {
      console.error('Error voting:', err);
      Swal.fire('Error', err.response?.data?.message || 'Failed to submit vote.', 'error');
      // Revert optimistic update if error
      fetchForums(currentPage);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-zinc-950">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[#faba22] my-auto mx-auto"></div>
       
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
      <div className='bg-zinc-950 lg:pt-24'> 
         <div className="min-h-screen  text-[#faba22] p-8 sm:p-12 lg:p-16 lg:pt-20  w-9/12 mx-auto">
      <h1 className="text-5xl font-bold font-funnel text-center mb-12 text-white">Community Forum</h1>

      {forums.length === 0 ? (
        <div className="bg-zinc-900 p-8 rounded-xl shadow-lg text-center text-lg mt-8 border border-zinc-800">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {forums.map((forum) => (
              <div key={forum._id} className="bg-zinc-900 rounded-xl shadow-lg border border-zinc-800 overflow-hidden flex flex-col">
                {forum.image && (
                  <img
                    src={forum.image}
                    alt={forum.title}
                    className="w-full h-48 object-cover object-center"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/363636/DDDDDD?text=No+Image"; }}
                  />
                )}
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-2xl font-semibold mb-3 text-white">{forum.title}</h3>
                  <p className="text-zinc-300 text-sm mb-4 flex-grow">
                    {forum.content.length > 150 ? `${forum.content.substring(0, 150)}...` : forum.content}
                  </p>
                  <div className="flex items-center text-zinc-400 text-xs mb-4">
                    <span className="mr-2">By {forum.authorName}</span>
                    {forum.authorRole === 'Admin' && (
                      <span className="flex items-center bg-blue-700 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                        <FaUserShield className="mr-1" /> Admin
                      </span>
                    )}
                    {forum.authorRole === 'Trainer' && (
                      <span className="flex items-center bg-purple-700 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                        <FaUserTie className="mr-1" /> Trainer
                      </span>
                    )}
                    <span className="ml-auto">{new Date(forum.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex justify-between items-center mt-auto pt-4 border-t border-zinc-700">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleVote(forum._id, forum.userVote === 'upvote' ? 'remove' : 'upvote')}
                        className={`p-2 rounded-full transition-colors duration-200 ${
                          forum.userVote === 'upvote' ? 'bg-green-600 text-white' : 'bg-zinc-700 hover:bg-green-500 text-zinc-300'
                        }`}
                        title="Upvote"
                      >
                        <BiUpvote size={20} />
                      </button>
                      <span className="text-lg font-semibold text-white">{forum.totalUpVotes}</span>

                      <button
                        onClick={() => handleVote(forum._id, forum.userVote === 'downvote' ? 'remove' : 'downvote')}
                        className={`p-2 rounded-full transition-colors duration-200 ${
                          forum.userVote === 'downvote' ? 'bg-red-600 text-white' : 'bg-zinc-700 hover:bg-red-500 text-zinc-300'
                        }`}
                        title="Downvote"
                      >
                        <BiDownvote size={20} />
                      </button>
                      <span className="text-lg font-semibold text-white">{forum.totalDownVotes}</span>
                    </div>
                    <a
                      href={`/forum/${forum._id}`} // Link to individual forum post
                      className="inline-flex items-center px-4 py-2 bg-[#faba22] text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors duration-200"
                    >
                      Read More
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center space-x-4 mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Previous
            </button>
            <span className="text-lg text-white">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
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
