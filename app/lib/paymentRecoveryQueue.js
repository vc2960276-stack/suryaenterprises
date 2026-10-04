import { send } from "@vercel/queue";

export const RECOVERY_TOPIC = "payin-recovery";
const RETENTION_SECONDS = 7 * 24 * 3600;

export function validRecoveryWork(work) {
  return work && typeof work.transaction_id === "string" && /^SE\d{13}[a-f0-9]{10}$/.test(work.transaction_id) &&
    ["payment", "callback"].includes(work.kind) && Number.isSafeInteger(work.generation) && work.generation >= 0 &&
    (!work.event_id || work.event_id === `${work.transaction_id}:success` || work.event_id === `${work.transaction_id}:failed` ||
      work.event_id === `${work.transaction_id}:refunded`);
}

export async function publishRecoveryWork(work, { sendMessage = send, delaySeconds = 0 } = {}) {
  if (!validRecoveryWork(work)) throw new Error("Invalid recovery work");
  // Generation makes each next step distinct. Replaying a step after a lost
  // publish ACK republishes the same key, rather than making duplicate chains.
  return sendMessage(RECOVERY_TOPIC, work, { retentionSeconds: RETENTION_SECONDS,
    delaySeconds, idempotencyKey: `${work.kind}:${work.event_id || work.transaction_id}:${work.generation}` });
}

export async function enqueuePaymentRecovery(transactionId, { kind = "payment", eventId } = {}) {
  const work = { transaction_id: transactionId, kind, generation: 0, ...(eventId ? { event_id: eventId } : {}) };
  if (process.env.VERCEL !== "1" || !validRecoveryWork(work)) return false;
  let timer;
  try {
    await Promise.race([publishRecoveryWork(work, { delaySeconds: kind === "payment" ? 5 : 0 }),
      new Promise((_, reject) => { timer = setTimeout(() => reject(new Error("Queue publish timed out")), 5000); })]);
    return true;
  } catch {
    console.error("[payment-recovery] Queue publish unavailable; persistent backend outbox remains pending");
    return false;
  } finally { clearTimeout(timer); }
}

export async function processRecoveryWork(work, { request = fetch, publish = publishRecoveryWork } = {}) {
  if (!validRecoveryWork(work)) throw new Error("Invalid recovery work");
  const token = process.env.PAYIN_API_TOKEN;
  if (!token) throw new Error("Recovery authentication missing");
  // Use the private API origin directly, not the public website rewrite. The
  // token never follows redirects or leaves the configured server origin.
  const origin = new URL(process.env.PAYIN_BACKEND_ORIGIN || "https://payin-frontend-hy1p.vercel.app");
  if (origin.protocol !== "https:" || origin.username || origin.password || origin.pathname !== "/" || origin.search || origin.hash) {
    throw new Error("Invalid backend origin");
  }
  const response = await request(`${origin.origin}/api/internal/payments/reconcile-order`, {
    method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ transaction_id: work.transaction_id, kind: work.kind }),
    signal: AbortSignal.timeout(25000), redirect: "error", cache: "no-store",
  });
  if (!response.ok) throw new Error(`Recovery step HTTP ${response.status}`);
  const result = await response.json();
  if (result.success !== true || typeof result.complete !== "boolean") throw new Error("Invalid recovery step response");
  if (result.complete) return;
  const delaySeconds = result.retry_after_seconds;
  if (!Number.isInteger(delaySeconds) || delaySeconds < 1 || delaySeconds > 300) throw new Error("Invalid recovery delay");
  // Publish before acknowledgment. A crash or lost publish response redelivers
  // this step; the queue key and Mongo leases keep the repeated step harmless.
  await publish({ ...work, generation: work.generation + 1 }, { delaySeconds });
}
