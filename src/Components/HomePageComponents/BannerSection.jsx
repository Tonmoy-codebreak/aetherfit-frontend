import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { MdArrowOutward } from "react-icons/md";

const BannerSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const images = [
    {
      url: "https://images.unsplash.com/photo-1640117227173-b6970c105b1e?w=1200&auto=format&fit=crop&q=80&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8eW9nYSUyMG1hbnxlbnwwfHwwfHx8Mg%3D%3D",
      alt: "A person practicing yoga, symbolizing mind and body balance."
    },
    {
      url: "https://images.unsplash.com/photo-1554284126-aa88f22d8b74?w=1200&auto=format&fit=crop&q=80&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8d29ya291dHxlbnwwfHwwfHx8Mg%3D%3D",
      alt: "Someone lifting weights, representing strength training."
    },
    {
      url: "https://images.unsplash.com/photo-1533594285052-5a88351dab21?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjF8fGZpdG5lc3MlMjBibGFjayUyMGFuZCUyMHdoaXRlfGVufDB8MHw0fHx8Mg%3D%3D",
      alt: "A person running, depicting cardio excellence."
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[80vh] bg-black overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ${
              index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/40"></div>
          </div>
        ))}
      </div>

      {/* Slide Indicator - RIGHT SIDE */}
      <div className="absolute top-1/2 right-3 md:right-6 -translate-y-1/2 z-20 flex flex-col items-center gap-2 md:gap-3">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`transition-all duration-500 focus:outline-none rounded-full ${
              index === currentSlide
                ? 'w-2 md:w-3 h-10 md:h-12 bg-[#faba22]'
                : 'w-2 md:w-3 h-2 md:h-3 bg-white/30 hover:bg-white/60 hover:h-6 md:hover:h-8'
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-[80vh] flex flex-col">
        {/* Top Spacer */}
        <div className="flex-1 min-h-[10vh]"></div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-4 md:px-8 lg:px-12">
          <div className="max-w-7xl w-full">
            <div className={`text-center space-y-8 md:space-y-10 transition-all duration-1000 delay-500 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
            }`}>
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 md:gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 md:px-5 py-1 md:py-2 mt-4">
                <div className="w-2 h-2 bg-[#faba22] rounded-full animate-pulse"></div>
                <span className="text-white text-xs md:text-sm font-medium tracking-wider uppercase">
                  AetherFit Premium
                </span>
              </div>

              {/* Headline */}
              <div className="space-y-2 md:space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-funnel font-bold leading-tight text-white">
                  <span className="block opacity-90">Forge Your Path to</span>
                  <span className="block text-[#faba22] relative">
                    Peak Wellness
                    <div className="absolute -bottom-2 md:-bottom-3 left-1/2 transform -translate-x-1/2 w-16 md:w-24 h-1 bg-[#faba22] rounded-full"></div>
                  </span>
                </h1>
              </div>

              {/* Description */}
              <div className="max-w-xl md:max-w-2xl mx-auto">
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 leading-relaxed font-light px-2 md:px-0">
                  AetherFit merges smart programs and <br className='md:block' /> expert coaching to help you stay fit, focused <br className='md:block' /> and fulfilled — all in one place.
                </p>
              </div>

              {/* CTA Button */}
              <div className="pt-4 md:pt-6">
                <Link
                  to="/classes"
                  className="group inline-flex items-center gap-2 md:gap-4 bg-[#faba22] text-black px-5 md:px-7 py-2 md:py-3 rounded-full font-bold text-sm md:text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-[#faba22]/40"
                >
                  Browse Modules
                  <div className="w-6 md:w-8 h-6 md:h-8 bg-black/20 rounded-full flex items-center justify-center transition-transform group-hover:rotate-45">
                    <MdArrowOutward className="w-4 md:w-5 h-4 md:h-5" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex-1 min-h-[10vh] flex items-end justify-between px-4 md:px-8 lg:px-12 pb-6 md:pb-8">
          {/* Slide Counter */}
          <div className="text-white/60 text-xs md:text-sm">
            <span className="text-[#faba22] text-base md:text-lg font-bold">
              {String(currentSlide + 1).padStart(2, '0')}
            </span>
            <span className="mx-2">/</span>
            <span>{String(images.length).padStart(2, '0')}</span>
          </div>

          {/* Scroll Hint */}
          <div className="text-white/60 text-right text-xs md:text-sm">
            <div className="font-medium tracking-wider uppercase">
              Scroll Down
            </div>
            <div className="w-px h-6 bg-white/30 ml-auto mt-2"></div>
          </div>
        </div>
      </div>

      {/* Floating Accent Lines */}
      <div className="absolute top-1/4 left-4 md:left-8 w-1 h-20 bg-gradient-to-b from-[#faba22] to-transparent opacity-60"></div>
      <div className="absolute bottom-1/4 right-4 md:right-8 w-1 h-20 bg-gradient-to-t from-[#faba22] to-transparent opacity-60"></div>
    </section>
  );
};

export default BannerSection;
