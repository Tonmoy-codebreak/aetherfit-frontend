import React, { useState, useEffect } from 'react';
import useAxios from '../../hooks/useAxios';

const LatestPost = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const axiosSecure = useAxios()

    useEffect(() => {
        const fetchLatestPosts = async () => {
            try {
                setLoading(true);
                // Fetch the latest 6 posts (default limit in backend route)
                const response = await axiosSecure.get(`${import.meta.env.VITE_API_URL}/forums`);
                setPosts(response.data.forums); // Access the 'forums' array from the response
            } catch (err) {
                console.error("Error fetching latest forum posts:", err);
                setError("Failed to load latest posts. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchLatestPosts();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[300px] bg-zinc-950 flex items-center justify-center p-4 font-sans">
                <p className="text-white text-xl">Loading latest posts...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[300px] bg-zinc-950 flex items-center justify-center p-4 font-sans">
                <p className="text-red-400 text-xl">{error}</p>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="min-h-[300px] bg-zinc-950 flex items-center justify-center p-4 font-sans">
                <p className="text-zinc-400 text-xl">No recent forum posts available.</p>
            </div>
        );
    }

    return (
        <section className="bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold text-[#faba22] text-center mb-12 font-funnel drop-shadow-lg">
                    Latest Community Posts
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <div
                            key={post._id}
                            className="bg-zinc-900 rounded-xl shadow-xl border border-zinc-800 overflow-hidden
                                       transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                        >
                            {post.image && (
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-48 object-cover object-center rounded-t-xl"
                                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x200/3f3f46/fafa00?text=No+Image"; }}
                                />
                            )}
                            <div className="p-6">
                                <h3 className="text-2xl font-semibold text-white mb-2 line-clamp-2">{post.title}</h3>
                                <p className="text-zinc-400 text-base mb-4 line-clamp-3">{post.content}</p>
                                <div className="flex items-center justify-between text-zinc-500 text-sm mb-4">
                                    <span>By: <span className="text-zinc-300">{post.authorName || "Anonymous"}</span></span>
                                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                </div>
                                <a
                                    href={`/forum/${post._id}`} // Assuming a route for single forum post details
                                    className="inline-block bg-[#faba22] text-black px-5 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors duration-200"
                                >
                                    Read More
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LatestPost;