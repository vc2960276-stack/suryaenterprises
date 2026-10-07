import { dashboardFilters } from "../../lib-admin/core.mjs";
import { adminHandler, adminJson } from "../../lib-admin/server";
import { ordersFor } from "../../lib-admin/orders";

export const dynamic = "force-dynamic";
export const maxDuration = 60;
export const GET = adminHandler(async (request, context) => {
  return adminJson({ ok: true, ...await (await ordersFor(context)).shipmentPreview(dashboardFilters(new URL(request.url).searchParams)) });
});
export const POST = adminHandler(async (request, context) => {
  let body;
  try { body = await request.json(); } catch { return adminJson({ ok: false, error: "Invalid shipment request." }, 400); }
  if (!body || typeof body !== "object") return adminJson({ ok: false, error: "Invalid shipment request." }, 400);
  return adminJson({ ok: true, ...await (await ordersFor(context)).bulkShip(body) });
}, { mutate: true });
