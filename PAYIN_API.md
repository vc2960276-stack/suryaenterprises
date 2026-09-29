# Surya Pay-In API

Base URL: `https://suryaent.in/api/v1`

## Create Pay-In Order

`POST /payin/create-order`

Header:

`Authorization: Bearer SE_LIVE_...`

Body:

```json
{
  "order_id": "100000000001",
  "amount": 499,
  "name": "Rahul Kumar",
  "email": "rahul@example.com",
  "mobile": "9876543210",
  "productinfo": "Order Payment",
  "redirect_url": "https://merchant.example/payment/result"
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
    "qr_string": "upi://pay?...",
    "payment_id": "...",
    "merchant_vpa": "...",
    "expires_in": 1800
  },
  "error": null
}
```

The merchant renders `qr_string` as a UPI QR. Do not mark an order paid from a browser redirect; use the PayU callback or status endpoint.

## Check Status

`POST /payin/check-status`

```json
{ "order_id": "100000000001" }
```

## PayU Callback

Configure PayU to POST to:

`https://suryaent.in/api/payin/payu-callback`

The endpoint verifies the PayU SHA-512 reverse hash and transaction amount before changing the order to `paid` or `failed`.
