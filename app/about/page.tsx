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
