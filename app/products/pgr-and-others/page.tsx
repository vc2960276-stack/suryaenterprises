import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ProductGallery from "../components/productGallery";

export const metadata: Metadata = {
    title: "PGR and Others | Surya Enterprises",
    description:
        "Explore plant growth regulators and other agricultural solutions from Surya Enterprises  Limited.",
};

const features = [
    {
        number: "01",
        title: "Plant Growth Regulation",
        description:
            "Choose plant growth regulators for specific crop development objectives, based on the product’s registered uses and label directions.",
        background: "from-green-50 to-emerald-50",
        border: "border-green-100",
        icon: "bg-emerald-500",
        accent: "text-emerald-600",
    },
    {
        number: "02",
        title: "Crop-Specific Solutions",
        description:
            "Consider your crop, growth stage, and field conditions when selecting specialized products for your agricultural needs.",
        background: "from-purple-50 to-blue-50",
        border: "border-purple-100",
        icon: "bg-violet-500",
        accent: "text-violet-600",
    },
    {
        number: "03",
        title: "Responsible Application",
        description:
            "Follow product-specific guidance for timing, application rates, compatibility, and safety precautions before every use.",
        background: "from-orange-50 to-amber-50",
        border: "border-orange-100",
        icon: "bg-orange-500",
        accent: "text-orange-600",
    },
];

function LeafIcon({ className = "" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            <path d="M20 3c-5 4-10 0-14 5a7 7 0 0 0 10 10c5-4 1-9 4-15Z" />
            <path d="M3 21c2-6 6-10 12-13" />
        </svg>
    );
}

function ArrowIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
            aria-hidden="true"
        >
            <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
    );
}

