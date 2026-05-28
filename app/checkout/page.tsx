import { redirect } from "next/navigation";
import { getCartWithProducts } from "@/lib/cart";
import { formatMoney } from "@/lib/money";
import { getCurrentUser } from "@/lib/auth";
import { CheckoutForm } from "./CheckoutForm";

export const metadata = { title: "Checkout — PetsRescue Co." };

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: { canceled?: string };
}) {
  const { items, subtotal } = await getCartWithProducts();
  if (items.length === 0) redirect("/cart");

  const user = await getCurrentUser();
  const shipping = 0;
  const total = subtotal + shipping;
  const canceled = searchParams.canceled === "1";

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <header className="mb-10 text-center">
        <p className="eyebrow">Checkout</p>
        <h1 className="section-title mt-2">Almost yours</h1>
        <div className="rule mx-auto mt-5" />
      </header>

      {canceled && (
        <div className="mx-auto mb-8 max-w-2xl rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-medium">Payment was canceled.</p>
          <p className="mt-1 text-amber-800">
            Your items are still in your bag. Continue when you&apos;re ready.
          </p>
        </div>
      )}

      <div className="grid gap-12 md:grid-cols-[1fr_360px]">
        <CheckoutForm defaultEmail={user?.email ?? ""} defaultName={user?.name ?? ""} />

        <aside className="sticky top-28 h-fit space-y-5 border border-ink-100 bg-white p-7 text-sm">
          <h2 className="eyebrow">Your order</h2>
          <ul className="divide-y divide-ink-100">
            {items.map((i) => (
              <li
                key={`${i.productId}:${i.variantId ?? ""}`}
                className="flex justify-between gap-2 py-3"
              >
                <div className="pr-2">
                  <div className="text-ink-800">{i.name}</div>
                  {i.variantName && (
                    <div className="text-xs uppercase tracking-widest text-ink-400">
                      {i.variantName}
                    </div>
                  )}
                  <div className="text-xs text-ink-500">Qty {i.quantity}</div>
                </div>
                <span className="text-ink-700">{formatMoney(i.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between border-t border-ink-100 pt-4 text-ink-600">
            <span>Subtotal</span>
            <span>{formatMoney(subtotal)}</span>
          </div>
          <div className="flex justify-between text-ink-600">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between border-t border-ink-100 pt-4 font-serif text-lg text-ink-900">
            <span>Total</span>
            <span>{formatMoney(total)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
