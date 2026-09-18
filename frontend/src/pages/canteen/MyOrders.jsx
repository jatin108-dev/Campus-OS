import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  RefreshCw,
  ShoppingBag,
  Store,
  Utensils,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const STATUS_CONFIG = {
  PLACED: {
    label: "Placed",
    color: "#d4b968",
    bg: "bg-[#d4b968]/[0.07]",
    border: "border-[#d4b968]/20",
    text: "text-[#d9c478]",
  },

  CONFIRMED: {
    label: "Confirmed",
    color: "#56d8a3",
    bg: "bg-emerald-400/[0.06]",
    border: "border-emerald-400/20",
    text: "text-emerald-300",
  },

  PREPARING: {
    label: "Preparing",
    color: "#56d8a3",
    bg: "bg-emerald-400/[0.06]",
    border: "border-emerald-400/20",
    text: "text-emerald-300",
  },

  READY: {
    label: "Ready",
    color: "#d4b968",
    bg: "bg-[#d4b968]/[0.07]",
    border: "border-[#d4b968]/20",
    text: "text-[#d9c478]",
  },

  COMPLETED: {
    label: "Completed",
    color: "#56d8a3",
    bg: "bg-emerald-400/[0.06]",
    border: "border-emerald-400/20",
    text: "text-emerald-300",
  },

  CANCELLED: {
    label: "Cancelled",
    color: "#ef7777",
    bg: "bg-red-400/[0.06]",
    border: "border-red-400/20",
    text: "text-red-300",
  },
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));
};

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
};

const formatPickupTime = (value) => {
  if (!value) return "—";

  const match = String(value).match(/^(\d{1,2}):(\d{2})$/);

  if (!match) return String(value);

  let hours = Number(match[1]);
  const minutes = match[2];

  const period = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;

  return `${hours}:${minutes} ${period}`;
};

