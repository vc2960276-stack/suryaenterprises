"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import AuthCard, { Field, FormError } from "../components/shop/AuthCard";
import { isValidEmail, isValidPhone, normalisePhone } from "../lib-account/crypto";
import { register, useSession } from "../lib-account/session-client";

const safeNext = (v) => (v && v.startsWith("/") && !v.startsWith("//") ? v : "/account");

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const session = useSession();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (session.status === "ready" && session.customer) router.replace(next);
  }, [session, router, next]);

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (form.name.trim().length < 2) errs.name = "Please enter your name.";
    if (!isValidEmail(form.email.trim().toLowerCase())) errs.email = "Enter a valid email address.";
    if (!isValidPhone(normalisePhone(form.phone))) errs.phone = "Enter a valid 10-digit Indian mobile number.";
    if (form.password.length < 8) errs.password = "Use at least 8 characters.";
    if (form.confirm !== form.password) errs.confirm = "Passwords do not match.";
    return errs;
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setFieldError(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    setError("");
    try {
      await register({ name: form.name.trim(), email: form.email.trim(), phone: form.phone, password: form.password });
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
      title="Create your account"
      subtitle="Save addresses, see your orders and check out faster."
      footer={
        <>
          Already have an account?{" "}
          <Link href={`/login${next !== "/account" ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-semibold text-brand hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} noValidate className="space-y-4">
        <FormError message={error} />
        <Field label="Full name" error={fieldError.name}>
          <input id="reg-name" name="name" autoComplete="name" value={form.name} onChange={update} aria-invalid={fieldError.name ? "true" : undefined} className="input" />
        </Field>
        <Field label="Email address" error={fieldError.email}>
          <input id="reg-email" name="email" type="email" autoComplete="email" inputMode="email" value={form.email} onChange={update} aria-invalid={fieldError.email ? "true" : undefined} className="input" />
        </Field>
        <Field label="Mobile number" hint="10 digits" error={fieldError.phone}>
          <input id="reg-phone" name="phone" type="tel" autoComplete="tel" inputMode="numeric" value={form.phone} onChange={update} aria-invalid={fieldError.phone ? "true" : undefined} className="input" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Password" hint="min. 8 characters" error={fieldError.password}>
            <span className="relative block">
              <input id="reg-password" name="password" type={show ? "text" : "password"} autoComplete="new-password" value={form.password} onChange={update} aria-invalid={fieldError.password ? "true" : undefined} className="input pr-11" />
              <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} aria-pressed={show} className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded text-ink-3 hover:text-ink">
                {show ? <EyeOff className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" /> : <Eye className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />}
              </button>
            </span>
          </Field>
          <Field label="Confirm password" error={fieldError.confirm}>
            <input id="reg-confirm" name="confirm" type={show ? "text" : "password"} autoComplete="new-password" value={form.confirm} onChange={update} aria-invalid={fieldError.confirm ? "true" : undefined} className="input" />
          </Field>
        </div>
        <button type="submit" disabled={busy} className="btn btn-buy h-11 w-full text-[15px]">
          <UserPlus className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          {busy ? "Creating account…" : "Create account"}
        </button>
        <p className="text-center text-xs text-ink-3">
          By creating an account you agree to our{" "}
          <Link href="/terms" className="underline hover:text-brand">Terms of Use</Link> and{" "}
          <Link href="/privacy" className="underline hover:text-brand">Privacy Policy</Link>.
        </p>
      </form>
    </AuthCard>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<AuthCard title="Create your account" />}>
      <RegisterForm />
    </Suspense>
  );
}
