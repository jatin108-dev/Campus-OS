import {
  ArrowRight,
  Utensils,
  LibraryBig,
  MapPinned,
} from "lucide-react";

const Features = () => {
  return (
    <section
      id="features"
      className="relative bg-[#0b0c10] text-white py-24 overflow-hidden"
    >
      {/* Background grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.06]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "90px 90px",
          }}
        />
      </div>

      {/* Glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-emerald-500/5 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">

          <span className="inline-flex items-center px-5 py-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 text-emerald-400 font-medium">
            Features
          </span>

          <h2 className="mt-7 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            Everything You Need
          </h2>

          <p className="mt-6 text-lg sm:text-xl leading-8 text-blue-200/65">
            CampusOS combines essential campus services into one
            intelligent platform, making student life easier,
            faster, and more connected.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">

          {/* ================= CANTEEN ================= */}
          <div className="group relative rounded-3xl border border-white/10 bg-[#15161b] p-8 hover:border-emerald-400/30 transition duration-300">

            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-emerald-400/10 border border-emerald-400/10 flex items-center justify-center">
              <Utensils
                size={28}
                className="text-emerald-400"
              />
            </div>

            <h3 className="text-2xl font-bold mt-8">
              Smart Canteen
            </h3>

            <p className="mt-4 text-gray-400 leading-8">
              Browse menus from all campus canteens, place
              orders online, and skip long queues with a
              seamless ordering experience.
            </p>

            <a
              href="#"
              className="inline-flex items-center gap-2 mt-8 text-emerald-400 font-semibold group-hover:gap-3 transition-all"
            >
              Learn More
              <ArrowRight size={18} />
            </a>
          </div>

          {/* ================= LIBRARY ================= */}
          <div className="group relative rounded-3xl border border-white/10 bg-[#15161b] p-8 hover:border-emerald-400/30 transition duration-300">

            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-emerald-400/10 border border-emerald-400/10 flex items-center justify-center">
              <LibraryBig
                size={28}
                className="text-emerald-400"
              />
            </div>

            <h3 className="text-2xl font-bold mt-8">
              Digital Library
            </h3>

            <p className="mt-4 text-gray-400 leading-8">
              Search books, reserve copies, track due dates,
              and manage all your library activities digitally.
            </p>

            <a
              href="#"
              className="inline-flex items-center gap-2 mt-8 text-emerald-400 font-semibold group-hover:gap-3 transition-all"
            >
              Learn More
              <ArrowRight size={18} />
            </a>
          </div>

          {/* ================= NAVIGATION ================= */}
          <div className="group relative rounded-3xl border border-white/10 bg-[#15161b] p-8 hover:border-emerald-400/30 transition duration-300">

            {/* Coming Soon */}
            <span className="absolute top-6 right-6 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs font-semibold">
              Coming Soon
            </span>

            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-emerald-400/10 border border-emerald-400/10 flex items-center justify-center">
              <MapPinned
                size={28}
                className="text-emerald-400"
              />
            </div>

            <h3 className="text-2xl font-bold mt-8">
              Campus Navigation
            </h3>

            <p className="mt-4 text-gray-400 leading-8">
              Navigate classrooms, labs, auditoriums and
              campus facilities effortlessly using indoor
              navigation.
            </p>

            <a
              href="#"
              className="inline-flex items-center gap-2 mt-8 text-emerald-400 font-semibold group-hover:gap-3 transition-all"
            >
              Learn More
              <ArrowRight size={18} />
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Features;