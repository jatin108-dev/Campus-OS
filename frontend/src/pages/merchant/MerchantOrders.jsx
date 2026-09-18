import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  RefreshCw,
  ChevronRight,
  Clock,
  Clock3,
  CheckCircle2,
  Check,
  XCircle,
  X,
  Utensils,
  UtensilsCrossed,
  User,
  Users,
  Store,
  ShoppingBag,
  PackageCheck,
  IndianRupee,
  MapPin,
  CreditCard,
  Loader2,
  LogOut,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const STATUS_FLOW = [
  "PLACED",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "COMPLETED",
];

const STATUS_CONFIG = {
  PLACED: {
    label: "New Order",
    color: "text-amber-300",
    bg: "bg-amber-300/[0.06]",
    border: "border-amber-300/15",
  },
  CONFIRMED: {
    label: "Confirmed",
    color: "text-sky-300",
    bg: "bg-sky-300/[0.06]",
    border: "border-sky-300/15",
  },
  PREPARING: {
    label: "Preparing",
    color: "text-orange-300",
    bg: "bg-orange-300/[0.06]",
    border: "border-orange-300/15",
  },
  READY: {
    label: "Ready",
    color: "text-emerald-400",
    bg: "bg-emerald-400/[0.06]",
    border: "border-emerald-400/15",
  },
  COMPLETED: {
    label: "Completed",
    color: "text-white/45",
    bg: "bg-white/[0.035]",
    border: "border-white/10",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "text-red-300",
    bg: "bg-red-400/[0.05]",
    border: "border-red-400/10",
  },
};

const formatMoney = (value) => {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
};

