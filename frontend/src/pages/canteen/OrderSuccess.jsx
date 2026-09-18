import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  CreditCard,
  FileText,
  Home,
  MapPin,
  ShoppingBag,
  Utensils,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [order, setOrder] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const stateOrder = location.state?.order;

    if (stateOrder) {
      setOrder(stateOrder);

      localStorage.setItem(
        "campusOSLastOrder",
        JSON.stringify(stateOrder)
      );

      return;
    }

    try {
      const savedOrder =
        localStorage.getItem("campusOSLastOrder");

      if (savedOrder) {
        setOrder(JSON.parse(savedOrder));
      }
    } catch (error) {
      console.error(
        "Unable to load order:",
        error
      );
    }
  }, [location.state]);

  const copyToken = async () => {
    if (!order?.tokenNumber) return;

    try {
      await navigator.clipboard.writeText(
        order.tokenNumber
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1600);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070908] px-5 text-white">
        <div className="text-center">
          <ShoppingBag
            size={42}
            className="mx-auto text-zinc-700"
          />

          <h1 className="mt-5 text-2xl font-semibold">
            No recent order found
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Your order details could not be loaded.
          </p>

          <button
            type="button"
            onClick={() => navigate("/canteen")}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
          >
            <Home size={16} />
            Back to Canteen
          </button>
        </div>
      </div>
    );
  }

  const token = order.tokenNumber || "—";

  const pickupTime =
    order.pickupTime || "—";

  const canteenName =
    order.canteen?.name ||
    order.canteenName ||
    "Campus Canteen";

  const totalAmount =
    Number(order.totalAmount || 0);

  const paymentMethod =
    order.paymentMethod === "UPI"
      ? "Paid via UPI"
      : "Payment";

  const orderStatus =
    order.orderStatus ||
    order.status ||
    "PLACED";

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#070908] text-white">
      {/* subtle background atmosphere */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-emerald-400/[0.025] blur-3xl" />

        <div className="absolute -bottom-40 -right-40 h-[420px] w-[420px] rounded-full bg-amber-300/[0.02] blur-3xl" />
      </div>

      <main className="relative mx-auto flex min-h-screen w-full max-w-[1400px] flex-col px-5 py-5 sm:px-8 lg:px-10 lg:py-6">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <header className="flex shrink-0 items-center justify-between">
          {/* BRAND */}

          <button
            type="button"
            onClick={() => navigate("/canteen")}
            className="group flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.025] transition group-hover:border-emerald-300/25">
              <Utensils
                size={18}
                className="text-emerald-300"
              />
            </div>

            <div className="text-left">
              <p className="text-[15px] font-semibold tracking-tight">
                Campus
                <span className="text-emerald-300">
                  OS
                </span>
              </p>

              <p className="mt-0.5 text-[8px] uppercase tracking-[0.25em] text-zinc-700">
                Eat · Learn · Explore
              </p>
            </div>
          </button>

          {/* BACK */}

          <button
            type="button"
            onClick={() => navigate("/canteen")}
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.09] px-4 py-2.5 text-xs font-medium text-zinc-500 transition hover:border-white/20 hover:bg-white/[0.025] hover:text-white"
          >
            <ArrowRight
              size={14}
              className="rotate-180"
            />

            <span className="hidden sm:inline">
              Back to Canteen
            </span>

            <span className="sm:hidden">
              Back
            </span>
          </button>
        </header>

        {/* =====================================================
            MAIN CONTENT
        ===================================================== */}

        <div className="flex flex-1 items-center py-7 lg:py-4">
          <div className="grid w-full items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 xl:gap-16">

            {/* =================================================
                LEFT SIDE
            ================================================= */}

            <section className="text-center lg:text-left">
              {/* SUCCESS */}

              <div className="flex justify-center lg:justify-start">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-300/20 bg-emerald-300/[0.055]">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-300/25">
                    <Check
                      size={20}
                      strokeWidth={2.5}
                      className="text-emerald-300"
                    />
                  </div>
                </div>
              </div>

              {/* LABEL */}

              <p className="mt-5 text-[9px] font-semibold uppercase tracking-[0.42em] text-amber-300/75">
                Order placed
              </p>

              {/* HEADING */}

              <h1 className="mt-2 text-4xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-5xl xl:text-[58px]">
                You're all{" "}
                <span className="font-serif italic text-amber-200">
                  set.
                </span>
              </h1>

              {/* DESCRIPTION */}

              <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-zinc-500 lg:mx-0">
                Your order has been sent to{" "}
                <span className="text-zinc-300">
                  {canteenName}
                </span>
                . Keep your pickup token handy when
                you collect your order.
              </p>

              {/* TOKEN */}

              <div className="relative mx-auto mt-7 max-w-[570px] lg:mx-0">
                {/* ticket notches */}

                <div className="absolute -left-2 top-1/2 z-10 h-5 w-5 -translate-y-1/2 rounded-full bg-[#070908]" />

                <div className="absolute -right-2 top-1/2 z-10 h-5 w-5 -translate-y-1/2 rounded-full bg-[#070908]" />

                <div className="relative overflow-hidden rounded-[25px] border border-amber-200/20 bg-[#11110e]">
                  {/* subtle glow */}

                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(251,191,36,0.065),transparent_58%)]" />

                  <div className="relative px-6 py-6 sm:px-8 sm:py-7">
                    {/* token label */}

                    <div className="flex items-center justify-center gap-2">
                      <span className="h-px w-7 bg-amber-200/20" />

                      <span className="text-[8px] font-semibold uppercase tracking-[0.4em] text-amber-200/55">
                        Pickup token
                      </span>

                      <span className="h-px w-7 bg-amber-200/20" />
                    </div>

                    {/* token */}

                    <div className="mt-2 flex items-center justify-center gap-3">
                      <span className="font-mono text-[46px] font-bold tracking-[-0.045em] text-amber-200 sm:text-[54px]">
                        {token}
                      </span>

                      <button
                        type="button"
                        onClick={copyToken}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.025] text-zinc-600 transition hover:border-amber-200/25 hover:text-amber-200"
                        aria-label="Copy token"
                      >
                        {copied ? (
                          <Check size={15} />
                        ) : (
                          <Copy size={15} />
                        )}
                      </button>
                    </div>

                    <p className="mt-1 text-[10px] text-zinc-700">
                      {copied
                        ? "Token copied"
                        : "Show this token at pickup"}
                    </p>
                  </div>

                  {/* divider */}

                  <div className="mx-6 border-t border-dashed border-white/[0.07]" />

                  <div className="px-5 py-3 text-center text-[8px] uppercase tracking-[0.25em] text-zinc-800">
                    CampusOS · Canteen order
                  </div>
                </div>
              </div>
            </section>

            {/* =================================================
                RIGHT SIDE
            ================================================= */}

            <section>
              {/* DETAILS */}

              <div className="rounded-[25px] border border-white/[0.08] bg-white/[0.025] p-2">
                {/* pickup */}

                <div className="flex items-center gap-4 border-b border-white/[0.06] px-4 py-4 sm:px-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-300/[0.07]">
                    <Clock3
                      size={17}
                      className="text-emerald-300"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[9px] uppercase tracking-[0.18em] text-zinc-700">
                      Pickup time
                    </p>

                    <p className="mt-1 text-sm font-semibold text-white">
                      {pickupTime}
                    </p>
                  </div>

                  <div className="ml-auto text-right">
                    <p className="text-[9px] uppercase tracking-[0.15em] text-zinc-700">
                      Method
                    </p>

                    <p className="mt-1 text-xs text-zinc-400">
                      Counter pickup
                    </p>
                  </div>
                </div>

                {/* location */}

                <div className="flex items-center gap-4 border-b border-white/[0.06] px-4 py-4 sm:px-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-200/[0.06]">
                    <MapPin
                      size={17}
                      className="text-amber-200"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[9px] uppercase tracking-[0.18em] text-zinc-700">
                      Pickup location
                    </p>

                    <p className="mt-1 truncate text-sm font-semibold text-white">
                      {canteenName}
                    </p>

                    <p className="mt-0.5 text-[10px] text-zinc-600">
                      Canteen counter
                    </p>
                  </div>
                </div>

                {/* payment */}

                <div className="flex items-center gap-4 border-b border-white/[0.06] px-4 py-4 sm:px-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/[0.04]">
                    <CreditCard
                      size={17}
                      className="text-zinc-400"
                    />
                  </div>

                  <div>
                    <p className="text-[9px] uppercase tracking-[0.18em] text-zinc-700">
                      Payment
                    </p>

                    <p className="mt-1 text-sm font-semibold text-white">
                      ₹{totalAmount.toFixed(0)}
                    </p>
                  </div>

                  <p className="ml-auto text-xs font-medium text-emerald-300">
                    {paymentMethod}
                  </p>
                </div>

                {/* status */}

                <div className="flex items-center gap-4 px-4 py-4 sm:px-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-300/[0.07]">
                    <CheckCircle2
                      size={17}
                      className="text-emerald-300"
                    />
                  </div>

                  <div>
                    <p className="text-[9px] uppercase tracking-[0.18em] text-zinc-700">
                      Order status
                    </p>

                    <p className="mt-1 text-sm font-semibold capitalize text-white">
                      {String(orderStatus).toLowerCase()}
                    </p>
                  </div>

                  <div className="ml-auto flex items-center gap-2 text-[10px] text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                    Confirmed
                  </div>
                </div>
              </div>

              {/* QUICK MESSAGE */}

              <div className="mt-4 flex items-center gap-3 px-1">
                <div className="h-px flex-1 bg-white/[0.06]" />

                <p className="text-center text-[9px] uppercase tracking-[0.2em] text-zinc-700">
                  Keep your token ready
                </p>

                <div className="h-px flex-1 bg-white/[0.06]" />
              </div>

              {/* ACTIONS */}

              <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                <button
                  type="button"
                  onClick={() => navigate("/canteen")}
                  className="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-black transition hover:bg-zinc-200"
                >
                  <Home size={15} />

                  Back to Canteen

                  <ArrowRight
                    size={15}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/my-orders")}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/[0.1] px-5 py-3.5 text-sm font-medium text-zinc-400 transition hover:border-white/20 hover:bg-white/[0.035] hover:text-white"
                >
                  <FileText size={15} />
                  View My Orders
                </button>
              </div>
            </section>
          </div>
        </div>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <footer className="flex shrink-0 items-center justify-between border-t border-white/[0.055] pt-4 text-[9px] text-zinc-700">
          <div>
            <span className="font-semibold text-zinc-500">
              CampusOS
            </span>

            <span className="mx-2">·</span>

            <span className="hidden sm:inline">
              Making campus life simpler.
            </span>
          </div>

          <div className="flex items-center gap-3 uppercase tracking-[0.14em]">
            <span>Eat</span>
            <span>·</span>
            <span>Explore</span>
            <span>·</span>
            <span>Belong</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default OrderSuccess;