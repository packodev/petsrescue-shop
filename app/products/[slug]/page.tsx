import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { parseImages } from "@/lib/product";
import { ProductView } from "./ProductView";

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Params }) {
  const p = await prisma.product.findUnique({ where: { slug: params.slug } });
  return { title: p ? `${p.name} — PawsRescue` : "Not found" };
}

export default async function ProductPage({ params }: { params: Params }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      variants: { orderBy: { sortOrder: "asc" } },
    },
  });
  if (!product || !product.active) notFound();

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <nav className="mb-10 text-xs uppercase tracking-widest text-ink-400">
        <Link href="/" className="hover:text-ink-700">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-ink-700">Shop</Link>
        <span className="mx-2">/</span>
        <span className="text-ink-700">{product.name}</span>
      </nav>

      <ProductView
        product={{
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          compareAt: product.compareAt,
          stock: product.stock,
          image: product.image,
          images: parseImages(product.images),
        }}
        variants={product.variants.map((v) => ({
          id: v.id,
          name: v.name,
          image: v.image,
          priceOverride: v.priceOverride,
          compareAt: v.compareAt,
          stock: v.stock,
        }))}
      />
    </div>
  );
}
