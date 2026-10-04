import { handleCallback } from "@vercel/queue";
import { processRecoveryWork } from "../../../lib/paymentRecoveryQueue";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// The trigger makes this consumer private on Vercel. Only a durable queue
// message can invoke it; browser traffic cannot schedule money outcomes.
export const POST = handleCallback(processRecoveryWork, {
  visibilityTimeoutSeconds: 60,
  retry: (_error, metadata) => ({ afterSeconds: Math.min(30, 5 * Math.max(1, metadata.deliveryCount)) }),
});
