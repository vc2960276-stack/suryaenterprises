# Store operations

`/admin/dashboard` is a private key-only operations console. No email sign-in is required. The key is checked server-side using a salted scrypt hash in the site's `store_admin_settings` Mongo collection. It is never bundled into JavaScript or committed. Sessions use random tokens in secure HTTP-only cookies; only token hashes are persisted, expire after eight hours, and are revoked when the key is rotated. Login attempts are limited persistently across server instances.

## Configure or rotate access

Use the site's existing `MONGO_URL` and `DB_NAME`, supplied via environment or ignored `.env.local`. Run the setup script with the desired key on standard input. For example, set `SURYA_ADMIN_SETUP_KEY` privately and run:

```sh
printf '%s' "$SURYA_ADMIN_SETUP_KEY" | node scripts/configure-store-admin.mjs --payin-db test
```

`--payin-db` selects the existing gateway database on the same Mongo cluster, so original merchant order IDs and callback delivery status can be joined. This project's current gateway database is named `test`; that name does not imply sandbox PayU payments. Configure only the database the operator owns. The script creates admin TTL/query indexes and the private configuration document, preserving financial records. No new Vercel secret is required because the existing Mongo connection supplies the configuration.

## What the dashboard records

Confirmed PayU payments are read from `orders` (`paymentStatus: paid`, valid PayU payment ID, positive amount). Matching gateway transactions are joined using the unique transaction identity, amount and PayU ID, never amount alone. Collections and merchandise sales are different metrics: collections include gateway payments; merchandise sales require actual recorded product line items. The default period is today in Asia/Kolkata. Historical records lack an exact first-confirmed timestamp; their record update date is explicitly identified. New verified successes persist `paidAt` once.

Historical orders did not capture purchased products or shipping addresses. The dashboard suggests a deterministic closest-price catalog product, clearly labeled approximate, with the price difference. A match does not establish a customer purchase. An admin can confirm an association; that confirmation and every fulfillment update are recorded independently in `store_admin_orders`. Payment amount, status, provider IDs, balances and callbacks are never changed by these operations.

Actual storefront checkouts now save SKU, quantity, server-resolved price and shipping address. A changed or manipulated amount is rejected before a payment is created. Gateway API requests without product items keep their existing behavior.

Fulfillment follows processing → packed → shipped → delivered. Shipment needs a carrier and tracking reference. Hold, cancellation and return require a reason. Cancellation/return records do not issue refunds. Concurrent edits use revisions; stale changes receive HTTP 409. Unconfirmed product suggestions cannot be shipped. CSV export requires the same authenticated session and neutralizes spreadsheet formulas; exports are bounded at 10,000 records with an explicit error if the period must be narrowed.

All admin data responses are private/no-store and changes require a same-origin request. Admin pages are excluded from search indexing. Raw provider payloads, PayU secrets and merchant API tokens are never returned to the browser.
