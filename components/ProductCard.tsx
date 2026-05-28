import Image from "next/image";
import Link from "next/link";
import { formatMoney } from "@/lib/money";

export type ProductCardData = {
  slug: string;
  name: string;
  price: number;
  compareAt: number | null;
  image: string;
};

export function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-cream-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition duration-700 group-hover:scale-[1.03]"
        />
        {product.compareAt && product.compareAt > product.price && (
          <span className="absolute left-3 top-3 rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            {Math.round((1 - product.price / product.compareAt) * 100)}% off
          </span>
        )}
      </div>
      <div className="mt-4 px-1">
        <h3 className="font-serif text-lg leading-snug text-ink-900 group-hover:text-emerald-800">
          {product.name}
        </h3>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="text-base font-bold text-ink-900">
            {formatMoney(product.price)}
          </span>
          {product.compareAt && product.compareAt > product.price && (
            <span className="text-sm text-ink-400 line-through">
              {formatMoney(product.compareAt)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
