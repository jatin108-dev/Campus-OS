import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  Clock3,
  MapPin,
  PackageCheck,
  RefreshCw,
  Store,
  Utensils,
  XCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const STATUS_STEPS = [
  {
    key: "PLACED",
    title: "Order Placed",
    description: "Your order has been received",
  },
  {
    key: "CONFIRMED",
    title: "Confirmed",
    description: "The canteen has confirmed your order",
  },
  {
    key: "PREPARING",
    title: "Preparing",
    description: "Your food is being prepared",
  },
  {
    key: "READY",
    title: "Ready for Pickup",
    description: "Your order is ready at the counter",
  },
  {
    key: "COMPLETED",
    title: "Completed",
    description: "Order picked up successfully",
  },
];

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

const getStatusIndex = (status) => {
  return STATUS_STEPS.findIndex((step) => step.key === status);
};

function ProgressTimeline({ status }) {
  const currentIndex = getStatusIndex(status);

  if (status === "CANCELLED") {
    return (
      <div className="rounded-3xl border border-red-400/15 bg-red-400/[0.05] p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-400/10">
            <XCircle size={22} className="text-red-400" />
          </div>

          <div>
            <h3 className="font-bold text-white">
              Order Cancelled
            </h3>

            <p className="mt-1 text-sm leading-6 text-zinc-500">
              This order has been cancelled and will not be
              prepared.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/[0.08] bg-[#101416] p-5 sm:p-7">
      <div className="mb-7">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-600">
          Order Progress
        </p>

        <h2 className="mt-2 text-xl font-bold text-white">
          Track your order
        </h2>
      </div>

      <div className="relative">
        {STATUS_STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div
              key={step.key}
              className="relative flex gap-4 pb-7 last:pb-0"
            >
              {index < STATUS_STEPS.length - 1 && (
                <div
                  className={`absolute left-[17px] top-9 h-[calc(100%-8px)] w-px ${
                    index < currentIndex
                      ? "bg-emerald-400/50"
                      : "bg-white/[0.08]"
                  }`}
                />
              )}

              <div
                className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${
                  isCompleted
                    ? "border-emerald-400/30 bg-emerald-400/10"
                    : isCurrent
                    ? "border-white/20 bg-white text-[#090c0d]"
                    : "border-white/[0.08] bg-white/[0.04] text-zinc-600"
                }`}
              >
                {isCompleted ? (
                  <Check size={16} strokeWidth={2.5} />
                ) : (
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isCurrent
                        ? "bg-[#090c0d]"
                        : "bg-zinc-700"
                    }`}
                  />
                )}
              </div>

              <div className="pt-0.5">
                <p
                  className={`text-sm font-bold ${
                    isCurrent || isCompleted
                      ? "text-white"
                      : "text-zinc-600"
                  }`}
                >
                  {step.title}
                </p>

                <p
                  className={`mt-1 text-xs leading-5 ${
                    isCurrent
                      ? "text-zinc-400"
                      : "text-zinc-600"
                  }`}
                >
                  {step.description}
                </p>

                {isCurrent && (
                  <span className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    Current status
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OrderTracking() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchOrder = useCallback(
    async (isRefresh = false) => {
      if (!orderId) {
        setError("Order ID is missing.");
        setLoading(false);
        return;
      }

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
              `Unable to load order (${response.status})`
          );
        }

        const fetchedOrder =
          data.order || data.data || data;

        setOrder(fetchedOrder);
      } catch (err) {
        console.error(
          "Order tracking fetch error:",
          err
        );

        setError(
          err.message ||
            "Unable to load order details."
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080b0d] text-white">
        <main className="mx-auto max-w-5xl px-5 py-8 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-4 w-24 rounded bg-white/[0.06]" />

            <div className="mt-8 h-10 w-64 rounded bg-white/[0.07]" />

            <div className="mt-3 h-4 w-80 max-w-full rounded bg-white/[0.05]" />

            <div className="mt-8 h-44 rounded-3xl bg-white/[0.04]" />

            <div className="mt-5 h-96 rounded-3xl bg-white/[0.04]" />
          </div>
        </main>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#080b0d] text-white">
        <main className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-5">
          <div className="w-full max-w-md rounded-3xl border border-white/[0.08] bg-[#101416] p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-400/10 bg-red-400/[0.06]">
              <XCircle
                size={25}
                className="text-red-400"
              />
            </div>

            <h1 className="mt-5 text-xl font-bold text-white">
              Couldn't load this order
            </h1>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              {error || "Order details are unavailable."}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => fetchOrder(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#090c0d]"
              >
                <RefreshCw size={16} />
                Try Again
              </button>

              <button
                type="button"
                onClick={() => navigate("/my-orders")}
                className="rounded-xl border border-white/[0.08] px-4 py-3 text-sm font-semibold text-zinc-300"
              >
                My Orders
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const canteenName =
    order.canteen?.name || "Campus Canteen";

  const canteenLocation =
    order.canteen?.location || "Campus";

  const itemCount = (order.items || []).reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#080b0d] text-white">
      <main className="mx-auto max-w-5xl px-5 py-7 sm:px-6 lg:px-8 lg:py-9">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <button
              type="button"
              onClick={() => navigate("/my-orders")}
              className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-white"
            >
              <ArrowLeft size={16} />
              My Orders
            </button>

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-600">
              Order Tracking
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Your order
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              Track your canteen order in real time.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchOrder(true)}
            disabled={refreshing}
            className="mt-8 inline-flex items-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.035] px-3.5 py-2.5 text-sm font-semibold text-zinc-300 transition hover:bg-white/[0.06] disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
            <span className="hidden sm:inline">
              {refreshing ? "Refreshing..." : "Refresh"}
            </span>
          </button>
        </div>

        {/* Token Hero */}
        <section className="mt-8 overflow-hidden rounded-3xl border border-white/[0.08] bg-[#101416]">
          <div className="grid lg:grid-cols-[1fr_auto]">
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04]">
                  <Store
                    size={20}
                    className="text-zinc-300"
                  />
                </div>

                <div>
                  <h2 className="font-bold text-white">
                    {canteenName}
                  </h2>

                  <div className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500">
                    <MapPin size={13} />
                    {canteenLocation}
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-600">
                  Pickup Token
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-4">
                  <span className="font-mono text-5xl font-black tracking-tight text-white sm:text-6xl">
                    {order.tokenNumber || "—"}
                  </span>

                  <span
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                      order.orderStatus === "COMPLETED"
                        ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                        : order.orderStatus === "CANCELLED"
                        ? "border-red-400/20 bg-red-400/10 text-red-300"
                        : order.orderStatus === "READY"
                        ? "border-amber-400/20 bg-amber-400/10 text-amber-300"
                        : "border-white/10 bg-white/[0.05] text-zinc-300"
                    }`}
                  >
                    {order.orderStatus || "PLACED"}
                  </span>
                </div>

                <p className="mt-3 text-sm text-zinc-500">
                  Show this token at the canteen counter
                  when your order is ready.
                </p>
              </div>
            </div>

            <div className="border-t border-white/[0.07] bg-white/[0.025] p-6 lg:flex lg:min-w-[220px] lg:flex-col lg:justify-center lg:border-l lg:border-t-0">
              <div className="flex items-center gap-2 text-zinc-500">
                <Clock3 size={16} />
                <span className="text-xs font-medium">
                  Pickup Time
                </span>
              </div>

              <p className="mt-2 text-2xl font-bold text-white">
                {order.pickupTime
                  ? formatPickupTime(order.pickupTime)
                  : formatTime(order.pickupAt)}
              </p>

              {order.pickupAt && (
                <p className="mt-1 text-xs text-zinc-600">
                  {formatDate(order.pickupAt)}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="mt-5 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <ProgressTimeline
            status={order.orderStatus}
          />

          {/* Order Summary */}
          <section className="rounded-3xl border border-white/[0.08] bg-[#101416] p-5 sm:p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-600">
                  Summary
                </p>

                <h2 className="mt-2 text-xl font-bold text-white">
                  Order Details
                </h2>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04]">
                <Utensils
                  size={18}
                  className="text-zinc-500"
                />
              </div>
            </div>

            <div className="mt-6 space-y-2.5">
              {(order.items || []).map(
                (item, index) => (
                  <div
                    key={
                      item.menuItem ||
                      `${item.name}-${index}`
                    }
                    className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.05] bg-white/[0.025] px-3.5 py-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-7 min-w-7 items-center justify-center rounded-lg bg-white/[0.06] px-1.5 text-xs font-bold text-zinc-400">
                        {item.quantity}×
                      </span>

                      <span className="truncate text-sm text-zinc-300">
                        {item.name}
                      </span>
                    </div>

                    <span className="shrink-0 text-sm font-medium text-zinc-400">
                      {formatCurrency(
                        Number(item.price || 0) *
                          Number(item.quantity || 0)
                      )}
                    </span>
                  </div>
                )
              )}
            </div>

            <div className="mt-5 space-y-3 border-t border-white/[0.07] pt-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">
                  Items
                </span>

                <span className="text-zinc-300">
                  {itemCount}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500">
                  Total
                </span>

                <span className="text-lg font-bold text-white">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </div>

            {order.note && (
              <div className="mt-5 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-600">
                  Note
                </p>

                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  {order.note}
                </p>
              </div>
            )}

            <div className="mt-5 flex items-center gap-2 text-xs text-zinc-600">
              <PackageCheck size={14} />

              <span>
                Ordered {formatDate(order.createdAt)} at{" "}
                {formatTime(order.createdAt)}
              </span>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default OrderTracking;