"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import {
  readCart,
  writeCart,
  clearCart,
  cartKey,
  type CartLine,
} from "@/lib/cart";

async function getStockFor(productId: string, variantId: string | null) {
  if (variantId) {
    const v = await prisma.variant.findUnique({
      where: { id: variantId },
      select: { id: true, productId: true, stock: true },
    });
    if (!v || v.productId !== productId) return null;
    return v.stock;
  }
  const p = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, stock: true, active: true },
  });
  if (!p || !p.active) return null;
  return p.stock;
}

async function setLine(
  productId: string,
  variantId: string | null,
  mutate: (current: number) => number,
) {
  const stock = await getStockFor(productId, variantId);
  if (stock === null) return;

  const cart = await readCart();
  const key = cartKey(productId, variantId);
  const idx = cart.findIndex((l) => cartKey(l.productId, l.variantId) === key);
  const currentQty = idx >= 0 ? cart[idx]!.quantity : 0;
  let next = mutate(currentQty);
  if (next < 0) next = 0;
  if (next > stock) next = stock;

  if (next === 0) {
    if (idx >= 0) cart.splice(idx, 1);
  } else {
    const entry: CartLine = { productId, variantId, quantity: next };
    if (idx >= 0) cart[idx] = entry;
    else cart.push(entry);
  }
  await writeCart(cart);
}

export async function addToCart(
  productId: string,
  variantId: string | null,
  quantity: number = 1,
) {
  await setLine(productId, variantId, (cur) => cur + quantity);
  revalidatePath("/cart");
  revalidatePath("/");
}

export async function updateQuantity(
  productId: string,
  variantId: string | null,
  quantity: number,
) {
  await setLine(productId, variantId, () => quantity);
  revalidatePath("/cart");
}

export async function removeFromCart(
  productId: string,
  variantId: string | null,
) {
  await setLine(productId, variantId, () => 0);
  revalidatePath("/cart");
}

export async function emptyCart() {
  await clearCart();
  revalidatePath("/cart");
  revalidatePath("/", "layout");
}
