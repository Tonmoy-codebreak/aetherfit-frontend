import React from "react";
import { Link } from "react-router";
import { FaDumbbell, FaUsers, FaChartLine } from "react-icons/fa";
import { MdOutlineArrowOutward } from "react-icons/md";

// Extended features array to include icons
const features = [
  {
    title: "Your Profile",
    description:
      "Customize your journey: track personal progress, update fitness preferences, set milestones, and see your achievements all in one place.",
    link: "/profile",
    icon: FaDumbbell, // Icon for personal fitness/profile
  },
  {
    title: "Explore Classes",
    description:
      "Access a wide range of classes from beginner to advanced. Filter by trainer, intensity, or focus area to find your perfect session.",
    link: "/classes",
    icon: FaChartLine, // Icon for progress/variety in classes
  },
  {
    title: "Meet Our Trainers",
    description:
      "Browse profiles of certified trainers. Learn about their specialties, experience, and book one-on-one sessions tailored to your needs.",
    link: "/trainers",
    icon: FaUsers, // Icon for human connection/trainers
  },
  {
    title: "Community Forum",
    description:
      "Join discussions, share your experiences, ask questions, and get valuable insights from a supportive fitness community.",
    link: "/forum",
    icon: FaUsers, // Icon for community/discussions
  },
  {
    title: "Smart Fitness Tracking",
    description:
      "Leverage smart analytics to monitor workout patterns, set realistic goals, and receive actionable insights for continuous improvement.",
    link: "/dashboard",
    icon: FaChartLine, // Icon for data/analytics
  },
];

const FeatureSection = () => {
  return (
    <section className="bg-black py-16 font-funnel relative overflow-hidden">
     
      <div className="absolute inset-0 bg-[#090909]"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-5xl font-extrabold text-[#faba22] mb-4 tracking-tight">
            Features for a Healthier You
          </h2>
          <p className="md:text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Unlock tools and guidance tailored to fuel your progress, connect with professionals, and grow within a community that shares your wellness journey
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.link}
              // Apply col-span-2 for the "Smart Fitness Tracking" card on medium screens and up
              className={`group bg-gray-900/60 rounded-3xl p-8 flex flex-col justify-between
                         hover:bg-gray-800/80 hover:shadow-lg transition-all duration-500 ease-in-out
                         border border-[#faba22]/20 hover:border-[#faba22]/50 transform hover:-translate-y-1
                         ${feature.title === "Smart Fitness Tracking" ? "md:col-span-2" : ""}`
                       }
            >
              <div className="flex justify-between items-start mb-6">
                {/* Feature Icon */}
                {feature.icon && (
                  <feature.icon className="text-4xl text-[#faba22] group-hover:scale-110 transition-transform duration-300" />
                )}
                {/* Arrow Icon with Hover Effect */}
                <MdOutlineArrowOutward className="text-2xl text-gray-400 group-hover:text-[#faba22] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
              </div>
              {/* Feature Title */}
              <h3 className="text-2xl font-bold font-funnel text-white mb-3 leading-tight">
                {feature.title}
              </h3>
              {/* Feature Description */}
              <p className="text-sm text-gray-400 leading-relaxed flex-grow">
                {feature.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;