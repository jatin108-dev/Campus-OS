import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import {
  ArrowUpRight,
  MapPinned,
  UtensilsCrossed,
} from "lucide-react";

const features = [
  {
    number: "01",
    icon: UtensilsCrossed,
    title: "Smart Canteen",
    description:
      "Browse campus menus, place orders online, choose your pickup time, and skip the queue.",
    accent: "emerald",
    route: "/canteen",
  },
  {
    number: "02",
    icon: MapPinned,
    title: "Campus Navigation",
    description:
      "Find classrooms, labs, auditoriums and campus facilities with intelligent indoor navigation.",
    accent: "gold",
    comingSoon: true,
  },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#090a0d] text-white">
      <Navbar />

      <Hero />

      {/* =====================================================
          FEATURES
      ===================================================== */}
      <section
        id="features"
        className="relative border-t border-white/[0.06] bg-[#090a0d] px-6 py-16 sm:px-8 lg:px-10 lg:py-20"
      >
        {/* subtle background grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
            `,
            backgroundSize: "54px 54px",
          }}
        />

        <div className="relative mx-auto max-w-6xl">
          {/* Section heading */}
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.04] px-3.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Campus Services
              </span>

              <h2 className="mt-5 text-3xl font-extrabold tracking-[-0.035em] sm:text-4xl lg:text-5xl">
                Built for{" "}
                <span className="text-white/35">
                  GNIOT.
                </span>
              </h2>
            </div>

            <p className="max-w-md text-sm leading-6 text-white/40 md:pb-1">
              Essential campus experiences, brought together
              in one simple digital platform.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;
              const isEmerald = feature.accent === "emerald";

              return (
                <div
                  key={feature.number}
                  onClick={() => {
                    if (feature.route) {
                      navigate(feature.route);
                    }
                  }}
                  className={`group relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 sm:p-7 ${
                    feature.route
                      ? "cursor-pointer hover:-translate-y-1"
                      : ""
                  } ${
                    isEmerald
                      ? "border-emerald-400/[0.12] bg-[#0c1210] hover:border-emerald-400/25"
                      : "border-amber-300/[0.11] bg-[#11110e] hover:border-amber-300/25"
                  }`}
                >
                  {/* Ambient glow */}
                  <div
                    className={`pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full blur-3xl ${
                      isEmerald
                        ? "bg-emerald-400/[0.035]"
                        : "bg-amber-300/[0.035]"
                    }`}
                  />

                  {/* Top row */}
                  <div className="relative flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                          isEmerald
                            ? "bg-emerald-400/[0.08] text-emerald-400"
                            : "bg-amber-300/[0.07] text-amber-300"
                        }`}
                      >
                        <Icon size={20} strokeWidth={1.8} />
                      </div>

                      <span className="text-[10px] font-medium tracking-[0.18em] text-white/20">
                        {feature.number}
                      </span>
                    </div>

                    {feature.comingSoon ? (
                      <span className="rounded-full border border-amber-300/15 bg-amber-300/[0.04] px-3 py-1 text-[9px] font-medium uppercase tracking-[0.12em] text-amber-300/70">
                        Coming Soon
                      </span>
                    ) : (
                      <ArrowUpRight
                        size={18}
                        className="text-white/20 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-emerald-400"
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="relative mt-8">
                    <h3 className="text-xl font-bold tracking-tight text-white sm:text-[22px]">
                      {feature.title}
                    </h3>

                    <p className="mt-3 max-w-lg text-sm leading-6 text-white/40">
                      {feature.description}
                    </p>
                  </div>

                  {/* Bottom line */}
                  <div className="relative mt-7 flex items-center justify-between border-t border-white/[0.06] pt-4">
                    {isEmerald ? (
                      <>
                        <span className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.14em] text-emerald-400/70">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          Available now
                        </span>

                        <span className="text-xs text-white/20 transition group-hover:text-white/50">
                          Explore →
                        </span>
                      </>
                    ) : (
                      <span className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.14em] text-amber-300/50">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-300/60" />
                        In development
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Small platform statement */}
          <div className="mt-5 flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.018] px-5 py-4">
            <p className="text-xs text-white/30">
              One platform. One campus.{" "}
              <span className="text-white/55">
                One connected experience.
              </span>
            </p>

            <span className="hidden text-[9px] uppercase tracking-[0.18em] text-white/20 sm:block">
              CampusOS
            </span>
          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}
      <footer className="border-t border-white/[0.06] bg-[#08090c]">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-9 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">
              Campus<span className="text-emerald-400">OS</span>
            </h2>

            <p className="mt-1 text-xs text-white/30">
              Smart Campus. Smarter Students.
            </p>
          </div>

          <div className="flex gap-6 text-xs text-white/35">
            <a
              href="#features"
              className="transition hover:text-emerald-400"
            >
              Features
            </a>

            <a
              href="#"
              className="transition hover:text-white"
            >
              About
            </a>

            <a
              href="#"
              className="transition hover:text-white"
            >
              Contact
            </a>
          </div>
        </div>

        <div className="border-t border-white/[0.04] py-4 text-center text-[10px] text-white/20">
          © {new Date().getFullYear()} CampusOS · GNIOT
        </div>
      </footer>
    </div>
  );
};

export default Landing;