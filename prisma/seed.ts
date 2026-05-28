import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categories = [{ name: "Puzzles", slug: "puzzles" }];

// Each design gets these three size variants. priceOverride is what the
// customer actually pays for that size; the base Product.price below is
// the small (default) price so listing pages still show a sensible number.
const sizes = [
  { name: "Small — 300 pieces", priceOverride: 19.99, sortOrder: 0 },
  { name: "Medium — 500 pieces", priceOverride: 29.99, sortOrder: 1 },
  { name: "Large — 1,000 pieces", priceOverride: 39.99, sortOrder: 2 },
];

const designs = [
  {
    slug: "golden-retriever-sunset",
    name: "Golden Retriever at Sunset",
    description:
      "A warm portrait of a golden retriever bathed in late afternoon light. Printed on premium cardboard with eco-friendly inks. Ships in a gift-ready box.",
    image:
      "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=1200&q=85",
    featured: true,
  },
  {
    slug: "three-cats-tea-party",
    name: "Three Cats Tea Party",
    description:
      "A whimsical illustration of three cats sharing tea around a tiny table. Detailed, screen-free fun for cat lovers of every age.",
    image:
      "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=1200&q=85",
    featured: false,
  },
  {
    slug: "sleeping-puppies",
    name: "Sleeping Puppies",
    description:
      "A peaceful scene of puppies curled up together. Soft, warm tones that feel like an afternoon nap.",
    image:
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=1200&q=85",
    featured: false,
  },
  {
    slug: "cat-in-the-garden",
    name: "Cat in the Garden",
    description:
      "A curious cat exploring a sunlit garden. Full of small details that reward patient assembly.",
    image:
      "https://images.unsplash.com/photo-1514984879728-be0aff75a6e8?w=1200&q=85",
    featured: false,
  },
];

async function main() {
  console.log("Resetting database...");

  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.variant.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});

  console.log("Seeding categories...");
  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name },
      create: c,
    });
  }

  const puzzles = await prisma.category.findUniqueOrThrow({
    where: { slug: "puzzles" },
  });

  console.log("Seeding puzzle designs...");
  for (const d of designs) {
    const product = await prisma.product.create({
      data: {
        slug: d.slug,
        name: d.name,
        description: d.description,
        price: sizes[0]!.priceOverride, // small price as the listing price
        stock: 100,
        image: d.image,
        active: true,
        featured: d.featured,
        categoryId: puzzles.id,
        variants: {
          create: sizes.map((s) => ({
            name: s.name,
            image: d.image,
            priceOverride: s.priceOverride,
            stock: 100,
            sortOrder: s.sortOrder,
          })),
        },
      },
    });
    console.log(`  ✓ ${product.slug} (with ${sizes.length} sizes)`);
  }

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@petsrescue.shop";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123";
  const hashed = await bcrypt.hash(adminPassword, 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "ADMIN", password: hashed, name: "Admin" },
    create: {
      email: adminEmail,
      password: hashed,
      name: "Admin",
      role: "ADMIN",
    },
  });

  console.log(`\nDone. Admin: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
