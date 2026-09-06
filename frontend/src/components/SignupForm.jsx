import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
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

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [enrollmentNumber, setEnrollmentNumber] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          fullName,
          email,
          password,
          role,
          enrollmentNumber,
          vendorId,
        },
        {
          withCredentials: true,
        }
      );

      setMessage(response.data.message);
      console.log(response.data);
    } catch (error) {
      console.log(error.response?.data);

      setMessage(
        error.response?.data?.message || "Registration failed"
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-lg bg-[#11161a] rounded-3xl shadow-2xl border border-white/10 p-6"
    >
      {/* Heading */}

      <h2 className="text-3xl font-bold text-center text-white">
        Create Account
      </h2>

      <p className="text-center text-gray-400 mt-1">
        Join CampusOS today
      </p>

      {/* Role Selection */}

      <div className="flex mt-5 bg-[#1a2025] rounded-2xl p-1 border border-white/10">
        <button
          type="button"
          onClick={() => setRole("student")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition ${
            role === "student"
              ? "bg-emerald-500/20 text-emerald-400"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <GraduationCap size={18} />
          Student
        </button>

        <button
          type="button"
          onClick={() => setRole("vendor")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition ${
            role === "vendor"
              ? "bg-emerald-500/20 text-emerald-400"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Store size={18} />
          Vendor
        </button>
      </div>

      {/* Form */}

      <form
        onSubmit={handleSignup}
        className="mt-5 space-y-3"
      >
        {/* Full Name */}

        <div>
          <label className="text-sm font-medium text-gray-300">
            Full Name
          </label>

          <div className="relative mt-1">
            <User
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full bg-[#090d10] border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-white placeholder-gray-600 outline-none focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10 transition"
            />
          </div>
        </div>

        {/* Email */}

        <div>
          <label className="text-sm font-medium text-gray-300">
            Email
          </label>

          <div className="relative mt-1">
            <Mail
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full bg-[#090d10] border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-white placeholder-gray-600 outline-none focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10 transition"
            />
          </div>
        </div>

        {/* Enrollment / Vendor ID */}

        <div>
          <label className="text-sm font-medium text-gray-300">
            {role === "student"
              ? "Enrollment Number"
              : "Vendor ID"}
          </label>

          <input
            type="text"
            value={
              role === "student"
                ? enrollmentNumber
                : vendorId
            }
            onChange={(e) => {
              if (role === "student") {
                setEnrollmentNumber(e.target.value);
              } else {
                setVendorId(e.target.value);
              }
            }}
            placeholder={
              role === "student"
                ? "Enter Enrollment Number"
                : "Enter Vendor ID"
            }
            className="w-full mt-1 bg-[#090d10] border border-white/10 rounded-xl py-2.5 px-4 text-white placeholder-gray-600 outline-none focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10 transition"
          />
        </div>

        {/* Password */}

        <div>
          <label className="text-sm font-medium text-gray-300">
            Password
          </label>

          <div className="relative mt-1">
            <Lock
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create Password"
              className="w-full bg-[#090d10] border border-white/10 rounded-xl py-2.5 pl-11 pr-12 text-white placeholder-gray-600 outline-none focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10 transition"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              {showPassword ? (
                <EyeOff size={19} />
              ) : (
                <Eye size={19} />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password */}

        <div>
          <label className="text-sm font-medium text-gray-300">
            Confirm Password
          </label>

          <div className="relative mt-1">
            <Lock
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              placeholder="Confirm Password"
              className="w-full bg-[#090d10] border border-white/10 rounded-xl py-2.5 pl-11 pr-12 text-white placeholder-gray-600 outline-none focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10 transition"
            />

            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              {showConfirm ? (
                <EyeOff size={19} />
              ) : (
                <Eye size={19} />
              )}
            </button>
          </div>
        </div>

        {/* Message */}

        {message && (
          <p className="text-center text-sm text-emerald-400">
            {message}
          </p>
        )}

        {/* Submit */}

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-emerald-500 text-black py-2.5 rounded-xl font-semibold hover:bg-emerald-400 transition"
        >
          <UserPlus size={19} />
          Create Account
        </button>
      </form>

      {/* Bottom */}

      <p className="text-center text-gray-500 mt-4">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-emerald-400 font-semibold hover:text-emerald-300"
        >
          Login
        </Link>
      </p>
    </motion.div>
  );
};

export default SignupForm;