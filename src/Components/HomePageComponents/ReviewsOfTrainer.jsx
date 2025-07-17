import React, { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const ReviewsOfTrainer = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                // Use the new route to get reviews sorted by trainer popularity with trainer info
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/reviews-by-popular-trainers`);
                setReviews(res.data);
            } catch (err) {
                console.error("Error fetching reviews:", err); // Log the actual error
                setError("Failed to load reviews.");
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, []);

    const renderStars = (rating) =>
        Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} className={`w-5 h-5 ${i < rating ? "text-[#faba22]" : "text-zinc-600"} fill-current`} viewBox="0 0 24 24">
                <path d="M12 .587l3.668 7.568 8.332 1.208-6.001 5.853 1.416 8.293L12 18.896l-7.415 3.903 1.416-8.293-6.001-5.853 8.332-1.208z" />
            </svg>
        ));

    if (loading) return <p className="text-white text-center py-12">Loading...</p>;
    if (error) return <p className="text-red-400 text-center py-12">{error}</p>;
    if (reviews.length === 0) return <p className="text-zinc-400 text-center py-12">No reviews available yet.</p>;


    return (
        <section className="bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <h2 className="text-4xl md:text-5xl font-bold text-[#faba22] text-center mb-12 font-funnel drop-shadow-lg">
                What Our Members Say
            </h2>

            <Swiper
                modules={[Navigation]}
                slidesPerView={1} // Default for mobile
                spaceBetween={30}
                navigation
                loop={reviews.length > 1} // Only loop if there's more than 1 review
                className="max-w-7xl mx-auto"
                breakpoints={{
                    // when window width is >= 768px (md breakpoint)
                    768: {
                        slidesPerView: 2,
                    },
                    // when window width is >= 1024px (lg breakpoint)
                    1024: {
                        slidesPerView: 3,
                    },
                }}
            >
                {reviews.map((review, idx) => (
                    <SwiperSlide key={review._id || idx}>
                        <div className="bg-zinc-900 rounded-xl shadow-xl border border-zinc-800 p-6 h-full flex flex-col justify-between">
                            <div>
                                <div className="flex items-center mb-4">
                                    {/* Trainer's Photo */}
                                    <img
                                        src={review.trainerPhotoURL || "https://placehold.co/48x48/3f3f46/fafa00?text=T"}
                                        alt={review.trainerName || "Trainer"}
                                        className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-[#faba22]"
                                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/48x48/3f3f46/fafa00?text=T"; }}
                                    />
                                    <div>
                                        {/* MODIFIED: Display Trainer's Name */}
                                        <p className="text-white text-lg font-semibold">{review.trainerName || "Unknown Trainer"}</p>
                                        <div className="flex mt-1">{renderStars(review.rating)}</div>
                                    </div>
                                </div>
                                {/* Reviewer's Feedback */}
                                <p className="text-zinc-300 text-base italic mb-4 line-clamp-4">"{review.feedback}"</p>
                            </div>
                            {/* Reviewer Info at the bottom of the card (Optional, if you want to show who reviewed) */}
                            {review.reviewerName && (
                                <p className="text-zinc-400 text-sm mt-auto pt-4 border-t border-zinc-700">
                                    Reviewed by: <span className="text-white font-medium">{review.reviewerName}</span>
                                </p>
                            )}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default ReviewsOfTrainer;