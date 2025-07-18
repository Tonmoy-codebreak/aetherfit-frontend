import React, { useState, useEffect } from "react"; // Import useState
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import { useAuth } from "../../AuthProvider/useAuth";
import useAxios from "../../hooks/useAxios";

const AddForumTrainer = () => {
    const { user: authUser } = useAuth();
    const axiosSecure = useAxios()
    const navigate = useNavigate();

    const [mongoUser, setMongoUser] = useState(null); // State to store MongoDB user data
    const [newForum, setNewForum] = useState({
        title: "",
        content: "",
        image: "",
    });

    const [photoFile, setPhotoFile] = useState(null);
    const [previewURL, setPreviewURL] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingUser, setIsLoadingUser] = useState(true); // New loading state for user data

    // Effect to fetch MongoDB user data
    useEffect(() => {
        const fetchMongoUser = async () => {
            if (!authUser?.email) {
                setIsLoadingUser(false);
                return;
            }
            try {
                const res = await axiosSecure.get(`${import.meta.env.VITE_API_URL}/users?email=${authUser.email}`);
                setMongoUser(res.data);
            } catch (err) {
                console.error("Error fetching MongoDB user data:", err);
                Swal.fire({
                    title: "Error",
                    text: "Failed to load your user profile. Please try refreshing.",
                    icon: "error",
                    background: "black",
                    color: "#faba22",
                    confirmButtonColor: "#faba22",
                });
            } finally {
                setIsLoadingUser(false);
            }
        };

        fetchMongoUser();
    }, [authUser]); // Depend on authUser to refetch if auth state changes

    const handleInputChange = (e) => {
        setNewForum({ ...newForum, [e.target.name]: e.target.value });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        setPhotoFile(file);
        setPreviewURL(file ? URL.createObjectURL(file) : "");
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
        setIsSubmitting(true);

        // Now check mongoUser for _id and email
        if (!mongoUser?._id || !mongoUser?.email) {
            Swal.fire({
                title: "Error",
                text: "Your full user profile is not loaded. Please wait or refresh the page.",
                icon: "error",
                background: "black",
                color: "#faba22",
                confirmButtonColor: "#faba22",
            });
            setIsSubmitting(false);
            return;
        }

        // MODIFIED: Check if photoFile is present
        if (!photoFile) {
            Swal.fire({
                title: "Image Required",
                text: "Please upload an image for your forum post.",
                icon: "warning",
                background: "black",
                color: "#faba22",
                confirmButtonColor: "#faba22",
            });
            setIsSubmitting(false);
            return;
        }

        try {
            let finalImageURL = newForum.image;

            // photoFile is guaranteed to be present here due to the check above
            const base64Image = await toBase64(photoFile);
            const uploadRes = await axiosSecure.post(`${import.meta.env.VITE_API_URL}/upload-image`, {
                imageBase64: base64Image,
            });
            finalImageURL = uploadRes.data.url || finalImageURL;


            // Use mongoUser._id and mongoUser.email for author details
            const authorId = mongoUser._id;
            const authorName = authUser?.displayName || mongoUser.name || mongoUser.email; // Use authUser.displayName if available, then mongoUser.name
            const authorRole = "Trainer";
            const authorEmail = mongoUser.email

            await axiosSecure.post(`${import.meta.env.VITE_API_URL}/admin/forums`, {
                ...newForum,
                image: finalImageURL,
                authorId,
                authorName,
                authorRole,
                authorEmail,
            });

            setNewForum({ title: "", content: "", image: "" });
            setPhotoFile(null);
            setPreviewURL("");

            Swal.fire({
                title: "Forum Added!",
                text: "Your forum post has been submitted.",
                icon: "success",
                background: "black",
                color: "#faba22",
                confirmButtonColor: "#faba22",
            });

        } catch (err) {
            console.error("Forum add error:", err);
            Swal.fire({
                title: "Error",
                text: err.response?.data?.message || err.message || "Something went wrong.",
                icon: "error",
                background: "black",
                color: "#faba22",
                confirmButtonColor: "#faba22",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoadingUser) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-zinc-950">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[#faba22] my-auto mx-auto"></div>
                <p className="text-[#faba22] ml-4 text-xl font-inter">Loading user data...</p>
            </div>
        );
    }

    // If user data failed to load or authUser is not available
    if (!mongoUser || !mongoUser._id) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-zinc-950">
                <p className="text-red-500 text-xl font-inter">User profile not found or loaded. Please ensure you are logged in correctly.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white font-inter p-8 sm:p-12 lg:p-16">
            <h1 className="text-5xl md:text-6xl font-bold font-funnel text-center mb-12 text-[#faba22] drop-shadow-lg">
                Create New Forum Post
            </h1>

            <div className="bg-zinc-900 p-8 rounded-2xl shadow-2xl border border-zinc-800 w-full lg:w-3/4 xl:w-2/3 mx-auto">
                <h2 className="text-3xl font-semibold mb-8 text-white">Your Forum Details</h2>
                <form onSubmit={handleSubmit} className="space-y-8"> {/* Increased space-y */}
                    <div>
                        <label htmlFor="title" className="block text-lg font-medium mb-2 text-zinc-300">Forum Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={newForum.title}
                            onChange={handleInputChange}
                            placeholder="Enter a compelling title for your forum post"
                            required
                            className="w-full p-4 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#faba22] text-lg"
                        />
                    </div>

                    <div>
                        <label htmlFor="content" className="block text-lg font-medium mb-2 text-zinc-300">Content</label>
                        <textarea
                            id="content"
                            name="content"
                            value={newForum.content}
                            onChange={handleInputChange}
                            placeholder="Share your insights, questions, or discussions here..."
                            required
                            rows={8} // Increased rows for more content visibility
                            className="w-full p-4 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#faba22] text-lg resize-y"
                        ></textarea>
                    </div>

                    <div>
                        <label htmlFor="image" className="block text-lg font-medium mb-2 text-zinc-300">Upload Image (Required)</label> {/* Changed label */}
                        {previewURL && (
                            <div className="mb-6 flex justify-center"> {/* Increased mb */}
                                <img
                                    src={previewURL}
                                    alt="Image Preview"
                                    className="w-64 h-40 object-cover rounded-xl border-4 border-zinc-700 shadow-md" // Larger preview, rounded corners, border, shadow
                                />
                            </div>
                        )}
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            required // MODIFIED: Added required attribute
                            className="w-full text-zinc-300 file:mr-5 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-base file:font-semibold file:bg-[#faba22] file:text-black hover:file:bg-yellow-500 transition-colors duration-200 cursor-pointer" // Enhanced file input styling
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-4 rounded-xl font-bold text-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1
                        ${
                            isSubmitting
                                ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
                                : 'bg-[#faba22] hover:bg-yellow-500 text-black'
                        }
                        flex items-center justify-center gap-3
                        `}
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