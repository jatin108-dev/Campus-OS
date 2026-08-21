import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#09090F] text-white">

      {/* Background */}
      <div className="absolute inset-0">

  {/* Soft Black Glow */}
  <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-white/5 blur-[160px]" />
  <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-white/5 blur-[160px]" />

  {/* Grid */}
  <div
    className="absolute inset-0 opacity-[0.04]"
    style={{
      backgroundImage: `
        linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)
      `,
      backgroundSize: "40px 40px",
    }}
  />

</div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 py-20 lg:px-10">

        <div className="grid w-full items-center gap-20 lg:grid-cols-2">

          {/* LEFT SIDE */}

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >

            {/* Badge */}
{/* 
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-5 py-2 backdrop-blur-xl"
            > */}
              {/* <span className="mr-2 h-2 w-2 rounded-full bg-emerald-400"></span> */}

              {/* <span className="text-sm font-medium tracking-wide text-slate-300">
                Smart Campus Platform
              </span> */}
            {/* </motion.div>  */}

            {/* Heading */}

            <motion.h1
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 text-5xl font-black leading-[1.05] tracking-tight md:text-6xl xl:text-7xl"
            >
              The Digital
              <br />

              Operating System
              <br />

              for

              Modern Campuses
              
            </motion.h1>

            {/* Description */}

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="mt-8 max-w-xl text-lg leading-8 text-slate-400"
            >
              CampusOS connects students, faculty and campus services through
              one intelligent platform. Order food, access the library,
              manage academics and stay updated with campus activities
              effortlessly.
            </motion.p>

            {/* CTA */}

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-10 flex flex-wrap gap-4"
            >

              <Link
  to="/signup"
  className="group inline-flex items-center rounded-2xl border border-white bg-white px-8 py-4 font-semibold text-neutral-900 transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-100"
>
  Get Started

  <ArrowRight
    size={18}
    className="ml-3 transition-transform duration-300 group-hover:translate-x-1"
  />
</Link>

              <Link
                to="/login"
                className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 font-semibold backdrop-blur-xl transition-all duration-300 hover:border-indigo-500 hover:bg-white/10"
              >
                Explore Campus
              </Link>

            </motion.div>

            {/* Stats */}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-16 grid grid-cols-3 gap-8"
            >

              <div>
                <h2 className="text-4xl font-black text-white">
                  20+
                </h2>

                <p className="mt-2 text-sm uppercase tracking-wider text-slate-500">
                  Campus Services
                </p>
              </div>

              <div>
                <h2 className="text-4xl font-black text-white">
                  24/7
                </h2>

                <p className="mt-2 text-sm uppercase tracking-wider text-slate-500">
                  Smart Access
                </p>
              </div>

              <div>
                <h2 className="text-4xl font-black text-white">
                  100%
                </h2>

                <p className="mt-2 text-sm uppercase tracking-wider text-slate-500">
                  Digital Experience
                </p>
              </div>

            </motion.div>

          </motion.div>

          {/* RIGHT SIDE */}
          {/* Continue with Part 2 */}
                    {/* RIGHT SIDE */}

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="relative hidden lg:flex justify-center"
          >
            {/* Floating Card 1 */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -left-10 top-10 z-20 rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl p-4 shadow-2xl"
            >
              {/* <p className="text-xs text-slate-400">Today's Orders</p> */}
              {/* <h3 className="mt-1 text-3xl font-bold">24</h3> */}
            </motion.div>

            {/* Floating Card 2 */}
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -right-8 bottom-12 z-20 rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl p-4 shadow-2xl"
            >
              {/* <p className="text-xs text-slate-400">Attendance</p>
              <h3 className="mt-1 text-3xl font-bold">92%</h3> */}
            </motion.div>

            {/* Dashboard */}
            <div className="relative w-[520px] rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-6 shadow-[0_30px_80px_rgba(0,0,0,.45)]">

              {/* Top */}
              <div className="flex items-center justify-between border-b border-white/10 pb-5">

                <div>
                  <h2 className="text-xl font-bold">
                    Campus Dashboard
                  </h2>

                  <p className="text-sm text-slate-400">
                    Everything in one place
                  </p>
                </div>

                <div className="flex gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-500"></span>
                  <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
                  <span className="h-3 w-3 rounded-full bg-green-500"></span>
                </div>

              </div>

              {/* Grid */}
              <div className="mt-6 grid grid-cols-2 gap-5">

                <div className="rounded-2xl bg-slate-900/70 p-5 border border-white/5">
                  <p className="text-sm text-slate-400">
                    Library Books
                  </p>

                  <h3 className="mt-3 text-3xl font-bold">
                    08
                  </h3>

                  <div className="mt-4 h-2 rounded-full bg-slate-700">
                    <div className="h-full w-3/4 rounded-full bg-indigo-500"></div>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-900/70 p-5 border border-white/5">
                  <p className="text-sm text-slate-400">
                    Canteen Wallet
                  </p>

                  <h3 className="mt-3 text-3xl font-bold">
                    ₹820
                  </h3>

                  <div className="mt-4 h-2 rounded-full bg-slate-700">
                    <div className="h-full w-2/3 rounded-full bg-emerald-500"></div>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-900/70 p-5 border border-white/5">
                  <p className="text-sm text-slate-400">
                    Assignments
                  </p>

                  <h3 className="mt-3 text-3xl font-bold">
                    05
                  </h3>

                  <div className="mt-4 flex gap-2">
                    <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs text-violet-300">
                      Pending
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-900/70 p-5 border border-white/5">
                  <p className="text-sm text-slate-400">
                    Notifications
                  </p>

                  <h3 className="mt-3 text-3xl font-bold">
                    12
                  </h3>

                  <div className="mt-4 flex gap-2">
                    <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs text-cyan-300">
                      Live
                    </span>
                  </div>
                </div>

              </div>

              {/* Bottom */}
              <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/70 p-5">

                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">
                    Quick Access
                  </h3>

                  <span className="text-sm text-slate-500">
                    CampusOS
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-4">

                  {[
                    "Canteen",
                    "Library",
                    "Profile",
                  ].map((item) => (
                    <div
                      key={item}
                      className="cursor-pointer rounded-xl border border-white/10 bg-white/5 py-4 text-center text-sm text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-black"
                    >
                      {item}
                    </div>
                  ))}

                </div>

              </div>

            </div>

          </motion.div>

        </div>

      </div>

    </section>
  );
};

export default Hero;