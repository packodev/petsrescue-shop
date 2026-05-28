import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/ProductCard";
import { parseImages } from "@/lib/product";

export const metadata = { title: "Shop — PetsRescue" };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; q?: string };
}) {
  const { category, q } = searchParams;

  const [categories, products, currentCategory] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({
      where: {
        active: true,
        category: category ? { slug: category } : undefined,
        OR: q
          ? [
              { name: { contains: q } },
              { description: { contains: q } },
            ]
          : undefined,
      },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    }),
    category
      ? prisma.category.findUnique({ where: { slug: category } })
      : Promise.resolve(null),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <header className="mb-12 text-center">
        <p className="eyebrow">The collection</p>
        <h1 className="section-title mt-2">
          {currentCategory ? currentCategory.name : "All pieces"}
        </h1>
        {q && (
          <p className="mt-2 text-sm italic text-ink-400">
            Search results for “{q}”
          </p>
        )}
        <div className="rule mx-auto mt-5" />
      </header>

      {categories.length > 1 && (
        <nav className="mb-10 flex flex-wrap justify-center gap-6 text-xs uppercase tracking-widest">
          <Link
            href="/products"
            className={`pb-1 ${!category ? "border-b border-ink-800 text-ink-900" : "text-ink-500 hover:text-ink-900"}`}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/products?category=${c.slug}`}
              className={`pb-1 ${
                category === c.slug
                  ? "border-b border-ink-800 text-ink-900"
                  : "text-ink-500 hover:text-ink-900"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </nav>
      )}

      {products.length === 0 ? (
        <div className="py-20 text-center text-ink-400">No pieces found.</div>
      ) : (
        <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={{
                slug: p.slug,
                name: p.name,
                price: p.price,
                compareAt: p.compareAt,
                image: p.image,
                images: parseImages(p.images),
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
