import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatMoney } from "@/lib/cart";
import { deleteProductAction } from "../actions";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Products ({products.length})</h2>
        <Link href="/admin/products/new" className="btn-primary">+ New product</Link>
      </div>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 text-left text-xs uppercase text-ink-500">
            <tr>
              <th className="px-4 py-2"></th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Stock</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-ink-50">
                <td className="px-4 py-2">
                  <div className="relative h-10 w-10 overflow-hidden rounded bg-ink-50">
                    <Image src={p.image} alt={p.name} fill className="object-cover" sizes="40px" />
                  </div>
                </td>
                <td className="px-4 py-2 font-medium">{p.name}</td>
                <td className="px-4 py-2 text-ink-600">{p.category.name}</td>
                <td className="px-4 py-2">{formatMoney(p.price)}</td>
                <td className="px-4 py-2">{p.stock}</td>
                <td className="px-4 py-2">
                  {p.active ? (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                      Active
                    </span>
                  ) : (
                    <span className="rounded-full bg-ink-100 px-2 py-0.5 text-xs text-ink-600">
                      Hidden
                    </span>
                  )}
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="text-emerald-700 hover:underline"
                    >
                      Edit
                    </Link>
                    {p.active && (
                      <form action={deleteProductAction}>
                        <input type="hidden" name="id" value={p.id} />
                        <button
                          type="submit"
                          className="text-red-600 hover:underline"
                        >
                          Hide
                        </button>
                      </form>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
