import Link from "next/link";
import PaymentPartners from "../components/shop/PaymentPartners";
import PolicyLayout from "../components/shop/PolicyLayout";
import { SITE } from "../config/site";

const { payment, returns } = SITE.policies;

const sections = [
  {
    id: "methods",
    title: "Accepted payment methods",
    content: (
      <>
        <p>
          The Marketplace currently accepts <strong>{SITE.payments.join(", ")}</strong>. When you place an order, a UPI
          payment request is generated through our payment partner PayU. You can scan the QR code with any UPI app
          (Google Pay, PhonePe, Paytm, BHIM or your bank’s app) or tap “Open UPI app” on a phone.
        </p>
        <p>Cash on delivery, cards, net banking and wallets are not offered at present. If that changes, the options will appear at checkout and this policy will be updated.</p>
        <PaymentPartners className="border border-line" />
      </>
    ),
  },
  {
    id: "how-it-works",
    title: "How a payment is confirmed",
    content: (
      <>
        <ol>
          <li>Submit the checkout form. A unique order ID and a UPI payment request for the exact order total are created.</li>
          <li>Complete the payment in your UPI app within <strong>{payment.pendingWindowMinutes} minutes</strong>; after that the request expires.</li>
          <li>Return to the payment screen and tap “I have paid — check payment”. We verify the status with PayU before confirming the order.</li>
          <li>On success you see the confirmation screen and your cart is cleared. Payments are also verified on our servers, so a successful payment is recorded against your order ID even if you close the page.</li>
        </ol>
        <p>Keep the order ID shown on the payment screen; it is the reference for every query.</p>
      </>
    ),
  },
  {
    id: "pending",
    title: "Pending payments",
    content: (
      <p>
        A payment can show as pending for a few minutes while your bank and the UPI network settle it. Please do not pay
        a second time. Tap “check payment” again after a short while. If it is still pending after the{" "}
        {payment.pendingWindowMinutes}-minute window and your account has not been debited, simply place the order again.
        If your account <strong>was</strong> debited but the order is not confirmed, contact us with the order ID and the
        UPI transaction reference (UTR) — we will reconcile it with PayU and either confirm the order or refund you.
      </p>
    ),
  },
  {
    id: "failed",
    title: "Failed payments and auto-reversal",
    content: (
      <>
        <p>
          If a payment fails, no order is created. Any amount debited for a failed transaction is reversed automatically
          by your bank, usually within <strong>{payment.autoReversalTimeline}</strong>. If the reversal has not arrived
          after that period, share the UTR with us and we will take it up with PayU and your bank.
        </p>
        <p>Common reasons for failure are an incorrect UPI PIN, a daily UPI limit, insufficient balance or a bank outage. None of these are charged by us.</p>
      </>
    ),
  },
  {
    id: "security",
    title: "Security and data",
    content: (
      <>
        <ul>
          <li>Your UPI PIN, bank account and card details are entered only in your UPI app — <strong>never</strong> on our website — and are never shared with or stored by us.</li>
          <li>PayU is an RBI-regulated payment aggregator. We share only the order ID, amount, your name, email and mobile number to create the payment request.</li>
          <li>We will never call or message you asking for your UPI PIN, OTP or to “receive” a payment. Report any such attempt to {SITE.helpline.display}.</li>
        </ul>
      </>
    ),
  },
  {
    id: "invoice",
    title: "Pricing, GST and invoices",
    content: (
      <p>
        All prices are in Indian Rupees. A GST invoice from {SITE.legalName} (GSTIN {SITE.offices[0].gstin} /{" "}
        {SITE.offices[1]?.gstin}) is issued for every confirmed order and sent with the consignment. If you need the
        invoice in your business name with your GSTIN, mention it in the order notes at checkout or contact us before dispatch.
      </p>
    ),
  },
  {
    id: "refunds",
    title: "Refunds",
    content: (
      <p>
        All refunds — for cancellations, failed deliveries or approved claims — are made to the original UPI account
        through PayU and normally reach you within <strong>{returns.refundTimeline}</strong>. See the{" "}
        <Link href="/return-refund-policy">Return &amp; Refund Policy</Link> and{" "}
        <Link href="/cancellation-policy">Cancellation Policy</Link>.
      </p>
    ),
  },
  {
    id: "help",
    title: "Payment help",
    content: (
      <p>
        Call {SITE.helpline.display} ({SITE.helpline.hours}) or email <a href={`mailto:${SITE.email}`}>{SITE.email}</a>{" "}
        with the order ID and UTR. See also our <Link href="/faqs#payments">payment FAQs</Link>.
      </p>
    ),
  },
];

export default function PaymentPolicyPage() {
  return (
    <PolicyLayout
      eyebrow="Customer service"
      title="Payment Policy"
      intro="UPI via PayU: how payments are confirmed, what happens when one is pending or fails, and how refunds come back."
      sections={sections}
    />
  );
}
