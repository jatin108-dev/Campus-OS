import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Bell,
  ChevronRight,
  Clock3,
  IndianRupee,
  Loader2,
  LogOut,
  PackageCheck,
  RefreshCw,
  ShoppingBag,
  Store,
  UtensilsCrossed,
  Users,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const STATUS_CONFIG = {
  PLACED: {
    label: "New",
    className:
      "border-amber-300/15 bg-amber-300/[0.06] text-amber-300",
  },
  CONFIRMED: {
    label: "Confirmed",
    className:
      "border-sky-300/15 bg-sky-300/[0.06] text-sky-300",
  },
  PREPARING: {
    label: "Preparing",
    className:
      "border-orange-300/15 bg-orange-300/[0.06] text-orange-300",
  },
  READY: {
    label: "Ready",
    className:
      "border-emerald-300/15 bg-emerald-300/[0.06] text-emerald-300",
  },
  COMPLETED: {
    label: "Completed",
    className:
      "border-white/10 bg-white/[0.04] text-white/45",
  },
  CANCELLED: {
    label: "Cancelled",
    className:
      "border-red-300/15 bg-red-300/[0.05] text-red-300",
  },
};

const formatMoney = (value) => {
  const amount = Number(value || 0);

  return `₹${amount.toLocaleString("en-IN")}`;
};

