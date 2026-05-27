import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatMoney } from "@/lib/cart";

export default async function AdminDashboard() {
  const [productCount, orderCount, pendingCount, revenue, recentOrders] =
    await Promise.all([
      prisma.product.count({ where: { active: true } }),
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { in: ["PAID", "SHIPPED", "DELIVERED"] } },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { items: true },
      }),
    ]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Active products" value={String(productCount)} />
        <Stat label="Total orders" value={String(orderCount)} />
        <Stat label="Pending" value={String(pendingCount)} />
        <Stat label="Revenue" value={formatMoney(revenue._sum.total ?? 0)} />
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent orders</h2>
          <Link href="/admin/orders" className="text-sm text-emerald-700 hover:underline">
            View all →
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="card p-8 text-center text-ink-500">No orders yet.</div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-ink-50 text-left text-xs uppercase text-ink-500">
                <tr>
                  <th className="px-4 py-2">Order</th>
                  <th className="px-4 py-2">Customer</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Total</th>
                  <th className="px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-t border-ink-50">
                    <td className="px-4 py-2 font-mono text-xs">
                      <Link href={`/admin/orders/${o.id}`} className="hover:text-emerald-700">
                        #{o.id.slice(-8).toUpperCase()}
                      </Link>
                    </td>
                    <td className="px-4 py-2">{o.fullName}</td>
                    <td className="px-4 py-2">{o.status}</td>
                    <td className="px-4 py-2">{formatMoney(o.total)}</td>
                    <td className="px-4 py-2 text-ink-500">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-4">
      <div className="text-xs uppercase text-ink-500">{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
    </div>
  );
}
