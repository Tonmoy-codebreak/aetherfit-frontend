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
                const response = await axiosSecure.get(`${import.meta.env.VITE_API_URL}/forums`);
                setPosts(response.data.forums);
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
                <h2 className="text-4xl md:text-5xl font-semibold font-funnel text-[#faba22] text-center mb-12 drop-shadow-lg">
                    Latest Community Posts
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {posts.map((post) => (
                        <article
                            key={post._id}
                            className="group relative bg-gradient-to-tr from-zinc-900 via-zinc-800 to-zinc-900 rounded-2xl  shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-lg"
                        >
                            {/* Angled overlay */}
                            <div className="absolute top-0 left-0 w-full h-24 bg-[#faba22] skew-y-[-12deg] origin-top-left opacity-20 pointer-events-none transition-opacity duration-500 group-hover:opacity-0"></div>

                            {post.image ? (
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-56 object-cover object-center rounded-t-2xl border-b border-[#faba22]"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://placehold.co/400x200/3f3f46/fafa00?text=No+Image";
                                    }}
                                />
                            ) : (
                                <div className="w-full h-56 flex items-center justify-center bg-zinc-800 rounded-t-2xl border-b border-[#faba22] text-[#faba22] text-xl font-semibold">
                                    No Image
                                </div>
                            )}

                            <div className="p-6 flex flex-col justify-between min-h-[220px]">
                                <header>
                                    <h3 className="text-white text-2xl font-semibold font-funnel mb-2 line-clamp-2 tracking-wide drop-shadow-lg">
                                        {post.title}
                                    </h3>
                                    <p className="text-zinc-400 text-base mb-4 line-clamp-3 tracking-wide">
                                        {post.content}
                                    </p>
                                </header>

                                <footer className="flex justify-between items-center text-zinc-500 text-sm font-mono mt-auto">
                                    <span>
                                        By: <span className="text-[#faba22]">{post.authorName || "Anonymous"}</span>
                                    </span>
                                    <time dateTime={post.createdAt} className="text-[#faba22]">
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </time>
                                </footer>

                                <a
                                    href={`/forum/${post._id}`}
                                    className="mt-6 block text-center bg-[#faba22] text-black font-semibold py-3 rounded-xl shadow-md transition-colors duration-300 hover:bg-yellow-400 hover:shadow-[0_0_15px_rgba(250,186,34,0.9)]"
                                >
                                    Read More
                                </a>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LatestPost;
