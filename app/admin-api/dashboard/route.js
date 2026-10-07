import { dashboardFilters } from "../../lib-admin/core.mjs";
import { adminHandler, adminJson } from "../../lib-admin/server";
import { ordersFor } from "../../lib-admin/orders";

export const dynamic = "force-dynamic";
export const GET = adminHandler(async (request, context) => {
  const store = await ordersFor(context);
  return adminJson({ ok: true, ...await store.dashboard(dashboardFilters(new URL(request.url).searchParams)) });
});
