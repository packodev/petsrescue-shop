import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
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

const serif = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PetsRescue — Pet-themed puzzles that help us rescue more",
  description:
    "Beautifully illustrated pet puzzles in multiple designs and three sizes. Every order supports our rescue work — feeding, treating, and rehoming pets in need.",
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
        <div className="bg-amber-700 py-2 text-center text-[11px] font-medium uppercase tracking-wider text-cream-50">
          Every order helps us rescue, feed & rehome more pets 🐾
        </div>
        <Navbar cartCount={cart.count} user={user} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
