import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Store,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
} from "lucide-react";

const SignupForm = () => {
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-200 p-8"
    >
      {/* Heading */}

      <h2 className="text-3xl font-bold text-center text-gray-900">
        Create Account
      </h2>

      <p className="text-center text-gray-500 mt-2">
        Join CampusOS today
      </p>

      {/* Role Selection */}

      <div className="flex mt-8 bg-gray-100 rounded-2xl p-1">

        <button
          type="button"
          onClick={() => setRole("student")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition ${
            role === "student"
              ? "bg-[#2E8B7E] text-white"
              : "text-gray-600"
          }`}
        >
          <GraduationCap size={18} />
          Student
        </button>

        <button
          type="button"
          onClick={() => setRole("vendor")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition ${
            role === "vendor"
              ? "bg-[#2E8B7E] text-white"
              : "text-gray-600"
          }`}
        >
          <Store size={18} />
          Vendor
        </button>

      </div>

      {/* Form */}

      <form className="mt-8 space-y-5">

        {/* Name */}

        <div>

          <label className="text-sm font-medium text-gray-700">
            Full Name
          </label>

          <div className="relative mt-2">

            <User
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#2E8B7E] focus:outline-none"
            />

          </div>

        </div>

        {/* Email */}

        <div>

          <label className="text-sm font-medium text-gray-700">
            Email
          </label>

          <div className="relative mt-2">

            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#2E8B7E] focus:outline-none"
            />

          </div>

        </div>

        {/* Enrollment / Vendor */}

        <div>

          <label className="text-sm font-medium text-gray-700">
            {role === "student"
              ? "Enrollment Number"
              : "Vendor ID"}
          </label>

          <input
            type="text"
            placeholder={
              role === "student"
                ? "Enter Enrollment Number"
                : "Enter Vendor ID"
            }
            className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#2E8B7E] focus:outline-none"
          />

        </div>

        {/* Password */}

        <div>

          <label className="text-sm font-medium text-gray-700">
            Password
          </label>

          <div className="relative mt-2">

            <Lock
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create Password"
              className="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#2E8B7E] focus:outline-none"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>

          </div>

        </div>

        {/* Confirm Password */}

        <div>

          <label className="text-sm font-medium text-gray-700">
            Confirm Password
          </label>

          <div className="relative mt-2">

            <Lock
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#2E8B7E] focus:outline-none"
            />

            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>

          </div>

        </div>

        {/* Submit */}

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-[#2E8B7E] text-white py-3 rounded-xl hover:bg-[#256F65] transition"
        >
          <UserPlus size={20} />
          Create Account
        </button>

      </form>

      {/* Bottom */}

      <p className="text-center text-gray-600 mt-8">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-[#2E8B7E] font-semibold"
        >
          Login
        </Link>
      </p>

    </motion.div>
  );
};

export default SignupForm;