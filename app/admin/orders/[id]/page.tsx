import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatMoney } from "@/lib/cart";
import { updateOrderStatusAction } from "../../actions";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true, user: { select: { email: true, name: true } } },
  });
  if (!order) notFound();

  const statuses = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/orders"
            className="text-sm text-emerald-700 hover:underline"
          >
            ← Back to orders
          </Link>
          <h2 className="mt-1 text-xl font-bold">
            Order #{order.id.slice(-8).toUpperCase()}
          </h2>
          <p className="text-xs text-ink-500">
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <form
          action={updateOrderStatusAction}
          className="flex items-center gap-2"
        >
          <input type="hidden" name="id" value={order.id} />
          <select
            name="status"
            defaultValue={order.status}
            className="input w-40"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button type="submit" className="btn-primary">
            Update
          </button>
        </form>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="card p-4 md:col-span-2">
          <h3 className="mb-3 font-semibold">Items</h3>
          <ul className="divide-y divide-ink-50">
            {order.items.map((i) => (
              <li key={i.id} className="flex items-center gap-3 py-3">
                <div className="relative h-14 w-14 overflow-hidden rounded bg-ink-50">
                  <Image src={i.image} alt={i.name} fill className="object-cover" sizes="56px" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{i.name}</div>
                  {i.variantName && (
                    <div className="text-xs text-ink-600">{i.variantName}</div>
                  )}
                  <div className="text-xs text-ink-500">
                    {formatMoney(i.price)} × {i.quantity}
                  </div>
                </div>
                <div className="font-semibold">
                  {formatMoney(i.price * i.quantity)}
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1 border-t border-ink-50 pt-3 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatMoney(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>
                {order.shipping === 0 ? "Free" : formatMoney(order.shipping)}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold">
              <span>Total</span>
              <span>{formatMoney(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-4 text-sm">
            <h3 className="mb-2 font-semibold">Customer</h3>
            <p>{order.fullName}</p>
            <p className="text-ink-600">{order.email}</p>
            <p className="text-ink-600">{order.phone}</p>
            {order.user && (
              <p className="mt-2 text-xs text-ink-500">
                Registered user: {order.user.email}
              </p>
            )}
          </div>
          <div className="card p-4 text-sm">
            <h3 className="mb-2 font-semibold">Shipping</h3>
            <p>{order.address}</p>
            <p>
              {order.city}, {order.postalCode}
            </p>
            <p>{order.country}</p>
          </div>
          <div className="card p-4 text-sm">
            <h3 className="mb-2 font-semibold">Payment</h3>
            <p>
              {order.paymentMethod === "COD"
                ? "Cash on delivery"
                : "Credit card (demo)"}
            </p>
            <p className="text-ink-500">Status: {order.status}</p>
          </div>
          {order.notes && (
            <div className="card p-4 text-sm">
              <h3 className="mb-2 font-semibold">Notes</h3>
              <p className="text-ink-700">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
