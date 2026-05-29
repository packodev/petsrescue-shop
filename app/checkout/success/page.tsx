import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatMoney } from "@/lib/money";
import { ClearCartOnMount } from "./ClearCartOnMount";

export const metadata = { title: "Order placed — PawsRescue" };

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  if (!searchParams.id) notFound();
  const order = await prisma.order.findUnique({
    where: { id: searchParams.id },
    include: { items: true },
  });
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      {order.status === "PAID" && <ClearCartOnMount />}
      <div className="border border-ink-100 bg-white p-12 text-center">
        <p className="eyebrow text-emerald-800">Order received</p>
        <h1 className="mt-4 font-serif text-4xl text-ink-900">Thank you</h1>
        <div className="rule mx-auto my-6" />
        <p className="text-ink-500">
          A confirmation has been sent to <span className="text-ink-800">{order.email}</span>.
        </p>
        <p className="mt-2 text-xs uppercase tracking-widest text-ink-400">
          Order №{order.id.slice(-8).toUpperCase()}
        </p>

        <div className="mt-10 space-y-3 border-t border-ink-100 pt-8 text-left text-sm">
          {order.items.map((i) => (
            <div key={i.id} className="flex justify-between">
              <div>
                <div className="text-ink-800">{i.name}</div>
                {i.variantName && (
                  <div className="text-xs uppercase tracking-widest text-ink-400">
                    {i.variantName}
                  </div>
                )}
                <div className="text-xs text-ink-500">Qty {i.quantity}</div>
              </div>
              <span className="text-ink-700">{formatMoney(i.price * i.quantity)}</span>
            </div>
          ))}
          <div className="flex justify-between border-t border-ink-100 pt-3 text-ink-600">
            <span>Subtotal</span>
            <span>{formatMoney(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-ink-600">
            <span>Shipping</span>
            <span>{order.shipping === 0 ? "Free" : formatMoney(order.shipping)}</span>
          </div>
          <div className="flex justify-between border-t border-ink-100 pt-3 font-serif text-lg text-ink-900">
            <span>Total</span>
            <span>{formatMoney(order.total)}</span>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/account" className="btn-primary">View my orders</Link>
          <Link href="/products" className="btn-outline">Keep shopping</Link>
        </div>
      </div>
    </div>
  );
}
