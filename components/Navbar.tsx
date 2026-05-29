import Link from "next/link";
import { logoutAction } from "@/app/(auth)/actions";

type User = { id: string; email: string; name: string | null; role: string } | null;

export function Navbar({ cartCount, user }: { cartCount: number; user: User }) {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-cream-50/95 backdrop-blur">
      <div className="mx-auto grid max-w-6xl grid-cols-3 items-center gap-4 px-6 py-5">
        <nav className="hidden items-center gap-7 text-xs uppercase tracking-widest text-ink-600 md:flex">
          <Link href="/" className="hover:text-ink-900">Home</Link>
          <Link href="/products" className="hover:text-ink-900">Shop</Link>
          <Link href="/#how-it-works" className="hover:text-ink-900">How it works</Link>
        </nav>

        <Link
          href="/"
          className="col-span-2 text-center font-serif text-2xl font-medium tracking-wide text-ink-900 md:col-span-1"
        >
          Paws<span className="italic text-emerald-800">Rescue</span>
        </Link>

        <div className="flex items-center justify-end gap-5 text-xs uppercase tracking-widest text-ink-600">
          <Link href="/about" className="hidden hover:text-ink-900 md:inline">
            Our rescue
          </Link>
          {user?.role === "ADMIN" && (
            <>
              <Link href="/admin" className="hidden hover:text-ink-900 md:inline">
                Admin
              </Link>
              <form action={logoutAction}>
                <button type="submit" className="text-ink-500 hover:text-ink-900">
                  Sign out
                </button>
              </form>
            </>
          )}
          <Link
            href="/cart"
            className="relative inline-flex items-center gap-1.5 hover:text-ink-900"
          >
            Bag
            {cartCount > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-800 px-1.5 text-[10px] font-semibold text-cream-50">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
