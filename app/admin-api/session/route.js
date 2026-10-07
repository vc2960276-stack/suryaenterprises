import { ADMIN_COOKIE, SESSION_SECONDS } from "../../lib-admin/auth-store.mjs";
import { adminHandler, adminJson, sessionToken } from "../../lib-admin/server";

export const dynamic = "force-dynamic";
const cookieOptions = () => ({ httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: SESSION_SECONDS });
export const GET = adminHandler(async (request, context) => {
  const configuration = await context.access.settings();
  return adminJson({ ok: true, authenticated: !!context.session, configured: !!configuration?.keyHash });
}, { auth: false });
export const POST = adminHandler(async (request, context) => {
  let body;
  try { body = await request.json(); } catch { return adminJson({ ok: false, error: "Enter your access key." }, 400); }
  if (!body || typeof body !== "object") return adminJson({ ok: false, error: "Enter your access key." }, 400);
  const client = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || request.headers.get("x-real-ip") || "unknown";
  const token = await context.access.login(body.key, client);
  const response = adminJson({ ok: true, authenticated: true });
  response.cookies.set(ADMIN_COOKIE, token, cookieOptions());
  return response;
}, { auth: false, mutate: true });
export const DELETE = adminHandler(async (request, context) => {
  await context.access.logout(sessionToken(request));
  const response = adminJson({ ok: true, authenticated: false });
  response.cookies.set(ADMIN_COOKIE, "", { ...cookieOptions(), maxAge: 0 });
  return response;
}, { auth: false, mutate: true });
