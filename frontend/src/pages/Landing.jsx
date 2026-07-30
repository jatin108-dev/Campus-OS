import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeatureCard from "../components/FeatureCard";

import {
  UtensilsCrossed,
  Library,
  MapPinned,
} from "lucide-react";

const features = [
  {
    icon: UtensilsCrossed,
    title: "Smart Canteen",
    description:
      "Browse menus from all campus canteens, place orders online, and skip long queues with a seamless ordering experience.",
  },
  {
    icon: Library,
    title: "Digital Library",
    description:
      "Search books, reserve copies, track due dates, and manage all your library activities digitally.",
  },
  {
    icon: MapPinned,
    title: "Campus Navigation",
    description:
      "Navigate classrooms, labs, auditoriums and campus facilities effortlessly using indoor navigation.",
    comingSoon: true,
  },
];

const Landing = () => {
  return (
    <div className="bg-[#F8FAF8] min-h-screen">

      {/* Navbar */}

      <Navbar />

      {/* Hero */}

      <Hero />

      {/* Features */}

      <section
        id="features"
        className="py-24 px-8"
      >
        <div className="max-w-7xl mx-auto">

          <div className="text-center">

            <span className="bg-[#D7F5E8] text-[#2E8B7E] px-5 py-2 rounded-full font-medium">

              Features

            </span>

            <h2 className="mt-6 text-5xl font-bold text-gray-900">

              Everything You Need

            </h2>

            <p className="mt-6 text-gray-600 max-w-3xl mx-auto leading-8">

              CampusOS combines essential campus services into one
              intelligent platform, making student life easier,
              faster, and more connected.

            </p>

          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">

            {features.map((feature, index) => (

              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                comingSoon={feature.comingSoon}
              />

            ))}

          </div>

        </div>

      </section>

      {/* Footer */}

      <footer className="border-t border-gray-200 bg-white">

        <div className="max-w-7xl mx-auto px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-6">

          <div>

            <h2 className="text-2xl font-bold text-[#2E8B7E]">

              CampusOS

            </h2>

            <p className="text-gray-500 mt-2">

              Smart Campus. Smarter Students.

            </p>

          </div>

          <div className="flex gap-8 text-gray-600">

            <a
              href="#features"
              className="hover:text-[#2E8B7E]"
            >
              Features
            </a>

            <a
              href="#"
              className="hover:text-[#2E8B7E]"
            >
              About
            </a>

            <a
              href="#"
              className="hover:text-[#2E8B7E]"
            >
              Contact
            </a>

          </div>

        </div>

        <div className="text-center text-sm text-gray-400 pb-6">

          © {new Date().getFullYear()} CampusOS. All rights reserved.

        </div>

      </footer>

    </div>
  );
};

export default Landing;