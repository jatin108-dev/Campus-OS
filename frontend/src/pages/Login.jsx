import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import LoginForm from "../components/LoginForm";

const Login = () => {
  return (
    <div className="relative min-h-screen bg-[#F8FAF8] overflow-hidden">

      {/* Background Blur Effects */}

      <div className="absolute -top-24 -left-24 w-80 h-80 bg-emerald-200/40 rounded-full blur-3xl"></div>

      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-100/40 rounded-full blur-3xl"></div>

      {/* Back Button */}

      <div className="absolute top-8 left-8">

        <Link
          to="/"
          className="flex items-center gap-2 text-gray-600 hover:text-[#2E8B7E] transition"
        >
          <ArrowLeft size={20} />

          Back to Home

        </Link>

      </div>

      {/* Main Content */}

      <div className="relative flex items-center justify-center min-h-screen px-6">

        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl w-full">

          {/* Left Side */}

          <div className="hidden lg:block">

            <span className="bg-[#D7F5E8] text-[#2E8B7E] px-4 py-2 rounded-full font-medium">

              CampusOS

            </span>

            <h1 className="mt-8 text-6xl font-bold leading-tight text-gray-900">

              Welcome

              <br />

              Back.

            </h1>

            <p className="mt-6 text-lg text-gray-600 leading-8 max-w-lg">

              Login to continue accessing your canteen orders,
              library records, announcements and other campus
              services from one centralized platform.

            </p>

            <div className="mt-10 space-y-4">

              <div className="flex items-center gap-3">

                <div className="w-3 h-3 rounded-full bg-[#2E8B7E]"></div>

                <span className="text-gray-700">

                  Smart Canteen Ordering

                </span>

              </div>

              <div className="flex items-center gap-3">

                <div className="w-3 h-3 rounded-full bg-[#2E8B7E]"></div>

                <span className="text-gray-700">

                  Digital Library

                </span>

              </div>

              <div className="flex items-center gap-3">

                <div className="w-3 h-3 rounded-full bg-[#2E8B7E]"></div>

                <span className="text-gray-700">

                  Campus Navigation

                </span>

              </div>

            </div>

          </div>

          {/* Right Side */}

          <div className="flex justify-center">

            <LoginForm />

          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;