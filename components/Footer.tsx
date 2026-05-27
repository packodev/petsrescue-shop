import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-ink-100 bg-cream-100">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="font-serif text-2xl text-ink-900">
              PetsRescue<span className="ml-1 italic text-emerald-700">Co.</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-500">
              Hand-engraved keepsakes for the people who love their dogs most.
              Crafted with care, made to last a lifetime.
            </p>
          </div>
          <div className="md:col-span-2">
            <h4 className="eyebrow mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-ink-600">
              <li><Link href="/products" className="hover:text-ink-900">All</Link></li>
              <li><Link href="/products?category=dogs" className="hover:text-ink-900">For dogs</Link></li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <h4 className="eyebrow mb-4">Help</h4>
            <ul className="space-y-2 text-sm text-ink-600">
              <li>Shipping</li>
              <li>Returns</li>
              <li>Contact</li>
            </ul>
          </div>
          <div className="md:col-span-3">
            <h4 className="eyebrow mb-4">Stay in the loop</h4>
            <p className="mb-3 text-sm text-ink-500">
              Receive new releases and stories from the studio.
            </p>
            <form className="flex border-b border-ink-300">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 bg-transparent py-2 text-sm placeholder:text-ink-400 focus:outline-none"
              />
              <button
                type="button"
                className="text-xs uppercase tracking-widest text-ink-700 hover:text-ink-900"
              >
                Join →
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="border-t border-ink-100 py-5">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 text-[11px] uppercase tracking-widest text-ink-400 md:flex-row">
          <span>© {new Date().getFullYear()} PetsRescue Co.</span>
          <span>Hand-crafted in small batches</span>
        </div>
      </div>
    </footer>
  );
}
