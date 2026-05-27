import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatMoney } from "@/lib/cart";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const orders = await prisma.order.findMany({
    where: searchParams.status
      ? { status: searchParams.status }
      : undefined,
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  const statuses = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Orders ({orders.length})</h2>

      <div className="flex flex-wrap gap-2 text-sm">
        <Link
          href="/admin/orders"
          className={`rounded-full px-3 py-1 ${
            !searchParams.status ? "bg-emerald-600 text-white" : "bg-ink-100"
          }`}
        >
          All
        </Link>
        {statuses.map((s) => (
          <Link
            key={s}
            href={`/admin/orders?status=${s}`}
            className={`rounded-full px-3 py-1 ${
              searchParams.status === s ? "bg-emerald-600 text-white" : "bg-ink-100"
            }`}
          >
            {s}
          </Link>
        ))}
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 text-left text-xs uppercase text-ink-500">
            <tr>
              <th className="px-4 py-2">Order</th>
              <th className="px-4 py-2">Customer</th>
              <th className="px-4 py-2">Items</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink-500">
                  No orders.
                </td>
              </tr>
            )}
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-ink-50">
                <td className="px-4 py-2 font-mono text-xs">
                  <Link href={`/admin/orders/${o.id}`} className="hover:text-emerald-700">
                    #{o.id.slice(-8).toUpperCase()}
                  </Link>
                </td>
                <td className="px-4 py-2">
                  <div>{o.fullName}</div>
                  <div className="text-xs text-ink-500">{o.email}</div>
                </td>
                <td className="px-4 py-2">
                  {o.items.reduce((s, i) => s + i.quantity, 0)}
                </td>
                <td className="px-4 py-2 font-medium">{formatMoney(o.total)}</td>
                <td className="px-4 py-2">{o.status}</td>
                <td className="px-4 py-2 text-ink-500">
                  {new Date(o.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
