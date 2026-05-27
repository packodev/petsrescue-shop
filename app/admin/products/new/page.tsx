import { prisma } from "@/lib/db";
import { ProductForm } from "../ProductForm";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">New product</h2>
      <ProductForm categories={categories} />
    </div>
  );
}
