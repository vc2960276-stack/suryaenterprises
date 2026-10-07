"use client";

// Browser-side customer session: one shared store, hydrated once from
// /account-api/me, updated by login/register/logout. Components subscribe
// with useSession(); nothing here touches localStorage (the session itself
// is an httpOnly cookie the browser sends automatically).
import { useEffect, useSyncExternalStore } from "react";

const INITIAL = { status: "idle", customer: null }; // idle | loading | ready
let state = INITIAL;
const listeners = new Set();

function set(next) {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
}
const subscribe = (l) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export async function accountApi(path, { method = "GET", body } = {}) {
  const res = await fetch(`/account-api/${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "same-origin",
    cache: "no-store",
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  if (!res.ok || !data?.ok) {
    const err = new Error(data?.error || (res.status === 401 ? "Please sign in to continue." : "Something went wrong. Please try again."));
    err.field = data?.field;
    err.status = res.status;
    throw err;
  }
  return data;
}

let inflight = null;
export function refreshSession() {
  if (inflight) return inflight;
  set({ status: state.status === "idle" ? "loading" : state.status });
  inflight = accountApi("me")
    .then((d) => set({ status: "ready", customer: d.customer }))
    .catch(() => set({ status: "ready", customer: null }))
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

export async function login(identifier, password) {
  const d = await accountApi("login", { method: "POST", body: { identifier, password } });
  set({ status: "ready", customer: d.customer });
  return d.customer;
}

export async function register(payload) {
  const d = await accountApi("register", { method: "POST", body: payload });
  set({ status: "ready", customer: d.customer });
  return d.customer;
}

export async function logout() {
  try {
    await accountApi("logout", { method: "POST" });
  } finally {
    set({ status: "ready", customer: null });
  }
}

export function setCustomer(customer) {
  set({ status: "ready", customer });
}

export function useSession() {
  const snap = useSyncExternalStore(subscribe, () => state, () => INITIAL);
  useEffect(() => {
    if (state.status === "idle") refreshSession();
  }, []);
  return snap;
}

export const firstName = (customer) => (customer?.name ?? "").trim().split(/\s+/)[0] || "there";
