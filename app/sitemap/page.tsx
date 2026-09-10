import React from 'react';
import Link from 'next/link';
import {
    Map,
    Leaf,
    FlaskConical,
    Sprout,
    Bug,
    Factory,
    ShieldCheck,
    FileText,
    ArrowLeft,
    Building2,
    Mail,
    Users,
    TestTube,
    Truck,
    HelpCircle,
    Briefcase,
    ChevronRight,
    Globe
} from 'lucide-react';

export default function SitemapPage() {
    const categories = [
        {
            title: "Company & Overview",
            icon: Building2,
            color: "emerald",
            badgeBg: "bg-emerald-100 text-emerald-700",
            borderColor: "border-emerald-100",
            hoverBg: "hover:border-emerald-300",
            links: [
                { name: "Home Page", href: "/", desc: "Main landing page & company highlight" },
                { name: "About Us", href: "/#about", desc: "Our 25+ years history, mission & values" },
                { name: "Manufacturing Process", href: "/#manufacturing", desc: "4-step quality manufacturing workflow" },
                { name: "Careers & Culture", href: "/careers", desc: "Join India's leading agrochemical team" },
                { name: "Contact & Headquarters", href: "/contact", desc: "Get in touch with our Gujarat offices" },
            ]
        },
        {
            title: "Products & Solutions",
            icon: FlaskConical,
            color: "indigo",
            badgeBg: "bg-indigo-100 text-indigo-700",
            borderColor: "border-indigo-100",
            hoverBg: "hover:border-indigo-300",
            links: [
                { name: "All Products Overview", href: "/products", desc: "Complete catalog of agricultural solutions" },
                { name: "Agro Chemicals", href: "/products/chemicals", desc: "State-of-the-art precision chemicals" },
                { name: "Fertilizers & Nutrients", href: "/products/fertilizers", desc: "Optimal plant nutrition & growth enhancers" },
                { name: "Pesticides & Protection", href: "/products/pesticides", desc: "Crop-safeguarding eco-pesticides" },
                { name: "Plant Growth Regulators", href: "/products/growth-regulators", desc: "Advanced bio-stimulants for yields" },
            ]
        },
        {
            title: "Process & Innovation",
            icon: Factory,
            color: "amber",
            badgeBg: "bg-amber-100 text-amber-800",
            borderColor: "border-amber-100",
            hoverBg: "hover:border-amber-300",
            links: [
                { name: "Formulation R&D", href: "/process/formulation", desc: "Extensive crop research & chemical design" },
                { name: "State Facilities & Production", href: "/process/production", desc: "Modern factories adhering to standards" },
                { name: "Quality Control & Testing", href: "/process/testing", desc: "Rigorous laboratory testing for safety" },
                { name: "Pan-India Distribution Network", href: "/process/distribution", desc: "Covering 22+ states efficiently" },
            ]
        },
        {
            title: "Legal & Compliance",
            icon: ShieldCheck,
            color: "sky",
            badgeBg: "bg-sky-100 text-sky-700",
            borderColor: "border-sky-100",
            hoverBg: "hover:border-sky-300",
            links: [
                { name: "Terms & Conditions", href: "/terms", desc: "Legal rules & product disclaimers" },
                { name: "Privacy Policy", href: "/privacy", desc: "Data protection & privacy commitment" },
                { name: "Safety Data Sheets (SDS)", href: "/compliance/sds", desc: "Material hazard & handling documentation" },
                { name: "Quality Certifications", href: "/compliance/certifications", desc: "ISO & regulatory approvals" },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50/50 text-slate-800 font-sans pb-20">

            {/* ================= HERO HEADER ================= */}
            <section className="relative w-full bg-slate-900 text-white py-16 md:py-20 px-6 md:px-12 lg:px-16 overflow-hidden">
                {/* Background Image Overlay */}
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
                        <Map className="w-3.5 h-3.5" />
                        Site Navigation
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
                        Web <span className="text-emerald-400">Sitemap</span>
                    </h1>

                    <p className="text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed">
                        Explore the complete structure of SURYAENTERPRISE Limited. Find quick links to our agricultural products, manufacturing processes, corporate information, and compliance disclosures.
                    </p>
                </div>
            </section>

            {/* ================= MAIN SITEMAP CONTENT ================= */}
            <main className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {categories.map((cat, idx) => {
                        const Icon = cat.icon;
                        return (
                            <div
                                key={idx}
                                className={`bg-white border ${cat.borderColor} rounded-3xl p-6 md:p-8 shadow-sm transition-all duration-300 flex flex-col justify-between`}
                            >
                                <div>
                                    {/* Category Header */}
                                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                                        <div className={`p-3 rounded-2xl ${cat.badgeBg}`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-900">{cat.title}</h2>
                                            <span className="text-xs text-slate-400 font-medium">
                                                {cat.links.length} Pages Available
                                            </span>
                                        </div>
                                    </div>

                                    {/* Links List */}
                                    <div className="space-y-3">
                                        {cat.links.map((link, lIdx) => (
                                            <Link
                                                key={lIdx}
                                                href={link.href}
                                                className="group flex items-start justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                                            >
                                                <div>
                                                    <div className="text-sm font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors flex items-center gap-1.5">
                                                        {link.name}
                                                    </div>
                                                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                                                        {link.desc}
                                                    </p>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ================= BOTTOM INFO BOX ================= */}
                <div className="mt-12 bg-emerald-50/60 border border-emerald-200/60 rounded-3xl p-8 text-center max-w-4xl mx-auto">
                    <div className="flex justify-center mb-3 text-emerald-600">
                        <Globe className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                        Looking for something specific?
                    </h3>
                    <p className="text-slate-600 text-xs md:text-sm max-w-xl mx-auto mb-6">
                        If you can&apos;t find a particular product batch, distributor application, or safety data sheet, reach out directly to our Gujarat support desk.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs md:text-sm px-6 py-3 rounded-xl transition-all shadow-md shadow-emerald-200"
                    >
                        Contact Help Desk
                    </Link>
                </div>
            </main>

        </div>
    );
}