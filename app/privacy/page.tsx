import React from 'react';
import {
    Leaf,
    FlaskConical,
    Sprout,
    Bug,
    Factory,
    TestTube,
    Truck,
    ArrowRight,
    Sparkles,
    Star,
    Pipette
} from 'lucide-react';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-white text-slate-800 font-sans">

            {/* ================= HERO SECTION (FULL WIDTH) ================= */}
            <section className="relative h-[480px] md:h-[600px] w-full flex items-center overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop')`,
                    }}
                >
                    <div className="absolute inset-0 bg-black/30" />
                    {/* Bottom fade into white */}
                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white via-white/70 to-transparent" />
                </div>

                {/* Hero Content */}
                <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none">
                        <span className="text-white">SURYA</span>
                        <span className="text-amber-400">ENTERPRISES</span>
                    </h1>
                  
                </div>
            </section>

            {/* ================= ABOUT SECTION ================= */}
            <section className="w-full px-6 md:px-12 lg:px-16 py-12 md:py-16">
                <div className="max-w-7xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 mb-6">
                        <Leaf className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-emerald-700 tracking-wider uppercase">
                            About the Company
                        </span>
                    </div>

                    {/* Heading */}
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-8">
                        Nurturing Growth, <br />
                        <span className="text-emerald-600">Sustaining Tomorrow</span>
                    </h2>

                    {/* Quote */}
                    <div className="border-l-4 border-emerald-500 pl-5 py-1 mb-8 max-w-4xl">
                        <p className="italic text-slate-700 text-base md:text-lg font-medium">
                            &quot;Headquartered in Gujarat, India, we are a renowned Agro Chemical company committed to revolutionizing agriculture.&quot;
                        </p>
                    </div>

                    {/* Paragraphs */}
                    <div className="space-y-5 text-slate-600 text-base md:text-lg leading-relaxed mb-14 max-w-5xl">
                        <p>
                            <strong className="text-emerald-700 font-semibold">SURYAENTERPRISES  Limited</strong> stands at the forefront of agricultural innovation, delivering precision-engineered solutions that empower farmers across the nation. Our comprehensive range of products and unwavering commitment to quality have established us as a trusted partner in India&apos;s agricultural growth story.
                        </p>
                        <p>
                            We believe in the power of sustainable innovation. Every product we develop, from pesticides to plant growth regulators, is crafted with meticulous attention to environmental responsibility and farmer prosperity. Our mission extends beyond business—it&apos;s about cultivating a greener, more abundant future for generations to come.
                        </p>
                    </div>

                    {/* Stats - Full width grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {[
                            { stat: '25+', label: 'Years of Excellence' },
                            { stat: '150+', label: 'Innovative Products' },
                            { stat: '50k+', label: 'Farmers Empowered' },
                            { stat: '22', label: 'States Covered' },
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 md:p-8 text-center hover:shadow-md transition-shadow"
                            >
                                <div className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-emerald-600 mb-1">
                                    {item.stat}
                                </div>
                                <div className="text-sm md:text-base font-medium text-slate-600">
                                    {item.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= PRODUCTS SECTION ================= */}
            <section className="w-full px-6 md:px-12 lg:px-16 py-12 md:py-16 bg-white">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900">
                            Our <span className="text-emerald-600">Premium</span> Products
                        </h2>
                        <p className="text-slate-500 text-base md:text-lg mt-3">
                            Crafting excellence in every solution, tailored for modern agriculture
                        </p>
                    </div>

                    {/* Product Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
                        {/* Chemicals */}
                        <div className="relative bg-indigo-50/50 border border-indigo-100 rounded-2xl p-8 lg:p-10 flex flex-col justify-between overflow-hidden group hover:shadow-lg transition-all duration-300">
                            <div className="absolute -top-12 -right-12 w-40 h-40 bg-indigo-100/60 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
                            <div>
                                <div className="w-14 h-14 rounded-xl bg-indigo-600 flex items-center justify-center text-white mb-6 shadow-lg shadow-indigo-200">
                                    <FlaskConical className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-3">Chemicals</h3>
                                <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-8">
                                    Our state-of-the-art facilities produce a wide range of high-quality chemicals, catering to your diverse agricultural needs.
                                </p>
                            </div>
                            <a href="#chemicals" className="inline-flex items-center text-base font-semibold text-indigo-600 hover:text-indigo-700 group/link">
                                Explore Range <ArrowRight className="w-4 h-4 ml-1.5 group-hover/link:translate-x-1 transition-transform" />
                            </a>
                        </div>

                        {/* Fertilizers */}
                        <div className="relative bg-emerald-50/50 border border-emerald-100 rounded-2xl p-8 lg:p-10 flex flex-col justify-between overflow-hidden group hover:shadow-lg transition-all duration-300">
                            <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-100/60 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
                            <div>
                                <div className="w-14 h-14 rounded-xl bg-emerald-600 flex items-center justify-center text-white mb-6 shadow-lg shadow-emerald-200">
                                    <Sprout className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-3">Fertilizers</h3>
                                <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-8">
                                    Our specialized fertilizers are formulated to optimize plant nutrition, promoting healthy growth and robust yields for farmers.
                                </p>
                            </div>
                            <a href="#fertilizers" className="inline-flex items-center text-base font-semibold text-emerald-600 hover:text-emerald-700 group/link">
                                Explore Range <ArrowRight className="w-4 h-4 ml-1.5 group-hover/link:translate-x-1 transition-transform" />
                            </a>
                        </div>

                        {/* Pesticides */}
                        <div className="relative bg-amber-50/50 border border-amber-100 rounded-2xl p-8 lg:p-10 flex flex-col justify-between overflow-hidden group hover:shadow-lg transition-all duration-300">
                            <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-100/60 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
                            <div>
                                <div className="w-14 h-14 rounded-xl bg-amber-500 flex items-center justify-center text-white mb-6 shadow-lg shadow-amber-200">
                                    <Bug className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-3">Pesticides</h3>
                                <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-8">
                                    We develop effective and environmentally responsible pesticides, safeguarding crops from pests and ensuring sustainable farming practices.
                                </p>
                            </div>
                            <a href="#pesticides" className="inline-flex items-center text-base font-semibold text-amber-600 hover:text-amber-700 group/link">
                                Explore Range <ArrowRight className="w-4 h-4 ml-1.5 group-hover/link:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    </div>

                    {/* Banner */}
                    <div className="relative bg-emerald-50/60 border border-emerald-200/70 rounded-3xl p-10 md:p-14 text-center overflow-hidden">
                        <div className="flex justify-center items-center gap-1.5 text-amber-400 mb-5">
                            <Sparkles className="w-5 h-5 text-amber-400" />
                            <Sparkles className="w-7 h-7 text-emerald-500" />
                            <Sparkles className="w-5 h-5 text-amber-400" />
                        </div>
                        <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-5">
                            We understand your <span className="text-emerald-600">crop&apos;s need</span>
                        </h3>
                        <p className="max-w-3xl mx-auto text-slate-600 text-base md:text-lg leading-relaxed">
                            Nurtured in Gujarat, <strong className="text-emerald-700 font-semibold">SURYAENTERPRISES</strong> is your trusted agrochemical companion, devoted to crafting top-tier solutions - chemicals, fertilizers, pesticides - tailored to your crop&apos;s desires.
                        </p>
                    </div>
                </div>
            </section>

            {/* ================= MANUFACTURING PROCESS ================= */}
            <section className="w-full px-6 md:px-12 lg:px-16 py-12 md:py-16 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-center mb-5">
                        <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-600">
                            <Factory className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900">
                            Manufacturing <span className="text-emerald-600">Process</span>
                        </h2>
                        <p className="text-slate-500 text-base md:text-lg mt-3 max-w-2xl mx-auto">
                            The manufacturing process at SURYAENTERPRISES follows a systematic four-step approach to ensure quality and efficiency
                        </p>
                    </div>

                    {/* 4 Steps */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        {/* Step 1 */}
                        <div className="relative bg-white border border-slate-100 rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-200">
                                    <Pipette className="w-6 h-6" />
                                </div>
                                <span className="text-5xl font-black text-purple-100 select-none">01</span>
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 mb-3">Formulation</h4>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">
                                Our experts meticulously design the optimal chemical, fertilizer, or pesticide formula based on extensive research and understanding of crop needs.
                            </p>
                            <div className="w-14 h-1 bg-purple-300 rounded-full" />
                        </div>

                        {/* Step 2 */}
                        <div className="relative bg-white border border-slate-100 rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 rounded-xl bg-sky-500 flex items-center justify-center text-white shadow-md shadow-sky-200">
                                    <Factory className="w-6 h-6" />
                                </div>
                                <span className="text-5xl font-black text-sky-100 select-none">02</span>
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 mb-3">Production</h4>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">
                                State-of-the-art facilities and rigorous quality control measures are employed to manufacture products, adhering to approved formulations and industry standards.
                            </p>
                            <div className="w-14 h-1 bg-sky-300 rounded-full" />
                        </div>

                        {/* Step 3 */}
                        <div className="relative bg-white border border-slate-100 rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-md shadow-amber-200">
                                    <TestTube className="w-6 h-6" />
                                </div>
                                <span className="text-5xl font-black text-amber-100 select-none">03</span>
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 mb-3">Testing</h4>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">
                                Each batch undergoes rigorous testing for efficacy, safety, and compliance with regulatory standards, ensuring only the highest-quality products reach our customers.
                            </p>
                            <div className="w-14 h-1 bg-amber-300 rounded-full" />
                        </div>

                        {/* Step 4 */}
                        <div className="relative bg-white border border-slate-100 rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-200">
                                    <Truck className="w-6 h-6" />
                                </div>
                                <span className="text-5xl font-black text-emerald-100 select-none">04</span>
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 mb-3">Distribution</h4>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">
                                Once approved, products are carefully packaged to preserve integrity. Efficient distribution channels ensure timely delivery to farmers across the nation.
                            </p>
                            <div className="w-14 h-1 bg-emerald-300 rounded-full" />
                        </div>
                    </div>

                    {/* Bottom star */}
                    <div className="flex justify-center mt-14">
                        <div className="p-2.5 rounded-full bg-amber-50 text-amber-500 border border-amber-200/50">
                            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}