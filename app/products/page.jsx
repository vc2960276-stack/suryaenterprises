import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Products | Surya Enterprises",
  description:
    "Explore insecticides, herbicides, fungicides, and PGR solutions from Surya Enterprises.",
};

const categories = [
  {
    name: "Insecticides",
    href: "/products/insecticides",
    description:
      "Crop protection solutions for managing harmful insects and supporting healthy growth.",
    image: "/assets/images/61YKl1tdghL-250x250.jpg",
    imageAlt: "Healthy flowering plants",
    tone: "bg-amber-50",
    label: "01",
  },
  {
    name: "Herbicides",
    href: "/products/herbicides",
    description:
      "Responsible weed management products to help crops compete for essential resources.",
    image: "/assets/images/81SJkUtxvgL-250x250.jpg",
    imageAlt: "Vegetable plants growing in a field",
    tone: "bg-emerald-50",
    label: "02",
  },
  {
    name: "Fungicides",
    href: "/products/fungicides",
    description:
      "Focused crop care for managing fungal pressure and protecting plant quality.",
    image: "/assets/images/71rALmymU6L-250x250.jpg",
    imageAlt: "Bright pink flowers",
    tone: "bg-rose-50",
    label: "03",
  },
  {
    name: "PGR and Others",
    href: "/products/pgr-and-others",
    description:
      "Plant growth regulators and specialty solutions for balanced, productive crops.",
    image: "/assets/images/71vntpP8IWL-250x250.jpg",
    imageAlt: "Colorful flowering plants",
    tone: "bg-lime-50",
    label: "04",
  },
];

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-[#f0faf5] text-slate-800">
      <section className="relative overflow-hidden bg-green-950 px-6 py-20 text-white md:px-10 md:py-28">
        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-bl from-emerald-700/40 to-transparent" />
        <div className="relative mx-auto max-w-7xl">
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-3 text-sm text-green-100">
            <Link href="/" className="underline-offset-4 hover:underline">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page" className="text-yellow-300">
              Products
            </span>
          </nav>

          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-green-200">
                      Surya Enterprises  Limited
          </p>
          <h1 className="max-w-3xl text-5xl font-extrabold tracking-tight sm:text-6xl md:text-8xl">
            Grow with the right <span className="text-yellow-300">support.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-green-50 md:text-xl">
            Explore our crop care categories, created to help farmers protect plants,
            manage challenges, and support productive growth.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 md:px-10 md:py-20" aria-labelledby="categories-heading">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold tracking-wide text-green-600">OUR CATEGORIES</p>
            <h2 id="categories-heading" className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
              Crop care, category by category
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-slate-600">
            Select a category to learn more about our solutions and their role in a considered crop management approach.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className={`group overflow-hidden rounded-2xl border border-white ${category.tone} shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-700`}
            >
              <div className="relative aspect-square overflow-hidden bg-white">
                <Image
                  src={category.image}
                  alt={category.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold tracking-widest text-green-900">
                  {category.label}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-slate-900">{category.name}</h3>
                <p className="mt-3 min-h-20 text-sm leading-6 text-slate-600">{category.description}</p>
                <span className="mt-5 inline-flex items-center gap-2 font-semibold text-green-700">
                  View category
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">-&gt;</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
