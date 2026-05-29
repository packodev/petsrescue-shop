import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-ink-100 bg-cream-100">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="font-serif text-2xl text-ink-900">
              Paws<span className="italic text-emerald-800">Rescue</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-500">
              Beautifully illustrated pet puzzles in multiple designs and
              three sizes. Every order helps us feed, treat and rehome more
              animals in need.
            </p>
          </div>
          <div className="md:col-span-2">
            <h4 className="eyebrow mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-ink-600">
              <li><Link href="/products" className="hover:text-ink-900">All puzzles</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-ink-900">How it works</Link></li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <h4 className="eyebrow mb-4">About</h4>
            <ul className="space-y-2 text-sm text-ink-600">
              <li><Link href="/about" className="hover:text-ink-900">Our rescue</Link></li>
              <li><Link href="/#impact" className="hover:text-ink-900">Your impact</Link></li>
              <li><Link href="/#faq" className="hover:text-ink-900">FAQ</Link></li>
            </ul>
          </div>
          <div className="md:col-span-3">
            <h4 className="eyebrow mb-4">Stay in the loop</h4>
            <p className="mb-3 text-sm text-ink-500">
              Get rescue updates and stories from the pets we&apos;ve helped.
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
          <span>© {new Date().getFullYear()} PawsRescue — an individual rescue initiative</span>
          <span>Made with love for animals 🐾</span>
        </div>
      </div>
    </footer>
  );
}
