import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SignupForm from "../components/SignupForm";

const Signup = () => {
  return (
    <div className="relative min-h-screen bg-[#080b0d] text-white overflow-hidden">

      {/* Background Glow */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl" />

      <div className="absolute bottom-[-200px] right-[-150px] w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-3xl" />

      {/* Back Button */}
      <Link
        to="/"
        className="absolute top-8 left-10 z-20 flex items-center gap-3 text-gray-400 hover:text-white transition"
      >
        <ArrowLeft size={20} />
        Back to Home
      </Link>

      {/* Main Content */}
      <div className="relative min-h-screen max-w-7xl mx-auto px-8 lg:px-12 grid lg:grid-cols-2 gap-12 items-center">

        {/* LEFT SIDE */}
        <div className="hidden lg:block">

          {/* Badge */}
          <span className="inline-block px-5 py-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-400 font-medium">
            Join CampusOS
          </span>

          {/* Heading */}
          <h1 className="mt-8 text-6xl xl:text-7xl font-bold leading-[0.95] tracking-tight">
            Start Your
            <br />
            Campus
            <br />
            Journey<span className="text-emerald-400">.</span>
          </h1>

          {/* Description */}
          <p className="mt-7 max-w-xl text-lg leading-8 text-gray-400">
            Create your CampusOS account to access food ordering,
            library services and all campus activities from one
            centralized platform.
          </p>

          {/* Features */}
          <div className="mt-9 space-y-5">

            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="text-gray-300">
                Smart Canteen
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="text-gray-300">
                Digital Library
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="text-gray-300">
                Campus Navigation
              </span>
            </div>

          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex justify-center lg:justify-end py-10">
          <SignupForm />
        </div>

      </div>
    </div>
  );
};

export default Signup;