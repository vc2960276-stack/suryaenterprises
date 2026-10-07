import Link from "next/link";
import PolicyLayout from "../components/shop/PolicyLayout";
import { SITE } from "../config/site";

const { returns } = SITE.policies;

const sections = [
  {
    id: "overview",
    title: "Our approach",
    content: (
      <>
        <p>
          Crop-protection products are regulated, hazardous goods. For your safety and the safety of others in the supply
          chain, we cannot take back a chemical or seed pack once its seal has been broken. What we do promise is this: if
          a product reaches you damaged, leaking, wrong, short or expired, we will replace it or refund it.
        </p>
        <div className="callout">
          Claims must be raised within <strong>{returns.claimWindowDays} days of delivery</strong>, with photographs.
          Approved refunds are returned to the original UPI account within <strong>{returns.refundTimeline}</strong>.
        </div>
      </>
    ),
  },
  {
    id: "not-returnable",
    title: "What cannot be returned",
    content: (
      <>
        <ul>
          <li>Any pesticide, herbicide, fungicide, plant-growth regulator or other chemical whose seal, cap or pouch has been opened, punctured or tampered with.</li>
          <li>Seeds or other inputs whose packet has been opened (when these categories go live).</li>
          <li>Products that have been used, part-used, decanted or mixed.</li>
          <li>Products bought for one crop but found unsuitable for another — crop suitability must be checked on the label before ordering.</li>
          <li>Products damaged after delivery by improper storage, heat, moisture or handling.</li>
          <li>Change-of-mind returns of sealed products, except where the order is still cancellable under our <Link href="/cancellation-policy">Cancellation Policy</Link>.</li>
        </ul>
      </>
    ),
  },
  {
    id: "eligible-claims",
    title: "Eligible claims",
    content: (
      <>
        <table>
          <thead>
            <tr>
              <th>Issue</th>
              <th>What we need from you</th>
              <th>Resolution</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Damaged or leaking on arrival</td>
              <td>Photos of the outer box, the damaged pack and the shipping label; do not open or use the product.</td>
              <td>Replacement, or refund if stock is unavailable.</td>
            </tr>
            <tr>
              <td>Wrong product, pack size or quantity</td>
              <td>Photo of the product label and the invoice/packing slip.</td>
              <td>Correct item dispatched, or refund of the affected item.</td>
            </tr>
            <tr>
              <td>Expired or near-expiry on arrival</td>
              <td>Photo of the batch number and expiry date on the pack.</td>
              <td>Replacement from a fresh batch, or refund.</td>
            </tr>
            <tr>
              <td>Missing items</td>
              <td>Photo of everything received alongside the packing slip.</td>
              <td>Missing item dispatched, or refund.</td>
            </tr>
          </tbody>
        </table>
        <p>Where a replacement is agreed, the damaged or wrong item is collected by our carrier in its original packaging; please keep it sealed and stored safely until pickup.</p>
      </>
    ),
  },
  {
    id: "how-to-claim",
    title: "How to raise a claim",
    content: (
      <>
        <ol>
          <li>
            Within {returns.claimWindowDays} days of delivery, email <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or
            call {SITE.helpline.display} ({SITE.helpline.hours}) with your <strong>order ID</strong>.
          </li>
          <li>Attach clear photographs as listed above. For leakage, include a photo showing the extent of the leak and any affected items.</li>
          <li>We acknowledge the claim within 48 hours and may ask for a short video or additional photos.</li>
          <li>Once approved, we arrange pickup (if needed) and dispatch the replacement or initiate the refund.</li>
        </ol>
      </>
    ),
  },
  {
    id: "refunds",
    title: "Refund method and timeline",
    content: (
      <>
        <ul>
          <li>Refunds are made only to the <strong>original UPI account</strong> used for payment, through PayU. We cannot refund to a different account or in cash.</li>
          <li>Approved refunds are initiated within 2 working days and normally reach your account within <strong>{returns.refundTimeline}</strong>, depending on your bank.</li>
          <li>The refund covers the product value and GST for the affected item. Delivery charges are refunded when the whole order is affected or the issue is attributable to us.</li>
          <li>If a refund has not arrived after the stated period, share the UPI transaction reference with us and we will raise it with PayU.</li>
        </ul>
      </>
    ),
  },
  {
    id: "safety-disposal",
    title: "Safety during a claim",
    content: (
      <p>
        Do not attempt to repack, clean up or dispose of a leaking pesticide yourself without gloves and ventilation. Keep
        it away from children, animals, food and water, and follow the first-aid guidance on the label if there has been
        any contact. See our <Link href="/product-safety-disclaimer">Product Safety Disclaimer</Link>.
      </p>
    ),
  },
  {
    id: "disputes",
    title: "If you disagree with a decision",
    content: (
      <p>
        You may escalate to our Grievance Officer under the <Link href="/grievance-redressal">Grievance Redressal Policy</Link>.
        Consumers also retain their rights under the Consumer Protection Act, 2019.
      </p>
    ),
  },
];

export default function ReturnRefundPolicyPage() {
  return (
    <PolicyLayout
      eyebrow="Customer service"
      title="Return & Refund Policy"
      intro="No returns on opened chemicals or seeds for safety — but damaged, wrong, short or expired-on-arrival items are replaced or refunded."
      sections={sections}
    />
  );
}
