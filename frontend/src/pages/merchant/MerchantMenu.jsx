import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Check,
  ChevronRight,
  Edit3,
  ImagePlus,
  Loader2,
  LogOut,
  Plus,
  RefreshCw,
  Search,
  Store,
  Trash2,
  UtensilsCrossed,
  X,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  category: "Snacks",
  image: "",
  isAvailable: true,
};

const CATEGORIES = [
  "All",
  "Snacks",
  "Meals",
  "Beverages",
  "Desserts",
  "Fast Food",
  "Other",
];

const MerchantMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);

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

  const fetchMenu = async (refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      /*
       * Expected merchant menu endpoint:
       * GET /api/menu/merchant
       */
      const response = await fetch(
        `${API_URL}/api/menu/merchant`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Unable to load menu"
        );
      }

      const items = Array.isArray(data)
        ? data
        : data?.menuItems ||
          data?.items ||
          data?.menu ||
          data?.data ||
          [];

      setMenuItems(items);
    } catch (err) {
      console.error("Menu fetch error:", err);
      setError(err.message || "Unable to load menu");
      setMenuItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadUser();
    fetchMenu();
  }, []);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return menuItems.filter((item) => {
      const matchesSearch =
        !query ||
        item?.name?.toLowerCase().includes(query) ||
        item?.description
          ?.toLowerCase()
          .includes(query);

      const matchesCategory =
        category === "All" ||
        item?.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [menuItems, search, category]);

  const stats = useMemo(() => {
    return {
      total: menuItems.length,
      available: menuItems.filter(
        (item) => item?.isAvailable !== false
      ).length,
      unavailable: menuItems.filter(
        (item) => item?.isAvailable === false
      ).length,
    };
  }, [menuItems]);

  const openAddModal = () => {
    setEditingItem(null);
    setForm(EMPTY_FORM);
    setError("");
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);

    setForm({
      name: item?.name || "",
      description: item?.description || "",
      price: item?.price ?? "",
      category: item?.category || "Snacks",
      image: item?.image || item?.imageUrl || "",
      isAvailable: item?.isAvailable !== false,
    });

    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingItem(null);
    setForm(EMPTY_FORM);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const saveMenuItem = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Menu item name is required.");
      return;
    }

    if (
      form.price === "" ||
      Number(form.price) < 0
    ) {
      setError("Please enter a valid price.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        category: form.category,
        image: form.image.trim(),
        isAvailable: form.isAvailable,
      };

      const endpoint = editingItem
        ? `${API_URL}/api/menu/${editingItem._id}`
        : `${API_URL}/api/menu`;

      const method = editingItem ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            `Unable to ${
              editingItem ? "update" : "create"
            } menu item`
        );
      }

      const savedItem =
        data?.menuItem ||
        data?.item ||
        data?.data;

      if (editingItem) {
        setMenuItems((previous) =>
          previous.map((item) =>
            item._id === editingItem._id
              ? savedItem || { ...item, ...payload }
              : item
          )
        );
      } else if (savedItem) {
        setMenuItems((previous) => [
          savedItem,
          ...previous,
        ]);
      } else {
        await fetchMenu(true);
      }

      closeModal();
    } catch (err) {
      console.error("Save menu item error:", err);
      setError(
        err.message || "Unable to save menu item"
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteMenuItem = async (item) => {
    const confirmed = window.confirm(
      `Delete "${item?.name || "this item"}"?`
    );

    if (!confirmed) return;

    try {
      setError("");

      const response = await fetch(
        `${API_URL}/api/menu/${item._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Unable to delete menu item"
        );
      }

      setMenuItems((previous) =>
        previous.filter(
          (menuItem) => menuItem._id !== item._id
        )
      );
    } catch (err) {
      console.error("Delete menu item error:", err);
      setError(
        err.message || "Unable to delete menu item"
      );
    }
  };

  const toggleAvailability = async (item) => {
    const nextAvailability =
      item?.isAvailable === false;

    try {
      setError("");

      const response = await fetch(
        `${API_URL}/api/menu/${item._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            isAvailable: nextAvailability,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to update availability"
        );
      }

      const updatedItem =
        data?.menuItem ||
        data?.item ||
        data?.data;

      setMenuItems((previous) =>
        previous.map((menuItem) =>
          menuItem._id === item._id
            ? updatedItem || {
                ...menuItem,
                isAvailable: nextAvailability,
              }
            : menuItem
        )
      );
    } catch (err) {
      console.error("Availability error:", err);
      setError(
        err.message || "Unable to update availability"
      );
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
      {/* Ambient */}
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
                <UtensilsCrossed
                  size={17}
                  className="rotate-0"
                />
                Orders
              </Link>

              <Link
                to="/merchant/menu"
                className="flex items-center gap-3 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.06] px-3.5 py-3 text-sm font-medium text-emerald-400"
              >
                <UtensilsCrossed size={17} />
                Menu
              </Link>

              <Link
                to="/merchant/settings"
                className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm text-white/40 transition hover:bg-white/[0.03] hover:text-white"
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
          {/* TOP BAR */}
          <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/[0.06] bg-[#070908]/90 px-5 backdrop-blur-xl sm:px-8 lg:px-10">
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-emerald-400/60">
                Merchant Console
              </p>

              <h1 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
                Menu
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fetchMenu(true)}
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

              <button
                type="button"
                onClick={openAddModal}
                className="flex items-center gap-2 rounded-lg border border-emerald-400/15 bg-emerald-400/[0.07] px-3.5 py-2 text-[10px] font-semibold text-emerald-400 transition hover:border-emerald-400/25 hover:bg-emerald-400/[0.1]"
              >
                <Plus size={14} />
                Add Item
              </button>
            </div>
          </header>

          <div className="mx-auto max-w-[1500px] px-5 py-7 pb-24 sm:px-8 lg:px-10">
            {/* PAGE HEADER */}
            <div className="mb-7 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div>
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
                    Menu
                  </span>
                </div>

                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Menu Management
                </h2>

                <p className="mt-2 text-xs text-white/25">
                  Manage what students can see and order from
                  your canteen.
                </p>
              </div>

              {/* MINI STATS */}
              <div className="flex items-center gap-5">
                <div>
                  <p className="text-lg font-bold text-white/80">
                    {stats.total}
                  </p>
                  <p className="text-[8px] uppercase tracking-[0.13em] text-white/20">
                    Items
                  </p>
                </div>

                <div className="h-7 w-px bg-white/[0.07]" />

                <div>
                  <p className="text-lg font-bold text-emerald-400">
                    {stats.available}
                  </p>
                  <p className="text-[8px] uppercase tracking-[0.13em] text-white/20">
                    Available
                  </p>
                </div>

                <div className="h-7 w-px bg-white/[0.07]" />

                <div>
                  <p className="text-lg font-bold text-white/35">
                    {stats.unavailable}
                  </p>
                  <p className="text-[8px] uppercase tracking-[0.13em] text-white/20">
                    Hidden
                  </p>
                </div>
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <div className="mb-5 flex items-center justify-between rounded-xl border border-red-400/10 bg-red-400/[0.04] px-4 py-3">
                <p className="text-xs text-red-300/80">
                  {error}
                </p>

                <button
                  onClick={() => setError("")}
                  className="text-white/30 hover:text-white"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* TOOLBAR */}
            <div className="mb-5 flex flex-col gap-3 lg:flex-row">
              <div className="relative flex-1">
                <Search
                  size={15}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search menu items..."
                  className="h-11 w-full rounded-xl border border-white/[0.07] bg-[#0b0e0c] pl-11 pr-4 text-xs text-white outline-none placeholder:text-white/20 transition focus:border-emerald-400/20"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto">
                {CATEGORIES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={`whitespace-nowrap rounded-xl border px-4 py-2.5 text-[10px] font-medium transition ${
                      category === item
                        ? "border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-400"
                        : "border-white/[0.07] bg-white/[0.018] text-white/30 hover:text-white/60"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* MENU GRID */}
            {loading ? (
              <div className="flex min-h-[480px] items-center justify-center rounded-2xl border border-white/[0.07] bg-[#0b0e0c]">
                <div className="flex items-center gap-3 text-xs text-white/30">
                  <Loader2
                    size={18}
                    className="animate-spin text-emerald-400"
                  />
                  Loading menu...
                </div>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="flex min-h-[480px] flex-col items-center justify-center rounded-2xl border border-white/[0.07] bg-[#0b0e0c] px-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.025] text-white/20">
                  <UtensilsCrossed size={22} />
                </div>

                <h3 className="mt-5 text-sm font-semibold text-white/60">
                  {menuItems.length === 0
                    ? "Your menu is empty"
                    : "No matching items"}
                </h3>

                <p className="mt-2 max-w-xs text-[10px] leading-5 text-white/25">
                  {menuItems.length === 0
                    ? "Add your first menu item to start accepting student orders."
                    : "Try changing your search or category filter."}
                </p>

                {menuItems.length === 0 && (
                  <button
                    type="button"
                    onClick={openAddModal}
                    className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.07] px-4 py-2.5 text-xs font-semibold text-emerald-400"
                  >
                    <Plus size={14} />
                    Add First Item
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {filteredItems.map((item) => {
                  const available =
                    item?.isAvailable !== false;

                  const image =
                    item?.image ||
                    item?.imageUrl ||
                    "";

                  return (
                    <article
                      key={item?._id}
                      className="group overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0b0e0c] transition hover:border-white/[0.11]"
                    >
                      {/* IMAGE */}
                      <div className="relative h-40 overflow-hidden bg-[#101310]">
                        {image ? (
                          <img
                            src={image}
                            alt={item?.name || "Menu item"}
                            className={`h-full w-full object-cover transition duration-500 group-hover:scale-[1.03] ${
                              available
                                ? ""
                                : "opacity-35 grayscale"
                            }`}
                            onError={(event) => {
                              event.currentTarget.style.display =
                                "none";
                            }}
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-white/10">
                            <ImagePlus size={28} />
                          </div>
                        )}

                        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
                          <span className="rounded-full border border-white/10 bg-black/50 px-2.5 py-1 text-[8px] uppercase tracking-[0.1em] text-white/50 backdrop-blur-md">
                            {item?.category ||
                              "Snacks"}
                          </span>

                          <span
                            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[8px] uppercase tracking-[0.08em] backdrop-blur-md ${
                              available
                                ? "border-emerald-400/15 bg-emerald-400/[0.08] text-emerald-400"
                                : "border-white/10 bg-black/50 text-white/35"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                available
                                  ? "bg-emerald-400"
                                  : "bg-white/20"
                              }`}
                            />
                            {available
                              ? "Available"
                              : "Hidden"}
                          </span>
                        </div>
                      </div>

                      {/* BODY */}
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-semibold text-white/80">
                              {item?.name ||
                                "Unnamed Item"}
                            </h3>

                            <p className="mt-1.5 line-clamp-2 min-h-[30px] text-[10px] leading-5 text-white/25">
                              {item?.description ||
                                "No description added."}
                            </p>
                          </div>

                          <p className="shrink-0 text-base font-bold text-[#d5b765]">
                            ₹
                            {Number(
                              item?.price || 0
                            ).toLocaleString("en-IN")}
                          </p>
                        </div>

                        <div className="mt-4 flex items-center gap-2 border-t border-white/[0.05] pt-3">
                          <button
                            type="button"
                            onClick={() =>
                              toggleAvailability(item)
                            }
                            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-[9px] font-medium transition ${
                              available
                                ? "border-emerald-400/10 bg-emerald-400/[0.04] text-emerald-400/70 hover:bg-emerald-400/[0.07]"
                                : "border-white/[0.07] bg-white/[0.02] text-white/30 hover:text-white/50"
                            }`}
                          >
                            <Check size={12} />
                            {available
                              ? "Available"
                              : "Make Available"}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(item)
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.018] text-white/25 transition hover:border-emerald-400/15 hover:text-emerald-400"
                            title="Edit"
                          >
                            <Edit3 size={13} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              deleteMenuItem(item)
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.018] text-white/25 transition hover:border-red-400/15 hover:bg-red-400/[0.04] hover:text-red-300"
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
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
            <UtensilsCrossed size={17} />
            <span className="text-[8px]">Orders</span>
          </Link>

          <Link
            to="/merchant/menu"
            className="flex flex-col items-center gap-1 px-4 py-1.5 text-emerald-400"
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

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/[0.09] bg-[#0c100e] shadow-2xl">
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
              <div>
                <p className="text-[9px] uppercase tracking-[0.18em] text-emerald-400/60">
                  Menu Management
                </p>

                <h3 className="mt-1 text-base font-bold">
                  {editingItem
                    ? "Edit Menu Item"
                    : "Add Menu Item"}
                </h3>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/25 transition hover:bg-white/[0.04] hover:text-white/60"
              >
                <X size={16} />
              </button>
            </div>

            <form
              onSubmit={saveMenuItem}
              className="space-y-4 p-5"
            >
              {/* NAME */}
              <div>
                <label className="mb-1.5 block text-[9px] uppercase tracking-[0.13em] text-white/25">
                  Item Name
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Paneer Roll"
                  className="h-11 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] px-3.5 text-xs text-white outline-none placeholder:text-white/15 focus:border-emerald-400/20"
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="mb-1.5 block text-[9px] uppercase tracking-[0.13em] text-white/25">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Short description of the item..."
                  className="w-full resize-none rounded-xl border border-white/[0.07] bg-white/[0.025] px-3.5 py-3 text-xs text-white outline-none placeholder:text-white/15 focus:border-emerald-400/20"
                />
              </div>

              {/* PRICE + CATEGORY */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-[9px] uppercase tracking-[0.13em] text-white/25">
                    Price
                  </label>

                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-[#d5b765]/60">
                      ₹
                    </span>

                    <input
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="99"
                      className="h-11 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] pl-8 pr-3 text-xs text-white outline-none placeholder:text-white/15 focus:border-[#c7a85b]/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-[9px] uppercase tracking-[0.13em] text-white/25">
                    Category
                  </label>

                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="h-11 w-full rounded-xl border border-white/[0.07] bg-[#101411] px-3 text-xs text-white outline-none focus:border-emerald-400/20"
                  >
                    {CATEGORIES.filter(
                      (item) => item !== "All"
                    ).map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* IMAGE */}
              <div>
                <label className="mb-1.5 block text-[9px] uppercase tracking-[0.13em] text-white/25">
                  Image URL
                </label>

                <input
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="h-11 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] px-3.5 text-xs text-white outline-none placeholder:text-white/15 focus:border-emerald-400/20"
                />
              </div>

              {/* AVAILABILITY */}
              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.018] px-4 py-3">
                <div>
                  <p className="text-xs font-medium text-white/65">
                    Available for ordering
                  </p>

                  <p className="mt-1 text-[9px] text-white/20">
                    Students can order this item when enabled.
                  </p>
                </div>

                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={form.isAvailable}
                  onChange={handleChange}
                  className="h-4 w-4 accent-emerald-400"
                />
              </label>

              {/* ERROR */}
              {error && (
                <p className="rounded-lg border border-red-400/10 bg-red-400/[0.04] px-3 py-2 text-[10px] text-red-300/80">
                  {error}
                </p>
              )}

              {/* ACTIONS */}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="flex-1 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3 text-xs font-medium text-white/35 transition hover:text-white/60 disabled:opacity-40"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.07] px-4 py-3 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-400/[0.1] disabled:opacity-40"
                >
                  {saving ? (
                    <>
                      <Loader2
                        size={14}
                        className="animate-spin"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check size={14} />
                      {editingItem
                        ? "Save Changes"
                        : "Add Item"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MerchantMenu;