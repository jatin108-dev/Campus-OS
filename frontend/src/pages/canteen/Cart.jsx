import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ShoppingBag, UtensilsCrossed } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import CartItem from "../../components/canteen/CartItem";

const CART_KEY = "campusOSCart";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(() => {
    try {
      const storedCart = localStorage.getItem(CART_KEY);
      return storedCart ? JSON.parse(storedCart) : [];
    } catch {
      return [];
    }
  });

  const saveCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("campusOSCartChange"));
  };

  useEffect(() => {
    const handleCartChange = () => {
      try {
        const storedCart = localStorage.getItem(CART_KEY);
        setCart(storedCart ? JSON.parse(storedCart) : []);
      } catch {
        setCart([]);
      }
    };

    window.addEventListener("campusOSCartChange", handleCartChange);

    return () => {
      window.removeEventListener("campusOSCartChange", handleCartChange);
    };
  }, []);

  const increaseQuantity = (item) => {
    const updatedCart = cart.map((cartItem) =>
      cartItem.menuItem === item.menuItem
        ? {
            ...cartItem,
            quantity: cartItem.quantity + 1,
          }
        : cartItem
    );

    saveCart(updatedCart);
  };

  const decreaseQuantity = (item) => {
    if (item.quantity <= 1) {
      removeItem(item);
      return;
    }

    const updatedCart = cart.map((cartItem) =>
      cartItem.menuItem === item.menuItem
        ? {
            ...cartItem,
            quantity: cartItem.quantity - 1,
          }
        : cartItem
    );

    saveCart(updatedCart);
  };

  const removeItem = (item) => {
    const updatedCart = cart.filter(
      (cartItem) => cartItem.menuItem !== item.menuItem
    );

    saveCart(updatedCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const subtotal = useMemo(() => {
    return cart.reduce(
      (total, item) => total + Number(item.price) * item.quantity,
      0
    );
  }, [cart]);

  const itemCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  // Keep checkout pricing simple for now.
  // We can add platform/convenience fees in Step 7 if required.
  const total = subtotal;

  const canteenName = cart[0]?.canteenName || "Campus Canteen";

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#080b0d] text-white">
        <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-5 py-16">
          <div className="w-full max-w-md text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-[#101518]">
              <ShoppingBag size={32} className="text-zinc-500" />
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
              Your cart
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight">
              Nothing here yet.
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-zinc-500">
              Add something delicious from one of the campus canteens and it
              will appear here.
            </p>

            <Link
              to="/canteen"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-300"
            >
              <UtensilsCrossed size={17} />
              Browse Canteens
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080b0d] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#080b0d]/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Continue shopping
          </button>

          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <ShoppingBag size={17} />
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8 lg:py-10">
        {/* Heading */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
            {canteenName}
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Your order
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Review your items before heading to checkout.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Items */}
          <section className="space-y-3">
            {cart.map((item) => (
              <CartItem
                key={item.menuItem}
                item={item}
                onIncrease={increaseQuantity}
                onDecrease={decreaseQuantity}
                onRemove={removeItem}
              />
            ))}

            <button
              type="button"
              onClick={clearCart}
              className="pt-2 text-sm text-zinc-500 transition hover:text-red-400"
            >
              Clear cart
            </button>
          </section>

          {/* Summary */}
          <aside className="h-fit rounded-2xl border border-white/10 bg-[#0d1114] p-5 lg:sticky lg:top-6">
            <h2 className="text-lg font-semibold">Order summary</h2>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between text-zinc-400">
                <span>Items ({itemCount})</span>
                <span>₹{subtotal.toFixed(0)}</span>
              </div>

              <div className="flex items-center justify-between text-zinc-400">
                <span>Taxes & fees</span>
                <span className="text-zinc-600">Added at checkout</span>
              </div>

              <div className="border-t border-white/10 pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Total</span>
                  <span className="text-xl font-bold text-white">
                    ₹{total.toFixed(0)}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/checkout")}
              className="mt-6 flex w-full items-center justify-center rounded-xl bg-emerald-400 px-4 py-3.5 text-sm font-bold text-black transition hover:bg-emerald-300"
            >
              Proceed to Checkout
            </button>

            <p className="mt-3 text-center text-xs leading-5 text-zinc-600">
              You can review pickup details and payment on the next step.
            </p>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default Cart;