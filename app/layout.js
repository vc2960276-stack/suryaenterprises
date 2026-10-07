import { Inter, Manrope } from "next/font/google";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import MobileBottomNav from "./components/shop/MobileBottomNav";
import OffersMarquee from "./components/shop/OffersMarquee";
import Toaster from "./components/shop/Toast";
import { SITE } from "./config/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-manrope", display: "swap" });

export const metadata = {
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "Shop seeds, crop protection, crop nutrition, farm machinery and animal husbandry products from leading brands and Surya's own range — Surya Enterprises, a licensed agro-inputs marketplace for farmers, agri-retailers and institutional buyers.",
};

export const viewport = {
  themeColor: "#0F7A3D",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${manrope.variable}`}>
      <body className="font-sans">
        <a
          href="#main"
          className="sr-only z-[100] rounded-md bg-harvest px-4 py-2 font-semibold text-ink focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
        >
          Skip to content
        </a>
        <Navbar />
        {SITE.offersSiteWide && <OffersMarquee />}
        <div id="main" className="min-h-[60vh]">
          {children}
        </div>
        <Footer />
        <MobileBottomNav />
        <Toaster />
      </body>
    </html>
  );
}
