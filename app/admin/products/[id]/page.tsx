import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProductForm } from "../ProductForm";
import { VariantRow } from "./VariantRow";
import { NewVariantForm } from "./NewVariantForm";
import { formatMoney } from "@/lib/cart";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id: params.id },
      include: { variants: { orderBy: { sortOrder: "asc" } } },
    }),
    prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);
  if (!product) notFound();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-4 text-lg font-semibold">Edit product</h2>
        <ProductForm
          categories={categories}
          product={{
            id: product.id,
            slug: product.slug,
            name: product.name,
            description: product.description,
            price: product.price,
            compareAt: product.compareAt,
            stock: product.stock,
            image: product.image,
            categoryId: product.categoryId,
            active: product.active,
            featured: product.featured,
            supplierUrl: product.supplierUrl,
          }}
        />
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">
          Variants ({product.variants.length})
        </h2>
        <p className="mb-3 text-sm text-ink-500">
          Each variant has its own image, stock and optional price override.
          Leave price empty to use the product's base price ({formatMoney(product.price)}).
        </p>
        <ul className="space-y-3">
          {product.variants.map((v) => (
            <li key={v.id} className="card flex gap-4 p-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded bg-ink-50">
                <Image src={v.image} alt={v.name} fill className="object-cover" sizes="80px" />
              </div>
              <div className="flex-1">
                <VariantRow
                  variant={{
                    id: v.id,
                    productId: product.id,
                    name: v.name,
                    image: v.image,
                    priceOverride: v.priceOverride,
                    stock: v.stock,
                    sortOrder: v.sortOrder,
                  }}
                />
              </div>
            </li>
          ))}
          {product.variants.length === 0 && (
            <li className="card p-6 text-center text-sm text-ink-500">
              No variants yet. Add one below.
            </li>
          )}
        </ul>

        <div className="mt-6">
          <h3 className="mb-2 text-base font-semibold">Add variant</h3>
          <NewVariantForm productId={product.id} />
        </div>
      </div>
    </div>
  );
}
