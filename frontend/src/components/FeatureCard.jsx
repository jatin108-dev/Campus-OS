const FeaturedCard = ({ icon, title, description, comingSoon }) => {
  return (
    <div className="relative rounded-3xl border border-white/10 bg-[#111418] p-8 hover:border-emerald-500/30 transition">

      {comingSoon && (
        <span className="absolute top-6 right-6 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm">
          Coming Soon
        </span>
      )}

      <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-3xl">
        {icon}
      </div>

      <h3 className="mt-8 text-2xl font-bold text-white">
        {title}
      </h3>

      <p className="mt-5 text-slate-400 leading-8">
        {description}
      </p>

      <button className="mt-8 text-emerald-400 font-semibold">
        Learn More →
      </button>

    </div>
  );
};

export default FeaturedCard;