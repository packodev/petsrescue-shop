import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export const metadata = { title: "Admin — PetsRescue Co." };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/");

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 pb-5">
        <h1 className="font-serif text-2xl text-ink-900">Studio</h1>
        <nav className="flex gap-6 text-xs uppercase tracking-widest text-ink-500">
          <Link href="/admin" className="hover:text-ink-900">Dashboard</Link>
          <Link href="/admin/products" className="hover:text-ink-900">Products</Link>
          <Link href="/admin/orders" className="hover:text-ink-900">Orders</Link>
        </nav>
      </div>
      {children}
    </div>
  );
}
