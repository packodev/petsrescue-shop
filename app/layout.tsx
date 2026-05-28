import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getCartWithProducts } from "@/lib/cart";
import { getCurrentUser } from "@/lib/auth";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PetsRescue — Honor your pet, help us rescue more",
  description:
    "Custom 3D crystals laser-engraved with your pet's photo. Every order supports our rescue work — feeding, treating, and rehoming pets in need.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cart, user] = await Promise.all([
    getCartWithProducts(),
    getCurrentUser(),
  ]);

  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body className="flex min-h-screen flex-col font-sans">
        <div className="bg-ink-900 py-2 text-center text-[11px] uppercase tracking-widest text-cream-100">
          Every order helps us rescue, feed & rehome more pets 🐾
        </div>
        <Navbar cartCount={cart.count} user={user} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
