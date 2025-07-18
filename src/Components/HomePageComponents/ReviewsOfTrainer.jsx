import React, { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import useAxios from "../../hooks/useAxios";

const ReviewsOfTrainer = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosSecure = useAxios();

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get(
          `${import.meta.env.VITE_API_URL}/reviews-by-popular-trainers`
        );
        setReviews(res.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Failed to load reviews.");
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const renderStars = (rating) =>
    Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        className={`w-6 h-6 ${
          i < rating ? "text-[#faba22]" : "text-zinc-600"
        } fill-current transition-all duration-300 hover:scale-110 drop-shadow-sm`}
        viewBox="0 0 24 24"
      >
        <path d="M12 .587l3.668 7.568 8.332 1.208-6.001 5.853 1.416 8.293L12 18.896l-7.415 3.903 1.416-8.293-6.001-5.853 8.332-1.208z" />
      </svg>
    ));

  if (loading) return <p className="text-white text-center py-12">Loading...</p>;
  if (error) return <p className="text-red-400 text-center py-12">{error}</p>;
  if (reviews.length === 0)
    return <p className="text-zinc-400 text-center py-12">No reviews available yet.</p>;

  return (
    <section className="bg-black py-24 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="relative z-10 flex flex-col-reverse lg:flex-col items-center max-w-7xl mx-auto pb-20">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-5xl font-black text-transparent bg-clip-text bg-[#faba22] font-funnel drop-shadow-2xl tracking-tight leading-tight">
            What Our Members Say
          </h2>

          <p className="text-zinc-400 text-lg mt-3 max-w-2xl mx-auto leading-relaxed font-light">
            Hear What Our Members Have to Say About Their Trainers
          </p>
        </div>

        <Swiper
          modules={[Navigation]}
          slidesPerView={1}
          spaceBetween={40}
          loop={reviews.length > 1}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onSwiper={(swiper) => {
            setTimeout(() => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
              swiper.navigation.destroy();
              swiper.navigation.init();
              swiper.navigation.update();
            });
          }}
          className="w-full"
        >
          {reviews.map((review, idx) => (
            <SwiperSlide key={review._id || idx}>
              <div className="group cursor-pointer animate-fadeIn">
                <div className="bg--zinc-900 rounded-3xl shadow-2xl  p-8 md:p-12 flex flex-col-reverse lg:flex-row gap-8 transition-all duration-700 hover:scale-[1.02] hover:shadow-[0_0_60px_rgba(250,186,34,0.2)] hover:border-[#faba22]/30">
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="relative">
                      <div className="absolute -top-6 -left-4 text-[#faba22]/30 text-8xl font-black rotate-12 transition-all duration-500 group-hover:rotate-0 group-hover:text-[#faba22]/50">
                        "
                      </div>
                      <div className="pl-8">
                        <p className="text-zinc-200 text-md md:text-2xl font-light leading-relaxed tracking-wide group-hover:text-white">
                          {review.feedback}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 rounded-3xl p-8 border border-zinc-700 w-full lg:w-[350px] shadow-2xl transition-all duration-700 group-hover:border-[#faba22]/30">
                    <div className="text-center">
                      <img
                        src={
                          review.trainerPhotoURL ||
                          "https://placehold.co/150x150/3f3f46/fafa00?text=T"
                        }
                        alt={review.trainerName || "Trainer"}
                        className="w-36 h-36 rounded-full object-cover border-4 border-[#faba22] shadow-lg transition-all duration-700 group-hover:scale-105 animate-scaleIn"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://placehold.co/150x150/3f3f46/faba22?text=T";
                        }}
                      />
                      <h3 className="text-white text-2xl font-bold my-4 tracking-wide transition-all duration-500 group-hover:text-[#faba22]">
                        {review.trainerName || "Unknown Trainer"}
                      </h3>
                      <div className="flex justify-center space-x-1 group-hover:scale-110 transition-all duration-500">
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-zinc-400 text-sm mt-3 font-light">
                        {review.rating}/5 Rating
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="flex justify-center items-center space-x-8 mt-8 md:mt-10 lg:mt-12">
          <button
            ref={prevRef}
            className="custom-prev group bg-gradient-to-br from-zinc-800 to-zinc-900 hover:from-[#faba22] hover:to-yellow-500 text-white p-4 rounded-full shadow-xl transition-all duration-500 transform hover:scale-110 hover:shadow-[0_0_30px_rgba(250,186,34,0.4)] border border-zinc-700 hover:border-[#faba22] hover:animate-pulse"
            aria-label="Previous Slide"
          >
            <svg
              className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform duration-300"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>

          <button
            ref={nextRef}
            className="custom-next group bg-gradient-to-br from-zinc-800 to-zinc-900 hover:from-[#faba22] hover:to-yellow-500 text-white p-4 rounded-full shadow-xl transition-all duration-500 transform hover:scale-110 hover:shadow-[0_0_30px_rgba(250,186,34,0.4)] border border-zinc-700 hover:border-[#faba22] hover:animate-pulse"
            aria-label="Next Slide"
          >
            <svg
              className="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-300"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
            </svg>
          </button>
        </div>
      </div>

      <style jsx>{`
        .swiper-button-prev,
        .swiper-button-next {
          display: none !important;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease forwards;
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.85);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.6s ease forwards;
        }
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 10px rgba(250, 186, 34, 0.6);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 20px rgba(250, 186, 34, 1);
          }
        }
        .hover\\:animate-pulse:hover {
          animation: pulse 1.5s infinite;
        }
      `}</style>
    </section>
  );
};

export default ReviewsOfTrainer;
