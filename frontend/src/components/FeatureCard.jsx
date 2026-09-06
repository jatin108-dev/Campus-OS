import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  comingSoon = false,
}) => {
  return (
    <motion.div
      whileHover={{
        y: -8,
        scale: 1.02,
      }}
      transition={{ duration: 0.3 }}
      className="group relative bg-[#111418] rounded-3xl p-8 border border-white/10 shadow-sm hover:shadow-2xl hover:border-emerald-500/30 transition-all duration-300"
    >
      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition">
        <Icon size={30} />
      </div>

      {/* Coming Soon Badge */}
      {comingSoon && (
        <span className="absolute top-6 right-6 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-semibold px-3 py-1 rounded-full">
          Coming Soon
        </span>
      )}

      {/* Title */}
      <h3 className="mt-6 text-2xl font-bold text-white">
        {title}
      </h3>

      {/* Description */}
      <p className="mt-4 text-slate-400 leading-7">
        {description}
      </p>

      {/* Learn More */}
      <button className="mt-8 flex items-center gap-2 text-emerald-400 font-semibold hover:gap-3 transition-all">
        Learn More
        <ArrowRight size={18} />
      </button>
    </motion.div>
  );
};

export default FeatureCard;