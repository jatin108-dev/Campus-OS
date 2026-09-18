import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  Clock3,
  MapPin,
  RefreshCw,
  ShoppingBag,
  Store,
  UtensilsCrossed,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const statusSteps = [
  { key: "PLACED", label: "Placed" },
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "PREPARING", label: "Preparing" },
  { key: "READY", label: "Ready" },
  { key: "COMPLETED", label: "Picked Up" },
];

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

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
};

const getStatusIndex = (status) => {
  const index = statusSteps.findIndex(
    (step) => step.key === status
  );

  return index === -1 ? 0 : index;
};

const OrderTracking = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchOrder = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const response = await fetch(
          `${API_URL}/api/orders/${orderId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load order"
          );
        }

        setOrder(data.order || data.data || null);
      } catch (err) {
        console.error("Order tracking error:", err);

        setError(
          err.message || "Unable to load your order"
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [orderId]
  );

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const items = Array.isArray(order?.items)
    ? order.items
    : [];

  const currentStatusIndex = useMemo(
    () => getStatusIndex(order?.orderStatus),
    [order?.orderStatus]
  );

  const isCancelled =
    order?.orderStatus === "CANCELLED";

  const canteenName =
    order?.canteen?.name || "Campus Canteen";

  const canteenLocation =
    order?.canteen?.location || "GNIOT Campus";

  const subtotal = items.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
        Number(item.quantity || 0),
    0
  );

  const totalAmount = Number(
    order?.totalAmount ?? subtotal
  );

  const pickupDate =
    order?.pickupAt || order?.createdAt;

  const pickupTime =
    order?.pickupTime ||
    formatTime(order?.pickupAt);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#060809] text-white">
        <div className="flex items-center gap-3 text-sm text-white/35">
          <RefreshCw
            size={15}
            className="animate-spin text-emerald-400"
          />
          Loading order...
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#060809] px-6 text-white">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
            <ShoppingBag
              size={18}
              className="text-white/35"
            />
          </div>

          <h1 className="mt-5 text-lg font-semibold">
            Couldn't load this order
          </h1>

          <p className="mt-2 text-xs text-white/30">
            {error || "Order information is unavailable."}
          </p>

          <div className="mt-5 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/my-orders")}
              className="rounded-xl border border-white/10 px-4 py-2.5 text-xs text-white/50 hover:text-white"
            >
              My Orders
            </button>

            <button
              type="button"
              onClick={() => fetchOrder()}
              className="rounded-xl bg-emerald-400 px-4 py-2.5 text-xs font-semibold text-black hover:bg-emerald-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#060809] text-white">

      {/* =====================================================
          AMBIENT LIGHT
      ===================================================== */}

      <div className="pointer-events-none absolute -left-40 top-[30%] h-96 w-96 rounded-full bg-emerald-500/[0.025] blur-[100px]" />

      <div className="pointer-events-none absolute left-[25%] top-[42%] h-72 w-72 rounded-full bg-[#c9a95b]/[0.035] blur-[110px]" />

      <div className="pointer-events-none absolute right-[-120px] bottom-[-100px] h-80 w-80 rounded-full bg-emerald-500/[0.02] blur-[100px]" />

      {/* =====================================================
          SUBTLE GRID
      ===================================================== */}

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <main className="relative mx-auto flex min-h-screen w-full max-w-[1380px] flex-col px-6 py-5 sm:px-8 lg:px-10 lg:py-6">

        {/* ===================================================
            TOP BAR
        =================================================== */}

        <header className="flex shrink-0 items-center justify-between border-b border-white/[0.06] pb-4">
          <button
            type="button"
            onClick={() => navigate("/my-orders")}
            className="group flex items-center gap-2.5 text-xs font-medium text-white/40 transition hover:text-white"
          >
            <ArrowLeft
              size={15}
              className="transition-transform group-hover:-translate-x-1"
            />
            My Orders
          </button>

          <button
            type="button"
            onClick={() => fetchOrder(true)}
            disabled={refreshing}
            className="group flex items-center gap-2 rounded-lg px-2 py-1.5 text-[11px] text-white/30 transition hover:bg-white/[0.03] hover:text-white disabled:opacity-40"
          >
            <RefreshCw
              size={13}
              className={
                refreshing
                  ? "animate-spin"
                  : "transition-transform group-hover:rotate-45"
              }
            />
            Refresh
          </button>
        </header>

        {/* ===================================================
            HEADING
        =================================================== */}

        <div className="shrink-0 py-6 lg:py-5">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.26em] text-emerald-400/65">
                Order Tracking
              </p>

              <h1 className="mt-1.5 text-3xl font-bold tracking-[-0.045em] sm:text-[2.35rem]">
                Your{" "}
                <span className="text-white/30">
                  order
                </span>
              </h1>

              <p className="mt-1 text-xs text-white/30">
                Track your campus order in real time.
              </p>
            </div>

            <div className="hidden text-right sm:block">
              <p className="text-[8px] uppercase tracking-[0.18em] text-white/20">
                Ordered
              </p>

              <p className="mt-1 text-xs text-white/45">
                {formatDate(order.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* ===================================================
            MAIN CONTENT
        =================================================== */}

        <div className="grid flex-1 grid-cols-1 gap-8 lg:min-h-0 lg:grid-cols-[1fr_350px] lg:gap-12">

          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <section className="flex min-h-0 flex-col">

            {/* CANTEEN */}
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <div className="flex items-center gap-3.5">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-400/[0.055] text-emerald-400">
                  <div className="absolute inset-0 rounded-xl bg-emerald-400/[0.06] blur-md" />
                  <Store
                    size={17}
                    className="relative"
                  />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-white/85">
                    {canteenName}
                  </h2>

                  <p className="mt-0.5 flex items-center gap-1 text-[10px] text-white/30">
                    <MapPin size={10} />
                    {canteenLocation}
                  </p>
                </div>
              </div>

              <div
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.14em] ${
                  isCancelled
                    ? "border-red-400/10 bg-red-400/[0.035] text-red-300/65"
                    : "border-emerald-400/15 bg-emerald-400/[0.045] text-emerald-400"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isCancelled
                      ? "bg-red-400"
                      : "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]"
                  }`}
                />

                {isCancelled
                  ? "Cancelled"
                  : "Active"}
              </div>
            </div>

            {/* =================================================
                TOKEN AREA
            ================================================= */}

            <div className="relative py-7">

              {/* Gold ambient glow behind token */}
              <div className="pointer-events-none absolute left-0 top-1/2 h-24 w-72 -translate-y-1/2 rounded-full bg-[#c9a95b]/[0.035] blur-3xl" />

              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#c9a95b]/70">
                    Pickup Token
                  </p>

                  <div className="mt-1.5 flex items-center gap-3">
                    <span className="font-mono text-[3.1rem] font-bold leading-none tracking-[-0.075em] text-[#d5b765] drop-shadow-[0_0_18px_rgba(201,169,91,0.12)] sm:text-[3.45rem]">
                      {order.tokenNumber || "—"}
                    </span>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.12em] ${
                        isCancelled
                          ? "border border-red-400/10 bg-red-400/[0.035] text-red-300/60"
                          : "border border-emerald-400/15 bg-emerald-400/[0.045] text-emerald-400"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>

                  <p className="mt-2 max-w-md text-[11px] leading-5 text-white/25">
                    Show this token at the counter when your
                    order is ready.
                  </p>
                </div>

                {/* Pickup info */}
                <div className="hidden items-center gap-6 sm:flex">
                  <div>
                    <p className="text-[8px] uppercase tracking-[0.17em] text-white/20">
                      Pickup
                    </p>

                    <p className="mt-1 text-sm font-semibold text-white/65">
                      {pickupTime}
                    </p>
                  </div>

                  <div>
                    <p className="text-[8px] uppercase tracking-[0.17em] text-white/20">
                      Date
                    </p>

                    <p className="mt-1 text-xs text-white/45">
                      {formatDate(pickupDate)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Mobile pickup */}
              <div className="mt-5 flex gap-7 sm:hidden">
                <div>
                  <p className="text-[8px] uppercase tracking-[0.16em] text-white/20">
                    Pickup
                  </p>

                  <p className="mt-1 text-xs font-semibold text-white/60">
                    {pickupTime}
                  </p>
                </div>

                <div>
                  <p className="text-[8px] uppercase tracking-[0.16em] text-white/20">
                    Date
                  </p>

                  <p className="mt-1 text-xs text-white/45">
                    {formatDate(pickupDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* =================================================
                PROGRESS
            ================================================= */}

            {!isCancelled && (
              <div className="flex flex-1 flex-col justify-center border-t border-white/[0.06] py-7 lg:py-8">

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/25">
                      Order Progress
                    </p>

                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="text-lg font-semibold text-white/85">
                        {statusSteps[currentStatusIndex]?.label}
                      </span>

                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
                    </div>
                  </div>

                  <span className="text-[9px] font-medium uppercase tracking-[0.15em] text-emerald-400/50">
                    Live
                  </span>
                </div>

                {/* Timeline */}
                <div className="mt-9 flex items-start">
                  {statusSteps.map((step, index) => {
                    const completed =
                      index <= currentStatusIndex;

                    const active =
                      index === currentStatusIndex;

                    return (
                      <div
                        key={step.key}
                        className="flex flex-1 items-start"
                      >
                        <div className="flex min-w-0 flex-col items-center">
                          <div
                            className={`relative flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 ${
                              completed
                                ? "border-emerald-400/30 bg-emerald-400/[0.065] text-emerald-400"
                                : "border-white/10 bg-white/[0.02] text-white/15"
                            } ${
                              active
                                ? "shadow-[0_0_22px_rgba(52,211,153,0.12)] ring-4 ring-emerald-400/[0.035]"
                                : ""
                            }`}
                          >
                            {active && (
                              <span className="absolute inset-[-5px] rounded-full border border-emerald-400/10 animate-pulse" />
                            )}

                            {completed ? (
                              <Check
                                size={15}
                                strokeWidth={2.5}
                              />
                            ) : (
                              <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            )}
                          </div>

                          <span
                            className={`mt-3 whitespace-nowrap text-[9px] ${
                              active
                                ? "font-semibold text-emerald-400"
                                : completed
                                  ? "font-medium text-white/50"
                                  : "text-white/20"
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>

                        {index <
                          statusSteps.length - 1 && (
                          <div className="relative mt-5 h-px flex-1 bg-white/[0.07]">
                            <div
                              className={`absolute left-0 top-0 h-px transition-all duration-500 ${
                                index <
                                currentStatusIndex
                                  ? "w-full bg-emerald-400/35"
                                  : "w-0"
                              }`}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Status helper */}
                <div className="mt-9 flex items-center gap-2 text-[10px] text-white/20">
                  <Clock3
                    size={12}
                    className="text-emerald-400/45"
                  />

                  We'll notify you when your order is ready.
                </div>
              </div>
            )}

            {isCancelled && (
              <div className="flex flex-1 items-center border-t border-white/[0.06]">
                <p className="text-xs text-red-300/55">
                  This order has been cancelled.
                </p>
              </div>
            )}
          </section>

          {/* =================================================
              RIGHT — SUMMARY
          ================================================= */}

          <aside className="flex min-h-0 flex-col border-t border-white/[0.06] pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">

            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/20">
                  Summary
                </p>

                <h2 className="mt-1 text-base font-semibold text-white/80">
                  What you ordered
                </h2>
              </div>

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.025] text-white/25">
                <ShoppingBag size={15} />
              </div>
            </div>

            {/* Items */}
            <div className="mt-6">
              {items.length === 0 ? (
                <p className="text-xs text-white/25">
                  No items found.
                </p>
              ) : (
                <div>
                  {items.map((item, index) => {
                    const itemTotal =
                      Number(item.price || 0) *
                      Number(item.quantity || 0);

                    return (
                      <div
                        key={`${item.menuItem || item.name}-${index}`}
                        className="group flex items-center justify-between gap-4 border-b border-white/[0.045] py-3.5 first:pt-0"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.025] text-white/20 transition group-hover:bg-emerald-400/[0.04] group-hover:text-emerald-400/60">
                            <UtensilsCrossed size={13} />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-xs font-medium text-white/65">
                              {item.name}
                            </p>

                            <p className="mt-0.5 text-[9px] text-white/20">
                              {item.quantity} × ₹
                              {Number(
                                item.price || 0
                              ).toFixed(0)}
                            </p>
                          </div>
                        </div>

                        <span className="shrink-0 text-xs font-medium text-white/45">
                          ₹{itemTotal.toFixed(0)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Total */}
            <div className="mt-auto pt-7">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/25">
                  Items total
                </span>

                <span className="text-xs text-white/40">
                  ₹{subtotal.toFixed(0)}
                </span>
              </div>

              <div className="mt-4 flex items-end justify-between border-t border-white/[0.055] pt-4">
                <div>
                  <p className="text-[8px] font-medium uppercase tracking-[0.18em] text-white/20">
                    Total Paid
                  </p>

                  <p className="mt-1 text-[10px] text-emerald-400/60">
                    {order.paymentStatus === "PAID"
                      ? "UPI · Payment successful"
                      : order.paymentMethod || "UPI"}
                  </p>
                </div>

                <span className="text-2xl font-bold tracking-tight text-[#d0b15f] drop-shadow-[0_0_12px_rgba(201,169,91,0.1)]">
                  ₹{totalAmount.toFixed(0)}
                </span>
              </div>
            </div>

            {/* Token reminder */}
            <div className="mt-6 border-t border-white/[0.055] pt-4">
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-medium uppercase tracking-[0.18em] text-white/20">
                  Pickup token
                </span>

                <span className="font-mono text-xs font-semibold text-[#c9a95b]/75">
                  {order.tokenNumber || "—"}
                </span>
              </div>
            </div>
          </aside>
        </div>

        {/* ===================================================
            FOOTER
        =================================================== */}

        <footer className="mt-4 shrink-0 border-t border-white/[0.05] pt-3">
          <div className="flex items-center justify-between">
            <p className="text-[8px] font-medium uppercase tracking-[0.18em] text-white/15">
              CampusOS · Smart Canteen
            </p>

            <p className="text-[8px] text-white/15">
              GNIOT Campus
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default OrderTracking;