"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { CircleAlert, CircleCheck, Clock3, LogOut, MapPin, Package, Pencil, Plus, Trash2, User } from "lucide-react";
import { Field, FormError } from "../components/shop/AuthCard";
import PageHeader from "../components/shop/PageHeader";
import { SITE } from "../config/site";
import { formatPrice } from "../lib-shop/format";
import { toast } from "../lib-shop/toast";
import { accountApi, firstName, logout, setCustomer, useSession } from "../lib-account/session-client";

const TABS = [
  { key: "profile", label: "Profile", Icon: User },
  { key: "addresses", label: "Addresses", Icon: MapPin },
  { key: "orders", label: "Orders", Icon: Package },
];

const STATES = ["Delhi", "Gujarat", "Maharashtra", "Rajasthan", "Uttar Pradesh"];
const EMPTY_ADDRESS = { label: "Home", firstName: "", lastName: "", address: "", apartment: "", city: "", state: "Delhi", pinCode: "", phone: "", isDefault: false };

function Panel({ title, action, children }) {
  return (
    <section className="rounded-lg border border-line bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
        <h2 className="font-display text-[16px] font-extrabold text-ink">{title}</h2>
        {action}
      </div>
      <div className="px-4 py-4 sm:px-5">{children}</div>
    </section>
  );
}

// ---------------- Profile ----------------
function ProfileTab({ customer }) {
  const [form, setForm] = useState({ name: customer.name, phone: customer.phone });
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState({});
  const [busy, setBusy] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setFieldError({});
    try {
      const d = await accountApi("me", { method: "PATCH", body: form });
      setCustomer(d.customer);
      toast("Profile updated.", { tone: "success" });
    } catch (err) {
      if (err.field) setFieldError({ [err.field]: err.message });
      else setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Panel title="Profile">
      <form onSubmit={save} noValidate className="grid gap-4 sm:max-w-lg">
        <FormError message={error} />
        <Field label="Full name" error={fieldError.name}>
          <input id="acc-name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} autoComplete="name" className="input" />
        </Field>
        <Field label="Mobile number" error={fieldError.phone}>
          <input id="acc-phone" type="tel" inputMode="numeric" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} autoComplete="tel" className="input" />
        </Field>
        <Field label="Email address" hint="used to sign in">
          <input id="acc-email" value={customer.email} readOnly className="input" />
        </Field>
        <div>
          <button type="submit" disabled={busy} className="btn btn-buy h-10 px-6">
            {busy ? "Saving…" : "Save changes"}
          </button>
        </div>
        <p className="text-xs text-ink-3">To change your email or password, call {SITE.helpline.display} ({SITE.helpline.hours}).</p>
      </form>
    </Panel>
  );
}

