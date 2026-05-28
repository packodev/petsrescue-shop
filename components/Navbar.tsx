import Link from "next/link";
import { logoutAction } from "@/app/(auth)/actions";

type User = { id: string; email: string; name: string | null; role: string } | null;

export function Navbar({ cartCount, user }: { cartCount: number; user: User }) {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-cream-50/95 backdrop-blur">
      <div className="mx-auto grid max-w-6xl grid-cols-3 items-center gap-4 px-6 py-5">
        <nav className="hidden items-center gap-7 text-xs uppercase tracking-widest text-ink-600 md:flex">
          <Link href="/products" className="hover:text-ink-900">Shop</Link>
          <Link href="/#how-it-works" className="hover:text-ink-900">How it works</Link>
          <Link href="/about" className="hover:text-ink-900">Our rescue</Link>
        </nav>

        <Link
          href="/"
          className="col-span-2 text-center font-serif text-2xl font-medium tracking-wide text-ink-900 md:col-span-1"
        >
          Pets<span className="italic text-amber-700">Rescue</span>
        </Link>

        <div className="flex items-center justify-end gap-5 text-xs uppercase tracking-widest text-ink-600">
          {user ? (
            <>
              {user.role === "ADMIN" && (
                <Link href="/admin" className="hidden hover:text-ink-900 md:inline">
                  Admin
                </Link>
              )}
              <Link href="/account" className="hidden hover:text-ink-900 sm:inline">
                Account
              </Link>
              <form action={logoutAction}>
                <button type="submit" className="text-ink-500 hover:text-ink-900">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-ink-900">Sign in</Link>
            </>
          )}
          <Link
            href="/cart"
            className="relative inline-flex items-center gap-1.5 hover:text-ink-900"
          >
            Bag
            {cartCount > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-700 px-1.5 text-[10px] font-semibold text-cream-50">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
