import Link from "next/link";
import PolicyLayout from "../components/shop/PolicyLayout";
import { SITE } from "../config/site";

const sections = [
  {
    id: "read-the-label",
    title: "Always read the label first",
    content: (
      <>
        <div className="callout callout-warn">
          <strong>Pesticides are poisons.</strong> {SITE.labelDisclaimer}
        </div>
        <p>
          The label and leaflet approved by the Central Insecticides Board &amp; Registration Committee (CIB&amp;RC) are
          the only authoritative source for the crops, target pests, dose, dilution, method of application, waiting
          period before harvest, re-entry interval and antidote for each product. Nothing on this website replaces the
          label.
        </p>
      </>
    ),
  },
  {
    id: "registration",
    title: "Registration and legal status",
    content: (
      <>
        <ul>
          <li>Pesticides sold in India must be registered with the CIB&amp;RC under the Insecticides Act, 1968 and the Insecticides Rules, 1971. The registration number is printed on the label.</li>
          <li>Use of a product on a crop or pest not listed on its label is not permitted under the Act.</li>
          <li>Sale, stocking and distribution of pesticides require a licence from the State Agriculture Department. Buyers who resell must hold such a licence.</li>
          <li>Some molecules are banned or restricted in particular states or crops; it is the buyer’s responsibility to check local restrictions before purchase and use.</li>
        </ul>
      </>
    ),
  },
  {
    id: "ppe",
    title: "Personal protective equipment (PPE)",
    content: (
      <>
        <p>Wear the protective equipment stated on the label every time you handle, mix or apply a product. As a minimum:</p>
        <ul>
          <li>Chemical-resistant gloves, long sleeves and trousers, and closed footwear.</li>
          <li>A face mask or respirator suited to the product, and protective eyewear when mixing or spraying.</li>
          <li>Do not eat, drink, smoke or chew while handling pesticides. Wash hands, face and exposed skin with soap and water afterwards, and wash work clothes separately.</li>
          <li>Never spray against the wind, and keep other people and animals out of the field during application and the re-entry interval.</li>
        </ul>
      </>
    ),
  },
  {
    id: "dosage",
    title: "Dosage, mixing and application",
    content: (
      <ul>
        <li>Use only the dose per acre or hectare and the dilution printed on the label. More is not better: over-dosing damages crops, leaves residues and breeds resistance.</li>
        <li>Measure with proper measuring equipment; never use kitchen utensils.</li>
        <li>Do not tank-mix products unless the label permits it. Prepare only the quantity you can apply in one session.</li>
        <li>Observe the pre-harvest interval (PHI) stated on the label before harvesting treated produce.</li>
        <li>Follow label instructions for the spray equipment and nozzle type; calibrate sprayers regularly.</li>
      </ul>
    ),
  },
  {
    id: "storage",
    title: "Storage and transport",
    content: (
      <ul>
        <li>Store in the original, labelled container with the cap tightly closed — never in food or drink containers.</li>
        <li>Keep in a cool, dry, ventilated, locked place away from children, animals, food, feed, seeds and fertilisers, and away from direct sunlight and heat.</li>
        <li>Do not store near water sources or in living quarters.</li>
        <li>Transport upright and separately from food and feed; secure containers so they cannot tip or leak.</li>
      </ul>
    ),
  },
  {
    id: "disposal",
    title: "Disposal of containers and leftovers",
    content: (
      <ul>
        <li>Triple-rinse empty containers, puncture them so they cannot be reused and dispose of them as directed on the label or through a collection scheme. Never reuse pesticide containers for any purpose.</li>
        <li>Do not pour leftover spray or rinse water into drains, ponds, canals or wells. Apply it to the treated field as per the label.</li>
        <li>Expired or unwanted products should not be dumped; contact the local Agriculture Department for guidance.</li>
      </ul>
    ),
  },
  {
    id: "first-aid",
    title: "First aid and poisoning",
    content: (
      <>
        <div className="callout callout-warn">
          In case of poisoning, <strong>call a doctor or go to the nearest hospital immediately</strong> and take the
          product label with you. The label names the active ingredient and the antidote, if any.
        </div>
        <ul>
          <li><strong>Skin contact:</strong> remove contaminated clothing and wash the skin with plenty of soap and water.</li>
          <li><strong>Eye contact:</strong> rinse with clean running water for at least 15 minutes, holding the eyelids open.</li>
          <li><strong>Inhalation:</strong> move the person to fresh air and keep them resting.</li>
          <li><strong>Swallowed:</strong> do not induce vomiting unless the label says so; never give anything by mouth to an unconscious person.</li>
          <li>Poison Information Centre (AIIMS, New Delhi) 24×7 helpline: 1800-116-117.</li>
        </ul>
      </>
    ),
  },
  {
    id: "no-advice",
    title: "No agronomic advice; limitation of liability",
    content: (
      <>
        <p>
          Product listings, category descriptions, search results and any guidance from our helpline are general
          information only and do not constitute agronomic, veterinary or medical advice. Crop suitability, pest
          identification, timing and dose must be confirmed from the product label and, where needed, by a qualified
          agricultural extension officer, Krishi Vigyan Kendra or agronomist.
        </p>
        <p>
          To the extent permitted by law, {SITE.legalName} is not liable for loss, injury or damage arising from use of a
          product contrary to its label, from mixing with other products, from application in unsuitable weather or
          field conditions, or from failure to use the stated protective equipment. See our{" "}
          <Link href="/terms">Terms of Use</Link> and <Link href="/disclaimer">Disclaimer</Link>.
        </p>
      </>
    ),
  },
  {
    id: "report",
    title: "Reporting a product concern",
    content: (
      <p>
        If you suspect a product is counterfeit, adulterated, mislabelled or has caused an adverse effect, stop using it,
        keep the pack and batch details, and contact us at {SITE.helpline.display} or{" "}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. You may also inform the Insecticide Inspector of your district.
      </p>
    ),
  },
];

export default function ProductSafetyPage() {
  return (
    <PolicyLayout
      eyebrow="Safety"
      title="Product Safety Disclaimer"
      intro="Pesticides and agrochemicals must be handled, stored and applied exactly as the CIB&RC-approved label directs. Read this before using any product bought from us."
      sections={sections}
      related={[
        { name: "Terms of use", href: "/terms" },
        { name: "Disclaimer", href: "/disclaimer" },
        { name: "Return & refund policy", href: "/return-refund-policy" },
        { name: "Shipping policy", href: "/shipping-policy" },
        { name: "FAQs", href: "/faqs" },
      ]}
    />
  );
}
