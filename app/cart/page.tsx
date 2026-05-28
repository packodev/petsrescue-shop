import Image from "next/image";
import Link from "next/link";
import { getCartWithProducts } from "@/lib/cart";
import { formatMoney } from "@/lib/money";
import { CartLineControls } from "./CartLineControls";

export const metadata = { title: "Your bag — PetsRescue Co." };

export default async function CartPage() {
  const { items, subtotal } = await getCartWithProducts();
  const shipping = subtotal === 0 ? 0 : subtotal >= 50 ? 0 : 7.99;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="eyebrow">Your bag</p>
        <h1 className="section-title mt-3">Your bag is empty</h1>
        <div className="rule mx-auto my-6" />
        <p className="text-ink-500">
          Discover hand-engraved pieces crafted in our studio.
        </p>
        <div className="mt-8">
          <Link href="/products" className="btn-primary">Shop the collection</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <header className="mb-10 text-center">
        <p className="eyebrow">Your bag</p>
        <h1 className="section-title mt-2">A thoughtful selection</h1>
        <div className="rule mx-auto mt-5" />
      </header>
      <div className="grid gap-14 md:grid-cols-[1fr_360px]">
        <ul className="space-y-8">
          {items.map((i) => (
            <li
              key={`${i.productId}:${i.variantId ?? ""}`}
              className="flex gap-6 border-b border-ink-100 pb-8"
            >
              <div className="relative aspect-[4/5] w-28 shrink-0 overflow-hidden bg-cream-100">
                <Image src={i.image} alt={i.name} fill className="object-cover" sizes="112px" />
              </div>
              <div className="flex flex-1 flex-col">
                <Link
                  href={`/products/${i.slug}`}
                  className="font-serif text-xl text-ink-900 hover:text-amber-700"
                >
                  {i.name}
                </Link>
                {i.variantName && (
                  <span className="mt-1 text-xs uppercase tracking-widest text-ink-500">
                    {i.variantName}
                  </span>
                )}
                <span className="mt-1 text-sm text-ink-500">
                  {formatMoney(i.price)}
                </span>
                <div className="mt-auto flex items-end justify-between pt-4">
                  <CartLineControls
                    productId={i.productId}
                    variantId={i.variantId}
                    quantity={i.quantity}
                    stock={i.stock}
                  />
                  <span className="font-serif text-lg text-ink-900">
                    {formatMoney(i.lineTotal)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="sticky top-28 h-fit space-y-5 border border-ink-100 bg-white p-7 text-sm">
          <h2 className="eyebrow">Order summary</h2>
          <div className="flex justify-between text-ink-600">
            <span>Subtotal</span>
            <span>{formatMoney(subtotal)}</span>
          </div>
          <div className="flex justify-between text-ink-600">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Complimentary" : formatMoney(shipping)}</span>
          </div>
          {subtotal < 50 && (
            <p className="text-xs italic text-ink-400">
              Add {formatMoney(50 - subtotal)} more for complimentary shipping.
            </p>
          )}
          <div className="border-t border-ink-100 pt-4 flex justify-between font-serif text-lg text-ink-900">
            <span>Total</span>
            <span>{formatMoney(total)}</span>
          </div>
          <Link href="/checkout" className="btn-primary w-full">
            Proceed to checkout
          </Link>
          <Link href="/products" className="block text-center text-xs uppercase tracking-widest text-ink-500 hover:text-ink-900">
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
