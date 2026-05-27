import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { formatMoney } from "@/lib/money";

export const metadata = { title: "Account — PetsRescue Co." };

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <header className="mb-12 text-center">
        <p className="eyebrow">Your account</p>
        <h1 className="section-title mt-2">
          {user.name ? user.name : "Welcome back"}
        </h1>
        <p className="mt-2 text-sm text-ink-500">{user.email}</p>
        <div className="rule mx-auto mt-5" />
      </header>

      <h2 className="eyebrow mb-6">Order history</h2>
      {orders.length === 0 ? (
        <div className="border border-ink-100 bg-white p-12 text-center text-ink-500">
          You haven't placed any orders yet.{" "}
          <Link href="/products" className="link-underline">Discover the collection</Link>
        </div>
      ) : (
        <ul className="space-y-5">
          {orders.map((o) => (
            <li key={o.id} className="border border-ink-100 bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 pb-4">
                <div>
                  <div className="font-serif text-lg text-ink-900">
                    Order №{o.id.slice(-8).toUpperCase()}
                  </div>
                  <div className="text-xs uppercase tracking-widest text-ink-400">
                    {new Date(o.createdAt).toLocaleDateString()} • {o.items.reduce((s, i) => s + i.quantity, 0)} items
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <StatusBadge status={o.status} />
                  <span className="font-serif text-lg text-ink-900">{formatMoney(o.total)}</span>
                </div>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-ink-600">
                {o.items.map((i) => (
                  <li key={i.id} className="flex justify-between">
                    <span>
                      {i.name}
                      {i.variantName && (
                        <span className="text-ink-400"> · {i.variantName}</span>
                      )}{" "}
                      × {i.quantity}
                    </span>
                    <span>{formatMoney(i.price * i.quantity)}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PENDING: "bg-cream-200 text-ink-700",
    PAID: "bg-emerald-100 text-emerald-800",
    SHIPPED: "bg-ink-800 text-cream-50",
    DELIVERED: "bg-emerald-700 text-cream-50",
    CANCELLED: "bg-ink-100 text-ink-500",
  };
  return (
    <span
      className={`px-2.5 py-1 text-[10px] uppercase tracking-widest ${map[status] ?? "bg-ink-100 text-ink-600"}`}
    >
      {status}
    </span>
  );
}
