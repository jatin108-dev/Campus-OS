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
    <div className="bg-[#090b0d] text-white min-h-screen">

      {/* Navbar */}
      <Navbar />

      {/* Hero */}
      <Hero />

      {/* Features */}
      <section
        id="features"
        className="py-24 px-8 bg-[#090b0d]"
      >
        <div className="max-w-7xl mx-auto">

          {/* Section Header */}
          <div className="text-center">

            <span className="inline-block bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-5 py-2 rounded-full font-medium">
              Features
            </span>

            <h2 className="mt-6 text-5xl md:text-6xl font-extrabold tracking-tight text-white">
              Everything You Need
            </h2>

            <p className="mt-6 text-slate-400 max-w-3xl mx-auto leading-8 text-lg">
              CampusOS combines essential campus services into one
              intelligent platform, making student life easier,
              faster, and more connected.
            </p>

          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">
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
      <footer className="border-t border-white/10 bg-[#0c0f12]">

        <div className="max-w-7xl mx-auto px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-6">

          <div>
            <h2 className="text-2xl font-bold text-emerald-400">
              CampusOS
            </h2>

            <p className="text-slate-500 mt-2">
              Smart Campus. Smarter Students.
            </p>
          </div>

          <div className="flex gap-8 text-slate-400">

            <a
              href="#features"
              className="hover:text-emerald-400 transition"
            >
              Features
            </a>

            <a
              href="#"
              className="hover:text-emerald-400 transition"
            >
              About
            </a>

            <a
              href="#"
              className="hover:text-emerald-400 transition"
            >
              Contact
            </a>

          </div>

        </div>

        <div className="text-center text-sm text-slate-600 pb-6">
          © {new Date().getFullYear()} CampusOS. All rights reserved.
        </div>

      </footer>

    </div>
  );
};

export default Landing;