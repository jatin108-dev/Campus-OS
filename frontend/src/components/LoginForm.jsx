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

      setMessage(response.data.message);
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
      className="w-full max-w-md bg-[#11161a] rounded-3xl shadow-2xl border border-white/10 p-8"
    >

      {/* Heading */}

      <h2 className="text-4xl font-bold text-center text-white">
        Welcome Back
      </h2>

      <p className="text-center text-gray-400 mt-3">
        Login to continue to CampusOS
      </p>

      {/* Role Selection */}

      <div className="flex mt-8 bg-[#1a2025] rounded-2xl p-1 border border-white/10">

        <button
          type="button"
          onClick={() => setRole("student")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition ${
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
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition ${
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
            onChange={(e) => setLoginId(e.target.value)}
            placeholder={
              role === "student"
                ? "Enter Enrollment Number"
                : "Enter Vendor ID"
            }
            className="w-full mt-2 px-4 py-3 rounded-xl bg-[#090d10] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10"
          />

        </div>

        {/* Password */}

        <div>

          <label className="text-sm font-medium text-gray-300">
            Password
          </label>

          <div className="relative mt-2">

            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className="w-full px-4 py-3 pr-12 rounded-xl bg-[#090d10] border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
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
          <p className="text-center text-sm text-emerald-400">
            {message}
          </p>
        )}

        {/* Login */}

        <button
          type="submit"
          className="w-full bg-emerald-500 text-black py-3 rounded-xl font-semibold flex justify-center items-center gap-2 hover:bg-emerald-400 transition"
        >
          <LogIn size={20} />
          Login
        </button>

      </form>

      {/* Bottom */}

      <p className="text-center text-gray-500 mt-8">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="text-emerald-400 font-semibold hover:text-emerald-300"
        >
          Sign Up
        </Link>
      </p>

    </motion.div>
  );
};

export default LoginForm;
