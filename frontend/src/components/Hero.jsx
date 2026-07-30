import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-[#F8FAF8]">

      {/* Background Blur */}

      <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl"></div>

      <div className="absolute top-0 right-0 w-80 h-80 bg-teal-100/30 rounded-full blur-3xl"></div>

      <div className="relative max-w-6xl mx-auto px-6 py-16">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >

          {/* Badge */}

          <span className="inline-flex bg-[#D7F5E8] text-[#2E8B7E] px-4 py-2 rounded-full font-medium text-sm">

            Smart Campus Platform

          </span>

          {/* Heading */}

          <h1 className="mt-6 text-5xl md:text-6xl font-extrabold leading-tight text-gray-900">

            One Platform

            <br />

            For Every

            <span className="text-[#2E8B7E]">

              {" "}Student.

            </span>

          </h1>

          {/* Description */}

          <p className="mt-5 text-lg text-gray-600 leading-7 max-w-2xl">

            CampusOS simplifies campus life with online canteen ordering,
            digital library management and smart campus services—all in one
            modern platform.

          </p>

          {/* Buttons */}

          <div className="flex flex-wrap gap-4 mt-8">

            <Link
              to="/signup"
              className="flex items-center gap-2 bg-[#2E8B7E] text-white px-7 py-3 rounded-xl hover:bg-[#256F65] transition shadow-lg"
            >
              Get Started

              <ArrowRight size={18} />

            </Link>

            <Link
              to="/login"
              className="px-7 py-3 rounded-xl border border-gray-300 hover:border-[#2E8B7E] hover:text-[#2E8B7E] transition"
            >
              Explore Campus
            </Link>

          </div>

          {/* Stats */}

          <div className="flex flex-wrap gap-12 mt-12">

            <div>

              <h3 className="text-3xl font-bold text-[#2E8B7E]">

                4

              </h3>

              <p className="text-gray-500">

                Campus Canteens

              </p>

            </div>

            <div>

              <h3 className="text-3xl font-bold text-[#2E8B7E]">

                24/7

              </h3>

              <p className="text-gray-500">

                Digital Access

              </p>

            </div>

            <div>

              <h3 className="text-3xl font-bold text-[#2E8B7E]">

                100%

              </h3>

              <p className="text-gray-500">

                Student Friendly

              </p>

            </div>

          </div>

        </motion.div>

      </div>

    </section>
  );
};

export default Hero;