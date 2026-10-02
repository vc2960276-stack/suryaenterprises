# Surya Pay-In API

Base URL: `https://www.suryaenter.in/api/v1`

Use the `www` host exactly as written. The apex domain `suryaenter.in` redirects to
`www`, and PayU does not follow redirects when posting callbacks.

All requests require the server-side token:

`Authorization: Bearer <PAYIN_API_TOKEN>`

## Create Pay-In Order

`POST /payin/create-order`

Body:

```json
{
  "order_id": "100000000001",
  "amount": 499,
  "name": "Rahul Kumar",
  "email": "rahul@example.com",
  "mobile": "9876543210",
  "productinfo": "Order Payment",
  "customer_ip": "203.0.113.10",
  "device_info": "Mozilla/5.0 ...",
  "expiry_seconds": 1800
}
```

Response:

```json
{
  "status": "success",
  "data": {
    "transaction_id": "SEPAY_...",
    "order_id": "100000000001",
    "amount": 499,
    "currency": "INR",
    "payment_status": "pending",
    "payment_id": "...",
    "merchant_vpa": "...",
    "merchant_name": "...",
    "deep_link": "upi://pay?...",
    "upi_intent": "upi://pay?...",
    "qr_string": "upi://pay?...",
    "intent_data": "pa=...&pn=...",
    "expires_in": 1800
  },
  "error": null
}
```

`deep_link`, `upi_intent` and `qr_string` carry the same UPI intent URI. Render it as a
QR code or open it as a deep link. Never mark an order paid from a browser redirect;
use the PayU callback or the status endpoint.

## Check Status

`POST /payin/check-status`

```json
{ "order_id": "100000000001" }
```

Response:

```json
{
  "status": "success",
  "data": {
    "order_id": "100000000001",
    "transaction_id": "SEPAY_...",
    "payment_status": "pending | paid | failed",
    "amount": 499,
    "currency": "INR",
    "payu_payment_id": "...",
    "utr": "...",
    "deep_link": "upi://pay?...",
    "qr_string": "upi://pay?..."
  },
  "error": null
}
```

While an order is `pending` this endpoint queries PayU (`verify_payment`) before answering.

## PayU Callback

Configure PayU to POST to:

`https://www.suryaenter.in/api/payin/payu-callback`

The endpoint verifies the PayU SHA-512 reverse hash and the transaction amount before
changing the order to `paid` or `failed`. A paid order is never changed by a later callback.

If `PAYIN_BACKEND_WEBHOOK_URL` is set, the verified PayU payload is relayed to the
Pay-In platform backend (`/api/webhooks/payu/payment`), which re-verifies the hash with
the shared salt and notifies the merchant.

## Browser checkout wrappers

`/api/checkout/payin/create` and `/api/checkout/payin/status` exist only for this site's
own checkout page. They inject the server-side token and reject cross-origin requests.
