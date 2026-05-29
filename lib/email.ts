import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@thepawsrescuecenter.com";
const ADMIN_EMAIL = process.env.ADMIN_NOTIFY_EMAIL;
const SITE_URL = "https://thepawsrescuecenter.com";

export type OrderEmailData = {
  id: string;
  email: string;
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  subtotal: number;
  shipping: number;
  total: number;
  items: Array<{
    name: string;
    variantName: string | null;
    quantity: number;
    price: number;
    image: string;
  }>;
};

function formatMoney(amount: number) {
  return `$${amount.toFixed(2)}`;
}

function shortOrderId(id: string) {
  return id.slice(-8).toUpperCase();
}

export async function sendOrderConfirmationEmail(order: OrderEmailData) {
  if (!resend) {
    console.warn("RESEND_API_KEY not set — skipping order confirmation email");
    return;
  }
  try {
    await resend.emails.send({
      from: `PawsRescue <${FROM_EMAIL}>`,
      to: order.email,
      subject: `Your PawsRescue order #${shortOrderId(order.id)} is confirmed`,
      html: customerHtml(order),
    });
  } catch (err) {
    console.error("Failed to send order confirmation email:", err);
  }
}

export async function sendAdminNotificationEmail(order: OrderEmailData) {
  if (!resend) {
    console.warn("RESEND_API_KEY not set — skipping admin notification");
    return;
  }
  if (!ADMIN_EMAIL) {
    console.warn("ADMIN_NOTIFY_EMAIL not set — skipping admin notification");
    return;
  }
  try {
    await resend.emails.send({
      from: `PawsRescue Orders <${FROM_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `New order #${shortOrderId(order.id)} — ${formatMoney(order.total)}`,
      html: adminHtml(order),
    });
  } catch (err) {
    console.error("Failed to send admin notification email:", err);
  }
}

function itemsRowsHtml(order: OrderEmailData) {
  return order.items
    .map(
      (i) => `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #e7e5e1;">
            <div style="font-weight:600;color:#1c1a17;">${escape(i.name)}</div>
            ${
              i.variantName
                ? `<div style="font-size:12px;color:#736e64;margin-top:2px;">${escape(i.variantName)}</div>`
                : ""
            }
            <div style="font-size:12px;color:#a8a39a;margin-top:2px;">Qty ${i.quantity}</div>
          </td>
          <td style="padding:12px 0;border-bottom:1px solid #e7e5e1;text-align:right;color:#1c1a17;font-weight:600;">
            ${formatMoney(i.price * i.quantity)}
          </td>
        </tr>
      `,
    )
    .join("");
}

