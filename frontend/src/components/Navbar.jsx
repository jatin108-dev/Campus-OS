import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";

const Navbar = () => {
  const location = useLocation();

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-5">

        {/* Logo */}

        <Link
          to="/"
          className="flex items-center gap-3"
        >
          <div className="w-11 h-11 rounded-2xl bg-[#2E8B7E] flex items-center justify-center shadow-lg">

            <GraduationCap
              className="text-white"
              size={24}
            />

          </div>

          <div>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900">

              CampusOS

            </h1>

            <p className="text-xs text-gray-500">

              Smart Campus Platform

            </p>

          </div>

        </Link>

        {/* Navigation */}

        <div className="hidden lg:flex items-center gap-10 text-gray-600 font-medium">

          {navLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="hover:text-[#2E8B7E] transition-all duration-300"
            >
              {item.name}
            </a>
          ))}

        </div>

        {/* Buttons */}

        <div className="flex items-center gap-4">

          <Link
            to="/login"
            className={`px-5 py-2 rounded-xl transition-all duration-300
            ${
              location.pathname === "/login"
                ? "bg-[#2E8B7E] text-white"
                : "border border-gray-300 hover:border-[#2E8B7E] hover:text-[#2E8B7E]"
            }`}
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="px-5 py-2 rounded-xl bg-[#2E8B7E] text-white hover:bg-[#256F65] transition-all duration-300 shadow-md hover:shadow-xl"
          >
            Sign Up
          </Link>

        </div>

      </div>
    </motion.nav>
  );
};

export default Navbar;