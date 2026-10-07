// Server-side session helpers for the customer account routes.
// The session is a signed HS256 JWT in an httpOnly cookie.
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { connectDB } from "../lib/mongodb";
import Customer from "./Customer";
import { signJwt, verifyJwt } from "./crypto";

export const SESSION_COOKIE = "surya_session";
const SESSION_DAYS = 30;

function secret() {
  const s = process.env.CUSTOMER_JWT_SECRET;
  if (!s || s.length < 32 || /<[^>]+>/.test(s)) {
    throw new Error("CUSTOMER_JWT_SECRET must be configured (at least 32 random characters)");
  }
  return s;
}

export async function setSessionCookie(customer) {
  const token = signJwt({ sub: String(customer._id), email: customer.email }, secret(), {
    expiresInSeconds: SESSION_DAYS * 24 * 60 * 60,
  });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.set(SESSION_COOKIE, "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 });
}

// Returns the signed-in Customer document, or null.
export async function getSessionCustomer() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  let payload;
  try {
    payload = verifyJwt(token, secret());
  } catch {
    return null;
  }
  if (!payload?.sub) return null;
  await connectDB();
  const customer = await Customer.findById(payload.sub);
  return customer ?? null;
}

export const ok = (data, init) => NextResponse.json({ ok: true, ...data }, init);
export const fail = (error, status = 400, extra = {}) => NextResponse.json({ ok: false, error, ...extra }, { status });

// Wraps a handler: JSON body parsing, auth requirement and uniform errors.
export function handler(fn, { auth = false } = {}) {
  return async (request, context) => {
    try {
      let body = {};
      if (request.method !== "GET" && request.method !== "DELETE") {
        try {
          body = await request.json();
        } catch {
          body = {};
        }
      }
      let customer = null;
      if (auth) {
        customer = await getSessionCustomer();
        if (!customer) return fail("Please sign in to continue.", 401);
      }
      return await fn({ request, body: body ?? {}, customer, params: await context?.params });
    } catch (error) {
      console.error("account-api error:", error);
      const message = /CUSTOMER_JWT_SECRET|MONGO_URL/.test(String(error?.message))
        ? "Accounts are not configured on this server."
        : "Something went wrong. Please try again.";
      return fail(message, 500);
    }
  };
}
