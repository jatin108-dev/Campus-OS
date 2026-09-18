import { motion } from "framer-motion";
import { Check, Clock3, Plus } from "lucide-react";

function MenuItemCard({ item, onAdd }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="group overflow-hidden rounded-2xl border border-white/8 bg-[#0d1114] transition-colors duration-200 hover:border-emerald-400/20"
    >
      {/* Food visual */}
      <div className="relative flex h-32 items-center justify-center border-b border-white/6 bg-[#11161a] sm:h-36">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-400/5 text-2xl">
            🍽️
          </div>
        )}

        {!item.isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <span className="rounded-full border border-white/10 bg-[#111518] px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-white/50">
              Unavailable
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-white">
              {item.name}
            </h3>

            <p className="mt-1 line-clamp-2 min-h-[32px] text-[11px] leading-4.5 text-white/40">
              {item.description || "Freshly prepared campus favourite."}
            </p>
          </div>

          <span className="shrink-0 text-sm font-semibold text-emerald-300">
            ₹{item.price}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[10px] text-white/35">
            <Clock3 size={12} />
            {item.preparationTime || 10} min
          </div>

          {item.isAvailable ? (
            <button
              type="button"
              onClick={() => onAdd(item)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-400/15 bg-emerald-400/8 px-3 py-2 text-[11px] font-medium text-emerald-300 transition hover:border-emerald-400/30 hover:bg-emerald-400/12"
            >
              <Plus size={14} />
              Add
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/8 px-3 py-2 text-[11px] text-white/25">
              <Check size={13} />
              Unavailable
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default MenuItemCard;