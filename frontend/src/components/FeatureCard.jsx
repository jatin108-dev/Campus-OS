import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const FeatureCard = ({ icon: Icon, title, description, comingSoon = false }) => {
  return (
    <motion.div
      whileHover={{
        y: -10,
        scale: 1.03,
      }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300"
    >
      {/* Icon */}

      <div className="w-16 h-16 rounded-2xl bg-[#D7F5E8] flex items-center justify-center text-[#2E8B7E] group-hover:scale-110 transition">

        <Icon size={30} />

      </div>

      {/* Badge */}

      {comingSoon && (
        <span className="absolute top-6 right-6 bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full">
          Coming Soon
        </span>
      )}

      {/* Title */}

      <h3 className="mt-6 text-2xl font-bold text-gray-900">
        {title}
      </h3>

      {/* Description */}

      <p className="mt-4 text-gray-600 leading-7">
        {description}
      </p>

      {/* Learn More */}

      <button className="mt-8 flex items-center gap-2 text-[#2E8B7E] font-semibold hover:gap-3 transition-all">
        Learn More

        <ArrowRight size={18} />

      </button>
    </motion.div>
  );
};

export default FeatureCard;