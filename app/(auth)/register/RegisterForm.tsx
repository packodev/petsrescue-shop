"use client";

import { useFormState, useFormStatus } from "react-dom";
import { registerAction, type AuthState } from "../actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary w-full" disabled={pending}>
      {pending ? "Creating..." : "Create account"}
    </button>
  );
}

export function RegisterForm() {
  const [state, action] = useFormState<AuthState, FormData>(registerAction, undefined);
  return (
    <form action={action} className="space-y-5 border border-ink-100 bg-white p-8">
      <div>
        <label className="label" htmlFor="name">Name (optional)</label>
        <input id="name" name="name" type="text" className="input" />
      </div>
      <div>
        <label className="label" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required className="input" />
      </div>
      <div>
        <label className="label" htmlFor="password">Password</label>
        <input id="password" name="password" type="password" required minLength={6} className="input" />
      </div>
      {state?.error && <p className="text-sm text-red-700">{state.error}</p>}
      <SubmitButton />
    </form>
  );
}
