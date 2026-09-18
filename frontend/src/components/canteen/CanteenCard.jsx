import { motion } from "framer-motion";
import { ArrowUpRight, Clock3, MapPin, Utensils } from "lucide-react";

function CanteenCard({ canteen, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.985 }}
      className="group w-full text-left rounded-2xl border border-white/8 bg-[#0d1114] p-4 transition-colors duration-200 hover:border-emerald-400/25 hover:bg-[#101518]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-400/8 text-emerald-300">
          <Utensils size={19} />
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${
            canteen.isOpen
              ? "border border-emerald-400/15 bg-emerald-400/8 text-emerald-300"
              : "border border-white/10 bg-white/5 text-white/45"
          }`}
        >
          {canteen.isOpen ? "OPEN" : "CLOSED"}
        </span>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate text-[15px] font-semibold text-white">
            {canteen.name}
          </h3>

          <ArrowUpRight
            size={16}
            className="shrink-0 text-white/25 transition-colors group-hover:text-emerald-300"
          />
        </div>

        <p className="mt-1.5 line-clamp-2 min-h-[36px] text-xs leading-5 text-white/45">
          {canteen.description || "Fresh meals and snacks available on campus."}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-white/40">
        <span className="flex items-center gap-1.5">
          <MapPin size={13} />
          {canteen.location}
        </span>

        <span className="flex items-center gap-1.5">
          <Clock3 size={13} />
          ~{canteen.preparationTime || 15} min
        </span>
      </div>
    </motion.button>
  );
}

export default CanteenCard;