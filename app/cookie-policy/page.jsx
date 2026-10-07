import Link from "next/link";
import PolicyLayout from "../components/shop/PolicyLayout";
import { SITE } from "../config/site";

const { cookies } = SITE.policies;

const sections = [
  {
    id: "what",
    title: "What cookies and local storage are",
    content: (
      <p>
        Cookies are small text files a website places in your browser. Local storage is a similar browser feature that
        lets a site remember information on your device without sending it to the server on every request. We use these
        technologies sparingly, and only for the purposes listed below.
      </p>
    ),
  },
  {
    id: "what-we-use",
    title: "What we use",
    content: (
      <>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Purpose</th>
              <th>Lifetime</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>surya-cart</code></td>
              <td>Local storage (essential)</td>
              <td>Remembers the products and quantities in your cart until you check out.</td>
              <td>Until you clear it or complete a payment</td>
            </tr>
            <tr>
              <td><code>surya-wishlist</code></td>
              <td>Local storage (essential)</td>
              <td>Remembers products you have saved to your wishlist.</td>
              <td>Until you remove them</td>
            </tr>
            <tr>
              <td><code>surya-recent</code></td>
              <td>Local storage (functional)</td>
              <td>Shows the products you viewed recently on the home page.</td>
              <td>Until you clear your browser data</td>
            </tr>
            <tr>
              <td><code>surya-pin</code></td>
              <td>Local storage (functional)</td>
              <td>Remembers the delivery PIN code you chose in “Deliver to”.</td>
              <td>Until you change or clear it</td>
            </tr>
          </tbody>
        </table>
        <p>
          These values stay on your device. They are not sent to us and are not used to track you across other websites.
          Our payment partner PayU and your UPI app may set their own cookies on their domains during payment, governed
          by their privacy policies.
        </p>
      </>
    ),
  },
  {
    id: "analytics",
    title: "Analytics and advertising cookies",
    content: cookies.usesAnalytics ? (
      <p>
        We use an analytics tool to understand how the website is used (pages visited, approximate location, device
        type) so we can improve it. Analytics data is aggregated and not used to identify you. You can opt out through
        your browser settings or the tool’s opt-out mechanism. We do not use advertising or retargeting cookies.
      </p>
    ) : (
      <p>
        We do <strong>not</strong> currently use analytics, advertising or retargeting cookies, and we do not share
        browsing data with advertisers. If we introduce an analytics tool, this policy will be updated and you will be
        asked for consent where the law requires it.
      </p>
    ),
  },
  {
    id: "control",
    title: "How to control them",
    content: (
      <>
        <ul>
          <li>Cart and wishlist items can be removed from the <Link href="/cart">Cart</Link> and <Link href="/wishlist">Wishlist</Link> pages.</li>
          <li>Clearing “site data” or “local storage” for www.suryaenter.in in your browser settings removes everything listed above.</li>
          <li>Browsers also let you block storage for specific sites. If you block it, the cart and checkout will not work.</li>
        </ul>
      </>
    ),
  },
  {
    id: "more",
    title: "More information",
    content: (
      <p>
        How we handle personal data is described in our <Link href="/privacy">Privacy Policy</Link>. Questions about this
        policy can be sent to <a href={`mailto:${SITE.grievanceEmail}`}>{SITE.grievanceEmail}</a>.
      </p>
    ),
  },
];

export default function CookiePolicyPage() {
  return (
    <PolicyLayout
      eyebrow="Privacy"
      title="Cookie Policy"
      intro="The handful of browser storage items this site uses, what each one does, and how to clear them."
      sections={sections}
    />
  );
}
