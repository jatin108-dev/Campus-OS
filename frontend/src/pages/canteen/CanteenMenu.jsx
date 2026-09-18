import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Search, ShoppingCart } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import MenuItemCard from "../../components/canteen/MenuItemCard";
import CategoryTabs from "../../components/canteen/CategoryTabs";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const CART_KEY = "campusOSCart";

function CanteenMenu() {
  const navigate = useNavigate();
  const { canteenId } = useParams();

  const [canteen, setCanteen] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [cartCount, setCartCount] = useState(0);
  const [addedItem, setAddedItem] = useState("");

  useEffect(() => {
    const savedCart = JSON.parse(
      localStorage.getItem(CART_KEY) || "[]"
    );

    setCartCount(
      savedCart.reduce(
        (total, item) => total + item.quantity,
        0
      )
    );
  }, []);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        setError("");

        const [canteenResponse, menuResponse] =
          await Promise.all([
            fetch(`${API_URL}/api/canteens/${canteenId}`, {
              credentials: "include",
            }),
            fetch(`${API_URL}/api/menu/${canteenId}`, {
              credentials: "include",
            }),
          ]);

        const canteenData = await canteenResponse.json();
        const menuData = await menuResponse.json();

        if (!canteenResponse.ok) {
          throw new Error(
            canteenData.message || "Failed to load canteen"
          );
        }

        if (!menuResponse.ok) {
          throw new Error(
            menuData.message || "Failed to load menu"
          );
        }

        setCanteen(
          canteenData.canteen ||
            canteenData.data ||
            canteenData
        );

        setMenuItems(
          menuData.menuItems ||
            menuData.items ||
            menuData.data ||
            []
        );
      } catch (err) {
        console.error("Menu fetch error:", err);
        setError(
          err.message || "Unable to load the menu"
        );
      } finally {
        setLoading(false);
      }
    };

    if (canteenId) {
      fetchMenu();
    }
  }, [canteenId]);

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        menuItems
          .map((item) => item.category)
          .filter(Boolean)
      ),
    ];

    return ["All", ...uniqueCategories];
  }, [menuItems]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return menuItems.filter((item) => {
      const matchesCategory =
        activeCategory === "All" ||
        item.category === activeCategory;

      const matchesSearch =
        !query ||
        item.name?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [menuItems, activeCategory, search]);

  const addToCart = (item) => {
    const existingCart = JSON.parse(
      localStorage.getItem(CART_KEY) || "[]"
    );

    // Prevent mixing items from different canteens.
    const cartCanteenId =
      existingCart.length > 0
        ? existingCart[0].canteen
        : null;

    if (cartCanteenId && cartCanteenId !== canteenId) {
      const shouldReplace = window.confirm(
        "Your cart contains items from another canteen. Replace the current cart?"
      );

      if (!shouldReplace) {
        return;
      }

      localStorage.removeItem(CART_KEY);
      existingCart.length = 0;
    }

    const existingItem = existingCart.find(
      (cartItem) => cartItem.menuItem === item._id
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      existingCart.push({
        menuItem: item._id,
        name: item.name,
        price: item.price,
        image: item.image || "",
        quantity: 1,
        canteen: canteenId,
        canteenName: canteen?.name || "",
      });
    }

    localStorage.setItem(
      CART_KEY,
      JSON.stringify(existingCart)
    );

    setCartCount(
      existingCart.reduce(
        (total, cartItem) =>
          total + cartItem.quantity,
        0
      )
    );

    setAddedItem(item.name);

    setTimeout(() => {
      setAddedItem("");
    }, 1400);
  };

  return (
    <div className="min-h-screen bg-[#090b0d] text-white">
      <main className="mx-auto w-full max-w-7xl px-4 pb-20 pt-6 sm:px-6 lg:px-8 lg:pt-9">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate("/canteen")}
            className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-xs text-white/45 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to canteens
          </button>

          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="relative inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs font-medium text-white/65 transition hover:border-emerald-400/20 hover:text-white"
          >
            <ShoppingCart size={15} />
            Cart

            {cartCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-400 px-1.5 text-[10px] font-bold text-black">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Canteen header */}
        {canteen && (
          <section className="mt-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    {canteen.name}
                  </h1>

                  <span
                    className={`rounded-full px-2.5 py-1 text-[9px] font-semibold tracking-wider ${
                      canteen.isOpen
                        ? "border border-emerald-400/15 bg-emerald-400/8 text-emerald-300"
                        : "border border-white/10 bg-white/5 text-white/40"
                    }`}
                  >
                    {canteen.isOpen ? "OPEN" : "CLOSED"}
                  </span>
                </div>

                <p className="mt-2 text-xs text-white/40">
                  {canteen.location}
                </p>

                {canteen.description && (
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-white/45">
                    {canteen.description}
                  </p>
                )}
              </div>

              <div className="text-xs text-white/35">
                Average preparation:{" "}
                <span className="text-white/60">
                  ~{canteen.preparationTime || 15} min
                </span>
              </div>
            </div>
          </section>
        )}

        {/* Search */}
        <section className="mt-7">
          <div className="relative max-w-xl">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search the menu..."
              className="h-11 w-full rounded-xl border border-white/10 bg-[#0d1114] pl-10 pr-4 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-emerald-400/30"
            />
          </div>
        </section>

        {/* Categories */}
        {!loading && !error && menuItems.length > 0 && (
          <section className="mt-5 border-b border-white/7 pb-3">
            <CategoryTabs
              categories={categories}
              activeCategory={activeCategory}
              onChange={setActiveCategory}
            />
          </section>
        )}

        {/* Added notification */}
        {addedItem && (
          <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-emerald-400/20 bg-[#101619] px-4 py-3 text-xs text-emerald-300 shadow-2xl">
            ✓ {addedItem} added to cart
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(
              (item) => (
                <div
                  key={item}
                  className="h-[250px] animate-pulse rounded-2xl border border-white/8 bg-[#0d1114]"
                />
              )
            )}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-7 rounded-2xl border border-red-400/15 bg-red-400/5 p-6">
            <p className="text-sm font-medium text-red-300">
              Could not load this menu
            </p>

            <p className="mt-1 text-xs text-white/40">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg border border-white/10 px-3 py-2 text-xs text-white/60 transition hover:text-white"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty menu */}
        {!loading &&
          !error &&
          menuItems.length === 0 && (
            <div className="mt-7 rounded-2xl border border-white/8 bg-[#0d1114] px-6 py-14 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/30">
                🍽️
              </div>

              <h2 className="mt-4 text-sm font-semibold">
                Menu coming soon
              </h2>

              <p className="mt-1 text-xs text-white/35">
                This canteen hasn't added any menu items yet.
              </p>
            </div>
          )}

        {/* Filtered empty */}
        {!loading &&
          !error &&
          menuItems.length > 0 &&
          filteredItems.length === 0 && (
            <div className="mt-7 rounded-2xl border border-white/8 bg-[#0d1114] px-6 py-12 text-center">
              <Search
                size={20}
                className="mx-auto text-white/25"
              />

              <p className="mt-3 text-sm font-medium">
                No matching items
              </p>

              <p className="mt-1 text-xs text-white/35">
                Try another search or category.
              </p>
            </div>
          )}

        {/* Menu */}
        {!loading &&
          !error &&
          filteredItems.length > 0 && (
            <section className="mt-7">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs text-white/35">
                  {filteredItems.length}{" "}
                  {filteredItems.length === 1
                    ? "item"
                    : "items"}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredItems.map((item) => (
                  <MenuItemCard
                    key={item._id}
                    item={item}
                    onAdd={addToCart}
                  />
                ))}
              </div>
            </section>
          )}
      </main>
    </div>
  );
}

export default CanteenMenu;