function customerHtml(order: OrderEmailData) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="margin:0;background:#fdfaf4;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#1c1a17;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fdfaf4;padding:40px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;">
        <tr>
          <td style="background:#174633;padding:32px 40px;text-align:center;">
            <div style="color:#fdfaf4;font-size:24px;font-weight:700;letter-spacing:0.5px;">Paws<span style="font-style:italic;color:#8bb59c;">Rescue</span></div>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <h1 style="margin:0 0 8px;font-size:24px;color:#0a0a09;">Thank you, ${escape(firstName(order.fullName))}.</h1>
            <p style="margin:0 0 24px;color:#4a463f;line-height:1.6;">
              Your order is confirmed. We'll send a tracking link as soon as it ships (usually within 7–14 days).
            </p>

            <div style="background:#faf5ea;border-radius:8px;padding:16px 20px;margin:0 0 24px;">
              <div style="font-size:12px;text-transform:uppercase;letter-spacing:1.5px;color:#736e64;">Order number</div>
              <div style="font-size:18px;font-weight:700;color:#1c1a17;margin-top:4px;">#${shortOrderId(order.id)}</div>
            </div>

            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
              ${itemsRowsHtml(order)}
              <tr>
                <td style="padding:12px 0;color:#4a463f;">Subtotal</td>
                <td style="padding:12px 0;text-align:right;color:#4a463f;">${formatMoney(order.subtotal)}</td>
              </tr>
              <tr>
                <td style="padding:0 0 12px;color:#4a463f;">Shipping</td>
                <td style="padding:0 0 12px;text-align:right;color:#4a463f;">${order.shipping === 0 ? "Free" : formatMoney(order.shipping)}</td>
              </tr>
              <tr>
                <td style="padding:12px 0;border-top:2px solid #1c1a17;font-size:18px;font-weight:700;color:#0a0a09;">Total</td>
                <td style="padding:12px 0;border-top:2px solid #1c1a17;font-size:18px;font-weight:700;text-align:right;color:#0a0a09;">${formatMoney(order.total)}</td>
              </tr>
            </table>

            <div style="background:#faf5ea;border-radius:8px;padding:16px 20px;margin:0 0 24px;">
              <div style="font-size:12px;text-transform:uppercase;letter-spacing:1.5px;color:#736e64;margin-bottom:8px;">Shipping to</div>
              <div style="color:#1c1a17;line-height:1.5;">
                ${escape(order.fullName)}<br/>
                ${escape(order.address)}<br/>
                ${escape(order.city)}, ${escape(order.postalCode)}<br/>
                ${escape(order.country)}
              </div>
            </div>

            <p style="margin:32px 0 0;color:#4a463f;line-height:1.6;font-size:14px;">
              Every order helps us feed, treat and rehome more animals. Thank you for being part of it.
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#faf5ea;padding:24px 40px;text-align:center;color:#736e64;font-size:12px;">
            <a href="${SITE_URL}" style="color:#174633;text-decoration:none;">thepawsrescuecenter.com</a>
            <div style="margin-top:8px;">Made with love for animals 🐾</div>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function adminHtml(order: OrderEmailData) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="margin:0;background:#f5f5f4;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#1c1a17;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e7e5e1;">
        <tr>
          <td style="padding:24px 32px;border-bottom:1px solid #e7e5e1;">
            <div style="font-size:12px;text-transform:uppercase;letter-spacing:1.5px;color:#736e64;">New order</div>
            <h1 style="margin:8px 0 4px;font-size:22px;color:#0a0a09;">#${shortOrderId(order.id)} — ${formatMoney(order.total)}</h1>
            <div style="color:#4a463f;font-size:14px;">${escape(order.fullName)} · ${escape(order.email)} · ${escape(order.phone)}</div>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px;">
            <h2 style="margin:0 0 12px;font-size:14px;text-transform:uppercase;letter-spacing:1.5px;color:#736e64;">Items</h2>
            <table width="100%" cellpadding="0" cellspacing="0">
              ${itemsRowsHtml(order)}
              <tr>
                <td style="padding:12px 0;color:#4a463f;font-size:14px;">Subtotal</td>
                <td style="padding:12px 0;text-align:right;color:#4a463f;font-size:14px;">${formatMoney(order.subtotal)}</td>
              </tr>
              <tr>
                <td style="padding:0 0 12px;color:#4a463f;font-size:14px;">Shipping</td>
                <td style="padding:0 0 12px;text-align:right;color:#4a463f;font-size:14px;">${order.shipping === 0 ? "Free" : formatMoney(order.shipping)}</td>
              </tr>
              <tr>
                <td style="padding:12px 0;border-top:2px solid #1c1a17;font-size:16px;font-weight:700;color:#0a0a09;">Total</td>
                <td style="padding:12px 0;border-top:2px solid #1c1a17;font-size:16px;font-weight:700;text-align:right;color:#0a0a09;">${formatMoney(order.total)}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:0 32px 24px;">
            <h2 style="margin:0 0 12px;font-size:14px;text-transform:uppercase;letter-spacing:1.5px;color:#736e64;">Shipping address</h2>
            <div style="color:#1c1a17;line-height:1.5;font-size:14px;">
              ${escape(order.fullName)}<br/>
              ${escape(order.address)}<br/>
              ${escape(order.city)}, ${escape(order.postalCode)}<br/>
              ${escape(order.country)}
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px;background:#faf5ea;border-top:1px solid #e7e5e1;text-align:center;">
            <a href="${SITE_URL}/admin/orders/${order.id}"
               style="display:inline-block;background:#174633;color:#fdfaf4;padding:12px 24px;border-radius:9999px;text-decoration:none;font-weight:600;font-size:14px;">
              Open in admin →
            </a>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function escape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function firstName(fullName: string) {
  return fullName.trim().split(/\s+/)[0] ?? fullName;
}
