import React, { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import useAxios from "../../hooks/useAxios";
import { useQuery } from "@tanstack/react-query";

const ReviewsOfTrainer = () => {
  const axiosSecure = useAxios();

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [swiperInstance, setSwiperInstance] = useState(null);

  const {
    data: reviews,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["reviewsByPopularTrainers"],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `${import.meta.env.VITE_API_URL}/reviews-by-popular-trainers`
      );
      return res.data;
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (swiperInstance && prevRef.current && nextRef.current) {
      swiperInstance.params.navigation.prevEl = prevRef.current;
      swiperInstance.params.navigation.nextEl = nextRef.current;
      swiperInstance.navigation.destroy();
      swiperInstance.navigation.init();
      swiperInstance.navigation.update();
    }
  }, [swiperInstance, prevRef, nextRef]);

  const renderStars = (rating) =>
    Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${
          i < rating ? "text-[#faba22]" : "text-zinc-600"
        } fill-current`}
        viewBox="0 0 24 24"
      >
        <path d="M12 .587l3.668 7.568 8.332 1.208-6.001 5.853 1.416 8.293L12 18.896l-7.415 3.903 1.416-8.293-6.001-5.853 8.332-1.208z" />
      </svg>
    ));

  if (isLoading)
    return <p className="text-white text-center py-12">Loading...</p>;
  if (isError)
    return (
      <p className="text-red-400 text-center py-12">
        Failed to load reviews: {error.message || "An unknown error occurred."}
      </p>
    );
  if (!reviews || reviews.length === 0)
    return <p className="text-zinc-400 text-center py-12">No reviews available yet.</p>;

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('https://i.ibb.co/tTTKr8sT/20250711-1757-Aether-Fit-Gym-Bench-remix-01jzwnd9y8fnfvcffyfxsekede.png')] bg-center bg-cover bg-no-repeat bg-fixed"></div>
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-funnel font-black text-transparent bg-clip-text bg-[#faba22] drop-shadow-2xl tracking-tight leading-tight">
            What Our Members Say
          </h2>
          <p className="text-white text-lg mt-3 max-w-2xl mx-auto leading-relaxed font-light">
            Hear What Our Members Have to Say About Their Trainers
          </p>
        </div>

        <Swiper
          modules={[Navigation]}
          spaceBetween={30}
          loop={reviews.length > 3}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onSwiper={setSwiperInstance}
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="w-full"
        >
          {reviews.map((review, idx) => (
            <SwiperSlide key={review._id || idx} className="flex justify-center">
              <div className="group bg-zinc-900/90 rounded-2xl shadow-2xl p-6 flex flex-col items-center text-center max-w-[400px] min-h-[500px] transition-all duration-500 hover:scale-[1.02]">
                <img
                  src={
                    review.trainerPhotoURL ||
                    "https://placehold.co/150x150/3f3f46/fafa00?text=T"
                  }
                  alt={review.trainerName || "Trainer"}
                  className="w-28 h-28 rounded-full object-cover border-4 border-[#faba22] shadow-lg group-hover:scale-105 transition-all duration-500"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/150x150/3f3f46/faba22?text=T";
                  }}
                />
                <h3 className="text-white text-xl font-bold mt-4">
                  {review.trainerName || "Unknown Trainer"}
                </h3>
                <div className="flex justify-center space-x-1 mt-2">
                  {renderStars(review.rating)}
                </div>
                <p className="text-zinc-400 text-sm mt-1">
                  {review.rating}/5 Rating
                </p>
                <p className="text-zinc-200 text-base font-light leading-relaxed tracking-wide mt-6">
                  "{review.feedback}"
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="flex justify-center items-center space-x-8 mt-10">
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

      <style>{`
        .swiper-button-prev,
        .swiper-button-next {
          display: none !important;
        }
        @keyframes pulse {
          0%,
          100% {
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