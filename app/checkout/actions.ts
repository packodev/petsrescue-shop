"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { clearCart, getCartWithProducts } from "@/lib/cart";

const checkoutSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(2, "Please enter your full name"),
  address: z.string().min(4, "Please enter a valid address"),
  city: z.string().min(2),
  postalCode: z.string().min(2),
  country: z.string().min(2),
  phone: z.string().min(4),
  notes: z.string().max(500).optional(),
  paymentMethod: z.enum(["COD", "CARD"]),
});

export type CheckoutState = { error?: string } | undefined;

export async function placeOrderAction(
  _prev: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const parsed = checkoutSchema.safeParse({
    email: formData.get("email"),
    fullName: formData.get("fullName"),
    address: formData.get("address"),
    city: formData.get("city"),
    postalCode: formData.get("postalCode"),
    country: formData.get("country"),
    phone: formData.get("phone"),
    notes: formData.get("notes") || undefined,
    paymentMethod: formData.get("paymentMethod"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { items, subtotal } = await getCartWithProducts();
  if (items.length === 0) {
    return { error: "Your cart is empty" };
  }

  const shipping = subtotal >= 50 ? 0 : 7.99;
  const total = subtotal + shipping;

  const user = await getCurrentUser();

  const order = await prisma.order.create({
    data: {
      userId: user?.id,
      email: parsed.data.email,
      fullName: parsed.data.fullName,
      address: parsed.data.address,
      city: parsed.data.city,
      postalCode: parsed.data.postalCode,
      country: parsed.data.country,
      phone: parsed.data.phone,
      notes: parsed.data.notes,
      paymentMethod: parsed.data.paymentMethod,
      subtotal,
      shipping,
      total,
      status: parsed.data.paymentMethod === "CARD" ? "PAID" : "PENDING",
      items: {
        create: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          name: i.name,
          variantName: i.variantName,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
        })),
      },
    },
  });

  // Decrement stock (best-effort; demo doesn't use transactions on SQLite for simplicity)
  for (const i of items) {
    if (i.variantId) {
      await prisma.variant.update({
        where: { id: i.variantId },
        data: { stock: { decrement: i.quantity } },
      });
    } else {
      await prisma.product.update({
        where: { id: i.productId },
        data: { stock: { decrement: i.quantity } },
      });
    }
  }

  await clearCart();
  revalidatePath("/");
  revalidatePath("/account");
  redirect(`/checkout/success?id=${order.id}`);
}