const formatTime = (dateValue) => {
  if (!dateValue) return "--";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return "--";

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDate = (dateValue) => {
  if (!dateValue) return "--";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return "--";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
};

const getOrderStudentName = (order) => {
  return (
    order?.student?.fullName ||
    order?.student?.name ||
    order?.studentName ||
    "Student"
  );
};

const getOrderItemsCount = (order) => {
  if (!Array.isArray(order?.items)) return 0;

  return order.items.reduce(
    (total, item) => total + Number(item?.quantity || 0),
    0
  );
};

const MerchantDashboard = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadUser = () => {
    try {
      const storedUser = localStorage.getItem("campusOSUser");

      if (!storedUser) {
        setUser(null);
        return;
      }

      setUser(JSON.parse(storedUser));
    } catch {
      setUser(null);
    }
  };

  const fetchOrders = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await fetch(
        `${API_URL}/api/orders/merchant`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Unable to load merchant orders"
        );
      }

      const incomingOrders = Array.isArray(data)
        ? data
        : data?.orders || data?.data || [];

      setOrders(incomingOrders);
    } catch (err) {
      console.error("Merchant dashboard error:", err);
      setError(err.message || "Something went wrong");
      setOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadUser();
    fetchOrders();

    const interval = setInterval(() => {
      fetchOrders(true);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const stats = useMemo(() => {
    const activeOrders = orders.filter(
      (order) =>
        !["COMPLETED", "CANCELLED"].includes(order?.orderStatus)
    );

    const pendingOrders = orders.filter((order) =>
      ["PLACED", "CONFIRMED"].includes(order?.orderStatus)
    );

    const preparingOrders = orders.filter(
      (order) => order?.orderStatus === "PREPARING"
    );

    const readyOrders = orders.filter(
      (order) => order?.orderStatus === "READY"
    );

    const completedOrders = orders.filter(
      (order) => order?.orderStatus === "COMPLETED"
    );

    const today = new Date();

    const todayOrders = orders.filter((order) => {
      if (!order?.createdAt) return false;

      const date = new Date(order.createdAt);

      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    });

    const todayRevenue = todayOrders
      .filter((order) => order?.paymentStatus === "PAID")
      .reduce(
        (total, order) =>
          total + Number(order?.totalAmount || 0),
        0
      );

    return {
      activeOrders,
      pendingOrders,
      preparingOrders,
      readyOrders,
      completedOrders,
      todayOrders,
      todayRevenue,
    };
  }, [orders]);

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort(
        (a, b) =>
          new Date(b?.createdAt || 0) -
          new Date(a?.createdAt || 0)
      )
      .slice(0, 7);
  }, [orders]);

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("campusOSUser");
      window.dispatchEvent(new Event("campusOSAuthChange"));
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-[#070908] text-white">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-emerald-500/[0.025] blur-3xl" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-amber-400/[0.018] blur-3xl" />
      </div>

      <div className="relative flex min-h-screen">
        {/* SIDEBAR */}
        <aside className="hidden w-[230px] shrink-0 border-r border-white/[0.06] bg-[#090b0a] lg:flex lg:flex-col">
          <div className="flex h-20 items-center border-b border-white/[0.06] px-6">
            <Link
              to="/"
              className="text-lg font-bold tracking-tight"
            >
              Campus<span className="text-emerald-400">OS</span>
            </Link>
          </div>

          <div className="px-4 pt-7">
            <p className="px-3 text-[9px] font-medium uppercase tracking-[0.2em] text-white/20">
              Merchant
            </p>

            <nav className="mt-3 space-y-1">
              <Link
                to="/merchant"
                className="flex items-center gap-3 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.06] px-3.5 py-3 text-sm font-medium text-emerald-400"
              >
                <Store size={17} />
                Dashboard
              </Link>

              <Link
                to="/merchant/orders"
                className="flex items-center justify-between rounded-xl px-3.5 py-3 text-sm text-white/40 transition hover:bg-white/[0.03] hover:text-white"
              >
                <span className="flex items-center gap-3">
                  <ShoppingBag size={17} />
                  Orders
                </span>

                {stats.activeOrders.length > 0 && (
                  <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[9px] text-emerald-400">
                    {stats.activeOrders.length}
                  </span>
                )}
              </Link>

              <Link
                to="/merchant/menu"
                className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm text-white/40 transition hover:bg-white/[0.03] hover:text-white"
              >
                <UtensilsCrossed size={17} />
                Menu
              </Link>

              <Link
                to="/merchant/settings"
                className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm text-white/40 transition hover:bg-white/[0.03] hover:text-white"
              >
                <Users size={17} />
                Settings
              </Link>
            </nav>
          </div>

          <div className="mt-auto border-t border-white/[0.06] p-4">
            <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/[0.025] p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-400/15 bg-emerald-400/[0.07] text-sm font-semibold text-emerald-400">
                {(
                  user?.fullName ||
                  user?.name ||
                  "V"
                )
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-white/80">
                  {user?.fullName || user?.name || "Vendor"}
                </p>

                <p className="mt-0.5 truncate text-[9px] text-white/25">
                  {user?.vendorId || "Merchant account"}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-white/30 transition hover:bg-red-400/[0.05] hover:text-red-300"
            >
              <LogOut size={15} />
              Logout
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main className="min-w-0 flex-1">
          {/* TOPBAR */}
          <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/[0.06] bg-[#070908]/90 px-5 backdrop-blur-xl sm:px-8 lg:px-10">
            <div>
              <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-emerald-400/60">
                Merchant Console
              </p>

              <h1 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
                Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fetchOrders(true)}
                disabled={refreshing}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.025] text-white/35 transition hover:border-emerald-400/15 hover:text-emerald-400 disabled:opacity-40"
                title="Refresh"
              >
                <RefreshCw
                  size={15}
                  className={refreshing ? "animate-spin" : ""}
                />
              </button>

              <button
                type="button"
                className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.025] text-white/35 transition hover:text-white"
              >
                <Bell size={15} />

                {stats.pendingOrders.length > 0 && (
                  <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                )}
              </button>

              <div className="ml-2 hidden h-8 w-px bg-white/[0.07] sm:block" />

              <div className="ml-1 hidden text-right sm:block">
                <p className="text-xs font-medium text-white/70">
                  {user?.fullName || "Merchant"}
                </p>
                <p className="text-[9px] text-white/25">
                  {user?.vendorId || "Vendor"}
                </p>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[1500px] px-5 py-7 sm:px-8 lg:px-10 lg:py-8">
            {/* ERROR */}
            {error && (
              <div className="mb-5 flex items-center justify-between rounded-xl border border-red-400/10 bg-red-400/[0.04] px-4 py-3">
                <p className="text-xs text-red-300/80">
                  {error}
                </p>

                <button
                  onClick={() => fetchOrders()}
                  className="text-[10px] font-medium text-red-300 hover:text-red-200"
                >
                  Retry
                </button>
              </div>
            )}

            {/* WELCOME */}
            <section className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm text-white/30">
                  Welcome back,
                </p>

                <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                  {user?.fullName || "Merchant"}
                  <span className="text-emerald-400">.</span>
                </h2>

                <p className="mt-2 text-xs text-white/25">
                  Here&apos;s what&apos;s happening with your
                  canteen today.
                </p>
              </div>

              <Link
                to="/merchant/orders"
                className="group inline-flex w-fit items-center gap-2 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.05] px-4 py-2.5 text-xs font-semibold text-emerald-400 transition hover:border-emerald-400/25 hover:bg-emerald-400/[0.08]"
              >
                Manage Orders
                <ArrowRight
                  size={14}
                  className="transition group-hover:translate-x-0.5"
                />
              </Link>
            </section>

            {/* STATS */}
            <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
              <div className="rounded-2xl border border-white/[0.07] bg-[#0c0f0d] p-5">
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-400/[0.07] text-emerald-400">
                    <ShoppingBag size={17} />
                  </div>

                  <span className="text-[9px] uppercase tracking-[0.15em] text-white/20">
                    Today
                  </span>
                </div>

                <p className="mt-5 text-2xl font-bold text-white">
                  {loading ? "—" : stats.todayOrders.length}
                </p>

                <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-white/25">
                  Total Orders
                </p>
              </div>

              <div className="rounded-2xl border border-[#c7a85b]/10 bg-[#100f0b] p-5">
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#c7a85b]/[0.07] text-[#c7a85b]">
                    <IndianRupee size={17} />
                  </div>

                  <span className="text-[9px] uppercase tracking-[0.15em] text-white/20">
                    Paid
                  </span>
                </div>

                <p className="mt-5 text-2xl font-bold text-[#d5b765]">
                  {loading
                    ? "—"
                    : formatMoney(stats.todayRevenue)}
                </p>

                <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-white/25">
                  Today&apos;s Revenue
                </p>
              </div>

              <div className="rounded-2xl border border-amber-300/10 bg-[#100f0b] p-5">
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-300/[0.06] text-amber-300">
                    <Clock3 size={17} />
                  </div>

                  <span className="text-[9px] uppercase tracking-[0.15em] text-white/20">
                    Action
                  </span>
                </div>

                <p className="mt-5 text-2xl font-bold text-white">
                  {loading ? "—" : stats.pendingOrders.length}
                </p>

                <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-white/25">
                  Pending Orders
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-400/10 bg-[#0b110e] p-5">
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-400/[0.07] text-emerald-400">
                    <PackageCheck size={17} />
                  </div>

                  <span className="text-[9px] uppercase tracking-[0.15em] text-white/20">
                    Ready
                  </span>
                </div>

                <p className="mt-5 text-2xl font-bold text-white">
                  {loading ? "—" : stats.readyOrders.length}
                </p>

                <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-white/25">
                  Ready for Pickup
                </p>
              </div>
            </section>

            {/* CONTENT */}
            <section className="mt-7 grid gap-5 xl:grid-cols-[1fr_310px]">
              {/* RECENT ORDERS */}
              <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0b0e0c]">
                <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
                  <div>
                    <h3 className="text-sm font-semibold text-white/85">
                      Recent Orders
                    </h3>
                    <p className="mt-1 text-[10px] text-white/25">
                      Latest activity from your canteen
                    </p>
                  </div>

                  <Link
                    to="/merchant/orders"
                    className="flex items-center gap-1 text-[10px] font-medium text-emerald-400/70 transition hover:text-emerald-400"
                  >
                    View all
                    <ChevronRight size={13} />
                  </Link>
                </div>

                {loading ? (
                  <div className="flex min-h-[330px] items-center justify-center">
                    <Loader2
                      size={22}
                      className="animate-spin text-emerald-400"
                    />
                  </div>
                ) : recentOrders.length === 0 ? (
                  <div className="flex min-h-[330px] flex-col items-center justify-center px-6 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-white/20">
                      <ShoppingBag size={20} />
                    </div>

                    <h4 className="mt-4 text-sm font-semibold text-white/60">
                      No orders yet
                    </h4>

                    <p className="mt-1 max-w-xs text-[10px] leading-5 text-white/25">
                      New student orders will appear here once
                      they are placed.
                    </p>
                  </div>
                ) : (
                  <div>
                    {recentOrders.map((order) => {
                      const status =
                        STATUS_CONFIG[order?.orderStatus] ||
                        STATUS_CONFIG.PLACED;

                      return (
                        <button
                          key={order?._id}
                          type="button"
                          onClick={() =>
                            navigate(
                              `/merchant/orders?order=${order?._id}`
                            )
                          }
                          className="group flex w-full items-center gap-4 border-b border-white/[0.045] px-5 py-4 text-left transition hover:bg-white/[0.018]"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#c7a85b]/10 bg-[#c7a85b]/[0.035] text-[10px] font-bold text-[#d5b765]">
                            {order?.tokenNumber || "—"}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="truncate text-xs font-semibold text-white/75">
                                {getOrderStudentName(order)}
                              </p>

                              <span
                                className={`hidden rounded-full border px-2 py-0.5 text-[8px] font-medium uppercase tracking-[0.08em] sm:inline-flex ${status.className}`}
                              >
                                {status.label}
                              </span>
                            </div>

                            <p className="mt-1 text-[10px] text-white/25">
                              {getOrderItemsCount(order)}{" "}
                              {getOrderItemsCount(order) === 1
                                ? "item"
                                : "items"}{" "}
                              · {formatDate(order?.createdAt)}{" "}
                              · {formatTime(order?.createdAt)}
                            </p>
                          </div>

                          <div className="hidden text-right sm:block">
                            <p className="text-sm font-semibold text-[#d5b765]">
                              {formatMoney(order?.totalAmount)}
                            </p>

                            <p className="mt-1 text-[9px] text-white/20">
                              {order?.paymentStatus || "PENDING"}
                            </p>
                          </div>

                          <ChevronRight
                            size={15}
                            className="shrink-0 text-white/15 transition group-hover:translate-x-0.5 group-hover:text-emerald-400"
                          />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-5">
                {/* LIVE STATUS */}
                <div className="rounded-2xl border border-emerald-400/10 bg-[#0b110e] p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.18em] text-emerald-400/60">
                        Live Queue
                      </p>

                      <h3 className="mt-1 text-sm font-semibold">
                        Order Status
                      </h3>
                    </div>

                    <span className="flex items-center gap-1.5 text-[9px] text-emerald-400/70">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                      Live
                    </span>
                  </div>

                  <div className="mt-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/35">
                        New
                      </span>
                      <span className="text-sm font-semibold text-amber-300">
                        {stats.pendingOrders.length}
                      </span>
                    </div>

                    <div className="h-px bg-white/[0.05]" />

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/35">
                        Preparing
                      </span>
                      <span className="text-sm font-semibold text-orange-300">
                        {stats.preparingOrders.length}
                      </span>
                    </div>

                    <div className="h-px bg-white/[0.05]" />

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/35">
                        Ready
                      </span>
                      <span className="text-sm font-semibold text-emerald-400">
                        {stats.readyOrders.length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* QUICK ACTIONS */}
                <div className="rounded-2xl border border-white/[0.07] bg-[#0b0e0c] p-5">
                  <p className="text-[9px] uppercase tracking-[0.18em] text-white/20">
                    Quick Actions
                  </p>

                  <div className="mt-4 space-y-2">
                    <Link
                      to="/merchant/orders"
                      className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.018] px-3.5 py-3 transition hover:border-emerald-400/15 hover:bg-emerald-400/[0.025]"
                    >
                      <span className="flex items-center gap-3 text-xs text-white/50">
                        <ShoppingBag
                          size={15}
                          className="text-emerald-400/70"
                        />
                        Manage Orders
                      </span>

                      <ChevronRight
                        size={14}
                        className="text-white/15"
                      />
                    </Link>

                    <Link
                      to="/merchant/menu"
                      className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.018] px-3.5 py-3 transition hover:border-emerald-400/15 hover:bg-emerald-400/[0.025]"
                    >
                      <span className="flex items-center gap-3 text-xs text-white/50">
                        <UtensilsCrossed
                          size={15}
                          className="text-emerald-400/70"
                        />
                        Manage Menu
                      </span>

                      <ChevronRight
                        size={14}
                        className="text-white/15"
                      />
                    </Link>
                  </div>
                </div>

                {/* PERFORMANCE */}
                <div className="rounded-2xl border border-[#c7a85b]/10 bg-[#100f0b] p-5">
                  <p className="text-[9px] uppercase tracking-[0.18em] text-[#c7a85b]/55">
                    Today
                  </p>

                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-bold text-[#d5b765]">
                        {stats.todayOrders.length}
                      </p>
                      <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-white/20">
                        Orders processed
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-semibold text-white/75">
                        {stats.completedOrders.length}
                      </p>
                      <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-white/20">
                        Completed
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/[0.07] bg-[#090b0a]/95 px-3 py-2 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-around">
          <Link
            to="/merchant"
            className="flex flex-col items-center gap-1 px-4 py-1.5 text-emerald-400"
          >
            <Store size={17} />
            <span className="text-[8px]">Dashboard</span>
          </Link>

          <Link
            to="/merchant/orders"
            className="flex flex-col items-center gap-1 px-4 py-1.5 text-white/30"
          >
            <ShoppingBag size={17} />
            <span className="text-[8px]">Orders</span>
          </Link>

          <Link
            to="/merchant/menu"
            className="flex flex-col items-center gap-1 px-4 py-1.5 text-white/30"
          >
            <UtensilsCrossed size={17} />
            <span className="text-[8px]">Menu</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-1 px-4 py-1.5 text-white/30"
          >
            <LogOut size={17} />
            <span className="text-[8px]">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MerchantDashboard;