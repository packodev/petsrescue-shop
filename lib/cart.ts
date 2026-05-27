import { cookies } from "next/headers";
import { prisma } from "./db";

export { formatMoney } from "./money";

const CART_COOKIE = "cart";

export type CartLine = {
  productId: string;
  variantId: string | null;
  quantity: number;
};

export function cartKey(productId: string, variantId: string | null) {
  return `${productId}:${variantId ?? ""}`;
}

export async function readCart(): Promise<CartLine[]> {
  const raw = cookies().get(CART_COOKIE)?.value;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (x) =>
          x &&
          typeof x.productId === "string" &&
          typeof x.quantity === "number" &&
          x.quantity > 0,
      )
      .map((x) => ({
        productId: String(x.productId),
        variantId:
          typeof x.variantId === "string" && x.variantId.length > 0
            ? x.variantId
            : null,
        quantity: x.quantity,
      }))
      .slice(0, 50);
  } catch {
    return [];
  }
}

export async function writeCart(items: CartLine[]) {
  cookies().set(CART_COOKIE, JSON.stringify(items), {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearCart() {
  cookies().delete(CART_COOKIE);
}

export async function getCartWithProducts() {
  const lines = await readCart();
  if (lines.length === 0) {
    return { items: [], subtotal: 0, count: 0 };
  }
  const productIds = Array.from(new Set(lines.map((l) => l.productId)));
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, active: true },
    include: { variants: true },
  });

  const items = lines
    .map((l) => {
      const p = products.find((x) => x.id === l.productId);
      if (!p) return null;
      const variant = l.variantId
        ? p.variants.find((v) => v.id === l.variantId)
        : null;
      if (l.variantId && !variant) return null;

      const price = variant?.priceOverride ?? p.price;
      const image = variant?.image ?? p.image;
      const stock = variant?.stock ?? p.stock;
      const variantName = variant?.name ?? null;

      return {
        productId: p.id,
        variantId: variant?.id ?? null,
        slug: p.slug,
        name: p.name,
        variantName,
        price,
        image,
        quantity: l.quantity,
        lineTotal: price * l.quantity,
        stock,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);
  return { items, subtotal, count };
}

