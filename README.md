# 🐾 PetsRescue Shop

A simple full-stack dropshipping store for pet supplies, built with Next.js 14, Prisma, and SQLite.

## Features

- **Storefront**: Homepage, product catalog with category filter & search, product detail pages
- **Cart & Checkout**: Cookie-based cart, checkout with shipping form, order confirmation
- **Auth**: Register / Login / Logout with JWT cookie sessions (bcrypt hashed passwords)
- **User account**: Order history per user
- **Admin panel**: Dashboard, product CRUD, order management with status updates
- **Database**: SQLite via Prisma — zero setup needed

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env
# (or on Windows)
copy .env.example .env

# 3. Create the database
npx prisma db push

# 4. Seed sample products & admin user
npm run db:seed

# 5. Run the dev server
npm run dev
```

Visit http://localhost:3000.

**Admin credentials** (configurable in `.env`):
- Email: `admin@petsrescue.shop`
- Password: `admin123`

Login with these and navigate to `/admin`.

## Project structure

```
app/
  (auth)/             # login & register pages + server actions
  account/            # customer order history
  admin/              # admin dashboard, products & orders management
  cart/               # cart page + server actions
  checkout/           # checkout form & success page
  products/           # product list & detail pages
  layout.tsx          # root layout with navbar + footer
  page.tsx            # homepage

components/           # shared UI: Navbar, Footer, ProductCard, AddToCartButton
lib/                  # db client, auth helpers, cart helpers
prisma/               # schema.prisma + seed script
```

## Going to production

To launch this for real, replace these placeholders:

1. **Database**: Swap SQLite for Postgres in `prisma/schema.prisma` (set `provider = "postgresql"`) and update `DATABASE_URL`.
2. **Payments**: The credit card option is a placeholder. Integrate [Stripe Checkout](https://docs.stripe.com/checkout/quickstart):
   - Add `stripe` to dependencies
   - Replace `placeOrderAction` in `app/checkout/actions.ts` with a Stripe Checkout Session creation
   - Add a webhook route at `app/api/stripe/webhook/route.ts` to mark orders as `PAID`
3. **Dropshipping fulfillment**: Use the `supplierUrl` field on products and integrate with a supplier API (CJ Dropshipping, Spocket, AliExpress) to forward orders.
4. **Email**: Send order confirmation emails via Resend, Postmark, or SendGrid.
5. **Secrets**: Generate a strong `JWT_SECRET` (`openssl rand -base64 48`) and rotate `ADMIN_PASSWORD`.
6. **Hosting**: Deploy to Vercel (Next.js native), Railway, or Fly.io.

## Scripts

| Command           | What it does                          |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Start dev server on port 3000         |
| `npm run build`   | Production build                      |
| `npm start`       | Run production server                 |
| `npm run db:push` | Sync database schema (no migration)   |
| `npm run db:seed` | Seed sample products + admin user     |
| `npm run db:studio` | Open Prisma Studio (DB GUI)         |
