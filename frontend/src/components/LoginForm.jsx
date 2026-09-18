import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

import {
  GraduationCap,
  Store,
  Eye,
  EyeOff,
  LogIn,
} from "lucide-react";

const LoginForm = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          loginId,
          password,
          role,
        },
        {
          withCredentials: true,
        }
      );

      // Save logged-in user
      localStorage.setItem(
        "campusOSUser",
        JSON.stringify(response.data.user)
      );

      // Notify Navbar / Hero / other components
      window.dispatchEvent(
        new Event("campusOSAuthChange")
      );

      setMessage(
        response.data.message || "Login successful"
      );

      // IMPORTANT:
      // Both Student AND Vendor go to Landing page first
      navigate("/");
    } catch (error) {
      console.log(error.response?.data);

      setMessage(
        error.response?.data?.message || "Login failed"
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md rounded-3xl border border-white/10 bg-[#11161a] p-8 shadow-2xl"
    >
      {/* Heading */}
      <h2 className="text-center text-4xl font-bold text-white">
        Welcome Back
      </h2>

      <p className="mt-3 text-center text-gray-400">
        Login to continue to CampusOS
      </p>

      {/* Role Selection */}
      <div className="mt-8 flex rounded-2xl border border-white/10 bg-[#1a2025] p-1">
        {/* Student */}
        <button
          type="button"
          onClick={() => {
            setRole("student");
            setMessage("");
          }}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 transition ${
            role === "student"
              ? "bg-emerald-500/20 text-emerald-400"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <GraduationCap size={18} />
          Student
        </button>

        {/* Vendor */}
        <button
          type="button"
          onClick={() => {
            setRole("vendor");
            setMessage("");
          }}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 transition ${
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
        onSubmit={handleLogin}
        className="mt-8 space-y-5"
      >
        {/* Enrollment / Vendor ID */}
        <div>
          <label className="text-sm font-medium text-gray-300">
            {role === "student"
              ? "Enrollment Number"
              : "Vendor ID"}
          </label>

          <input
            type="text"
            value={loginId}
            onChange={(e) =>
              setLoginId(e.target.value)
            }
            placeholder={
              role === "student"
                ? "Enter Enrollment Number"
                : "Enter Vendor ID"
            }
            required
            className="mt-2 w-full rounded-xl border border-white/10 bg-[#090d10] px-4 py-3 text-white placeholder-gray-600 focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/10"
          />
        </div>

        {/* Password */}
        <div>
          <label className="text-sm font-medium text-gray-300">
            Password
          </label>

          <div className="relative mt-2">
            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter Password"
              required
              className="w-full rounded-xl border border-white/10 bg-[#090d10] px-4 py-3 pr-12 text-white placeholder-gray-600 focus:border-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/10"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-white"
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <p
            className={`text-center text-sm ${
              message
                .toLowerCase()
                .includes("success")
                ? "text-emerald-400"
                : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}

        {/* Login */}
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 font-semibold text-black transition hover:bg-emerald-400"
        >
          <LogIn size={20} />
          Login
        </button>
      </form>

      {/* Bottom */}
      <p className="mt-8 text-center text-gray-500">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="font-semibold text-emerald-400 hover:text-emerald-300"
        >
          Sign Up
        </Link>
      </p>
    </motion.div>
  );
};

export default LoginForm;