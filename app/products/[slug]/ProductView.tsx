"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addToCart } from "@/app/cart/actions";
import { formatMoney } from "@/lib/money";
import { HeroCarousel } from "@/components/HeroCarousel";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAt: number | null;
  stock: number;
  image: string;
  images: string[];
};

type Variant = {
  id: string;
  name: string;
  image: string;
  priceOverride: number | null;
  stock: number;
};

export function ProductView({
  product,
  variants,
}: {
  product: Product;
  variants: Variant[];
}) {
  const hasVariants = variants.length > 0;
  const [variantId, setVariantId] = useState<string | null>(
    hasVariants ? variants[0]!.id : null,
  );
  const [qty, setQty] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);
  const router = useRouter();

  const selectedVariant = variants.find((v) => v.id === variantId) ?? null;
  const price = selectedVariant?.priceOverride ?? product.price;
  const stock = selectedVariant?.stock ?? product.stock;

  const gallery = product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="grid gap-14 md:grid-cols-2">
      {/* IMAGE */}
      <div>
        {gallery.length > 1 ? (
          <HeroCarousel images={gallery} />
        ) : (
          <div className="relative aspect-[4/5] overflow-hidden bg-cream-100">
            <Image
              src={gallery[0]!}
              alt={product.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 600px"
            />
          </div>
        )}
      </div>

      {/* DETAILS */}
      <div className="md:pt-6">
        <p className="eyebrow">Pet puzzle</p>
        <h1 className="mt-3 font-serif text-4xl font-normal leading-tight text-ink-900 md:text-5xl">
          {product.name}
        </h1>
        <div className="mt-5 flex items-baseline gap-3">
          <span className="text-3xl font-bold text-ink-900">
            {formatMoney(price)}
          </span>
          {product.compareAt && product.compareAt > price && (
            <>
              <span className="text-lg text-ink-300 line-through">
                {formatMoney(product.compareAt)}
              </span>
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-red-700">
                {Math.round((1 - price / product.compareAt) * 100)}% off
              </span>
            </>
          )}
        </div>

        <div className="rule my-7" />

        <p className="leading-relaxed text-ink-500">{product.description}</p>

        {hasVariants && (
          <div className="mt-8">
            <p className="eyebrow mb-3">
              Size — <span className="text-ink-700 normal-case tracking-normal">{selectedVariant?.name}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVariantId(v.id)}
                  className={`border px-4 py-2 text-sm transition ${
                    variantId === v.id
                      ? "border-ink-800 bg-ink-800 text-cream-50"
                      : "border-ink-200 text-ink-700 hover:border-ink-800"
                  }`}
                >
                  {v.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 space-y-2 text-sm text-ink-500">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
            {stock > 0 ? (
              <span>In stock — ships in 7–14 days across the US</span>
            ) : (
              <span className="text-ink-400">Currently sold out</span>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <div className="flex items-center border border-ink-200">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="px-4 py-3 text-ink-700 hover:bg-ink-50"
              disabled={isPending || stock <= 0}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="min-w-10 px-3 py-3 text-center text-sm font-medium text-ink-800">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(stock, q + 1))}
              className="px-4 py-3 text-ink-700 hover:bg-ink-50"
              disabled={isPending || stock <= 0 || qty >= stock}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <button
            type="button"
            className="btn-primary flex-1 md:flex-none md:min-w-[220px]"
            disabled={isPending || stock <= 0}
            onClick={() =>
              startTransition(async () => {
                await addToCart(product.id, variantId, qty);
                setAdded(true);
                router.refresh();
                setTimeout(() => setAdded(false), 1500);
              })
            }
          >
            {isPending ? "Adding..." : added ? "Added to bag ✓" : "Add to bag"}
          </button>
        </div>

        <ul className="mt-10 space-y-2 border-t border-ink-100 pt-6 text-xs uppercase tracking-widest text-ink-500">
          <li>Ships fast</li>
          <li>Every order supports our rescue work</li>
        </ul>
      </div>
    </div>
  );
}
