import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  Check,
  ChevronRight,
  Clock3,
  LogOut,
  Save,
  ShieldCheck,
  Store,
  UtensilsCrossed,
} from "lucide-react";

const MerchantSettings = () => {
  const [user, setUser] = useState(null);
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    canteenName: "Campus Canteen",
    openingTime: "09:00",
    closingTime: "18:00",
    acceptingOrders: true,
    notifications: true,
  });

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("campusOSUser");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch {
      setUser(null);
    }
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setSettings((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setSaved(false);
  };

  const handleSave = (event) => {
    event.preventDefault();

    /*
     * These settings are currently UI/local state.
     * Backend settings API can be connected later.
     */
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const handleLogout = async () => {
    const API_URL =
      import.meta.env.VITE_API_URL ||
      "http://localhost:5000";

    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
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
      {/* Ambient background */}
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
              Campus<span className="text-emerald-400">
                OS
              </span>
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
                className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm text-white/40 transition hover:bg-white/[0.03] hover:text-white"
              >
                <Bell size={17} />
                Orders
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
                className="flex items-center gap-3 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.06] px-3.5 py-3 text-sm font-medium text-emerald-400"
              >
                <Store size={17} />
                Settings
              </Link>
            </nav>
          </div>

          <div className="mt-auto border-t border-white/[0.06] p-4">
            <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/[0.025] p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-400/15 bg-emerald-400/[0.07] text-sm font-semibold text-emerald-400">
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
          {/* TOPBAR */}
          <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/[0.06] bg-[#070908]/90 px-5 backdrop-blur-xl sm:px-8 lg:px-10">
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-emerald-400/60">
                Merchant Console
              </p>

              <h1 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
                Settings
              </h1>
            </div>

            {saved && (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-2 text-[10px] text-emerald-400">
                <Check size={13} />
                Changes saved
              </div>
            )}
          </header>

          <div className="mx-auto max-w-[1100px] px-5 py-7 pb-24 sm:px-8 lg:px-10">
            {/* HEADER */}
            <div className="mb-7">
              <div className="mb-2 flex items-center gap-2">
                <Link
                  to="/merchant"
                  className="flex items-center gap-1.5 text-[10px] text-white/25 transition hover:text-white/60"
                >
                  <ChevronRight
                    size={11}
                    className="rotate-180"
                  />
                  Dashboard
                </Link>

                <ChevronRight
                  size={11}
                  className="text-white/10"
                />

                <span className="text-[10px] text-emerald-400/60">
                  Settings
                </span>
              </div>

              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Canteen Settings
              </h2>

              <p className="mt-2 text-xs text-white/25">
                Manage your merchant profile and ordering
                preferences.
              </p>
            </div>

            <form
              onSubmit={handleSave}
              className="grid gap-5 lg:grid-cols-[1fr_330px]"
            >
              {/* LEFT */}
              <div className="space-y-5">
                {/* PROFILE */}
                <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0b0e0c]">
                  <div className="border-b border-white/[0.06] px-5 py-4">
                    <p className="text-[9px] uppercase tracking-[0.18em] text-emerald-400/60">
                      Merchant Profile
                    </p>

                    <h3 className="mt-1 text-sm font-semibold text-white/80">
                      Account Information
                    </h3>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.018] p-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.07] text-xl font-bold text-emerald-400">
                        {(user?.fullName || "V")
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white/80">
                          {user?.fullName || "Vendor"}
                        </p>

                        <p className="mt-1 text-[10px] text-white/25">
                          {user?.email ||
                            "Merchant account"}
                        </p>

                        <div className="mt-2 flex items-center gap-2">
                          <span className="rounded-full border border-emerald-400/10 bg-emerald-400/[0.05] px-2 py-1 text-[8px] uppercase tracking-[0.1em] text-emerald-400/70">
                            {user?.role || "vendor"}
                          </span>

                          {user?.vendorId && (
                            <span className="text-[9px] text-white/20">
                              ID: {user.vendorId}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="mb-1.5 block text-[9px] uppercase tracking-[0.13em] text-white/25">
                        Canteen Name
                      </label>

                      <input
                        name="canteenName"
                        value={settings.canteenName}
                        onChange={handleChange}
                        className="h-11 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] px-3.5 text-xs text-white outline-none transition placeholder:text-white/15 focus:border-emerald-400/20"
                      />
                    </div>
                  </div>
                </section>

                {/* OPERATING HOURS */}
                <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0b0e0c]">
                  <div className="border-b border-white/[0.06] px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-400/[0.06] text-emerald-400">
                        <Clock3 size={16} />
                      </div>

                      <div>
                        <p className="text-[9px] uppercase tracking-[0.18em] text-white/20">
                          Operations
                        </p>

                        <h3 className="mt-1 text-sm font-semibold text-white/80">
                          Operating Hours
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1.5 block text-[9px] uppercase tracking-[0.13em] text-white/25">
                          Opening Time
                        </label>

                        <input
                          type="time"
                          name="openingTime"
                          value={settings.openingTime}
                          onChange={handleChange}
                          className="h-11 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 text-xs text-white outline-none focus:border-emerald-400/20"
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-[9px] uppercase tracking-[0.13em] text-white/25">
                          Closing Time
                        </label>

                        <input
                          type="time"
                          name="closingTime"
                          value={settings.closingTime}
                          onChange={handleChange}
                          className="h-11 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 text-xs text-white outline-none focus:border-emerald-400/20"
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.018] px-4 py-3">
                      <div>
                        <p className="text-xs font-medium text-white/60">
                          Accepting Orders
                        </p>

                        <p className="mt-1 text-[9px] text-white/20">
                          Allow students to place new orders.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSettings((previous) => ({
                            ...previous,
                            acceptingOrders:
                              !previous.acceptingOrders,
                          }));
                          setSaved(false);
                        }}
                        className={`relative h-6 w-11 rounded-full transition ${
                          settings.acceptingOrders
                            ? "bg-emerald-400/70"
                            : "bg-white/10"
                        }`}
                      >
                        <span
                          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                            settings.acceptingOrders
                              ? "left-6"
                              : "left-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </section>

                {/* NOTIFICATIONS */}
                <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0b0e0c]">
                  <div className="border-b border-white/[0.06] px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-400/[0.06] text-emerald-400">
                        <Bell size={16} />
                      </div>

                      <div>
                        <p className="text-[9px] uppercase tracking-[0.18em] text-white/20">
                          Preferences
                        </p>

                        <h3 className="mt-1 text-sm font-semibold text-white/80">
                          Notifications
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.018] px-4 py-3">
                      <div>
                        <p className="text-xs font-medium text-white/60">
                          New Order Alerts
                        </p>

                        <p className="mt-1 text-[9px] text-white/20">
                          Receive alerts when a student places
                          an order.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSettings((previous) => ({
                            ...previous,
                            notifications:
                              !previous.notifications,
                          }));
                          setSaved(false);
                        }}
                        className={`relative h-6 w-11 rounded-full transition ${
                          settings.notifications
                            ? "bg-emerald-400/70"
                            : "bg-white/10"
                        }`}
                      >
                        <span
                          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                            settings.notifications
                              ? "left-6"
                              : "left-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </section>

                {/* SAVE */}
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.07] px-5 py-3 text-xs font-semibold text-emerald-400 transition hover:border-emerald-400/25 hover:bg-emerald-400/[0.1]"
                >
                  <Save size={14} />
                  Save Changes
                </button>
              </div>

              {/* RIGHT */}
              <div className="space-y-5">
                {/* STATUS */}
                <div className="rounded-2xl border border-emerald-400/10 bg-[#0b110e] p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.18em] text-emerald-400/60">
                        Canteen Status
                      </p>

                      <h3 className="mt-1 text-lg font-bold">
                        {settings.acceptingOrders
                          ? "Open"
                          : "Closed"}
                      </h3>
                    </div>

                    <span
                      className={`mt-1 h-2 w-2 rounded-full ${
                        settings.acceptingOrders
                          ? "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)]"
                          : "bg-white/20"
                      }`}
                    />
                  </div>

                  <p className="mt-4 text-[10px] leading-5 text-white/25">
                    {settings.acceptingOrders
                      ? "Students can currently place orders through CampusOS."
                      : "New student orders are currently disabled."}
                  </p>

                  <div className="mt-5 border-t border-white/[0.06] pt-4">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-white/20">
                        Hours
                      </span>

                      <span className="text-white/50">
                        {settings.openingTime} –{" "}
                        {settings.closingTime}
                      </span>
                    </div>
                  </div>
                </div>

                {/* SECURITY */}
                <div className="rounded-2xl border border-white/[0.07] bg-[#0b0e0c] p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-400/[0.06] text-emerald-400">
                      <ShieldCheck size={16} />
                    </div>

                    <div>
                      <p className="text-[9px] uppercase tracking-[0.16em] text-white/20">
                        Security
                      </p>

                      <h3 className="mt-1 text-sm font-semibold text-white/70">
                        Account Protected
                      </h3>
                    </div>
                  </div>

                  <p className="mt-4 text-[10px] leading-5 text-white/25">
                    Your merchant account is protected using
                    authenticated CampusOS sessions.
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-[9px] text-emerald-400/60">
                    <Check size={12} />
                    Authentication enabled
                  </div>
                </div>

                {/* ACCOUNT */}
                <div className="rounded-2xl border border-white/[0.07] bg-[#0b0e0c] p-5">
                  <p className="text-[9px] uppercase tracking-[0.16em] text-white/20">
                    Account
                  </p>

                  <div className="mt-4 space-y-3">
                    <div className="flex justify-between gap-4">
                      <span className="text-[10px] text-white/20">
                        Name
                      </span>

                      <span className="truncate text-right text-[10px] text-white/50">
                        {user?.fullName || "Vendor"}
                      </span>
                    </div>

                    <div className="h-px bg-white/[0.05]" />

                    <div className="flex justify-between gap-4">
                      <span className="text-[10px] text-white/20">
                        Email
                      </span>

                      <span className="max-w-[180px] truncate text-right text-[10px] text-white/50">
                        {user?.email || "—"}
                      </span>
                    </div>

                    <div className="h-px bg-white/[0.05]" />

                    <div className="flex justify-between">
                      <span className="text-[10px] text-white/20">
                        Role
                      </span>

                      <span className="text-[10px] uppercase text-emerald-400/60">
                        {user?.role || "vendor"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </form>
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
            className="flex flex-col items-center gap-1 px-4 py-1.5 text-white/30"
          >
            <Bell size={17} />
            <span className="text-[8px]">Orders</span>
          </Link>

          <Link
            to="/merchant/menu"
            className="flex flex-col items-center gap-1 px-4 py-1.5 text-white/30"
          >
            <UtensilsCrossed size={17} />
            <span className="text-[8px]">Menu</span>
          </Link>

          <Link
            to="/merchant/settings"
            className="flex flex-col items-center gap-1 px-4 py-1.5 text-emerald-400"
          >
            <Store size={17} />
            <span className="text-[8px]">Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MerchantSettings;