"use client";

import { useFormState, useFormStatus } from "react-dom";
import { loginAction, type AuthState } from "../actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary w-full" disabled={pending}>
      {pending ? "Signing in..." : "Sign in"}
    </button>
  );
}

export function LoginForm() {
  const [state, action] = useFormState<AuthState, FormData>(loginAction, undefined);
  return (
    <form action={action} className="space-y-5 border border-ink-100 bg-white p-8">
      <div>
        <label className="label" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required className="input" />
      </div>
      <div>
        <label className="label" htmlFor="password">Password</label>
        <input id="password" name="password" type="password" required className="input" />
      </div>
      {state?.error && <p className="text-sm text-red-700">{state.error}</p>}
      <SubmitButton />
    </form>
  );
}
