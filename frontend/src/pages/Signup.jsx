import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SignupForm from "../components/SignupForm";

const Signup = () => {
  return (
    <div className="relative min-h-screen bg-[#F8FAF8] overflow-hidden">

      {/* Background */}

      <div className="absolute -top-32 -left-32 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl"></div>

      <div className="absolute bottom-0 right-0 w-72 h-72 bg-teal-100/30 rounded-full blur-3xl"></div>

      {/* Back Button */}

      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-[#2E8B7E] transition"
      >
        <ArrowLeft size={20} />
        Back to Home
      </Link>

      <div className="max-w-7xl mx-auto min-h-screen px-6 flex justify-between">

        {/* LEFT SIDE */}

        <div className="hidden lg:flex flex-col items-start py-21 w-[45%]">

          <span className="inline-block w-fit bg-[#D7F5E8] text-[#2E8B7E] px-4 py-2 rounded-full text-sm font-semibold">

            Join CampusOS

          </span>

          <h1 className="mt-5 text-5xl font-bold leading-tight text-gray-900">

            Start Your

            <br />

            Campus Journey.

          </h1>

          <p className="mt-5 text-lg text-gray-600 leading-7 max-w-md">

            Create your CampusOS account to access food ordering,
            library services and all campus activities from one place.

          </p>

          <div className="mt-8 space-y-3">

            <div className="flex items-center gap-3">

              <div className="w-2 h-2 rounded-full bg-[#2E8B7E]"></div>

              Smart Canteen

            </div>

            <div className="flex items-center gap-3">

              <div className="w-2 h-2 rounded-full bg-[#2E8B7E]"></div>

              Digital Library

            </div>

            <div className="flex items-center gap-3">

              <div className="w-2 h-2 rounded-full bg-[#2E8B7E]"></div>

              Campus Navigation

            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="w-full lg:w-[48%] flex p-2 justify-center items-center">

          <SignupForm />

        </div>

      </div>

    </div>
  );
};

export default Signup;