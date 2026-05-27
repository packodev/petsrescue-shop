import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/ProductCard";

export default async function HomePage() {
  const featured = await prisma.product.findMany({
    where: { featured: true, active: true },
    take: 4,
    orderBy: { createdAt: "desc" },
    include: { variants: { orderBy: { sortOrder: "asc" }, take: 1 } },
  });

  return (
    <div>
      {/* HERO */}
      <section className="relative">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 md:grid-cols-2 md:py-28">
          <div className="md:order-2">
            <div className="relative aspect-[4/5] overflow-hidden bg-cream-100 shadow-sm">
              <Image
                src="https://images.unsplash.com/photo-1514984879728-be0aff75a6e8?w=1200&q=85"
                alt="Hand-engraved glass"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 600px"
              />
            </div>
          </div>
          <div className="md:order-1">
            <p className="eyebrow">A keepsake collection</p>
            <h1 className="mt-4 font-serif text-5xl font-normal leading-[1.05] text-ink-900 md:text-6xl">
              For the love<br />
              <span className="italic text-emerald-700">of a good dog.</span>
            </h1>
            <div className="rule mt-6" />
            <p className="mt-6 max-w-md text-base leading-relaxed text-ink-500">
              Each glass is hand-engraved in small batches — a quiet tribute to
              the companion who knows you best. Hold it close, refill it often.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/products" className="btn-primary">
                Shop the collection
              </Link>
              <Link href="#story" className="link-underline text-sm">
                Read our story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCT */}
      <section className="border-y border-ink-100 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="eyebrow">The collection</p>
              <h2 className="section-title mt-2">Crafted to be cherished</h2>
            </div>
            <Link
              href="/products"
              className="hidden text-xs uppercase tracking-widest text-ink-600 hover:text-ink-900 md:inline-flex"
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard
                key={p.id}
                product={{
                  slug: p.slug,
                  name: p.name,
                  price: p.price,
                  compareAt: p.compareAt,
                  image: p.image,
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* STORY */}
      <section id="story" className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden bg-cream-100">
            <Image
              src="https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=1200&q=85"
              alt="The studio"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 600px"
            />
          </div>
          <div>
            <p className="eyebrow">Our story</p>
            <h2 className="section-title mt-2">
              A small studio,<br />
              <em className="not-italic text-emerald-700 italic">a lasting craft.</em>
            </h2>
            <div className="rule mt-6" />
            <p className="mt-6 leading-relaxed text-ink-500">
              We started PetsRescue Co. to honor the quiet, daily love between
              a dog and their person. Every piece is engraved by hand, finished
              individually, and packed with a story card. No two are exactly
              alike — just as it should be.
            </p>
            <p className="mt-4 leading-relaxed text-ink-500">
              A portion of every order is donated to local rescue shelters.
            </p>
          </div>
        </div>
      </section>

      {/* PROMISES */}
      <section className="border-t border-ink-100 bg-cream-100">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-16 md:grid-cols-3">
          {[
            {
              title: "Hand-engraved",
              body: "Crafted in small batches in our studio.",
            },
            {
              title: "Worldwide delivery",
              body: "Carefully packed and shipped to 100+ countries.",
            },
            {
              title: "Lifetime promise",
              body: "Loved your piece? We stand behind every engraving.",
            },
          ].map((p) => (
            <div key={p.title} className="text-center">
              <h3 className="font-serif text-xl text-ink-900">{p.title}</h3>
              <div className="rule mx-auto my-3" />
              <p className="text-sm text-ink-500">{p.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
