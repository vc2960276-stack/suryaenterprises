import crypto from "node:crypto";
import { enqueuePaymentRecovery, validRecoveryWork } from "../../../../lib/paymentRecoveryQueue";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const supplied = (request.headers.get("authorization") || "").replace(/^Bearer /, "");
  const a = Buffer.from(process.env.PAYIN_API_TOKEN || ""), b = Buffer.from(supplied);
  if (!a.length || a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return Response.json({ queued: false }, { status: 401 });
  }
  try {
    const input = await request.json();
    const work = { transaction_id: input.transaction_id, kind: input.kind, event_id: input.event_id, generation: 0 };
    if (!validRecoveryWork(work)) return Response.json({ queued: false }, { status: 400 });
    const queued = await enqueuePaymentRecovery(work.transaction_id, { kind: work.kind, eventId: work.event_id });
    return Response.json({ queued, release: process.env.VERCEL_GIT_COMMIT_SHA || null },
      { status: queued ? 202 : 503, headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ queued: false }, { status: 400 });
  }
}

export function GET() {
  return Response.json({ status: "ok", recovery: "durable-queue-v1", release: process.env.VERCEL_GIT_COMMIT_SHA || null },
    { headers: { "Cache-Control": "no-store" } });
}
