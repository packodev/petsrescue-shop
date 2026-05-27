import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categories = [
  { name: "Dogs", slug: "dogs" },
];

const variants = [
  {
    name: "Classic Paw Print",
    image:
      "https://images.unsplash.com/photo-1514984879728-be0aff75a6e8?w=800&q=80",
    sortOrder: 0,
  },
  {
    name: "Custom Name Engraving",
    image:
      "https://images.unsplash.com/photo-1530041539828-114de669390e?w=800&q=80",
    sortOrder: 1,
  },
  {
    name: "Breed Silhouette",
    image:
      "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=800&q=80",
    sortOrder: 2,
  },
];

async function main() {
  console.log("Resetting database...");

  // Clear in dependency order
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

  const dogs = await prisma.category.findUniqueOrThrow({
    where: { slug: "dogs" },
  });

  console.log("Seeding product...");
  const product = await prisma.product.create({
    data: {
      slug: "custom-engraved-glass-for-dogs",
      name: "Custom Engraved Glass for Dog Lovers",
      description:
        "Premium hand-engraved drinking glass for proud dog owners. Each glass is laser-engraved with a beautiful design celebrating your bond with your furry friend. Dishwasher safe, holds 12 oz / 350 ml. Makes the perfect gift for any dog lover.",
      price: 29.99,
      compareAt: 39.99,
      stock: 100,
      image:
        "https://images.unsplash.com/photo-1514984879728-be0aff75a6e8?w=800&q=80",
      active: true,
      featured: true,
      categoryId: dogs.id,
      variants: {
        create: variants.map((v) => ({
          name: v.name,
          image: v.image,
          stock: 100,
          sortOrder: v.sortOrder,
        })),
      },
    },
  });

  console.log(`Product created: ${product.slug}`);

  // Admin user
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

  console.log(`Done. Admin: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
