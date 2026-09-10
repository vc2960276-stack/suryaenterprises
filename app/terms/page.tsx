import React from 'react';
import Link from 'next/link';
import {
    FileText,
    ShieldCheck,
    AlertTriangle,
    Scale,
    Leaf,
    HelpCircle,
    CheckCircle2,
    ArrowLeft,
    Building2,
    Mail,
    MapPin,
    Phone,
    Lock,
    Globe
} from 'lucide-react';

export default function TermsPage() {
    const lastUpdated = "October 24, 2024";

    const sections = [
        { id: "acceptance", title: "1. Acceptance of Terms" },
        { id: "intellectual-property", title: "2. Intellectual Property" },
        { id: "product-usage", title: "3. Product Usage & Agricultural Safety" },
        { id: "disclaimer", title: "4. Disclaimer & Yield Warranties" },
        { id: "limitation", title: "5. Limitation of Liability" },
        { id: "governing-law", title: "6. Governing Law & Jurisdiction" },
        { id: "contact", title: "7. Contact Information" },
    ];

    return (
        <div className="min-h-screen bg-slate-50/50 text-slate-800 font-sans pb-20">

            {/* ================= HERO HEADER ================= */}
            <section className="relative w-full bg-slate-900 text-white py-16 md:py-20 px-6 md:px-12 lg:px-16 overflow-hidden">
                {/* Subtle Background Pattern & Gradient Overlay */}
                <div
                    className="absolute inset-0 opacity-20 bg-cover bg-center"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop')`,
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-emerald-950/80" />

                <div className="relative z-10 max-w-7xl mx-auto">
                    {/* Back link */}
                    <Link
                        href="/"
                        className="inline-flex items-center text-xs md:text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors mb-6 group"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1.5 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>

                    {/* Pill Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4 text-xs font-semibold uppercase tracking-wider">
                        <FileText className="w-3.5 h-3.5" />
                        Legal Documentation
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
                        Terms & <span className="text-emerald-400">Conditions</span>
                    </h1>

                    <p className="text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed">
                        Please read these terms and conditions carefully before using our products, website, or agrochemical services provided by SURYAENTERPRISES  Limited.
                    </p>

                    <div className="mt-6 flex items-center text-xs text-slate-400 font-medium">
                        <span>Last Updated: {lastUpdated}</span>
                        <span className="mx-2">•</span>
                        <span>Applies to all products & digital services</span>
                    </div>
                </div>
            </section>

            {/* ================= MAIN CONTENT ================= */}
            <main className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* SIDEBAR NAVIGATION */}
                    <aside className="lg:col-span-4 space-y-6">
                        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm sticky top-8">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Scale className="w-4 h-4 text-emerald-600" />
                                Table of Contents
                            </h3>
                            <nav className="space-y-1">
                                {sections.map((item) => (
                                    <a
                                        key={item.id}
                                        href={`#${item.id}`}
                                        className="block text-sm text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/60 px-3 py-2 rounded-lg font-medium transition-all"
                                    >
                                        {item.title}
                                    </a>
                                ))}
                            </nav>

                            <hr className="my-6 border-slate-100" />

                            {/* Quick Assistance Box */}
                            <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-4">
                                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-1">
                                    <HelpCircle className="w-4 h-4 text-emerald-600" />
                                    Have questions?
                                </div>
                                <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                                    Our compliance and agricultural advisory team is here to assist you with legal or product inquiries.
                                </p>
                                <a
                                    href="mailto:support@suryaenterprises.com"
                                    className="inline-flex items-center justify-center w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs py-2 px-3 rounded-lg transition-colors shadow-sm"
                                >
                                    Contact Compliance Team
                                </a>
                            </div>
                        </div>
                    </aside>

                    {/* DOCUMENT BODY */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Intro Alert Box */}
                        <div className="bg-white border-l-4 border-emerald-500 rounded-r-2xl p-6 shadow-sm border-y border-r border-slate-200/80">
                            <div className="flex items-start gap-3">
                                <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-bold text-slate-900 text-base mb-1">Important Notice</h4>
                                    <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                                        By accessing or using any services, products, or formulations provided by <strong className="text-slate-900">SURYAENTERPRISES  Limited</strong>, you agree to be bound by these Terms and Conditions. If you do not agree with any part, please discontinue product usage and website access immediately.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Section 1 */}
                        <section id="acceptance" className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-sm">
                            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2.5">
                                <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-black">01</span>
                                Acceptance of Terms
                            </h2>
                            <div className="space-y-3 text-slate-600 text-sm md:text-base leading-relaxed">
                                <p>
                                    These Terms and Conditions (&quot;Terms&quot;) govern your usage of the website, mobile applications, catalog services, and agrochemical physical products supplied by <strong>SURYAENTERPRISES  Limited</strong> (&quot;Company&quot;, &quot;We&quot;, &quot;Us&quot;, or &quot;Our&quot;).
                                </p>
                                <p>
                                    These terms apply to all visitors, registered dealers, agricultural distributors, farmers, and commercial enterprise clients who access our ecosystem or purchase our formulations.
                                </p>
                            </div>
                        </section>

                        {/* Section 2 */}
                        <section id="intellectual-property" className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-sm">
                            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2.5">
                                <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-black">02</span>
                                Intellectual Property Rights
                            </h2>
                            <div className="space-y-3 text-slate-600 text-sm md:text-base leading-relaxed">
                                <p>
                                    All content, formulations, chemical patents, trademarks, logos, brand names (including SURYAENTERPRISES  Limited), graphics, and software scripts are the exclusive intellectual property of the Company and protected under Indian and international IP laws.
                                </p>
                                <ul className="list-disc pl-5 space-y-2 text-slate-600 text-sm">
                                    <li>You may not copy, reproduce, or reverse-engineer any chemical compounds or formulations.</li>
                                    <li>Re-labeling or repackaging products without written authorization is strictly prohibited.</li>
                                    <li>Trademarks and logos cannot be used for third-party commercial marketing without explicit consent.</li>
                                </ul>
                            </div>
                        </section>

                        {/* Section 3 - Agrochemical Specific */}
                        <section id="product-usage" className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-sm">
                            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2.5">
                                <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-sm font-black">03</span>
                                Product Usage & Agricultural Safety
                            </h2>
                            <div className="space-y-4 text-slate-600 text-sm md:text-base leading-relaxed">
                                <p>
                                    Agrochemical products—including fertilizers, pesticides, and plant growth regulators—must be handled with extreme care and strict adherence to provided guidelines:
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                                        <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm mb-1">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                            Dosage Instructions
                                        </div>
                                        <p className="text-xs text-slate-500">
                                            Products must be diluted and applied strictly according to the product label instructions and crop type.
                                        </p>
                                    </div>

                                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                                        <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm mb-1">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                            Safety Gear
                                        </div>
                                        <p className="text-xs text-slate-500">
                                            Applicators must wear protective clothing, gloves, and masks when handling chemical concentrates.
                                        </p>
                                    </div>
                                </div>

                                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 p-3.5 rounded-xl font-medium">
                                    <strong>Warning:</strong> Improper storage, mixing with unapproved chemicals, or application during adverse weather conditions is at the user&apos;s sole risk.
                                </p>
                            </div>
                        </section>

                        {/* Section 4 */}
                        <section id="disclaimer" className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-sm">
                            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2.5">
                                <span className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center text-sm font-black">04</span>
                                Disclaimer & Yield Warranties
                            </h2>
                            <div className="space-y-3 text-slate-600 text-sm md:text-base leading-relaxed">
                                <p>
                                    While SURYAENTERPRISES  Limited manufactures high-purity, laboratory-tested products, final agricultural yields depend on variable external factors beyond our control, including:
                                </p>
                                <ul className="list-disc pl-5 space-y-1.5 text-slate-600 text-sm">
                                    <li>Soil conditions, quality, and pH levels</li>
                                    <li>Climatic changes, rainfall, temperature, and drought</li>
                                    <li>Pesticide resistance and pest infestation intensity</li>
                                    <li>User storage, application timing, and farming techniques</li>
                                </ul>
                                <p className="text-sm pt-2">
                                    Consequently, the Company does not guarantee specific crop yield volume or financial returns.
                                </p>
                            </div>
                        </section>

                        {/* Section 5 */}
                        <section id="limitation" className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-sm">
                            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2.5">
                                <span className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-black">05</span>
                                Limitation of Liability
                            </h2>
                            <div className="space-y-3 text-slate-600 text-sm md:text-base leading-relaxed">
                                <p>
                                    To the maximum extent permitted by applicable law, SURYAENTERPRISES  Limited shall not be liable for any indirect, incidental, consequential, or punitive damages resulting from product misuse, crop loss, soil contamination due to improper dosage, or unauthorized handling.
                                </p>
                                <p className="text-xs md:text-sm bg-slate-50 p-4 rounded-xl border border-slate-200/60 font-mono text-slate-700">
                                    Total cumulative liability for any verified defective batch shall be limited strictly to the replacement of the product or refund of the purchase price.
                                </p>
                            </div>
                        </section>

                        {/* Section 6 */}
                        <section id="governing-law" className="bg-white border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-sm">
                            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2.5">
                                <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-black">06</span>
                                Governing Law & Jurisdiction
                            </h2>
                            <div className="space-y-3 text-slate-600 text-sm md:text-base leading-relaxed">
                                <p>
                                    These Terms are governed by and construed in accordance with the laws of <strong>India</strong>. Any disputes, claims, or legal actions arising out of these Terms or product usage shall be subject to the exclusive jurisdiction of the courts located in <strong>Delhi, India</strong>.
                                </p>
                            </div>
                        </section>

                        {/* Section 7 - Contact */}
                        <section id="contact" className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white rounded-3xl p-8 md:p-10 shadow-md">
                            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
                                <Leaf className="w-4 h-4" />
                                SURYAENTERPRISES  Limited
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                Have Legal or Compliance Questions?
                            </h2>
                            <p className="text-slate-300 text-sm mb-8 leading-relaxed max-w-xl">
                                If you require clarification on our terms, safety data sheets (SDS), or dealer agreement policies, please contact our administrative headquarters.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs md:text-sm">
                                <div className="flex items-start gap-3 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
                                    <Building2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                                    <div>
                                        <span className="text-slate-400 block text-xs">Headquarters</span>
                                        <strong className="text-white font-semibold">Delhi, India</strong>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
                                    <Mail className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                                    <div>
                                        <span className="text-slate-400 block text-xs">Email Legal Team</span>
                                        <strong className="text-white font-semibold">legal@suryaenterprises.com</strong>
                                    </div>
                                </div>
                            </div>
                        </section>

                    </div>

                </div>
            </main>

        </div>
    );
}