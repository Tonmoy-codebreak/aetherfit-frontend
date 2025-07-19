import React, { useState } from "react"; 
import Swal from "sweetalert2";
import { useNavigate } from "react-router"; 
import { useAuth } from "../../AuthProvider/useAuth";
import useAxios from "../../hooks/useAxios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; 
const AddForumTrainer = () => {
    const { user: authUser } = useAuth();
    const axiosSecure = useAxios();
    const navigate = useNavigate();
    const queryClient = useQueryClient(); // Get query client for invalidation

    const [newForum, setNewForum] = useState({
        title: "",
        content: "",
        image: "",
    });

    const [photoFile, setPhotoFile] = useState(null);
    const [previewURL, setPreviewURL] = useState("");
    const [imageSize, setImageSize] = useState(null);

    // TanStack Query for fetching user data
    const { data: mongoUser, isLoading: isLoadingUser, isError: isUserError } = useQuery({
        queryKey: ["currentUser", authUser?.email], // Query key with email dependency
        queryFn: async () => {
            if (!authUser?.email) {
                return null; // Don't fetch if email is not available
            }
            const res = await axiosSecure.get(`${import.meta.env.VITE_API_URL}/users?email=${authUser.email}`);
            return res.data;
        },
        enabled: !!authUser?.email, // Only run the query if authUser.email exists
        staleTime: Infinity, // User data typically doesn't change often
        cacheTime: 1000 * 60 * 5, // Keep cached for 5 minutes
        onError: (err) => {
            console.error("Error fetching MongoDB user data:", err);
            Swal.fire({
                title: "Error",
                text: "Failed to load your user profile. Please try refreshing.",
                icon: "error",
                background: "black",
                color: "#faba22",
                confirmButtonColor: "#faba22",
            });
        },
    });

    // TanStack Query for adding a new forum post
    const { mutate: addForumMutation, isLoading: isSubmitting } = useMutation({
        mutationFn: async (forumData) => {
            // First, upload the image if a photoFile exists
            let finalImageURL = forumData.image;
            if (photoFile) {
                const base64Image = await toBase64(photoFile);
                const uploadRes = await axiosSecure.post(`${import.meta.env.VITE_API_URL}/upload-image`, {
                    imageBase64: base64Image,
                });
                finalImageURL = uploadRes.data.url;
            }

            // Then, post the forum data
            return axiosSecure.post(`${import.meta.env.VITE_API_URL}/admin/forums`, {
                ...forumData,
                image: finalImageURL,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["forums"]); // Invalidate forums query to refetch list if needed
            setNewForum({ title: "", content: "", image: "" });
            setPhotoFile(null);
            setPreviewURL("");
            setImageSize(null);
            Swal.fire({
                title: "Forum Added!",
                text: "Your forum post has been submitted.",
                icon: "success",
                background: "black",
                color: "#faba22",
                confirmButtonColor: "#faba22",
            });
            // Optional: navigate after success
            // navigate('/dashboard/trainer/my-forums');
        },
        onError: (err) => {
            console.error("Forum add error:", err);
            Swal.fire({
                title: "Error",
                text: err.response?.data?.message || err.message || "Something went wrong.",
                icon: "error",
                background: "black",
                color: "#faba22",
                confirmButtonColor: "#faba22",
            });
        },
    });

    const handleInputChange = (e) => {
        setNewForum({ ...newForum, [e.target.name]: e.target.value });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        const maxSize = 2 * 1024 * 1024;

        if (file) {
            if (file.size > maxSize) {
                Swal.fire({
                    title: "Image Too Large",
                    text: "Image size cannot be more than 2MB. Please choose a smaller image.",
                    icon: "error",
                    background: "black",
                    color: "#faba22",
                    confirmButtonColor: "#faba22",
                });
                setPhotoFile(null);
                setPreviewURL("");
                setImageSize(null);
                e.target.value = null;
                return;
            }
            setPhotoFile(file);
            setPreviewURL(URL.createObjectURL(file));
            setImageSize((file.size / (1024 * 1024)).toFixed(2) + ' MB');
        } else {
            setPhotoFile(null);
            setPreviewURL("");
            setImageSize(null);
        }
    };

    const toBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(",")[1]);
            reader.onerror = (error) => reject(error);
        });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!mongoUser?._id || !mongoUser?.email) {
            Swal.fire({
                title: "Error",
                text: "Your full user profile is not loaded. Please wait or refresh the page.",
                icon: "error",
                background: "black",
                color: "#faba22",
                confirmButtonColor: "#faba22",
            });
            return;
        }

        if (!photoFile) {
            Swal.fire({
                title: "Image Required",
                text: "Please upload an image for your forum post.",
                icon: "warning",
                background: "black",
                color: "#faba22",
                confirmButtonColor: "#faba22",
            });
            return;
        }

        const authorId = mongoUser._id;
        const authorName = authUser?.displayName || mongoUser.name || mongoUser.email;
        const authorRole = "Trainer"; // Assuming the user is always a Trainer here
        const authorEmail = mongoUser.email;

        // Call the mutation function
        addForumMutation({
            ...newForum,
            authorId,
            authorName,
            authorRole,
            authorEmail,
        });
    };

    if (isLoadingUser) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-zinc-950">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[#faba22]"></div>
                <p className="text-[#faba22] ml-4 text-lg sm:text-xl font-inter">Loading user data...</p>
            </div>
        );
    }

    if (isUserError || !mongoUser || !mongoUser._id) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-zinc-950">
                <p className="text-red-500 text-lg sm:text-xl font-inter text-center mx-4">User profile not found or loaded. Please ensure you are logged in correctly.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white font-inter px-4 py-8 sm:px-6 lg:px-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-funnel text-center mb-8 sm:mb-12 text-[#faba22] drop-shadow-lg">
                Create New Forum Post
            </h1>

            <div className="bg-zinc-900 p-4 sm:p-6 lg:p-8 rounded-2xl shadow-2xl border border-zinc-800 w-full max-w-4xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8 text-white">Your Forum Details</h2>
                <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                    <div>
                        <label htmlFor="title" className="block text-base sm:text-lg font-medium mb-2 text-zinc-300">Forum Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={newForum.title}
                            onChange={handleInputChange}
                            placeholder="Enter a compelling title for your forum post"
                            required
                            className="w-full p-3 sm:p-4 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#faba22] text-base sm:text-lg"
                        />
                    </div>

                    <div>
                        <label htmlFor="content" className="block text-base sm:text-lg font-medium mb-2 text-zinc-300">Content</label>
                        <textarea
                            id="content"
                            name="content"
                            value={newForum.content}
                            onChange={handleInputChange}
                            placeholder="Share your insights, questions, or discussions here..."
                            required
                            rows={6}
                            className="w-full p-3 sm:p-4 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#faba22] text-base sm:text-lg resize-y"
                        ></textarea>
                    </div>

                    <div>
                        <label htmlFor="image" className="block text-base sm:text-lg font-medium mb-2 text-zinc-300">Upload Image (Required)</label>
                        {previewURL && (
                            <div className="mb-4 flex flex-col items-center">
                                <img
                                    src={previewURL}
                                    alt="Image Preview"
                                    className="w-full max-w-xs sm:max-w-sm h-40 object-cover rounded-xl border-4 border-zinc-700 shadow-md"
                                />
                                {imageSize && (
                                    <p className="mt-2 text-zinc-400 text-xs sm:text-sm">Size: {imageSize}</p>
                                )}
                            </div>
                        )}
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            required
                            className="w-full text-sm sm:text-base text-zinc-300 file:mr-3 file:py-2 sm:file:py-3 file:px-4 sm:file:px-6 file:rounded-full file:border-0 file:font-semibold file:bg-[#faba22] file:text-black hover:file:bg-yellow-500 transition-colors duration-200 cursor-pointer"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3 sm:py-4 rounded-xl font-bold text-lg sm:text-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1
                        ${isSubmitting ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed' : 'bg-[#faba22] hover:bg-yellow-500 text-black'}
                        flex items-center justify-center gap-2 sm:gap-3`}
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-black" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Submitting...
                            </>
                        ) : (
                            'Post Forum'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddForumTrainer;