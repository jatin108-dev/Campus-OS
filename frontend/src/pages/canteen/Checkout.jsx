import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  CreditCard,
  MessageSquare,
  ShoppingBag,
  Store,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const CART_KEY = "campusOSCart";

const MIN_PICKUP_MINUTES = 15;
const MAX_PICKUP_MINUTES = 45;
const SLOT_INTERVAL = 5;
const PICKUP_WINDOW = 40;

/* ------------------------------------------
   TIME HELPERS
------------------------------------------ */

const pad = (value) => String(value).padStart(2, "0");

const formatTime = (date) => {
  let hours = date.getHours();
  const minutes = date.getMinutes();

  const period = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;

  return `${hours}:${pad(minutes)} ${period}`;
};

const getRoundedMinimumDate = () => {
  const now = new Date();

  const minimum = new Date(
    now.getTime() +
      MIN_PICKUP_MINUTES * 60 * 1000
  );

  /*
   * Round UP to the next 5-minute slot.
   */
  minimum.setSeconds(0);
  minimum.setMilliseconds(0);

  const remainder =
    minimum.getMinutes() % SLOT_INTERVAL;

  if (remainder !== 0) {
    minimum.setMinutes(
      minimum.getMinutes() +
        (SLOT_INTERVAL - remainder)
    );
  }

  return minimum;
};

const formatDateForInput = (date) => {
  return `${date.getFullYear()}-${pad(
    date.getMonth() + 1
  )}-${pad(date.getDate())}`;
};

const formatTimeForInput = (date) => {
  return `${pad(date.getHours())}:${pad(
    date.getMinutes()
  )}`;
};

const timeToDate = (time) => {
  const [hours, minutes] = time
    .split(":")
    .map(Number);

  const date = new Date();

  date.setHours(
    hours,
    minutes,
    0,
    0
  );

  return date;
};

const addMinutes = (date, minutes) => {
  return new Date(
    date.getTime() +
      minutes * 60 * 1000
  );
};

/* ------------------------------------------
   COMPONENT
------------------------------------------ */