// ---------------- Addresses ----------------
function AddressForm({ initial, onCancel, onSaved, submitLabel }) {
  const [form, setForm] = useState({ ...EMPTY_ADDRESS, ...initial });
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState({});
  const [busy, setBusy] = useState(false);
  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setFieldError({});
    try {
      const d = initial?.id
        ? await accountApi(`addresses/${initial.id}`, { method: "PATCH", body: form })
        : await accountApi("addresses", { method: "POST", body: form });
      onSaved(d.addresses);
    } catch (err) {
      if (err.field) setFieldError({ [err.field]: err.message });
      else setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="fade-in rounded-md border border-brand/30 bg-brand-tint/40 p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <FormError message={error} />
        <Field label="Label" hint="e.g. Home, Farm, Shop">
          <input name="label" value={form.label} onChange={update} className="input" />
        </Field>
        <Field label="Phone for delivery" error={fieldError.phone}>
          <input name="phone" type="tel" inputMode="numeric" value={form.phone} onChange={update} className="input" />
        </Field>
        <Field label="First name" error={fieldError.firstName}>
          <input name="firstName" value={form.firstName} onChange={update} autoComplete="given-name" className="input" />
        </Field>
        <Field label="Last name">
          <input name="lastName" value={form.lastName} onChange={update} autoComplete="family-name" className="input" />
        </Field>
        <div className="sm:col-span-2">
          <Field label="House number and street" error={fieldError.address}>
            <input name="address" value={form.address} onChange={update} autoComplete="address-line1" className="input" />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Apartment, landmark" hint="optional">
            <input name="apartment" value={form.apartment} onChange={update} autoComplete="address-line2" className="input" />
          </Field>
        </div>
        <Field label="Town / City" error={fieldError.city}>
          <input name="city" value={form.city} onChange={update} autoComplete="address-level2" className="input" />
        </Field>
        <Field label="State" error={fieldError.state}>
          <select name="state" value={form.state} onChange={update} className="input">
            {STATES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>
        <Field label="PIN code" error={fieldError.pinCode}>
          <input name="pinCode" inputMode="numeric" value={form.pinCode} onChange={update} autoComplete="postal-code" className="input" />
        </Field>
        <label className="flex items-center gap-2 self-end pb-2 text-[13px] text-ink">
          <input type="checkbox" name="isDefault" checked={form.isDefault} onChange={update} className="h-4 w-4 accent-brand" />
          Make this my default address
        </label>
      </div>
      <div className="mt-4 flex gap-2">
        <button type="submit" disabled={busy} className="btn btn-buy h-10 px-5">
          {busy ? "Saving…" : submitLabel}
        </button>
        <button type="button" onClick={onCancel} className="btn btn-outline h-10 px-4">
          Cancel
        </button>
      </div>
    </form>
  );
}

function AddressesTab({ customer }) {
  const [mode, setMode] = useState(null); // null | "new" | address id
  const addresses = customer.addresses;

  const refresh = (list) => {
    setCustomer({ ...customer, addresses: list });
    setMode(null);
  };
  const remove = async (a) => {
    if (!window.confirm(`Delete the "${a.label}" address?`)) return;
    try {
      const d = await accountApi(`addresses/${a.id}`, { method: "DELETE" });
      refresh(d.addresses);
      toast("Address deleted.");
    } catch (err) {
      toast(err.message);
    }
  };
  const makeDefault = async (a) => {
    try {
      const d = await accountApi(`addresses/${a.id}`, { method: "PATCH", body: { isDefault: true } });
      refresh(d.addresses);
    } catch (err) {
      toast(err.message);
    }
  };

  return (
    <Panel
      title="Saved addresses"
      action={
        mode !== "new" && (
          <button type="button" onClick={() => setMode("new")} className="btn btn-outline h-9 px-3 text-[13px]">
            <Plus className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            Add address
          </button>
        )
      }
    >
      {mode === "new" && <AddressForm initial={{ firstName: firstName(customer), phone: customer.phone }} submitLabel="Save address" onCancel={() => setMode(null)} onSaved={refresh} />}
      {addresses.length === 0 && mode !== "new" && (
        <p className="py-6 text-center text-[13px] text-ink-2">
          No saved addresses yet. Add one here, or it will be saved automatically after your next order.
        </p>
      )}
      <ul className={`grid gap-3 ${mode === "new" ? "mt-4" : ""} sm:grid-cols-2`}>
        {addresses.map((a) =>
          mode === a.id ? (
            <li key={a.id} className="sm:col-span-2">
              <AddressForm initial={a} submitLabel="Update address" onCancel={() => setMode(null)} onSaved={refresh} />
            </li>
          ) : (
            <li key={a.id} className={`rounded-md border p-4 text-[13px] ${a.isDefault ? "border-brand/40 bg-brand-tint/30" : "border-line"}`}>
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-ink">
                  {a.label}
                  {a.isDefault && <span className="ml-2 rounded-sm bg-brand px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">Default</span>}
                </p>
                <div className="-mr-2 -mt-1 flex">
                  <button type="button" onClick={() => setMode(a.id)} aria-label={`Edit ${a.label} address`} className="flex h-9 w-9 items-center justify-center rounded text-ink-2 hover:text-brand">
                    <Pencil className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                  </button>
                  <button type="button" onClick={() => remove(a)} aria-label={`Delete ${a.label} address`} className="flex h-9 w-9 items-center justify-center rounded text-ink-2 hover:text-danger">
                    <Trash2 className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                  </button>
                </div>
              </div>
              <p className="mt-1 text-ink">
                {a.firstName} {a.lastName}
              </p>
              <p className="text-ink-2">
                {a.address}
                {a.apartment ? `, ${a.apartment}` : ""}
                <br />
                {a.city}, {a.state} — {a.pinCode}
              </p>
              {a.phone && <p className="mt-1 tabular-nums text-ink-2">Phone {a.phone}</p>}
              {!a.isDefault && (
                <button type="button" onClick={() => makeDefault(a)} className="mt-2 text-[12px] font-semibold text-brand hover:underline">
                  Set as default
                </button>
              )}
            </li>
          )
        )}
      </ul>
    </Panel>
  );
}

// ---------------- Orders ----------------
const STATUS = {
  paid: { label: "Paid", cls: "bg-brand-tint text-brand-deep", Icon: CircleCheck },
  pending: { label: "Payment pending", cls: "bg-[#FFF8E6] text-[#6B4E00]", Icon: Clock3 },
  failed: { label: "Payment failed", cls: "bg-[#FDECEA] text-danger", Icon: CircleAlert },
};

function OrdersTab() {
  const [state, setState] = useState({ status: "loading", orders: [], error: "" });
  useEffect(() => {
    let alive = true;
    accountApi("orders")
      .then((d) => alive && setState({ status: "ready", orders: d.orders, error: "" }))
      .catch((err) => alive && setState({ status: "error", orders: [], error: err.message }));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <Panel title="My orders">
      {state.status === "loading" && (
        <div aria-busy="true" className="space-y-3">
          {[0, 1].map((i) => (
            <div key={i} className="skeleton h-16" />
          ))}
        </div>
      )}
      {state.status === "error" && <FormError message={state.error} />}
      {state.status === "ready" && state.orders.length === 0 && (
        <div className="py-8 text-center text-[13px] text-ink-2">
          <Package className="mx-auto h-8 w-8 text-ink-3" strokeWidth={1.5} aria-hidden="true" />
          <p className="mt-2">No orders yet for {"your email or mobile number"}.</p>
          <Link href="/products" className="btn btn-buy mt-4 h-10 px-5">
            Start shopping
          </Link>
        </div>
      )}
      {state.status === "ready" && state.orders.length > 0 && (
        <ul className="divide-y divide-line">
          {state.orders.map((o) => {
            const s = STATUS[o.paymentStatus] ?? STATUS.pending;
            return (
              <li key={o.orderId} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3 text-[13px]">
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[13px] font-semibold text-ink">{o.orderId}</p>
                  <p className="text-xs text-ink-2">
                    {new Date(o.createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" })}
                    {o.items?.length ? ` · ${o.items.length} ${o.items.length === 1 ? "item" : "items"}` : ""}
                    {" · UPI via PayU"}
                  </p>
                </div>
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${s.cls}`}>
                  <s.Icon className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                  {s.label}
                </span>
                <span className="w-24 text-right text-[14px] font-bold tabular-nums text-ink">{formatPrice(o.amount)}</span>
                <Link href="/track-order" className="text-[12px] font-semibold text-brand hover:underline">
                  Track
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      <p className="mt-4 text-xs text-ink-3">
        Orders are matched to the email and mobile number on your account. Can&apos;t see an order? Call {SITE.helpline.display} with the order ID.
      </p>
    </Panel>
  );
}

// ---------------- Page ----------------
function AccountInner() {
  const session = useSession();
  const router = useRouter();
  const params = useSearchParams();
  const tabKey = TABS.some((t) => t.key === params.get("tab")) ? params.get("tab") : "profile";

  useEffect(() => {
    if (session.status === "ready" && !session.customer) router.replace("/login?next=/account");
  }, [session, router]);

  const customer = session.customer;

  return (
    <main className="pb-3">
      <PageHeader
        eyebrow="My account"
        title={customer ? `Hello, ${firstName(customer)}` : "My account"}
        subtitle={customer ? customer.email : "Loading your account…"}
        crumbs={[{ label: "My account" }]}
      />
      {!customer ? (
        <div className="shell pt-3" aria-busy="true">
          <div className="skeleton h-48" />
        </div>
      ) : (
        <div className="shell grid gap-3 pt-3 lg:grid-cols-[240px_minmax(0,1fr)] lg:items-start">
          <nav aria-label="Account sections" className="rounded-lg border border-line bg-white p-2 lg:sticky lg:top-[calc(var(--header-h)+12px)]">
            <ul className="flex gap-1 overflow-x-auto lg:flex-col">
              {TABS.map((t) => {
                const active = t.key === tabKey;
                return (
                  <li key={t.key} className="shrink-0">
                    <Link
                      href={`/account?tab=${t.key}`}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center gap-2 rounded-md px-3 py-2 text-[13px] font-semibold ${active ? "bg-brand-tint text-brand-deep" : "text-ink-2 hover:bg-canvas hover:text-ink"}`}
                    >
                      <t.Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                      {t.label}
                    </Link>
                  </li>
                );
              })}
              <li className="shrink-0 lg:mt-2 lg:border-t lg:border-line lg:pt-2">
                <button
                  type="button"
                  onClick={async () => {
                    await logout();
                    router.push("/");
                    toast("You have been signed out.");
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-[13px] font-semibold text-ink-2 hover:bg-canvas hover:text-danger"
                >
                  <LogOut className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                  Sign out
                </button>
              </li>
            </ul>
          </nav>
          <div>
            {tabKey === "profile" && <ProfileTab key={customer.id} customer={customer} />}
            {tabKey === "addresses" && <AddressesTab customer={customer} />}
            {tabKey === "orders" && <OrdersTab />}
          </div>
        </div>
      )}
    </main>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<main className="shell py-6" aria-busy="true"><div className="skeleton h-48" /></main>}>
      <AccountInner />
    </Suspense>
  );
}
