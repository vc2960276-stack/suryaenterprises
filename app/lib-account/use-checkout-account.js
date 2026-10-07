"use client";

// Account glue for the checkout page. It WRAPS the page's existing state
// (details / payment / orderPlaced) without touching the PayU calls:
//   - pre-fills the form from the signed-in customer's default address,
//   - lets the shopper switch between saved addresses or type a new one,
//   - remembers the order id so the confirmation screen can show it
//     (the payment logic clears `payment` before setting `orderPlaced`),
//   - saves the delivery address to the account after a successful order.
//
// State derived from props is adjusted during render (React's documented
// pattern) rather than in effects, so no setState runs inside an effect.
import { useCallback, useEffect, useRef, useState } from "react";
import { accountApi, refreshSession, useSession } from "./session-client";

const EMPTY_ADDRESS = { address: "", apartment: "", city: "", pinCode: "" };

export function useCheckoutAccount({ details, setDetails, payment, orderPlaced }) {
  const session = useSession();
  const customer = session.customer;
  const [savedAddress, setSavedAddress] = useState(null);
  const [lastOrderId, setLastOrderId] = useState(null);
  const [prefilledFor, setPrefilledFor] = useState(null);
  const saved = useRef(false);

  // Keep the most recent order id (payment is reset to null on success).
  if (payment?.order_id && payment.order_id !== lastOrderId) {
    setLastOrderId(payment.order_id);
  }

  const applyAddress = useCallback(
    (addr) => {
      setSavedAddress(addr);
      setDetails((d) => ({
        ...d,
        firstName: addr.firstName || d.firstName,
        lastName: addr.lastName || d.lastName,
        phone: addr.phone || d.phone,
        address: addr.address,
        apartment: addr.apartment,
        city: addr.city,
        state: addr.state || d.state,
        pinCode: addr.pinCode,
      }));
    },
    [setDetails]
  );

  // Pre-fill once per signed-in customer, only into fields still blank.
  if (customer && prefilledFor !== customer.id) {
    setPrefilledFor(customer.id);
    const [first, ...rest] = (customer.name ?? "").trim().split(/\s+/);
    setDetails((d) => ({
      ...d,
      firstName: d.firstName || first || "",
      lastName: d.lastName || rest.join(" "),
      email: d.email || customer.email,
      phone: d.phone || customer.phone,
    }));
    const addr = customer.addresses.find((a) => a.isDefault) ?? customer.addresses[0];
    if (addr && !details.address) applyAddress(addr);
  }

  const useDifferentAddress = useCallback(() => {
    setSavedAddress(null);
    setDetails((d) => ({ ...d, ...EMPTY_ADDRESS }));
  }, [setDetails]);

  // After a confirmed order, keep the delivery address on the account
  // (the server reuses an identical saved entry instead of duplicating it).
  useEffect(() => {
    if (!orderPlaced || !customer || saved.current) return;
    saved.current = true;
    accountApi("addresses", {
      method: "POST",
      body: {
        label: savedAddress?.label || "Home",
        firstName: details.firstName,
        lastName: details.lastName,
        address: details.address,
        apartment: details.apartment,
        city: details.city,
        state: details.state,
        pinCode: details.pinCode,
        phone: details.phone,
        skipIfDuplicate: true,
      },
    })
      .then(() => refreshSession())
      .catch(() => {});
  }, [orderPlaced, customer, details, savedAddress]);

  return {
    customer,
    sessionReady: session.status === "ready",
    addresses: customer?.addresses ?? [],
    savedAddress,
    lastOrderId,
    applyAddress,
    useDifferentAddress,
  };
}
