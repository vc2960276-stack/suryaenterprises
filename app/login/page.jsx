"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import AuthCard, { Field, FormError } from "../components/shop/AuthCard";
import { login, useSession } from "../lib-account/session-client";

// Only same-origin paths are honoured as the post-login destination.
const safeNext = (v) => (v && v.startsWith("/") && !v.startsWith("//") ? v : "/account");

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const session = useSession();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState({});
  const [busy, setBusy] = useState(false);

  // Already signed in → go where they were headed.
  useEffect(() => {
    if (session.status === "ready" && session.customer) router.replace(next);
  }, [session, router, next]);

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!identifier.trim()) errs.identifier = "Enter your email or mobile number.";
    if (!password) errs.password = "Enter your password.";
    setFieldError(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    setError("");
    try {
      await login(identifier.trim(), password);
      router.replace(next);
    } catch (err) {
      if (err.field) setFieldError({ [err.field]: err.message });
      else setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthCard
      title="Sign in to your account"
      subtitle="Use the email or mobile number you registered with."
      footer={
        <>
          New to Surya Enterprises?{" "}
          <Link href={`/register${next !== "/account" ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-semibold text-brand hover:underline">
            Create an account
          </Link>
          <span className="mx-2 text-ink-3">·</span>
          <Link href="/cart" className="font-semibold text-brand hover:underline">
            Continue as guest
          </Link>
        </>
      }
    >
      <form onSubmit={submit} noValidate className="space-y-4">
        <FormError message={error} />
        <Field label="Email or mobile number" error={fieldError.identifier}>
          <input
            id="login-identifier"
            name="identifier"
            autoComplete="username"
            inputMode="email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            aria-invalid={fieldError.identifier ? "true" : undefined}
            className="input"
          />
        </Field>
        <Field label="Password" error={fieldError.password}>
          <span className="relative block">
            <input
              id="login-password"
              name="password"
              type={show ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={fieldError.password ? "true" : undefined}
              className="input pr-11"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Hide password" : "Show password"}
              aria-pressed={show}
              className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded text-ink-3 hover:text-ink"
            >
              {show ? <EyeOff className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" /> : <Eye className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />}
            </button>
          </span>
        </Field>
        <button type="submit" disabled={busy} className="btn btn-buy h-11 w-full text-[15px]">
          <LogIn className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          {busy ? "Signing in…" : "Sign in"}
        </button>
        <p className="text-center text-xs text-ink-3">
          Forgot your password? Call the helpline and we will help you reset it.
        </p>
      </form>
    </AuthCard>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<AuthCard title="Sign in to your account" />}>
      <LoginForm />
    </Suspense>
  );
}
