import Link from "next/link";
import { RegisterForm } from "./RegisterForm";

export const metadata = { title: "Register — PawsRescue" };

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <div className="text-center">
        <p className="eyebrow">Welcome</p>
        <h1 className="section-title mt-2">Create account</h1>
        <div className="rule mx-auto mt-5" />
      </div>
      <div className="mt-10">
        <RegisterForm />
      </div>
      <p className="mt-6 text-center text-sm text-ink-500">
        Already have an account?{" "}
        <Link href="/login" className="link-underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
