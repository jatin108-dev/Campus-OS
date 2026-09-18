import { Minus, Plus, Trash2 } from "lucide-react";

function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <div className="flex gap-4 rounded-2xl border border-white/10 bg-[#0d1114] p-4">
      {/* Image */}
      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#151a1e]">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl">
            🍽️
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <h3 className="truncate text-base font-semibold text-white">
            {item.name}
          </h3>

          <p className="mt-1 text-sm text-zinc-500">
            ₹{Number(item.price).toFixed(0)} each
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          {/* Quantity */}
          <div className="flex items-center rounded-xl border border-white/10 bg-[#151a1e]">
            <button
              type="button"
              onClick={() => onDecrease(item)}
              className="flex h-9 w-9 items-center justify-center text-zinc-400 transition hover:text-white"
            >
              <Minus size={15} />
            </button>

            <span className="w-8 text-center text-sm font-semibold text-white">
              {item.quantity}
            </span>

            <button
              type="button"
              onClick={() => onIncrease(item)}
              className="flex h-9 w-9 items-center justify-center text-zinc-400 transition hover:text-white"
            >
              <Plus size={15} />
            </button>
          </div>

          {/* Item total + delete */}
          <div className="flex items-center gap-3">
            <span className="font-semibold text-white">
              ₹{(Number(item.price) * item.quantity).toFixed(0)}
            </span>

            <button
              type="button"
              onClick={() => onRemove(item)}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400"
              aria-label={`Remove ${item.name}`}
            >
              <Trash2 size={17} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartItem;