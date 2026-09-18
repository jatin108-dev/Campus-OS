import { ArrowRight, Check, Clock3, Hash, MapPin } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  let order = location.state?.order;

  if (!order) {
    try {
      order = JSON.parse(
        localStorage.getItem("campusOSLastOrder") || "null"
      );
    } catch {
      order = null;
    }
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#080b0d] text-white">
        <div className="flex min-h-screen items-center justify-center px-5">
          <div className="text-center">
            <h1 className="text-2xl font-bold">
              Order not found
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              We couldn't find your recent order.
            </p>

            <button
              type="button"
              onClick={() => navigate("/canteen")}
              className="mt-6 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-black"
            >
              Browse Canteens
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tokenNumber =
    order.tokenNumber ||
    order.token ||
    order.orderToken ||
    "PENDING";

  const pickupTime = order.pickupTime || "Selected pickup time";

  const locationText = [
    order.building,
    order.floor,
    order.room,
  ]
    .filter(Boolean)
    .join(" • ");

  return (
    <div className="min-h-screen bg-[#080b0d] text-white">
      <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-5 py-12">
        <div className="w-full">
          {/* Success icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10">
            <Check
              size={30}
              className="text-emerald-400"
              strokeWidth={2.5}
            />
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
              Order placed
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              You're all set.
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-500">
              Your order has been sent to the canteen. Show your token
              when you pick it up.
            </p>
          </div>

          {/* Token */}
          <div className="mt-8 rounded-3xl border border-emerald-400/15 bg-[#0d1114] p-7 text-center">
            <div className="flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-zinc-600">
              <Hash size={14} />
              Pickup token
            </div>

            <div className="mt-3 text-5xl font-black tracking-tight text-emerald-400 sm:text-6xl">
              {tokenNumber}
            </div>

            <p className="mt-3 text-xs text-zinc-600">
              Keep this token handy at pickup.
            </p>
          </div>

          {/* Details */}
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-[#0d1114] p-5">
              <div className="flex items-center gap-3">
                <Clock3
                  size={17}
                  className="text-zinc-500"
                />

                <div>
                  <p className="text-xs text-zinc-600">
                    Pickup time
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {pickupTime}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0d1114] p-5">
              <div className="flex items-center gap-3">
                <MapPin
                  size={17}
                  className="text-zinc-500"
                />

                <div>
                  <p className="text-xs text-zinc-600">
                    Pickup location
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {locationText || "Campus"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/my-orders")}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3.5 text-sm font-semibold text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
            >
              Track my order
              <ArrowRight size={16} />
            </button>

            <button
              type="button"
              onClick={() => navigate("/canteen")}
              className="flex flex-1 items-center justify-center rounded-xl bg-emerald-400 px-5 py-3.5 text-sm font-bold text-black transition hover:bg-emerald-300"
            >
              Order something else
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default OrderSuccess;