"use client";

import { useFormState, useFormStatus } from "react-dom";
import { placeOrderAction, type CheckoutState } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary w-full" disabled={pending}>
      {pending ? "Redirecting to payment..." : "Continue to payment →"}
    </button>
  );
}

export function CheckoutForm({
  defaultEmail,
  defaultName,
}: {
  defaultEmail: string;
  defaultName: string;
}) {
  const [state, action] = useFormState<CheckoutState, FormData>(
    placeOrderAction,
    undefined,
  );

  return (
    <form action={action} className="space-y-10 border border-ink-100 bg-white p-8">
      <fieldset className="space-y-4">
        <legend className="eyebrow mb-3">Contact</legend>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={defaultEmail}
            required
            className="input"
          />
        </div>
        <div>
          <label className="label" htmlFor="phone">Phone</label>
          <input id="phone" name="phone" type="tel" required className="input" />
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="eyebrow mb-3">Shipping address</legend>
        <div>
          <label className="label" htmlFor="fullName">Full name</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            defaultValue={defaultName}
            required
            className="input"
          />
        </div>
        <div>
          <label className="label" htmlFor="address">Address</label>
          <input id="address" name="address" type="text" required className="input" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="city">City</label>
            <input id="city" name="city" type="text" required className="input" />
          </div>
          <div>
            <label className="label" htmlFor="postalCode">Postal code</label>
            <input id="postalCode" name="postalCode" type="text" required className="input" />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="country">Country</label>
          <input id="country" name="country" type="text" required className="input" />
        </div>
        <div>
          <label className="label" htmlFor="notes">Order notes (optional)</label>
          <textarea id="notes" name="notes" rows={3} className="input" />
        </div>
      </fieldset>

      <div className="rounded-md border border-ink-100 bg-cream-50 p-4 text-sm text-ink-600">
        <div className="font-medium text-ink-800">Secure payment</div>
        <p className="mt-1 text-xs text-ink-500">
          You&apos;ll enter your card details on the next page. We use Stripe — we
          never see or store your card number.
        </p>
      </div>

      {state?.error && <p className="text-sm text-red-700">{state.error}</p>}

      <SubmitButton />
    </form>
  );
}
