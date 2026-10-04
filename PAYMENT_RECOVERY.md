# Autonomous payment confirmation

The production Vercel deployment publishes gateway order identifiers to the
`payin-recovery` durable queue. Its consumer is private through the
`queue/v2beta` trigger in `vercel.json`. Vercel supplies queue authentication;
the queue contains no customer information or payment claims.

The consumer uses `PAYIN_BACKEND_ORIGIN` and `PAYIN_API_TOKEN` to call the
Express backend's authenticated recovery endpoint. The backend token must
match `SURYA_PAYIN_API_TOKEN` on the backend. Deploy the backend endpoint before
this storefront. The existing PayU callback URL remains unchanged.

Each successful step publishes its next delayed step before acknowledgment.
Repeated steps use stable queue publishing keys; the backend uses Mongo leases,
verified PayU outcomes and stable merchant event IDs. A stopped checkout or
dashboard does not stop an accepted recovery chain. Queue outages are recorded
on the persistent backend outbox and remain available to worker/traffic repair.

Check `/api/internal/payin/recovery` with GET for the deployed revision. POST is
server authenticated and accepts only a gateway transaction identifier, kind
and optional matching event identifier. The Express `/health/live` also reports
its deployed Git SHA and recovery revision. Customer-facing checkout behavior
and API tokens are unchanged.

Run `PAYIN_TEST_MONGO_URI=mongodb://127.0.0.1:27117/ npm run verify` with an
isolated MongoDB instance to test PayU binding, callback relays and queue step
redelivery using synthetic provider and recipient responses.