function StatusBadge({ status }) {
  const config =
    STATUS_CONFIG[status] || STATUS_CONFIG.PLACED;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] ${config.bg} ${config.border} ${config.text}`}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{
          backgroundColor: config.color,
        }}
      />

      {config.label}
    </span>
  );
}

function OrderCard({ order, onTrack }) {
  const canteenName =
    order.canteen?.name || "Campus Canteen";

  const canteenLocation =
    order.canteen?.location || "Campus";

  const itemCount = (order.items || []).reduce(
    (sum, item) =>
      sum + Number(item.quantity || 0),
    0
  );

  return (
    <article className="group relative overflow-hidden rounded-[30px] border border-white/[0.08] bg-[#0d1210] shadow-[0_25px_80px_rgba(0,0,0,0.32)]">
      {/* Decorative side line */}
      <div className="absolute bottom-0 left-0 top-0 w-[2px] bg-[#b8a36a]/25" />

      <div className="grid min-h-[285px] lg:grid-cols-[1.45fr_0.55fr]">
        {/* ================= LEFT ================= */}
        <div className="relative p-7 sm:p-8 lg:p-9">
          {/* Header */}
          <div className="flex items-start justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.07] bg-[#111714]">
                <Store
                  size={20}
                  className="text-[#c8b46d]"
                />
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
                  Canteen
                </p>

                <h2 className="mt-1 text-lg font-bold tracking-tight text-white">
                  {canteenName}
                </h2>

                <div className="mt-1 flex items-center gap-1.5 text-[11px] text-zinc-600">
                  <MapPin size={12} />
                  {canteenLocation}
                </div>
              </div>
            </div>

            <StatusBadge
              status={order.orderStatus}
            />
          </div>

          {/* Token */}
          <div className="mt-8 flex items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-7 bg-[#b8a36a]/30" />

                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#9e8b50]">
                  Pickup Token
                </p>

                <span className="h-px w-7 bg-[#b8a36a]/30" />
              </div>

              <p className="mt-2 font-mono text-[48px] font-black leading-none tracking-[-0.04em] text-[#f0d477] sm:text-[54px]">
                {order.tokenNumber || "—"}
              </p>
            </div>

            <div className="hidden text-right sm:block">
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-700">
                Order Date
              </p>

              <p className="mt-1 text-xs font-medium text-zinc-400">
                {formatDate(order.createdAt)}
              </p>

              <p className="mt-0.5 text-[11px] text-zinc-700">
                {formatTime(order.createdAt)}
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="mt-7 border-t border-white/[0.06] pt-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Utensils
                  size={13}
                  className="text-zinc-600"
                />

                <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
                  Order Items
                </span>
              </div>

              <span className="text-[10px] text-zinc-700">
                {itemCount}{" "}
                {itemCount === 1 ? "item" : "items"}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {(order.items || [])
                .slice(0, 4)
                .map((item, index) => (
                  <div
                    key={
                      item.menuItem ||
                      `${item.name}-${index}`
                    }
                    className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2"
                  >
                    <span className="text-[10px] font-bold text-[#bca65e]">
                      {item.quantity}×
                    </span>

                    <span className="max-w-[140px] truncate text-[11px] text-zinc-400">
                      {item.name}
                    </span>
                  </div>
                ))}

              {(order.items || []).length > 4 && (
                <div className="flex items-center rounded-xl border border-white/[0.05] px-3 py-2 text-[10px] text-zinc-700">
                  +{order.items.length - 4} more
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="border-t border-white/[0.07] bg-[#0b100e] p-7 lg:border-l lg:border-t-0 lg:p-8">
          <div className="flex h-full flex-col justify-between">
            <div>
              {/* Pickup */}
              <div>
                <div className="flex items-center gap-2">
                  <Clock3
                    size={14}
                    className="text-emerald-400/70"
                  />

                  <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
                    Pickup Time
                  </span>
                </div>

                <p className="mt-2 text-2xl font-bold tracking-tight text-white">
                  {order.pickupTime
                    ? formatPickupTime(
                        order.pickupTime
                      )
                    : formatTime(order.pickupAt)}
                </p>

                {order.pickupAt && (
                  <p className="mt-1 text-[10px] text-zinc-700">
                    {formatDate(order.pickupAt)}
                  </p>
                )}
              </div>

              {/* Divider */}
              <div className="my-6 h-px bg-white/[0.06]" />

              {/* Total */}
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
                  Total Paid
                </p>

                <p className="mt-1 text-[26px] font-black tracking-tight text-white">
                  {formatCurrency(order.totalAmount)}
                </p>

                <div className="mt-1 flex items-center gap-1.5">
                  <CheckCircle2
                    size={12}
                    className="text-emerald-400"
                  />

                  <span className="text-[10px] text-emerald-400/80">
                    Paid via UPI
                  </span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <button
              type="button"
              onClick={() => onTrack(order._id)}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#f1eee6] px-4 py-3.5 text-xs font-bold text-[#0a0d0b] transition duration-200 hover:bg-white active:scale-[0.98]"
            >
              <FileText size={15} />

              View Order

              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function EmptyOrders({ onOrder }) {
  return (
    <div className="flex min-h-[55vh] items-center justify-center rounded-[30px] border border-dashed border-white/[0.08] bg-[#0d1210]">
      <div className="px-6 py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#b8a36a]/15 bg-[#b8a36a]/[0.05]">
          <ShoppingBag
            size={27}
            className="text-[#bca65e]"
          />
        </div>

        <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8f7c43]">
          CampusOS Canteen
        </p>

        <h2 className="mt-2 text-2xl font-bold text-white">
          No orders yet
        </h2>

        <p className="mx-auto mt-2 max-w-sm text-xs leading-6 text-zinc-600">
          Your canteen orders and pickup tokens will
          appear here once you place your first order.
        </p>

        <button
          type="button"
          onClick={onOrder}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#eee9db] px-5 py-3 text-xs font-bold text-[#090c0a] transition hover:bg-white"
        >
          <Utensils size={15} />
          Browse Canteens
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

function MyOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchOrders = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const response = await fetch(
          `${API_URL}/api/orders/my-orders`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Accept: "application/json",
            },
          }
        );

        let data = {};

        try {
          data = await response.json();
        } catch {
          data = {};
        }

        if (!response.ok) {
          throw new Error(
            data.message ||
              `Unable to load orders (${response.status})`
          );
        }

        const fetchedOrders =
          data.orders ||
          data.data ||
          [];

        setOrders(
          Array.isArray(fetchedOrders)
            ? fetchedOrders
            : []
        );
      } catch (err) {
        console.error(
          "My Orders fetch error:",
          err
        );

        setError(
          err.message ||
            "Unable to load your orders."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060907] text-white">
        <main className="mx-auto flex min-h-screen max-w-6xl items-center px-6 lg:px-10">
          <div className="w-full animate-pulse">
            <div className="h-5 w-28 rounded bg-white/[0.05]" />

            <div className="mt-5 h-12 w-60 rounded bg-white/[0.06]" />

            <div className="mt-3 h-4 w-80 rounded bg-white/[0.04]" />

            <div className="mt-8 h-[290px] rounded-[30px] bg-white/[0.04]" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#060907] text-white">
      {/* ================= NAV ================= */}
      <header className="border-b border-white/[0.045]">
        <div className="mx-auto flex h-[76px] max-w-6xl items-center justify-between px-6 lg:px-10">
          <button
            type="button"
            onClick={() => navigate("/canteen")}
            className="group flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-[#0b100e]">
              <span className="font-serif text-lg text-[#62d7a5]">
                叉
              </span>
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-sm font-bold tracking-tight text-white">
                Campus<span className="text-emerald-400">OS</span>
              </p>

              <p className="mt-0.5 text-[7px] font-semibold uppercase tracking-[0.32em] text-zinc-700">
                Eat · Learn · Explore
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigate("/canteen")}
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] px-4 py-2 text-xs font-semibold text-zinc-500 transition hover:border-white/[0.14] hover:text-white"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">
              Back to Canteen
            </span>
            <span className="sm:hidden">Back</span>
          </button>
        </div>
      </header>

      {/* ================= CONTENT ================= */}
      <main className="mx-auto max-w-6xl px-6 py-8 lg:px-10 lg:py-10">
        {/* Heading */}
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#968247]">
              CampusOS · Canteen
            </p>

            <h1 className="mt-2 text-[38px] font-bold tracking-[-0.04em] text-[#f1eee7] sm:text-[46px]">
              My Orders
            </h1>

            <p className="mt-2 max-w-lg text-sm leading-6 text-zinc-600">
              Your orders, pickup tokens and canteen
              details — all in one place.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchOrders(true)}
            disabled={refreshing}
            className="mb-1 flex h-10 items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 text-xs font-semibold text-zinc-500 transition hover:border-white/[0.14] hover:text-white disabled:opacity-40"
          >
            <RefreshCw
              size={14}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            <span className="hidden sm:block">
              Refresh
            </span>
          </button>
        </div>

        {/* Gold separator */}
        <div className="mt-7 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/[0.05]" />

          <div className="h-1 w-1 rounded-full bg-[#b8a36a]/60" />

          <div className="h-px w-16 bg-[#b8a36a]/20" />
        </div>

        {/* Error */}
        {error && (
          <div className="mt-5 rounded-2xl border border-red-400/15 bg-red-400/[0.04] px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs text-red-300">
                {error}
              </p>

              <button
                type="button"
                onClick={() => fetchOrders()}
                className="text-xs font-semibold text-red-200 underline underline-offset-4"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Orders */}
        <section className="mt-6">
          {orders.length === 0 ? (
            <EmptyOrders
              onOrder={() => navigate("/canteen")}
            />
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  onTrack={(id) =>
                    navigate(
                      `/order-tracking/${id}`
                    )
                  }
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="mx-auto max-w-6xl px-6 pb-7 lg:px-10">
        <div className="flex items-center justify-between border-t border-white/[0.045] pt-5 text-[9px] uppercase tracking-[0.2em] text-zinc-800">
          <span>CampusOS · Canteen</span>

          <span>Eat · Explore · Belong</span>
        </div>
      </footer>
    </div>
  );
}

export default MyOrders;