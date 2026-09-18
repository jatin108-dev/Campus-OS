import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import {
  ArrowRight,
  MapPinned,
  ShoppingBag,
  UtensilsCrossed,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser =
          localStorage.getItem("campusOSUser");

        setUser(
          storedUser ? JSON.parse(storedUser) : null
        );
      } catch {
        setUser(null);
      }
    };

    loadUser();

    window.addEventListener(
      "campusOSAuthChange",
      loadUser
    );

    return () => {
      window.removeEventListener(
        "campusOSAuthChange",
        loadUser
      );
    };
  }, []);

  // --------------------------------------------------
  // SMART CANTEEN ROUTING
  // --------------------------------------------------
  const getSmartCanteenRoute = () => {
    try {
      const storedUser =
        localStorage.getItem("campusOSUser");

      // Not logged in
      if (!storedUser) {
        return "/login";
      }

      const loggedInUser = JSON.parse(storedUser);

      // Vendor → Merchant Portal
      if (loggedInUser?.role === "vendor") {
        return "/merchant";
      }

      // Student → Student Canteen
      return "/canteen";
    } catch (error) {
      console.error(
        "Error reading CampusOS user:",
        error
      );

      return "/login";
    }
  };

  const handleSmartCanteenClick = () => {
    navigate(getSmartCanteenRoute());
  };

  return (
    <section className="relative overflow-hidden bg-[#09090f] text-white">
      {/* Background Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "52px 52px",
        }}
      />

      {/* Ambient Glows */}
      <div className="pointer-events-none absolute left-[8%] top-[28%] h-64 w-64 rounded-full bg-emerald-500/[0.035] blur-3xl" />

      <div className="pointer-events-none absolute right-[12%] top-[32%] h-72 w-72 rounded-full bg-amber-400/[0.025] blur-3xl" />

      {/* =====================================================
          HERO CONTAINER
      ===================================================== */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-155px)] max-w-7xl items-center px-6 pb-10 pt-32 sm:px-8 sm:pt-36 lg:px-10 lg:pb-10 lg:pt-36">
        <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-10">

          {/* =====================================================
              LEFT CONTENT
          ===================================================== */}
          <div className="max-w-xl">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.045] px-3.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Smart Campus Platform
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.55,
                delay: 0.05,
              }}
              className="mt-6 text-[3rem] font-extrabold leading-[0.91] tracking-[-0.045em] sm:text-[3.6rem] lg:text-[3.95rem]"
            >
              <span className="text-white">
                The Digital
              </span>

              <br />

              <span className="text-white">
                Operating
              </span>

              <br />

              <span className="text-white">
                System
              </span>

              <br />

              <span className="text-white/30">
                for{" "}
              </span>

              {/* GNIOT */}
              <span
                className="relative inline-block font-normal italic tracking-[-0.015em] text-[#c7a85b]"
                style={{
                  fontFamily:
                    '"Brush Script MT", "Segoe Script", "URW Chancery L", cursive',
                }}
              >
                GNIOT

                <span className="absolute -bottom-1 left-[3%] h-[2px] w-[94%] rounded-full bg-[#c7a85b]/60" />
              </span>

              <br />

              <span className="text-white/30">
                Campus
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.15,
              }}
              className="mt-5 max-w-lg text-sm leading-6 text-slate-400 sm:text-[15px]"
            >
              CampusOS connects students with essential
              campus services through one intelligent
              platform. Order food, skip queues, and
              navigate your campus with ease.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.22,
              }}
              className="mt-6"
            >
              {!user ? (
                <Link
                  to="/login"
                  className="group inline-flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.045] px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-emerald-400/25 hover:bg-emerald-400/[0.06]"
                >
                  Get Started

                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              ) : (
                <a
                  href="#features"
                  className="group inline-flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.045] px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-emerald-400/25 hover:bg-emerald-400/[0.06]"
                >
                  Explore Campus

                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </a>
              )}
            </motion.div>

            {/* Compact Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.3,
              }}
              className="mt-6 flex items-center gap-6"
            >
              <div>
                <p className="text-lg font-semibold text-white/85">
                  2
                </p>

                <p className="mt-0.5 text-[9px] uppercase tracking-[0.14em] text-white/25">
                  Smart Services
                </p>
              </div>

              <div className="h-7 w-px bg-white/10" />

              <div>
                <p className="text-lg font-semibold text-white/85">
                  24/7
                </p>

                <p className="mt-0.5 text-[9px] uppercase tracking-[0.14em] text-white/25">
                  Digital Access
                </p>
              </div>

              <div className="h-7 w-px bg-white/10" />

              <div>
                <p className="text-lg font-semibold text-white/85">
                  1
                </p>

                <p className="mt-0.5 text-[9px] uppercase tracking-[0.14em] text-white/25">
                  Campus Platform
                </p>
              </div>
            </motion.div>
          </div>

          {/* =====================================================
              RIGHT DASHBOARD
          ===================================================== */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.65,
              delay: 0.12,
            }}
            className="relative mx-auto w-full max-w-xl lg:ml-auto"
          >

            {/* Floating Smart Canteen */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.55,
              }}
              className="absolute -left-2 top-8 z-20 hidden w-52 rounded-xl border border-emerald-400/15 bg-[#0d1714]/95 p-3.5 shadow-2xl backdrop-blur-xl sm:block lg:-left-12"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-400/[0.08] text-emerald-400">
                  <UtensilsCrossed size={17} />
                </div>

                <div>
                  <p className="text-[9px] uppercase tracking-[0.14em] text-white/25">
                    Smart Canteen
                  </p>

                  <p className="mt-0.5 text-xs font-semibold text-white">
                    Skip the queue
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Main Dashboard */}
            <div className="rounded-[1.6rem] border border-white/10 bg-[#111217]/95 p-4 shadow-2xl backdrop-blur-xl sm:p-5">

              {/* Dashboard Header */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-emerald-400/75">
                    CampusOS
                  </p>

                  <h2 className="mt-1.5 text-lg font-bold tracking-tight sm:text-xl">
                    Campus at a glance
                  </h2>

                  <p className="mt-0.5 text-[10px] text-white/25">
                    Essential campus services
                  </p>
                </div>

                <div className="flex gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-500/80" />
                  <span className="h-2 w-2 rounded-full bg-amber-400/80" />
                  <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
                </div>
              </div>

              <div className="my-4 h-px bg-white/[0.07]" />

              {/* Service Cards */}
              <div className="grid grid-cols-2 gap-3">

                {/* Smart Canteen */}
                <button
                  type="button"
                  onClick={handleSmartCanteenClick}
                  className="group rounded-xl border border-emerald-400/10 bg-[#09130f] p-4 text-left transition duration-300 hover:-translate-y-1 hover:border-emerald-400/25"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-400/[0.08] text-emerald-400">
                      <ShoppingBag size={17} />
                    </div>

                    <ArrowRight
                      size={15}
                      className="text-white/15 transition group-hover:translate-x-1 group-hover:text-emerald-400"
                    />
                  </div>

                  <p className="mt-4 text-[10px] text-slate-400">
                    Smart Canteen
                  </p>

                  <h3 className="mt-1 text-base font-bold text-white">
                    Order Food
                  </h3>

                  <div className="mt-3 flex items-center gap-1.5 text-[10px] text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Open for orders
                  </div>
                </button>

                {/* Campus Navigation */}
                <div className="rounded-xl border border-amber-400/10 bg-[#13130f] p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-400/[0.07] text-amber-300">
                      <MapPinned size={17} />
                    </div>

                    <span className="rounded-full border border-amber-400/15 px-2.5 py-1 text-[8px] font-medium uppercase tracking-[0.12em] text-amber-300/70">
                      Soon
                    </span>
                  </div>

                  <p className="mt-4 text-[10px] text-slate-400">
                    Campus Navigation
                  </p>

                  <h3 className="mt-1 text-base font-bold text-white">
                    Explore Campus
                  </h3>

                  <div className="mt-3 flex items-center gap-1.5 text-[10px] text-amber-300/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-300/70" />
                    Coming soon
                  </div>
                </div>
              </div>

              {/* Bottom Info */}
              <div className="mt-3 flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] text-white/25">
                  <UtensilsCrossed size={14} />
                </div>

                <div>
                  <p className="text-[8px] uppercase tracking-[0.13em] text-white/20">
                    Campus experience
                  </p>

                  <p className="mt-0.5 text-xs font-medium text-white/70">
                    Simple. Connected. Digital.
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Navigation Card */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.7,
              }}
              className="absolute -bottom-4 right-0 z-20 hidden w-56 rounded-xl border border-amber-400/10 bg-[#14140f]/95 p-3.5 shadow-2xl backdrop-blur-xl sm:block lg:-right-10"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-400/[0.07] text-amber-300">
                  <MapPinned size={17} />
                </div>

                <div>
                  <p className="text-[9px] uppercase tracking-[0.13em] text-white/25">
                    Campus Navigation
                  </p>

                  <p className="mt-0.5 text-xs font-semibold text-white">
                    Coming Soon
                  </p>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;