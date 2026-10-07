import { adminHandler, adminJson } from "../../../lib-admin/server";
import { ordersFor } from "../../../lib-admin/orders";

export const dynamic = "force-dynamic";
export const GET = adminHandler(async (request, context, route) => {
  const { id } = await route.params;
  return adminJson({ ok: true, order: await (await ordersFor(context)).detail(id) });
});
export const PATCH = adminHandler(async (request, context, route) => {
  const { id } = await route.params;
  let body;
  try { body = await request.json(); } catch { return adminJson({ ok: false, error: "Invalid order update." }, 400); }
  if (!body || typeof body !== "object") return adminJson({ ok: false, error: "Invalid order update." }, 400);
  return adminJson({ ok: true, order: await (await ordersFor(context)).update(id, body) });
}, { mutate: true });
