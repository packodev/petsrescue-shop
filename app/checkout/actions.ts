"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { getCartWithProducts } from "@/lib/cart";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const checkoutSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(2, "Please enter your full name"),
  address: z.string().min(4, "Please enter a valid address"),
  city: z.string().min(2),
  postalCode: z.string().min(2),
  country: z.string().min(2),
  phone: z.string().min(4),
  notes: z.string().max(500).optional(),
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
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { items, subtotal } = await getCartWithProducts();
  if (items.length === 0) {
    return { error: "Your cart is empty" };
  }

  const shipping = 0;
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
      paymentMethod: "CARD",
      subtotal,
      shipping,
      total,
      status: "PENDING",
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

  const h = headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${proto}://${host}`;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: parsed.data.email,
    line_items: [
      ...items.map((i) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: i.variantName ? `${i.name} — ${i.variantName}` : i.name,
            images: i.image ? [i.image] : undefined,
          },
          unit_amount: Math.round(i.price * 100),
        },
        quantity: i.quantity,
      })),
    ],
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: 0, currency: "usd" },
          display_name: "Free standard shipping (7–14 days)",
        },
      },
    ],
    success_url: `${origin}/checkout/success?id=${order.id}`,
    cancel_url: `${origin}/checkout?canceled=1`,
    metadata: { orderId: order.id },
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { stripeSessionId: session.id },
  });

  if (!session.url) {
    return { error: "Could not start payment. Please try again." };
  }
  redirect(session.url);
}
