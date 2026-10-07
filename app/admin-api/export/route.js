import { dashboardFilters } from "../../lib-admin/core.mjs";
import { adminHandler, privateHeaders } from "../../lib-admin/server";
import { ordersFor } from "../../lib-admin/orders";

export const dynamic = "force-dynamic";
export const GET = adminHandler(async (request, context) => {
  const params = new URL(request.url).searchParams;
  const csv = await (await ordersFor(context)).exportCsv(dashboardFilters(params));
  return new Response(csv, { headers: { ...privateHeaders, "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="surya-successful-orders.csv"' } });
});