const formatDate = (value) => {
  if (!value) return "--";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "--";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (value) => {
  if (!value) return "--";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "--";

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStudentName = (order) => {
  return (
    order?.student?.fullName ||
    order?.student?.name ||
    order?.studentName ||
    "Student"
  );
};

const getItemsCount = (order) => {
  if (!Array.isArray(order?.items)) return 0;

  return order.items.reduce(
    (sum, item) => sum + Number(item?.quantity || 0),
    0
  );
};

const MerchantOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [user, setUser] = useState(null);

  const [activeFilter, setActiveFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const loadUser = () => {
    try {
      const stored = localStorage.getItem("campusOSUser");

      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      setUser(null);
    }
  };

  const fetchOrders = async (refresh = false) => {
    try {
      if (refresh) {
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
          data?.message || "Unable to load orders"
        );
      }

      const incomingOrders = Array.isArray(data)
        ? data
        : data?.orders || data?.data || [];

      const sortedOrders = [...incomingOrders].sort(
        (a, b) =>
          new Date(b?.createdAt || 0) -
          new Date(a?.createdAt || 0)
      );

      setOrders(sortedOrders);

      if (selectedOrder?._id) {
        const updatedSelected = sortedOrders.find(
          (order) => order._id === selectedOrder._id
        );

        if (updatedSelected) {
          setSelectedOrder(updatedSelected);
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
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

  const counts = useMemo(() => {
    return {
      all: orders.length,
      new: orders.filter(
        (o) => o.orderStatus === "PLACED"
      ).length,
      preparing: orders.filter(
        (o) =>
          o.orderStatus === "CONFIRMED" ||
          o.orderStatus === "PREPARING"
      ).length,
      ready: orders.filter(
        (o) => o.orderStatus === "READY"
      ).length,
      completed: orders.filter(
        (o) => o.orderStatus === "COMPLETED"
      ).length,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (activeFilter === "ALL") return orders;

    if (activeFilter === "NEW") {
      return orders.filter(
        (order) => order.orderStatus === "PLACED"
      );
    }

    if (activeFilter === "PREPARING") {
      return orders.filter((order) =>
        ["CONFIRMED", "PREPARING"].includes(
          order.orderStatus
        )
      );
    }

    if (activeFilter === "READY") {
      return orders.filter(
        (order) => order.orderStatus === "READY"
      );
    }

    if (activeFilter === "COMPLETED") {
      return orders.filter(
        (order) => order.orderStatus === "COMPLETED"
      );
    }

    return orders;
  }, [orders, activeFilter]);

  const updateOrderStatus = async (orderId, nextStatus) => {
    try {
      setUpdating(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            status: nextStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Unable to update order status"
        );
      }

      const updatedOrder =
        data?.order ||
        data?.data ||
        data;

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                ...(updatedOrder &&
                typeof updatedOrder === "object"
                  ? updatedOrder
                  : {}),
                orderStatus: nextStatus,
              }
            : order
        )
      );

      setSelectedOrder((previous) =>
        previous?._id === orderId
          ? {
              ...previous,
              ...(updatedOrder &&
              typeof updatedOrder === "object"
                ? updatedOrder
                : {}),
              orderStatus: nextStatus,
            }
          : previous
      );
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Unable to update order status"
      );
    } finally {
      setUpdating(false);
    }
  };

  const cancelOrder = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    await updateOrderStatus(orderId, "CANCELLED");
  };

  const getNextStatus = (status) => {
    const index = STATUS_FLOW.indexOf(status);

    if (index === -1) return null;

    return STATUS_FLOW[index + 1] || null;
  };

  const getNextButtonLabel = (status) => {
    switch (status) {
      case "PLACED":
        return "Confirm Order";
      case "CONFIRMED":
        return "Start Preparing";
      case "PREPARING":
        return "Mark Ready";
      case "READY":
        return "Complete Order";
      default:
        return null;
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem("campusOSUser");
      window.dispatchEvent(
        new Event("campusOSAuthChange")
      );
      window.location.href = "/login";
    }
  };

  return (
    <div className="min-h-screen bg-[#070908] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-120px] top-[15%] h-80 w-80 rounded-full bg-emerald-500/[0.025] blur-3xl" />
        <div className="absolute right-[-100px] top-[5%] h-80 w-80 rounded-full bg-amber-400/[0.018] blur-3xl" />
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
            <p className="px-3 text-[9px] uppercase tracking-[0.2em] text-white/20">
              Merchant
            </p>

            <nav className="mt-3 space-y-1">
              <Link
                to="/merchant"
                className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm text-white/40 transition hover:bg-white/[0.03] hover:text-white"
              >
                <Store size={17} />
                Dashboard
              </Link>

              <Link
                to="/merchant/orders"
                className="flex items-center justify-between rounded-xl border border-emerald-400/10 bg-emerald-400/[0.06] px-3.5 py-3 text-sm font-medium text-emerald-400"
              >
                <span className="flex items-center gap-3">
                  <ShoppingBag size={17} />
                  Orders
                </span>

                {counts.new > 0 && (
                  <span className="rounded-full bg-amber-300/10 px-2 py-0.5 text-[9px] text-amber-300">
                    {counts.new}
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
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-400/15 bg-emerald-400/[0.07] text-sm font-semibold text-emerald-400">
                {(user?.fullName || "V")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-white/80">
                  {user?.fullName || "Vendor"}
                </p>

                <p className="truncate text-[9px] text-white/25">
                  {user?.vendorId || "Merchant"}
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
          <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/[0.06] bg-[#070908]/90 px-5 backdrop-blur-xl sm:px-8 lg:px-10">
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-emerald-400/60">
                Merchant Console
              </p>

              <h1 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
                Orders
              </h1>
            </div>

            <button
              type="button"
              onClick={() => fetchOrders(true)}
              disabled={refreshing}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.025] text-white/35 transition hover:border-emerald-400/20 hover:text-emerald-400 disabled:opacity-40"
            >
              <RefreshCw
                size={15}
                className={
                  refreshing ? "animate-spin" : ""
                }
              />
            </button>
          </header>

          <div className="mx-auto max-w-[1500px] px-5 py-7 pb-24 sm:px-8 lg:px-10">
            {/* HEADER */}
            <div className="mb-7 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Link
                    to="/merchant"
                    className="flex items-center gap-1.5 text-[10px] text-white/25 transition hover:text-white/60"
                  >
                    <ArrowLeft size={12} />
                    Dashboard
                  </Link>

                  <ChevronRight
                    size={11}
                    className="text-white/10"
                  />

                  <span className="text-[10px] text-emerald-400/60">
                    Orders
                  </span>
                </div>

                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Order Management
                </h2>

                <p className="mt-2 text-xs text-white/25">
                  Review incoming orders and move them through
                  the preparation workflow.
                </p>
              </div>

              <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.15em] text-emerald-400/60">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Live order queue
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <div className="mb-5 flex items-center justify-between rounded-xl border border-red-400/10 bg-red-400/[0.04] px-4 py-3">
                <p className="text-xs text-red-300/80">
                  {error}
                </p>

                <button
                  onClick={() => fetchOrders()}
                  className="text-[10px] font-medium text-red-300"
                >
                  Retry
                </button>
              </div>
            )}

            {/* FILTER BAR */}
            <div className="mb-5 overflow-x-auto">
              <div className="flex min-w-max items-center gap-2">
                {[
                  ["ALL", "All Orders", counts.all],
                  ["NEW", "New", counts.new],
                  [
                    "PREPARING",
                    "Preparing",
                    counts.preparing,
                  ],
                  ["READY", "Ready", counts.ready],
                  [
                    "COMPLETED",
                    "Completed",
                    counts.completed,
                  ],
                ].map(([key, label, count]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveFilter(key)}
                    className={`rounded-xl border px-4 py-2.5 text-[10px] font-medium transition ${
                      activeFilter === key
                        ? "border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-400"
                        : "border-white/[0.07] bg-white/[0.018] text-white/30 hover:border-white/10 hover:text-white/60"
                    }`}
                  >
                    {label}
                    <span className="ml-2 opacity-50">
                      {count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* ORDERS */}
            <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
              <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0b0e0c]">
                <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
                  <div>
                    <h3 className="text-sm font-semibold text-white/85">
                      Orders
                    </h3>

                    <p className="mt-1 text-[10px] text-white/20">
                      {filteredOrders.length} order
                      {filteredOrders.length !== 1
                        ? "s"
                        : ""}{" "}
                      shown
                    </p>
                  </div>

                  <span className="hidden text-[9px] uppercase tracking-[0.14em] text-white/20 sm:block">
                    Auto refresh · 30s
                  </span>
                </div>

                {loading ? (
                  <div className="flex min-h-[500px] items-center justify-center">
                    <div className="flex items-center gap-3 text-xs text-white/30">
                      <Loader2
                        size={18}
                        className="animate-spin text-emerald-400"
                      />
                      Loading orders...
                    </div>
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="flex min-h-[500px] flex-col items-center justify-center px-6 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.025] text-white/20">
                      <ShoppingBag size={22} />
                    </div>

                    <h3 className="mt-5 text-sm font-semibold text-white/60">
                      No orders found
                    </h3>

                    <p className="mt-2 max-w-xs text-[10px] leading-5 text-white/25">
                      There are no orders matching this filter
                      right now.
                    </p>
                  </div>
                ) : (
                  <div>
                    {filteredOrders.map((order) => {
                      const status =
                        STATUS_CONFIG[
                          order?.orderStatus
                        ] || STATUS_CONFIG.PLACED;

                      const isSelected =
                        selectedOrder?._id === order?._id;

                      return (
                        <button
                          key={order?._id}
                          type="button"
                          onClick={() =>
                            setSelectedOrder(order)
                          }
                          className={`group flex w-full items-center gap-4 border-b border-white/[0.045] px-5 py-4 text-left transition ${
                            isSelected
                              ? "bg-emerald-400/[0.035]"
                              : "hover:bg-white/[0.018]"
                          }`}
                        >
                          {/* TOKEN */}
                          <div
                            className={`flex h-11 w-[58px] shrink-0 items-center justify-center rounded-xl border bg-[#11100c] text-[10px] font-bold tracking-tight text-[#d5b765] ${
                              isSelected
                                ? "border-[#c7a85b]/25"
                                : "border-[#c7a85b]/10"
                            }`}
                          >
                            {order?.tokenNumber || "—"}
                          </div>

                          {/* INFO */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="truncate text-xs font-semibold text-white/75">
                                {getStudentName(order)}
                              </p>

                              <span
                                className={`hidden rounded-full border px-2 py-1 text-[8px] uppercase tracking-[0.08em] sm:inline-flex ${status.bg} ${status.border} ${status.color}`}
                              >
                                {status.label}
                              </span>
                            </div>

                            <p className="mt-1 text-[10px] text-white/25">
                              {getItemsCount(order)}{" "}
                              {getItemsCount(order) === 1
                                ? "item"
                                : "items"}{" "}
                              · Pickup{" "}
                              {order?.pickupTime ||
                                formatTime(
                                  order?.pickupAt
                                )}
                            </p>
                          </div>

                          {/* AMOUNT */}
                          <div className="hidden text-right sm:block">
                            <p className="text-sm font-semibold text-[#d5b765]">
                              {formatMoney(
                                order?.totalAmount
                              )}
                            </p>

                            <p className="mt-1 text-[9px] text-white/20">
                              {formatDate(
                                order?.createdAt
                              )}
                            </p>
                          </div>

                          <ChevronRight
                            size={15}
                            className={`shrink-0 transition ${
                              isSelected
                                ? "text-emerald-400"
                                : "text-white/10 group-hover:text-white/30"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* DETAIL PANEL */}
              <div className="h-fit overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0b0e0c] xl:sticky xl:top-[100px]">
                {!selectedOrder ? (
                  <div className="flex min-h-[500px] flex-col items-center justify-center px-8 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.025] text-white/20">
                      <PackageCheck size={22} />
                    </div>

                    <h3 className="mt-5 text-sm font-semibold text-white/55">
                      Select an order
                    </h3>

                    <p className="mt-2 max-w-[240px] text-[10px] leading-5 text-white/20">
                      Select an order from the queue to view
                      its details and update its status.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* DETAIL HEADER */}
                    <div className="border-b border-white/[0.06] p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.18em] text-emerald-400/60">
                            Order Details
                          </p>

                          <div className="mt-2 flex items-center gap-3">
                            <h3 className="text-xl font-bold text-[#d5b765]">
                              {selectedOrder.tokenNumber ||
                                "—"}
                            </h3>

                            {selectedOrder.orderStatus && (
                              <span
                                className={`rounded-full border px-2.5 py-1 text-[8px] uppercase tracking-[0.08em] ${
                                  STATUS_CONFIG[
                                    selectedOrder
                                      .orderStatus
                                  ]?.bg
                                } ${
                                  STATUS_CONFIG[
                                    selectedOrder
                                      .orderStatus
                                  ]?.border
                                } ${
                                  STATUS_CONFIG[
                                    selectedOrder
                                      .orderStatus
                                  ]?.color
                                }`}
                              >
                                {
                                  STATUS_CONFIG[
                                    selectedOrder
                                      .orderStatus
                                  ]?.label
                                }
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedOrder(null)
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-white/20 transition hover:bg-white/[0.04] hover:text-white/50"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    </div>

                    {/* STUDENT */}
                    <div className="border-b border-white/[0.06] p-5">
                      <p className="text-[9px] uppercase tracking-[0.16em] text-white/20">
                        Customer
                      </p>

                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-400/10 bg-emerald-400/[0.05] text-xs font-semibold text-emerald-400">
                          {getStudentName(
                            selectedOrder
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-white/75">
                            {getStudentName(
                              selectedOrder
                            )}
                          </p>

                          <p className="mt-0.5 text-[9px] text-white/25">
                            {selectedOrder?.student
                              ?.enrollmentNumber ||
                              selectedOrder?.enrollmentNumber ||
                              "Student"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* ITEMS */}
                    <div className="border-b border-white/[0.06] p-5">
                      <div className="flex items-center justify-between">
                        <p className="text-[9px] uppercase tracking-[0.16em] text-white/20">
                          Order Items
                        </p>

                        <span className="text-[9px] text-white/20">
                          {getItemsCount(
                            selectedOrder
                          )}{" "}
                          items
                        </span>
                      </div>

                      <div className="mt-4 space-y-3">
                        {Array.isArray(
                          selectedOrder.items
                        ) &&
                          selectedOrder.items.map(
                            (item, index) => (
                              <div
                                key={
                                  item?.menuItem ||
                                  index
                                }
                                className="flex items-center justify-between gap-3"
                              >
                                <div className="min-w-0">
                                  <p className="truncate text-xs text-white/60">
                                    {item?.name ||
                                      "Menu Item"}
                                  </p>

                                  <p className="mt-0.5 text-[9px] text-white/20">
                                    ×
                                    {item?.quantity ||
                                      1}
                                  </p>
                                </div>

                                <p className="shrink-0 text-xs font-medium text-[#d5b765]/80">
                                  {formatMoney(
                                    Number(
                                      item?.price ||
                                        0
                                    ) *
                                      Number(
                                        item?.quantity ||
                                          1
                                      )
                                  )}
                                </p>
                              </div>
                            )
                          )}
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-white/[0.05] pt-4">
                        <span className="text-[10px] text-white/30">
                          Total
                        </span>

                        <span className="text-lg font-bold text-[#d5b765]">
                          {formatMoney(
                            selectedOrder.totalAmount
                          )}
                        </span>
                      </div>
                    </div>

                    {/* PICKUP */}
                    <div className="border-b border-white/[0.06] p-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-400/[0.06] text-emerald-400">
                          <Clock3 size={16} />
                        </div>

                        <div>
                          <p className="text-[9px] uppercase tracking-[0.14em] text-white/20">
                            Pickup
                          </p>

                          <p className="mt-1 text-xs font-semibold text-white/65">
                            {selectedOrder.pickupTime ||
                              formatTime(
                                selectedOrder.pickupAt
                              )}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between text-[9px]">
                        <span className="text-white/20">
                          Payment
                        </span>

                        <span className="font-medium text-emerald-400/70">
                          {selectedOrder.paymentStatus ||
                            "PAID"}{" "}
                          ·{" "}
                          {selectedOrder.paymentMethod ||
                            "UPI"}
                        </span>
                      </div>
                    </div>

                    {/* STATUS FLOW */}
                    <div className="p-5">
                      <p className="text-[9px] uppercase tracking-[0.16em] text-white/20">
                        Order Progress
                      </p>

                      <div className="mt-5 space-y-3">
                        {STATUS_FLOW.map(
                          (status, index) => {
                            const currentIndex =
                              STATUS_FLOW.indexOf(
                                selectedOrder.orderStatus
                              );

                            const isDone =
                              currentIndex >= index;

                            const config =
                              STATUS_CONFIG[status];

                            return (
                              <div
                                key={status}
                                className="flex items-center gap-3"
                              >
                                <div
                                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
                                    isDone
                                      ? "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-400"
                                      : "border-white/[0.07] bg-white/[0.02] text-white/15"
                                  }`}
                                >
                                  {isDone ? (
                                    <Check size={12} />
                                  ) : (
                                    <span className="text-[9px]">
                                      {index + 1}
                                    </span>
                                  )}
                                </div>

                                <div className="flex-1">
                                  <p
                                    className={`text-[10px] font-medium ${
                                      isDone
                                        ? config.color
                                        : "text-white/20"
                                    }`}
                                  >
                                    {config.label}
                                  </p>
                                </div>

                                {selectedOrder.orderStatus ===
                                  status && (
                                  <span className="text-[8px] uppercase tracking-[0.1em] text-emerald-400/50">
                                    Current
                                  </span>
                                )}
                              </div>
                            );
                          }
                        )}
                      </div>

                      {/* ACTION */}
                      {getNextStatus(
                        selectedOrder.orderStatus
                      ) && (
                        <button
                          type="button"
                          disabled={updating}
                          onClick={() =>
                            updateOrderStatus(
                              selectedOrder._id,
                              getNextStatus(
                                selectedOrder.orderStatus
                              )
                            )
                          }
                          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.07] px-4 py-3 text-xs font-semibold text-emerald-400 transition hover:border-emerald-400/25 hover:bg-emerald-400/[0.1] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {updating ? (
                            <>
                              <Loader2
                                size={14}
                                className="animate-spin"
                              />
                              Updating...
                            </>
                          ) : (
                            <>
                              {getNextButtonLabel(
                                selectedOrder.orderStatus
                              )}
                              <ChevronRight size={14} />
                            </>
                          )}
                        </button>
                      )}

                      {["PLACED", "CONFIRMED", "PREPARING"].includes(
                        selectedOrder.orderStatus
                      ) && (
                        <button
                          type="button"
                          disabled={updating}
                          onClick={() =>
                            cancelOrder(
                              selectedOrder._id
                            )
                          }
                          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[10px] text-white/20 transition hover:bg-red-400/[0.04] hover:text-red-300 disabled:opacity-40"
                        >
                          <X size={13} />
                          Cancel Order
                        </button>
                      )}

                      {selectedOrder.orderStatus ===
                        "COMPLETED" && (
                        <div className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.018] py-3 text-[10px] text-white/30">
                          <Check size={13} />
                          Order completed
                        </div>
                      )}

                      {selectedOrder.orderStatus ===
                        "CANCELLED" && (
                        <div className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-red-400/10 bg-red-400/[0.03] py-3 text-[10px] text-red-300/60">
                          <X size={13} />
                          Order cancelled
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* MOBILE NAV */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/[0.07] bg-[#090b0a]/95 px-3 py-2 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-around">
          <Link
            to="/merchant"
            className="flex flex-col items-center gap-1 px-4 py-1.5 text-white/30"
          >
            <Store size={17} />
            <span className="text-[8px]">Dashboard</span>
          </Link>

          <Link
            to="/merchant/orders"
            className="flex flex-col items-center gap-1 px-4 py-1.5 text-emerald-400"
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

export default MerchantOrders;