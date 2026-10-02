# Surya Enterprises storefront and PayU bridge

Next.js storefront with server-side PayU UPI intent creation, verified payment
callbacks and status reconciliation. Uses Node 24.

## Local setup

```bash
nvm use
npm ci
cp .env.example .env.local
npm run dev
```

Fill in server-side values before creating payments. The site runs at
`http://localhost:3000`. `/checkout` uses browser-only same-origin wrappers that
keep the internal Pay-In token on the server. See [PAYIN_API.md](PAYIN_API.md).

## Production routing

`vercel.json` runs the storefront's server functions, including PayU intent
creation and verification, in Mumbai (`bom1`). Keep this deployment setting
when moving the project: the PayU-calling service should execute in India.

Production uses the deployed Express API at
`https://payin-frontend-hy1p.vercel.app` by default. Vercel builds and the payment
runtime use this same destination even when `PAYIN_BACKEND_ORIGIN` is unset.
If the API moves, set `PAYIN_BACKEND_ORIGIN` to its new public HTTPS origin before
rebuilding. Overrides must identify a separate service, without a path or URL
credentials, rather than this storefront's domain.

| Public path | Express destination |
|---|---|
| `/pay/:path*` | `/pay/:path*` (checkout, assets, status, cancellation and receipts) |
| `/gateway/:path*` | `/:path*` (admin, merchant and provider webhook API) |

This preserves the storefront's own `/api/v1/payin/*` bridge. `suryaenter.in`
currently redirects to `www.suryaenter.in`; use `www` for API and PayU callbacks
so POST requests reach the intended endpoint directly.

Configure the payment settings in `.env.production.example` on the host, including the
production database, live PayU key/salt and shared internal token.
`PAYIN_API_TOKEN` must equal backend `SURYA_PAYIN_API_TOKEN`; both services must
use the same PayU key/salt. Provider callbacks use
`https://www.suryaenter.in/api/payin/payu-callback`; verified payloads are relayed
to `https://www.suryaenter.in/gateway/api/webhooks/payu/payment`.

Production builds reject insecure or looping Express origin overrides.
Payment runtime rejects missing secrets, sandbox PayU settings, test/demo
DB names and incorrect backend webhook destinations. Provider requests have a
15-second timeout. Full provider/customer payloads are not logged or returned
as error messages.

PayU HTTP errors retain safe diagnostics on the failed order: provider status,
response format, request reference, region and any `Retry-After` value. A 429
also returns `PAYMENT_PROVIDER_RATE_LIMITED` to the authenticated backend.
These diagnostics distinguish provider throttling from a function timeout;
they do not guarantee that changing the function region resolves a provider restriction.

```bash
npm run verify
npm start
```

`verify` runs lint, configuration/provider tests and a production build. GitHub
CI builds without a backend-origin override to cover Vercel's default routing,
uses a synthetic database build fixture, makes no real payments, and audits
dependencies. CI success does not verify the actual deployed Express host.
The full three-service guide is `Payin-Backend/docs/PRODUCTION.md` in the shared
workspace. No workflow deploys this project.
