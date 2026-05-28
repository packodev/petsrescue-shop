import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatMoney } from "@/lib/money";

export const metadata = {
  title: "Our rescue — PetsRescue",
  description:
    "The story behind PetsRescue — a personal mission to feed, treat and rehome animals in need.",
};

export default async function AboutPage() {
  const product = await prisma.product.findFirst({
    where: { active: true },
    orderBy: { featured: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <header className="text-center">
        <p className="eyebrow">Our rescue</p>
        <h1 className="section-title mt-2">A personal mission</h1>
        <div className="rule mx-auto mt-5" />
      </header>

      {/* OPENING STORY */}
      <section className="mt-16 space-y-6 text-base leading-relaxed text-ink-600">
        <p>
          PetsRescue isn&apos;t a registered charity. It isn&apos;t a big
          organization. It started the way most rescue work does — one
          animal at a time, with whatever resources were at hand.
        </p>
        <p>
          For years, that meant putting out food for strays in the
          neighborhood. Taking sick ones to the vet. Posting photos on social
          media until someone said yes. Driving across the city to deliver a
          puppy to a family who had been waiting months.
        </p>
        <p>
          Most of those costs came out of our own pocket. The orders from
          this shop are what makes it sustainable — so we can help more
          animals, more consistently, without running out of money halfway
          through a vet bill.
        </p>
      </section>

      {/* PHOTO PLACEHOLDER */}
      <div className="my-16 grid grid-cols-2 gap-3 md:grid-cols-3">
        {[
          "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=800&q=80",
          "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80",
          "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=800&q=80",
        ].map((src) => (
          <div
            key={src}
            className="relative aspect-square overflow-hidden bg-cream-100"
          >
            <Image
              src={src}
              alt="Rescued pet"
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
      <p className="-mt-10 text-center text-xs italic text-ink-400">
        Photos are placeholders. Real photos of rescued animals will appear here.
      </p>

      {/* WHAT YOUR ORDER DOES */}
      <section className="mt-20">
        <h2 className="section-title text-center">What your order does</h2>
        <div className="rule mx-auto mt-5" />
        <div className="mt-10 space-y-6 text-base leading-relaxed text-ink-600">
          <p>
            When you order a puzzle, you&apos;re paying for two things at
            once: a beautifully illustrated pet puzzle, and the continuation
            of this rescue work. After we cover the cost of the puzzle
            itself and shipping it to you, what&apos;s left goes directly to
            the animals.
          </p>
          <p>That means:</p>
          <ul className="ml-6 list-disc space-y-2 text-ink-600">
            <li>Food for strays who&apos;d otherwise go hungry</li>
            <li>Vet care — vaccines, treatment, emergency visits</li>
            <li>Transport and fostering for animals being rehomed</li>
            <li>Spay/neuter to break the cycle long-term</li>
          </ul>
          <p>
            There&apos;s no overhead, no salaries, no fancy office. Every
            dollar is accounted for because there&apos;s only one person
            accounting for it.
          </p>
        </div>
      </section>

      {/* HONEST DISCLOSURE */}
      <section className="mt-20 border border-ink-200 bg-cream-100 p-8">
        <h3 className="font-serif text-lg text-ink-900">Being honest with you</h3>
        <div className="rule mt-4" />
        <div className="mt-5 space-y-4 text-sm leading-relaxed text-ink-600">
          <p>
            PetsRescue is <strong>not</strong> a registered nonprofit, which
            means your purchase is <strong>not</strong> tax-deductible. We
            don&apos;t have official rescue numbers or audited financials to
            show you — because we&apos;re an individual, not an institution.
          </p>
          <p>
            What you&apos;re supporting is a person who spends their time and
            money helping animals, and uses this shop to make that work
            possible. We think being upfront about that matters more than
            pretending to be something we&apos;re not.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-20 text-center">
        <h2 className="section-title">Ready to help?</h2>
        <div className="rule mx-auto mt-5" />
        <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-ink-500">
          Pick a puzzle from our collection. Get a quiet afternoon — and help
          another animal find a home.
        </p>
        <div className="mt-8">
          <Link
            href={product ? `/products/${product.slug}` : "/products"}
            className="btn-primary"
          >
            {product ? `Order — ${formatMoney(product.price)}` : "Shop now"}
          </Link>
        </div>
      </section>
    </div>
  );
}
