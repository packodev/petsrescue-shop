import Link from "next/link";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Sign in — PawsRescue" };

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <div className="text-center">
        <p className="eyebrow">Welcome</p>
        <h1 className="section-title mt-2">Sign in</h1>
        <div className="rule mx-auto mt-5" />
      </div>
      <div className="mt-10">
        <LoginForm />
      </div>
      <p className="mt-6 text-center text-sm text-ink-500">
        New here?{" "}
        <Link href="/register" className="link-underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
