import { motion } from "framer-motion";

function CategoryTabs({ categories, activeCategory, onChange }) {
  return (
    <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
      {categories.map((category) => {
        const active = category === activeCategory;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            className={`relative shrink-0 rounded-lg px-3.5 py-2 text-xs font-medium transition ${
              active
                ? "text-emerald-300"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            {active && (
              <motion.div
                layoutId="activeCategory"
                className="absolute inset-0 rounded-lg border border-emerald-400/15 bg-emerald-400/7"
              />
            )}

            <span className="relative z-10">{category}</span>
          </button>
        );
      })}
    </div>
  );
}

export default CategoryTabs;