export default function PgrAndOthersPage() {
    return (
        <main className="min-h-screen bg-[#f0faf5] font-sans text-slate-800">
            {/* Hero */}
            <section
                aria-labelledby="page-title"
                className="relative isolate flex min-h-[460px] items-center overflow-hidden md:min-h-[640px]"
            >
                <Image
                    src="/assets/images/hand-palm-corn.jpg"
                    alt=""
                    fill
                    priority
                    sizes="100vw"
                    className="-z-30 object-cover"
                />

                <div className="absolute inset-0 -z-20 bg-gradient-to-r from-green-950/85 via-green-950/60 to-green-950/40" />

                <div className="mx-auto w-full max-w-7xl px-6 pb-28 pt-20 md:px-10">
                    <nav
                        aria-label="Breadcrumb"
                        className="mb-8 flex flex-wrap items-center gap-3 text-sm text-green-100"
                    >
                        <Link
                            href="/"
                            className="underline-offset-4 hover:underline"
                        >
                            Home
                        </Link>

                        <span aria-hidden="true">/</span>
                        <span>Products</span>
                        <span aria-hidden="true">/</span>

                        <span aria-current="page" className="text-yellow-300">
                            PGR and Others
                        </span>
                    </nav>

                    <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-green-100">
                        Surya Enterprises  Limited
                    </p>

                    <h1
                        id="page-title"
                        className="text-5xl font-extrabold leading-tight tracking-tight text-white sm:text-7xl lg:text-8xl"
                    >
                        PGR <span className="text-yellow-300">&amp; Others</span>
                    </h1>

                    <p className="mt-6 max-w-xl text-lg leading-relaxed text-green-50 md:text-2xl">
                        Supporting crop development.
                        <br />
                        Solutions for every growing season.
                    </p>

                    <a
                        href="#pgr-solutions"
                        className="mt-8 inline-flex items-center gap-3 rounded-lg bg-yellow-300 px-6 py-3.5 font-semibold text-green-950 transition-colors hover:bg-yellow-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                    >
                        Explore Solutions
                        <ArrowIcon />
                    </a>
                </div>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-36 bg-gradient-to-t from-[#f0faf5] to-transparent" />
            </section>

            {/* Main content */}
            <div className="relative mx-auto -mt-6 max-w-[1760px] px-4 pb-10 sm:px-8">
                <div className="rounded-t-2xl bg-white px-6 py-10 shadow-[0_12px_45px_rgba(20,65,40,0.08)] md:px-12 md:py-14 lg:px-16">
                    {/* Introduction */}
                    <section aria-labelledby="about-heading">
                        <div className="mb-8 flex items-center gap-3">
                            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                                <LeafIcon className="h-8 w-8" />
                            </span>

                            <div>
                                <p className="text-sm font-bold tracking-wide text-green-600">
                                    PGR &amp; SPECIALIZED SOLUTIONS
                                </p>

                                <div className="mt-2 h-px w-12 bg-green-300" />
                            </div>
                        </div>

                        <h2
                            id="about-heading"
                            className="text-3xl font-bold leading-tight tracking-tight text-slate-900 md:text-5xl"
                        >
                            Understanding Growth,
                            <br />
                            <span className="text-green-700">
                                Supporting Crop Development
                            </span>
                        </h2>

                        <p className="my-8 border-l-4 border-green-500 pl-5 text-lg italic leading-relaxed text-slate-600 md:text-xl">
                            Thoughtful crop management means choosing the right solution
                            for the right stage of development.
                        </p>

                        <p className="text-base leading-8 text-slate-600 md:text-lg">
                            <strong className="font-semibold text-green-700">
                                SURYAENTERPRISES  Limited
                            </strong>{" "}
                            supports farmers with agricultural solutions for their crop
                            management needs. Our PGR and Others category brings together
                            plant growth regulators and specialized products for
                            crop-specific applications.
                        </p>

                        <p className="mt-5 text-base leading-8 text-slate-600 md:text-lg">
                            Plant growth regulators influence specific plant processes;
                            their effects depend on the product, crop, application rate,
                            and timing. They are not a substitute for balanced nutrition
                            or sound farming practices. Always select products according
                            to their approved uses and label instructions.
                        </p>
                    </section>

                    {/* Feature cards */}
                    <section
                        id="pgr-solutions"
                        aria-labelledby="solutions-heading"
                        className="scroll-mt-8 pt-14 md:pt-16"
                    >
                        <header className="mb-10 text-center">
                            <h2
                                id="solutions-heading"
                                className="text-3xl font-bold tracking-tight md:text-4xl"
                            >
                                Thoughtful{" "}
                                <span className="text-green-600">
                                    Growth Management
                                </span>
                            </h2>

                            <p className="mt-3 text-base leading-relaxed text-slate-500">
                                Informed choices for your crop&apos;s changing needs
                            </p>
                        </header>

                        <div className="grid gap-6 md:grid-cols-3">
                            {features.map((feature) => (
                                <article
                                    key={feature.number}
                                    className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br p-7 transition-shadow hover:shadow-lg md:p-8 ${feature.background} ${feature.border}`}
                                >
                                    <div
                                        aria-hidden="true"
                                        className={`absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-[0.06] ${feature.icon}`}
                                    />

                                    <span
                                        aria-hidden="true"
                                        className={`mb-7 flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-bold text-white shadow-md ${feature.icon}`}
                                    >
                                        {feature.number}
                                    </span>

                                    <h3 className="mb-4 text-2xl font-bold">
                                        {feature.title}
                                    </h3>

                                    <p className="leading-7 text-slate-600">
                                        {feature.description}
                                    </p>

                                    <div
                                        aria-hidden="true"
                                        className={`mt-6 ${feature.accent}`}
                                    >
                                        <ArrowIcon />
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    <ProductGallery category="PGR and Others" />

                    {/* Bottom banner */}
                    <section
                        aria-labelledby="callout-heading"
                        className="mt-12 rounded-3xl bg-gradient-to-r from-green-50 to-emerald-50 p-3 md:p-4"
                    >
                        <div className="relative overflow-hidden rounded-2xl border border-green-200 bg-white/80 px-6 py-12 text-center md:px-12">
                            <div
                                aria-hidden="true"
                                className="absolute -left-16 -top-16 h-36 w-36 rounded-full bg-green-50"
                            />

                            <LeafIcon className="mx-auto mb-5 h-10 w-10 text-green-500" />

                            <h2
                                id="callout-heading"
                                className="relative text-3xl font-bold leading-tight tracking-tight md:text-5xl"
                            >
                                We understand your{" "}
                                <span className="text-green-600">
                                    crop&apos;s need
                                </span>
                            </h2>

                            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
                                Take a considered approach to crop development with
                                agricultural solutions from{" "}
                                <strong className="text-green-700">
                                    SURYAENTERPRISES
                                </strong>
                                . Match each product to your crop, its growth stage, and
                                your field conditions.
                            </p>

                            <p className="mx-auto mt-6 max-w-2xl rounded-xl bg-green-50 px-5 py-4 text-sm leading-6 text-green-800">
                                Use products only for approved applications. Follow all
                                label instructions for dosage, timing, compatibility,
                                protective equipment, and applicable harvest restrictions.
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}