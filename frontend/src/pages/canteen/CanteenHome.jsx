import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Search,
  ShoppingBag,
  Utensils,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import CanteenCard from "../../components/canteen/CanteenCard";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

function CanteenHome() {
  const navigate = useNavigate();

  const [canteens, setCanteens] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCanteens = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/canteens`,
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load canteens"
          );
        }

        setCanteens(
          data.canteens || data.data || []
        );
      } catch (err) {
        console.error(
          "Canteen fetch error:",
          err
        );

        setError(
          err.message ||
            "Unable to load canteens"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCanteens();
  }, []);

  const filteredCanteens = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return canteens;
    }

    return canteens.filter((canteen) => {
      return (
        canteen.name
          ?.toLowerCase()
          .includes(query) ||
        canteen.location
          ?.toLowerCase()
          .includes(query) ||
        canteen.description
          ?.toLowerCase()
          .includes(query)
      );
    });
  }, [canteens, search]);

  const openCanteens = filteredCanteens.filter(
    (canteen) => canteen.isOpen
  );

  const closedCanteens = filteredCanteens.filter(
    (canteen) => !canteen.isOpen
  );

  const handleCanteenClick = (canteen) => {
    navigate(`/canteen/${canteen._id}`);
  };

  return (
    <div className="min-h-screen bg-[#090b0d] text-white">
      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pt-12">
        {/* Header */}
        <section>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/5 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Campus Dining
              </div>

              <h1 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
                Good food.
                <span className="text-white/45">
                  {" "}
                  Less waiting.
                </span>
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-white/45">
                Pre-book your meal from class, choose a pickup
                time, and skip the queue.
              </p>
            </div>

            {/* MY ORDERS */}
            <button
              type="button"
              onClick={() => navigate("/my-orders")}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs font-medium text-white/70 transition hover:border-emerald-400/20 hover:bg-emerald-400/[0.04] hover:text-white"
            >
              <ShoppingBag size={15} />

              My Orders

              <ArrowRight size={14} />
            </button>
          </div>
        </section>

        {/* Search */}
        <section className="mt-8">
          <div className="relative max-w-2xl">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search canteens or locations..."
              className="h-12 w-full rounded-xl border border-white/10 bg-[#0d1114] pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-emerald-400/30"
            />
          </div>
        </section>

        {/* Canteens */}
        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">
                Campus canteens
              </h2>

              <p className="mt-1 text-xs text-white/35">
                {filteredCanteens.length}{" "}
                {filteredCanteens.length === 1
                  ? "canteen"
                  : "canteens"}{" "}
                available
              </p>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-[205px] animate-pulse rounded-2xl border border-white/8 bg-[#0d1114]"
                />
              ))}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-2xl border border-red-400/15 bg-red-400/5 p-6">
              <p className="text-sm font-medium text-red-300">
                Could not load canteens
              </p>

              <p className="mt-1 text-xs text-white/40">
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  window.location.reload()
                }
                className="mt-4 rounded-lg border border-white/10 px-3 py-2 text-xs text-white/70 transition hover:text-white"
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading &&
            !error &&
            filteredCanteens.length === 0 && (
              <div className="rounded-2xl border border-white/8 bg-[#0d1114] px-6 py-14 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/30">
                  <Utensils size={20} />
                </div>

                <h3 className="mt-4 text-sm font-medium">
                  No canteens found
                </h3>

                <p className="mt-1 text-xs text-white/35">
                  Try searching for another canteen or
                  location.
                </p>
              </div>
            )}

          {/* Open canteens */}
          {!loading &&
            !error &&
            openCanteens.length > 0 && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {openCanteens.map(
                  (canteen, index) => (
                    <motion.div
                      key={canteen._id}
                      initial={{
                        opacity: 0,
                        y: 8,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.25,
                        delay: index * 0.04,
                      }}
                    >
                      <CanteenCard
                        canteen={canteen}
                        onClick={() =>
                          handleCanteenClick(
                            canteen
                          )
                        }
                      />
                    </motion.div>
                  )
                )}
              </div>
            )}

          {/* Closed canteens */}
          {!loading &&
            !error &&
            closedCanteens.length > 0 && (
              <div className="mt-10">
                <h3 className="mb-4 text-xs font-medium uppercase tracking-[0.16em] text-white/30">
                  Currently closed
                </h3>

                <div className="grid grid-cols-1 gap-3 opacity-70 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {closedCanteens.map(
                    (canteen) => (
                      <CanteenCard
                        key={canteen._id}
                        canteen={canteen}
                        onClick={() =>
                          handleCanteenClick(
                            canteen
                          )
                        }
                      />
                    )
                  )}
                </div>
              </div>
            )}
        </section>
      </main>
    </div>
  );
}

export default CanteenHome;