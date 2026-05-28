import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatMoney } from "@/lib/money";
import { HeroCarousel } from "@/components/HeroCarousel";

export default async function HomePage() {
  const product = await prisma.product.findFirst({
    where: { active: true },
    orderBy: { featured: "desc" },
  });

  return (
    <div>
      {/* HERO */}
      <section className="relative">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 md:grid-cols-2 md:py-28">
          <div className="md:order-2">
            <HeroCarousel
              images={[
                product?.image ??
                  "https://images.unsplash.com/photo-1514984879728-be0aff75a6e8?w=1200&q=85",
                "https://images.unsplash.com/photo-1530041539828-114de669390e?w=1200&q=85",
                "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=1200&q=85",
                "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=1200&q=85",
              ]}
            />
          </div>
          <div className="md:order-1">
            <p className="eyebrow">A keepsake that gives back</p>
            <h1 className="mt-4 font-serif text-5xl font-normal leading-[1.05] text-ink-900 md:text-6xl">
              Honor your pet.<br />
              <span className="italic text-emerald-700">Help us rescue more.</span>
            </h1>
            <div className="rule mt-6" />
            <p className="mt-6 max-w-md text-base leading-relaxed text-ink-500">
              A collection of 3D laser-engraved crystals — hand-finished and
              made to last a lifetime. Every order helps us feed, treat and
              rehome more animals.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href={product ? `/products/${product.slug}` : "/products"}
                className="btn-primary"
              >
                {product ? `Order yours — ${formatMoney(product.price)}` : "Shop now"}
              </Link>
              <Link href="#how-it-works" className="link-underline text-sm">
                How it works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="border-y border-ink-100 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="text-center">
            <p className="eyebrow">How it works</p>
            <h2 className="section-title mt-2">From our shelf to yours</h2>
            <div className="rule mx-auto mt-5" />
          </div>
          <div className="mt-14 grid grid-cols-1 gap-12 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Choose your design",
                body: "Browse our collection of 3D laser-engraved crystals. Each design is unique — pick the one that speaks to you.",
              },
              {
                step: "02",
                title: "Hand-finished & packaged",
                body: "Every crystal is inspected by hand and carefully packaged in a protective gift box, ready to display or give.",
              },
              {
                step: "03",
                title: "Ships in 7–14 days",
                body: "Delivered to your door across the United States. A keepsake that lasts a lifetime — and helps more animals.",
              },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-emerald-700 font-serif text-sm text-emerald-700">
                  {s.step}
                </div>
                <h3 className="mt-5 font-serif text-xl text-ink-900">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-500">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR RESCUE STORY */}
      <section id="story" className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden bg-cream-100">
            <Image
              src="https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=1200&q=85"
              alt="A rescued dog"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 600px"
            />
          </div>
          <div>
            <p className="eyebrow">Why we do this</p>
            <h2 className="section-title mt-2">
              For the ones who<br />
              <em className="not-italic italic text-emerald-700">need us most.</em>
            </h2>
            <div className="rule mt-6" />
            <p className="mt-6 leading-relaxed text-ink-500">
              PetsRescue began as a personal mission — feeding, treating and
              rehoming animals one at a time. It&apos;s not a registered
              charity. It&apos;s one person, a lot of strays, and a promise to
              help where we can.
            </p>
            <p className="mt-4 leading-relaxed text-ink-500">
              Your purchase keeps that work going. Food, vet bills, transport
              to safe homes — every order makes the next rescue possible.
            </p>
            <Link href="/about" className="mt-8 inline-block link-underline text-sm">
              Read the full story →
            </Link>
          </div>
        </div>
      </section>

      {/* IMPACT */}
      <section id="impact" className="border-t border-ink-100 bg-cream-100">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="text-center">
            <p className="eyebrow">Your impact</p>
            <h2 className="section-title mt-2">What your order does</h2>
            <div className="rule mx-auto mt-5" />
          </div>
          <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-3">
            {[
              {
                title: "Feeds a stray for a week",
                body: "Quality food for the dogs and cats living on the street.",
              },
              {
                title: "Pays for vet care",
                body: "Vaccines, basic treatment, and emergency vet visits for rescued animals.",
              },
              {
                title: "Helps find a home",
                body: "Transport, fostering and the small things that turn a stray into a family member.",
              },
            ].map((p) => (
              <div key={p.title} className="text-center">
                <h3 className="font-serif text-xl text-ink-900">{p.title}</h3>
                <div className="rule mx-auto my-3" />
                <p className="text-sm text-ink-500">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-6 py-24">
        <div className="text-center">
          <p className="eyebrow">FAQ</p>
          <h2 className="section-title mt-2">Things people ask</h2>
          <div className="rule mx-auto mt-5" />
        </div>
        <dl className="mt-12 divide-y divide-ink-100 border-y border-ink-100">
          {[
            {
              q: "How long does it take?",
              a: "Most orders ship within 7–14 days. You'll get a tracking link by email as soon as your crystal is on its way.",
            },
            {
              q: "Do you ship to all 50 US states?",
              a: "Yes — we currently ship across the United States only.",
            },
            {
              q: "How is the crystal made?",
              a: "Each piece is K9 optical crystal with a 3D image laser-engraved inside. The image appears suspended within the crystal — no surface etching, no fading over time.",
            },
            {
              q: "How much of my purchase goes to the rescue?",
              a: "Our work is funded entirely by these orders. After production and shipping, what remains goes directly to feeding, treating and rehoming animals.",
            },
            {
              q: "Is this a registered nonprofit?",
              a: "No. PetsRescue is a personal initiative — not a registered charity. We're upfront about that so you know exactly what you're supporting.",
            },
          ].map((f) => (
            <div key={f.q} className="py-6">
              <dt className="font-serif text-lg text-ink-900">{f.q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-ink-500">
                {f.a}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* FINAL CTA */}
      <section className="border-t border-ink-100 bg-ink-900 text-cream-50">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <p className="text-xs uppercase tracking-widest text-emerald-400">
            One photo · one crystal · one rescued life
          </p>
          <h2 className="mt-4 font-serif text-4xl text-cream-50 md:text-5xl">
            Order yours today.
          </h2>
          <div className="mx-auto mt-5 h-px w-12 bg-cream-50/30" />
          <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-cream-100/80">
            A keepsake of your pet. A gift to another. Made to last forever.
          </p>
          <div className="mt-10">
            <Link
              href={product ? `/products/${product.slug}` : "/products"}
              className="inline-flex items-center justify-center bg-cream-50 px-8 py-3 text-sm font-medium tracking-wide text-ink-900 transition hover:bg-cream-200"
            >
              {product ? `Order — ${formatMoney(product.price)}` : "Shop now"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
