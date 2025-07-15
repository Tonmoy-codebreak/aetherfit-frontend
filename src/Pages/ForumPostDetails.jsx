import React, { useEffect, useState, useCallback, useContext } from "react";
import { useParams, Link } from "react-router";
import axios from "axios";
import {
  BiUpvote,
  BiSolidUpvote,
  BiDownvote,
  BiSolidDownvote,
} from "react-icons/bi";
import { AuthContext } from "../AuthProvider/Authcontext";

const ForumPostDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [forum, setForum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userVote, setUserVote] = useState(null);

  const fetchForum = useCallback(async () => {
    if (!id || !user?.email) return;

    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/forums/${id}`, {
        params: { userEmail: user.email },
      });

      setForum(res.data.forum || null);
      setUserVote(res.data.userVote || null);
    } catch (err) {
      console.error("Error fetching forum:", err);
    } finally {
      setLoading(false);
    }
  }, [id, user?.email]);

  useEffect(() => {
    fetchForum();
  }, [fetchForum]);

  const handleVote = async (type) => {
    if (!forum || !user?.email) return;

    const hasVoted = userVote === type;

    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/forums/${id}/vote`,
        {
          userEmail: user.email,
          voteType: hasVoted ? "remove" : type,
        }
      );

      setForum((prev) => ({
        ...prev,
        totalUpVotes: res.data.upvoteCount,
        totalDownVotes: res.data.downvoteCount,
      }));

      setUserVote(hasVoted ? null : type);
    } catch (err) {
      console.error("Vote error:", err);
      fetchForum();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-white bg-gradient-to-b from-black via-gray-900 to-black">
        <span className="animate-pulse text-lg">Loading forum...</span>
      </div>
    );
  }

  if (!forum) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-white bg-gradient-to-b from-black via-gray-900 to-black">
        <p className="text-xl font-medium">Forum not found.</p>
        <Link
          to="/forums"
          className="mt-4 bg-[#faba22] hover:bg-yellow-400 px-6 py-3 rounded-md text-black font-semibold transition"
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

        <div className="flex justify-between items-center text-sm text-gray-400 border-t border-b border-gray-700 py-4">
          <p>
            Author: <span className="text-white">{forum.authorName}</span> ({forum.authorRole})
          </p>
          <p>
            <span className="text-green-400">Upvotes: {forum.totalUpVotes || 0}</span> /{" "}
            <span className="text-red-400">Downvotes: {forum.totalDownVotes || 0}</span>
          </p>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => handleVote("upvote")}
            disabled={userVote === "downvote"}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold shadow-md transition-all duration-300 text-sm
              ${
                userVote === "downvote"
                  ? "bg-gray-700 cursor-not-allowed text-gray-400"
                  : "bg-[#faba22] hover:bg-yellow-400 text-black"
              }`}
          >
            {userVote === "upvote" ? <BiSolidUpvote size={20} /> : <BiUpvote size={20} />}
            {userVote === "upvote" ? "Upvoted" : "Upvote"}
          </button>

          <button
            type="button"
            onClick={() => handleVote("downvote")}
            disabled={userVote === "upvote"}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold shadow-md transition-all duration-300 text-sm
              ${
                userVote === "upvote"
                  ? "bg-gray-700 cursor-not-allowed text-gray-400"
                  : "bg-[#faba22] hover:bg-yellow-400 text-black"
              }`}
          >
            {userVote === "downvote" ? <BiSolidDownvote size={20} /> : <BiDownvote size={20} />}
            {userVote === "downvote" ? "Downvoted" : "Downvote"}
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
