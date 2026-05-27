"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateQuantity, removeFromCart } from "./actions";

export function CartLineControls({
  productId,
  variantId,
  quantity,
  stock,
}: {
  productId: string;
  variantId: string | null;
  quantity: number;
  stock: number;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const change = (q: number) => {
    if (q < 1 || q > stock) return;
    startTransition(async () => {
      await updateQuantity(productId, variantId, q);
      router.refresh();
    });
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center border border-ink-200">
        <button
          type="button"
          onClick={() => change(quantity - 1)}
          disabled={isPending || quantity <= 1}
          className="px-3 py-1.5 text-ink-700 hover:bg-ink-50 disabled:opacity-40"
          aria-label="Decrease"
        >
          −
        </button>
        <span className="min-w-8 px-2 text-center text-sm text-ink-800">{quantity}</span>
        <button
          type="button"
          onClick={() => change(quantity + 1)}
          disabled={isPending || quantity >= stock}
          className="px-3 py-1.5 text-ink-700 hover:bg-ink-50 disabled:opacity-40"
          aria-label="Increase"
        >
          +
        </button>
      </div>
      <button
        type="button"
        onClick={() =>
          startTransition(async () => {
            await removeFromCart(productId, variantId);
            router.refresh();
          })
        }
        disabled={isPending}
        className="text-[11px] uppercase tracking-widest text-ink-400 hover:text-ink-900"
      >
        Remove
      </button>
    </div>
  );
}
