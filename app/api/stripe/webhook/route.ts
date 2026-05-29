import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";
import {
  sendOrderConfirmationEmail,
  sendAdminNotificationEmail,
} from "@/lib/email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Stripe requires the raw request body to verify the signature, so disable
// any body parsing or caching on this route.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET not configured" },
      { status: 500 },
    );
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ error: `Invalid signature: ${msg}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    if (orderId && session.payment_status === "paid") {
      const order = await prisma.order.update({
        where: { id: orderId },
        data: { status: "PAID" },
        include: { items: true },
      });

      const emailPayload = {
        id: order.id,
        email: order.email,
        fullName: order.fullName,
        address: order.address,
        city: order.city,
        postalCode: order.postalCode,
        country: order.country,
        phone: order.phone,
        subtotal: order.subtotal,
        shipping: order.shipping,
        total: order.total,
        items: order.items.map((i) => ({
          name: i.name,
          variantName: i.variantName,
          quantity: i.quantity,
          price: i.price,
          image: i.image,
        })),
      };

      // Fire both emails in parallel; failures are swallowed inside the
      // email helpers so a Resend outage cannot block the webhook 200
      // and trigger Stripe to retry endlessly.
      await Promise.all([
        sendOrderConfirmationEmail(emailPayload),
        sendAdminNotificationEmail(emailPayload),
      ]);
    }
  }

  return NextResponse.json({ received: true });
}
