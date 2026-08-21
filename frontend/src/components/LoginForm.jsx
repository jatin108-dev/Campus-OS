import { useState } from "react";
import { Link } from "react-router-dom";
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
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post(
      "http://localhost:5000/api/auth/login",
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
    console.log(response.data);
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
      className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-200 p-8"
    >
      {/* Heading */}

      <h2 className="text-3xl font-bold text-center text-gray-900">
        Welcome Back
      </h2>

      <p className="text-center text-gray-500 mt-2">
        Login to continue to CampusOS
      </p>

      {/* Role Selection */}

      <div className="flex mt-8 bg-gray-100 rounded-2xl p-1">

        <button
          type="button"
          onClick={() => setRole("student")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition
            ${
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
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition
            ${
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

      <form onSubmit={handleLogin} className="mt-8 space-y-5">

        <div>
          <label className="text-sm font-medium text-gray-700">
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
            className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2E8B7E]"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Password
          </label>

          <div className="relative mt-2">

            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2E8B7E]"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>

          </div>
        </div>

            {message && (
             <p className="text-center text-sm text-gray-600 mt-4">
              {message}
             </p>
         )}

        <button
          type="submit"
          className="w-full bg-[#2E8B7E] text-white py-3 rounded-xl font-semibold flex justify-center items-center gap-2 hover:bg-[#256F65] transition"
        >
          <LogIn size={20} />
          Login
        </button>

      </form>

      {/* Bottom */}

      <p className="text-center text-gray-600 mt-8">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="text-[#2E8B7E] font-semibold"
        >
          Sign Up
        </Link>
      </p>

    </motion.div>
  );
};

export default LoginForm;