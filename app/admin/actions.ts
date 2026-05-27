"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

const productSchema = z.object({
  id: z.string().optional(),
  slug: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and dashes only"),
  name: z.string().min(2).max(120),
  description: z.string().min(2).max(2000),
  price: z.coerce.number().positive(),
  compareAt: z.coerce.number().positive().optional().nullable(),
  stock: z.coerce.number().int().min(0),
  image: z.string().url(),
  categoryId: z.string().min(1),
  active: z.coerce.boolean().optional(),
  featured: z.coerce.boolean().optional(),
  supplierUrl: z.string().url().optional().or(z.literal("")),
});

export type ProductFormState = { error?: string } | undefined;

export async function saveProductAction(
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireAdmin();

  const parsed = productSchema.safeParse({
    id: formData.get("id") || undefined,
    slug: formData.get("slug"),
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    compareAt: formData.get("compareAt") || null,
    stock: formData.get("stock"),
    image: formData.get("image"),
    categoryId: formData.get("categoryId"),
    active: formData.get("active") === "on",
    featured: formData.get("featured") === "on",
    supplierUrl: formData.get("supplierUrl") || "",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const data = parsed.data;
  const payload = {
    slug: data.slug,
    name: data.name,
    description: data.description,
    price: data.price,
    compareAt: data.compareAt ?? null,
    stock: data.stock,
    image: data.image,
    categoryId: data.categoryId,
    active: data.active ?? true,
    featured: data.featured ?? false,
    supplierUrl: data.supplierUrl || null,
  };

  if (data.id) {
    await prisma.product.update({ where: { id: data.id }, data: payload });
  } else {
    const existing = await prisma.product.findUnique({ where: { slug: data.slug } });
    if (existing) return { error: "A product with that slug already exists" };
    await prisma.product.create({ data: payload });
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id");
  if (typeof id !== "string") return;
  await prisma.product.update({ where: { id }, data: { active: false } });
  revalidatePath("/admin/products");
  revalidatePath("/products");
}

const variantSchema = z.object({
  id: z.string().optional(),
  productId: z.string().min(1),
  name: z.string().min(1).max(80),
  image: z.string().url(),
  priceOverride: z.coerce.number().positive().optional().nullable(),
  stock: z.coerce.number().int().min(0),
  sortOrder: z.coerce.number().int().min(0).optional(),
});

export type VariantFormState = { error?: string; ok?: boolean } | undefined;

export async function saveVariantAction(
  _prev: VariantFormState,
  formData: FormData,
): Promise<VariantFormState> {
  await requireAdmin();

  const parsed = variantSchema.safeParse({
    id: formData.get("id") || undefined,
    productId: formData.get("productId"),
    name: formData.get("name"),
    image: formData.get("image"),
    priceOverride: formData.get("priceOverride") || null,
    stock: formData.get("stock"),
    sortOrder: formData.get("sortOrder") || 0,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const data = parsed.data;
  const payload = {
    productId: data.productId,
    name: data.name,
    image: data.image,
    priceOverride: data.priceOverride ?? null,
    stock: data.stock,
    sortOrder: data.sortOrder ?? 0,
  };

  if (data.id) {
    await prisma.variant.update({ where: { id: data.id }, data: payload });
  } else {
    await prisma.variant.create({ data: payload });
  }
  revalidatePath(`/admin/products/${data.productId}`);
  revalidatePath("/products");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteVariantAction(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id");
  const productId = formData.get("productId");
  if (typeof id !== "string" || typeof productId !== "string") return;
  await prisma.variant.delete({ where: { id } });
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/products");
}

const statusSchema = z.enum([
  "PENDING",
  "PAID",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
]);

export async function updateOrderStatusAction(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id");
  const status = statusSchema.safeParse(formData.get("status"));
  if (typeof id !== "string" || !status.success) return;
  await prisma.order.update({
    where: { id },
    data: { status: status.data },
  });
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
}
