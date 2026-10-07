import "server-only";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectDB } from "../lib/mongodb";
import { isSameOriginRequest } from "../lib/requestOrigin";
import { AdminError } from "./core.mjs";
import { ADMIN_COOKIE, createAdminAuth } from "./auth-store.mjs";

export const privateHeaders = { "Cache-Control": "private, no-store, max-age=0", "X-Robots-Tag": "noindex, nofollow", "X-Content-Type-Options": "nosniff" };
export const adminJson = (value, status = 200) => NextResponse.json(value, { status, headers: privateHeaders });
export function sessionToken(request) {
  const entry = (request.headers.get("cookie") || "").split(";").map(c => c.trim()).find(c => c.startsWith(`${ADMIN_COOKIE}=`));
  return entry?.slice(ADMIN_COOKIE.length + 1) || null;
}
export async function adminContext(request, { auth = true, mutate = false } = {}) {
  if (mutate && !isSameOriginRequest(request)) throw new AdminError("Request origin is not allowed.", 403);
  await connectDB();
  const db = mongoose.connection.db;
  const access = createAdminAuth(db);
  const session = await access.read(sessionToken(request));
  if (auth && !session) throw new AdminError("Enter the admin access key to continue.", 401);
  return { db, client: mongoose.connection.getClient(), access, session };
}
export function adminHandler(fn, options) {
  return async (request, context) => {
    try { return await fn(request, await adminContext(request, options), context); }
    catch (error) {
      if (!(error instanceof AdminError)) console.error("Admin request failed:", error.name);
      return adminJson({ ok: false, error: error instanceof AdminError ? error.message : "Unable to load admin data. Please retry." }, error instanceof AdminError ? error.status : 503);
    }
  };
}