function Checkout() {
  const navigate = useNavigate();

  const [cart] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem(CART_KEY) || "[]"
      );
    } catch {
      return [];
    }
  });

  const [currentTime, setCurrentTime] =
    useState(new Date());

  const [pickupTime, setPickupTime] =
    useState("");

  const [pickerOpen, setPickerOpen] =
    useState(false);

  const [note, setNote] = useState("");

  const [placingOrder, setPlacingOrder] =
    useState(false);

  const [error, setError] = useState("");

  /* ------------------------------------------
     UPDATE CURRENT TIME
  ------------------------------------------ */

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  /* ------------------------------------------
     MINIMUM + MAXIMUM PICKUP TIME
  ------------------------------------------ */

  const minimumPickup = useMemo(() => {
    return getRoundedMinimumDate();
  }, [currentTime]);

  const maximumPickup = useMemo(() => {
    return addMinutes(
      minimumPickup,
      MAX_PICKUP_MINUTES - MIN_PICKUP_MINUTES
    );
  }, [minimumPickup]);

  /*
   * Example:
   *
   * Current = 10:00
   *
   * Minimum = 10:15
   * Maximum = 10:45
   *
   * Slots:
   * 10:15
   * 10:20
   * 10:25
   * 10:30
   * 10:35
   * 10:40
   * 10:45
   */

  const pickupSlots = useMemo(() => {
    const slots = [];

    let cursor = new Date(
      minimumPickup
    );

    while (cursor <= maximumPickup) {
      slots.push({
        value: formatTimeForInput(cursor),
        label: formatTime(cursor),
        date: new Date(cursor),
      });

      cursor = addMinutes(
        cursor,
        SLOT_INTERVAL
      );
    }

    return slots;
  }, [minimumPickup, maximumPickup]);

  /* ------------------------------------------
     SET DEFAULT PICKUP TIME
  ------------------------------------------ */

  useEffect(() => {
    if (!pickupTime && pickupSlots.length > 0) {
      setPickupTime(
        formatTimeForInput(
          pickupSlots[0].date
        )
      );
    }
  }, [pickupSlots, pickupTime]);

  /* ------------------------------------------
     VALIDATE EXISTING PICKUP TIME
     WHEN TIME MOVES FORWARD
  ------------------------------------------ */

  useEffect(() => {
    if (!pickupTime) return;

    const selectedDate =
      timeToDate(pickupTime);

    const minDate = getRoundedMinimumDate();
    const maxDate = addMinutes(
      minDate,
      MAX_PICKUP_MINUTES -
        MIN_PICKUP_MINUTES
    );

    if (
      selectedDate < minDate ||
      selectedDate > maxDate
    ) {
      setPickupTime(
        formatTimeForInput(minDate)
      );
    }
  }, [currentTime, pickupTime]);

  /* ------------------------------------------
     SELECTED PICKUP DATE
  ------------------------------------------ */

  const selectedPickupDate = useMemo(() => {
    if (!pickupTime) return null;

    return timeToDate(pickupTime);
  }, [pickupTime]);

  /* ------------------------------------------
     PICKUP WINDOW
  ------------------------------------------ */

  const pickupWindow = useMemo(() => {
    if (!selectedPickupDate) {
      return null;
    }

    const end = addMinutes(
      selectedPickupDate,
      PICKUP_WINDOW
    );

    return {
      start: formatTime(
        selectedPickupDate
      ),
      end: formatTime(end),
    };
  }, [selectedPickupDate]);

  /* ------------------------------------------
     CART
  ------------------------------------------ */

  const subtotal = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total +
        Number(item.price) *
          Number(item.quantity),
      0
    );
  }, [cart]);

  const itemCount = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total + Number(item.quantity),
      0
    );
  }, [cart]);

  const canteenName =
    cart[0]?.canteenName ||
    "Campus Canteen";

  const canteenId =
    cart[0]?.canteen;

  /* ------------------------------------------
     SELECT TIME
  ------------------------------------------ */

  const selectPickupTime = (time) => {
    setPickupTime(time);
    setPickerOpen(false);
    setError("");
  };

  /* ------------------------------------------
     PLACE ORDER
  ------------------------------------------ */

  const placeOrder = async (event) => {
    event.preventDefault();

    if (!cart.length) {
      navigate("/cart");
      return;
    }

    if (!pickupTime) {
      setError(
        "Please select a pickup time."
      );
      return;
    }

    /*
     * Final frontend validation.
     */
    const selectedDate =
      timeToDate(pickupTime);

    const minimum =
      getRoundedMinimumDate();

    const maximum = addMinutes(
      minimum,
      MAX_PICKUP_MINUTES -
        MIN_PICKUP_MINUTES
    );

    if (
      selectedDate < minimum ||
      selectedDate > maximum
    ) {
      setError(
        "Please select a valid pickup time between 15 and 45 minutes from now."
      );
      return;
    }

    try {
      setError("");
      setPlacingOrder(true);

      const response = await fetch(
        `${API_URL}/api/orders`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            canteen: canteenId,

            items: cart.map((item) => ({
              menuItem: item.menuItem,
              quantity: item.quantity,
            })),

            pickupTime,

            /*
             * Send exact timestamp so backend
             * can validate it correctly.
             */
            pickupAt:
              selectedDate.toISOString(),

            note: note.trim(),

            /*
             * UPI ONLY
             */
            paymentMethod: "UPI",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to place your order."
        );
      }

      const order =
        data.order ||
        data.data ||
        data;

      localStorage.setItem(
        "campusOSLastOrder",
        JSON.stringify(order)
      );

      localStorage.removeItem(
        CART_KEY
      );

      window.dispatchEvent(
        new Event("campusOSCartChange")
      );

      navigate("/order-success", {
        state: {
          order,
        },
      });
    } catch (err) {
      console.error(
        "Place order error:",
        err
      );

      setError(
        err.message ||
          "Something went wrong while placing your order."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  /* ------------------------------------------
     EMPTY CART
  ------------------------------------------ */

  if (!cart.length) {
    return (
      <div className="min-h-screen bg-[#080b0d] text-white">
        <div className="flex min-h-screen items-center justify-center px-5">
          <div className="text-center">
            <ShoppingBag
              size={40}
              className="mx-auto text-zinc-600"
            />

            <h1 className="mt-5 text-2xl font-bold">
              Your cart is empty
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              Add something from a canteen before
              checking out.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/canteen")
              }
              className="mt-6 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-black transition hover:bg-emerald-300"
            >
              Browse Canteens
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ------------------------------------------
     UI
  ------------------------------------------ */

  return (
    <div className="min-h-screen bg-[#080b0d] text-white">
      <main className="mx-auto w-full max-w-6xl px-5 py-6 sm:px-6 lg:px-8 lg:py-10">

        {/* HEADER */}

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() =>
              navigate("/cart")
            }
            className="inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to cart
          </button>

          <div className="flex items-center gap-2 text-xs text-zinc-600">
            <CheckCircle2
              size={15}
              className="text-emerald-400"
            />
            Secure checkout
          </div>
        </div>

        {/* TITLE */}

        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
            {canteenName}
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Checkout
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Choose your pickup time and confirm your order.
          </p>
        </div>

        <form
          onSubmit={placeOrder}
          className="mt-8 grid gap-6 lg:grid-cols-[1fr_370px]"
        >

          {/* =====================================
              LEFT
          ====================================== */}

          <div className="space-y-5">

            {/* PICKUP TIME */}

            <section className="rounded-2xl border border-white/10 bg-[#0d1114] p-5 sm:p-7">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10">
                    <Clock3
                      size={19}
                      className="text-emerald-400"
                    />
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold">
                      Pickup time
                    </h2>

                    <p className="mt-1 text-xs text-zinc-600">
                      15–45 minutes from now
                    </p>
                  </div>
                </div>

                <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] text-zinc-600">
                  5 min slots
                </span>
              </div>

              {/* =================================
                  BIG CLOCK
              ================================= */}

              <div className="mt-7 flex justify-center">

                <button
                  type="button"
                  onClick={() =>
                    setPickerOpen(
                      !pickerOpen
                    )
                  }
                  className="group relative"
                  aria-label="Select pickup time"
                >

                  {/* OUTER RING */}

                  <div className="flex h-64 w-64 items-center justify-center rounded-full border border-white/10 bg-[#101518] shadow-[0_0_60px_rgba(52,211,153,0.06)] transition duration-300 group-hover:border-emerald-400/30 group-hover:shadow-[0_0_70px_rgba(52,211,153,0.10)] sm:h-72 sm:w-72">

                    {/* INNER RING */}

                    <div className="relative flex h-52 w-52 items-center justify-center rounded-full border border-emerald-400/15 bg-[#0b1012] sm:h-60 sm:w-60">

                      {/* CLOCK TICKS */}

                      <div className="absolute inset-4 rounded-full border border-white/[0.04]" />

                      <div className="absolute top-5 left-1/2 h-2 w-0.5 -translate-x-1/2 rounded-full bg-emerald-400/60" />

                      <div className="absolute bottom-5 left-1/2 h-2 w-0.5 -translate-x-1/2 rounded-full bg-white/10" />

                      <div className="absolute left-5 top-1/2 h-0.5 w-2 -translate-y-1/2 rounded-full bg-white/10" />

                      <div className="absolute right-5 top-1/2 h-0.5 w-2 -translate-y-1/2 rounded-full bg-white/10" />

                      {/* CLOCK HAND */}

                      <div className="absolute left-1/2 top-1/2 h-[62px] w-0.5 origin-bottom -translate-x-1/2 -translate-y-full rounded-full bg-emerald-400/80" />

                      <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#0b1012] bg-emerald-400" />

                      {/* TIME */}

                      <div className="relative z-10 text-center">

                        <p className="text-3xl font-bold tracking-tight sm:text-4xl">
                          {selectedPickupDate
                            ? formatTime(
                                selectedPickupDate
                              )
                            : "--:--"}
                        </p>

                        <div className="mt-2 flex items-center justify-center gap-1.5 text-[11px] text-zinc-600">
                          <span>
                            Tap to select
                          </span>

                          <ChevronDown
                            size={12}
                            className={`transition-transform ${
                              pickerOpen
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              </div>

              {/* WINDOW

              {pickupWindow && (
                <div className="mx-auto mt-6 max-w-sm rounded-xl border border-emerald-400/15 bg-emerald-400/5 px-4 py-3 text-center">

                  <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-600">
                    Pickup window
                  </p>

                  <p className="mt-1 text-sm font-semibold text-emerald-300">
                    {pickupWindow.start}
                    {" — "}
                    {pickupWindow.end}
                  </p>

                  <p className="mt-1 text-[10px] text-zinc-700">
                    40 minutes to collect your order
                  </p>
                </div>
              )} */}
              

              {/* =================================
                  SCROLLABLE CLOCK PICKER
              ================================= */}

              {pickerOpen && (
                <div className="mx-auto mt-6 max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#111619]">

                  {/* PICKER HEADER */}

                  <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">

                    <div>
                      <p className="text-xs font-semibold text-white">
                        Select pickup time
                      </p>

                      <p className="mt-0.5 text-[10px] text-zinc-600">
                        Available for the next 45 minutes
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setPickerOpen(false)
                      }
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-white/5 hover:text-white"
                    >
                      <X size={15} />
                    </button>
                  </div>

                  {/* SCROLL AREA */}

                  <div className="max-h-64 overflow-y-auto p-3 scrollbar-thin">

                    {pickupSlots.map(
                      (slot) => {
                        const isSelected =
                          pickupTime ===
                          slot.value;

                        return (
                          <button
                            type="button"
                            key={slot.value}
                            onClick={() =>
                              selectPickupTime(
                                slot.value
                              )
                            }
                            className={`relative mb-1.5 flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-left transition last:mb-0 ${
                              isSelected
                                ? "bg-emerald-400 text-black"
                                : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"
                            }`}
                          >
                            <div className="flex items-center gap-3">

                              <Clock3
                                size={16}
                                className={
                                  isSelected
                                    ? "text-black"
                                    : "text-zinc-700"
                                }
                              />

                              <span className="text-sm font-semibold">
                                {slot.label}
                              </span>
                            </div>

                            {isSelected && (
                              <Check
                                size={17}
                                strokeWidth={3}
                              />
                            )}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>
              )}

              {/* INFO */}

              <div className="mt-5 flex items-start gap-2 rounded-xl bg-white/[0.02] p-3">
                <Clock3
                  size={13}
                  className="mt-0.5 shrink-0 text-zinc-700"
                />

                <p className="text-[11px] leading-5 text-zinc-600">
                  Pickup slots are available every 5 minutes,
                  starting 15 minutes from the current time and
                  ending at 45 minutes from the current time.
                </p>
              </div>
            </section>

            {/* PICKUP METHOD */}

            <section className="rounded-2xl border border-white/10 bg-[#0d1114] p-5 sm:p-6">

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10">
                  <Store
                    size={18}
                    className="text-emerald-400"
                  />
                </div>

                <div>
                  <h2 className="text-sm font-semibold">
                    Pickup method
                  </h2>

                  <p className="mt-1 text-xs text-zinc-600">
                    Collect your order from the canteen counter.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4">

                <div>
                  <p className="text-sm font-semibold">
                    Counter Pickup
                  </p>

                  <p className="mt-1 text-xs text-zinc-600">
                    {canteenName}
                  </p>
                </div>

                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400 text-black">
                  <Check
                    size={15}
                    strokeWidth={3}
                  />
                </div>
              </div>
            </section>

            {/* NOTE */}

            <section className="rounded-2xl border border-white/10 bg-[#0d1114] p-5 sm:p-6">

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04]">
                  <MessageSquare
                    size={18}
                    className="text-zinc-500"
                  />
                </div>

                <div>
                  <h2 className="text-sm font-semibold">
                    Note for the canteen
                  </h2>

                  <p className="mt-1 text-xs text-zinc-600">
                    Optional
                  </p>
                </div>
              </div>

              <textarea
                value={note}
                onChange={(event) =>
                  setNote(
                    event.target.value
                  )
                }
                maxLength={200}
                rows={3}
                placeholder="e.g. Less spicy, no onions..."
                className="mt-5 w-full resize-none rounded-xl border border-white/10 bg-[#151a1e] p-3.5 text-sm text-white outline-none placeholder:text-zinc-700 transition focus:border-emerald-400/30"
              />

              <div className="mt-2 text-right text-[11px] text-zinc-700">
                {note.length}/200
              </div>
            </section>

            {/* PAYMENT */}

            <section className="rounded-2xl border border-white/10 bg-[#0d1114] p-5 sm:p-6">

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10">
                  <CreditCard
                    size={18}
                    className="text-emerald-400"
                  />
                </div>

                <div>
                  <h2 className="text-sm font-semibold">
                    Payment
                  </h2>

                  <p className="mt-1 text-xs text-zinc-600">
                    UPI is the only available payment method.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-emerald-400/25 bg-emerald-400/5 p-4">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#151a1e] text-sm font-bold text-emerald-400">
                      UPI
                    </div>

                    <div>
                      <p className="text-sm font-semibold">
                        UPI Payment
                      </p>

                      <p className="mt-1 text-xs text-zinc-600">
                        Google Pay, PhonePe, Paytm & more
                      </p>
                    </div>

                  </div>

                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400 text-black">
                    <Check
                      size={14}
                      strokeWidth={3}
                    />
                  </div>

                </div>

                <div className="mt-4 rounded-lg bg-white/[0.03] px-3 py-2.5 text-[11px] text-zinc-600">
                  Demo UPI payment — no real transaction will be charged.
                </div>
              </div>
            </section>

            {/* ERROR */}

            {error && (
              <div className="rounded-xl border border-red-400/15 bg-red-400/5 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}
          </div>

          {/* =====================================
              RIGHT ORDER SUMMARY
          ====================================== */}

          <aside className="h-fit rounded-2xl border border-white/10 bg-[#0d1114] p-5 lg:sticky lg:top-6">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04]">
                <ShoppingBag
                  size={17}
                  className="text-zinc-400"
                />
              </div>

              <div>
                <h2 className="text-lg font-semibold">
                  Your order
                </h2>

                <p className="text-xs text-zinc-600">
                  {itemCount}{" "}
                  {itemCount === 1
                    ? "item"
                    : "items"}
                </p>
              </div>

            </div>

            {/* ITEMS */}

            <div className="mt-5 space-y-4">

              {cart.map((item) => (
                <div
                  key={item.menuItem}
                  className="flex items-center gap-3"
                >

                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#151a1e]">

                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        🍽️
                      </div>
                    )}

                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="truncate text-sm font-medium">
                      {item.name}
                    </p>

                    <p className="mt-1 text-xs text-zinc-600">
                      ₹
                      {Number(
                        item.price
                      ).toFixed(0)}
                      {" × "}
                      {item.quantity}
                    </p>

                  </div>

                  <span className="text-sm font-medium">
                    ₹
                    {(
                      Number(item.price) *
                      Number(item.quantity)
                    ).toFixed(0)}
                  </span>

                </div>
              ))}

            </div>

            {/* PRICE */}

            <div className="mt-5 border-t border-white/10 pt-5">

              <div className="flex justify-between text-sm text-zinc-500">
                <span>Subtotal</span>

                <span>
                  ₹{subtotal.toFixed(0)}
                </span>
              </div>

              <div className="mt-3 flex justify-between text-sm text-zinc-500">
                <span>Counter pickup</span>

                <span className="text-emerald-400">
                  Free
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">

                <span className="font-semibold">
                  Total
                </span>

                <span className="text-xl font-bold">
                  ₹{subtotal.toFixed(0)}
                </span>

              </div>
            </div>

            {/* PICKUP SUMMARY */}

            <div className="mt-4 rounded-xl bg-white/[0.03] p-3">

              <div className="flex items-center gap-2">

                <Clock3
                  size={14}
                  className="text-emerald-400"
                />

                <span className="text-xs text-zinc-500">
                  Pickup
                </span>

                <span className="ml-auto text-xs font-semibold text-white">
                  {pickupWindow?.start ||
                    "--:--"}
                </span>

              </div>

              {pickupWindow && (
                <p className="mt-2 pl-5 text-[11px] text-zinc-700">
                  Pickup window ends at{" "}
                  {pickupWindow.end}
                </p>
              )}
            </div>

            {/* CTA */}

            <button
              type="submit"
              disabled={
                placingOrder ||
                !pickupTime
              }
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-3.5 text-sm font-bold text-black transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {placingOrder
                ? "Processing..."
                : `Pay ₹${subtotal.toFixed(
                    0
                  )} with UPI`}
            </button>

            <p className="mt-3 text-center text-[11px] leading-5 text-zinc-700">
              Demo payment only. No real transaction will occur.
            </p>
          </aside>
        </form>
      </main>
    </div>
  );
}

export default Checkout;