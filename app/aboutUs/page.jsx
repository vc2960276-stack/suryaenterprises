import Link from "next/link";
import { Award, Beaker, ChevronRight, Globe, Phone, Target, Users } from "lucide-react";
import PageHeader from "../components/shop/PageHeader";
import { SITE, telHref } from "../config/site";

export const metadata = {
  title: "About us",
  description: "SURYAENTERPRISES — formerly Solar Crop Science — manufactures crop-protection products for Indian farmers.",
};

// Company figures carried over unchanged from the original About page.
const STATS = [
  { value: "12+", label: "Years of excellence" },
  { value: "150+", label: "Innovative products" },
  { value: "50k+", label: "Farmers empowered" },
  { value: "22", label: "States covered" },
];

const PILLARS = [
  {
    icon: Beaker,
    title: "Scientific excellence",
    text: "Our products are the result of rigorous research, cutting-edge technology, and a team of dedicated experts who share a passion for agricultural progress. By harnessing chemistry, biology and agronomy, we develop solutions for the challenges farmers face today.",
  },
  {
    icon: Globe,
    title: "Commitment to sustainability",
    text: "Every product we create is designed to maximise yields while minimising environmental impact. From responsible sourcing of raw materials to eco-friendly packaging, sustainability is woven into how SURYAENTERPRISES works.",
  },
  {
    icon: Users,
    title: "Empowering farmers",
    text: "More than a provider of agrochemical solutions, we see ourselves as partners in your success — through knowledge-sharing, education and ongoing support that help farmers overcome challenges and achieve remarkable results.",
  },
];

export default function AboutPage() {
  return (
    <main className="pb-3">
      <PageHeader
        eyebrow="Est. 2012 • Gujarat, India"
        title="Welcome to SURYAENTERPRISES"
        subtitle="Your Trusted Partner in Agrochemical Excellence!"
        image="/assets/marketplace/hero-paddy-sunrise.svg"
        crumbs={[{ label: "About Us" }]}
      />

      <div className="shell mt-3 space-y-3">
        {/* Intro + stats */}
        <section aria-labelledby="intro-heading" className="panel grid gap-5 p-5 md:grid-cols-[1.4fr_1fr] md:p-6">
          <div>
            <p className="eyebrow">Who we are</p>
            <h2 id="intro-heading" className="mt-1 font-display text-[22px] font-extrabold leading-tight text-ink md:text-2xl">
              Allies in cultivating success
            </h2>
            <p className="mt-3 text-[15px] leading-6 text-ink-2">
              At SURYAENTERPRISES, we&apos;re not just an agrochemical company. Based in the agricultural heartland of Gujarat,
              India, we&apos;ve established ourselves as a beacon of quality, innovation and sustainability in the industry.
            </p>
            <p className="mt-3 border-l-4 border-harvest pl-3 text-[14px] leading-6 text-ink-2">
              In business for over 12 years, formerly known as &apos;Solar Crop Science&apos;, our journey began with a simple
              mission: to empower farmers and nourish the earth.
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-2 self-start">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-lg bg-brand-tint px-3 py-4 text-center">
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-2xl font-extrabold tabular-nums text-brand">{s.value}</dd>
                <dd className="mt-0.5 text-xs text-ink-2">{s.label}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Mission */}
        <section aria-labelledby="mission-heading" className="panel flex gap-4 p-5 md:p-6">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-harvest-tint text-earth">
            <Target className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
          </span>
          <div>
            <h2 id="mission-heading" className="font-display text-[22px] font-extrabold text-ink md:text-2xl">
              Our mission
            </h2>
            <p className="mt-2 max-w-4xl text-[15px] leading-6 text-ink-2">
              To empower farmers and growers with the tools they need to cultivate healthy, productive crops while nurturing
              the land that sustains us all — striking a balance between technological innovation and sustainable practice so
              future generations inherit a thriving planet.
            </p>
          </div>
        </section>

        {/* Pillars */}
        <ul className="grid gap-3 md:grid-cols-3">
          {PILLARS.map((p) => (
            <li key={p.title} className="panel p-5 transition-shadow hover:shadow-[0_4px_16px_rgba(20,33,26,0.10)]">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-tint text-brand">
                <p.icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <h3 className="mt-3 font-display text-lg font-extrabold text-ink">{p.title}</h3>
              <p className="mt-1.5 text-[14px] leading-6 text-ink-2">{p.text}</p>
            </li>
          ))}
        </ul>

        {/* Legacy + CTA */}
        <section aria-labelledby="legacy-heading" className="on-dark grid gap-4 rounded-lg bg-brand-deep p-5 text-white md:grid-cols-[1fr_auto] md:items-center md:p-6">
          <div className="flex gap-4">
            <Award className="h-9 w-9 shrink-0 text-harvest" strokeWidth={1.75} aria-hidden="true" />
            <div>
              <h2 id="legacy-heading" className="font-display text-[22px] font-extrabold md:text-2xl">
                Our legacy of excellence
              </h2>
              <p className="mt-1.5 max-w-3xl text-[14px] leading-6 text-white/85">
                From our beginnings as Solar Crop Science to SURYAENTERPRISES today, over a decade of commitment to quality,
                innovation and farmer success — and we keep building on it across India.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/products" className="btn btn-cart">
              Explore our products
              <ChevronRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            </Link>
            <Link href="/contact" className="btn border border-white/40 text-white hover:bg-white/10">
              Contact our team
            </Link>
            <a href={telHref} className="btn border border-white/40 text-white hover:bg-white/10">
              <Phone className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              {SITE.helpline.display}
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
