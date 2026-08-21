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
      className="fixed top-6 left-1/2 z-50 w-[95%] max-w-7xl -translate-x-1/2" >
        
      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-8 py-4 backdrop-blur-2xl">

        {/* Logo */}

        <Link
          to="/"
          className="flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/10">

            <GraduationCap
              className="text-white"
              size={24}
            />

          </div>

          <div>

            <h1 className="text-2xl font-bold tracking-tight text-white">
              CampusOS
            </h1>

            <p className="text-xs text-zinc-400">
              
              Smart Campus Platform

            </p>

          </div>

        </Link>

        {/* Navigation */}

        <div className="hidden lg:flex items-center gap-2">

          {navLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="rounded-xl px-4 py-2 text-zinc-300 transition-all duration-300 hover:bg-white/10 hover:text-white"
            >
              {item.name}
            </a>
          ))}

        </div>

        {/* Buttons */}

        <div className="flex items-center gap-4">

  <Link
    to="/login"
    className={`rounded-xl px-5 py-2.5 font-medium transition-all duration-300 ${
      location.pathname === "/login"
        ? "bg-white text-black"
        : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
    }`}
  >
    Login
  </Link>

  <Link
    to="/signup"
    className="rounded-xl bg-white px-5 py-2.5 font-medium text-black transition-all duration-300 hover:bg-neutral-200 active:scale-95"
  >
    Sign Up
  </Link>

</div>

      </div>
    </motion.nav>
  );
};

export default Navbar;