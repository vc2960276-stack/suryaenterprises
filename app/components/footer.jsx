// components/Footer.jsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Leaf, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  ChevronRight,
  Send
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const usefulLinks = [
    { name: 'About Us', href: '/aboutUs' },
    { name: 'Management', href: '/management' },
    // { name: 'Products', href: '/products' },
    { name: 'Career', href: '/career' },
    { name: 'Contact', href: '/contact' },
  ];

  const products = [
    { name: 'Insecticides', href: '/products/insecticides' },
    { name: 'Herbicides', href: '/products/herbicides' },
    { name: 'Fungicides', href: '/products/fungicides' },
    { name: 'PGR', href: '/products/pgr' },
    { name: 'Institutional', href: '/products/institutional' },
  ];

  const contactInfo = [
    { icon: <Phone className="w-4 h-4" />, text: '9876543210', href: 'tel:9876543210' },
    { icon: <Mail className="w-4 h-4" />, text: 'info@SURYAENTERPRISES.com', href: 'mailto:info@SURYAENTERPRISES.com' },
    { icon: <MapPin className="w-4 h-4" />, text: 'Delhi, India', href: 'https://maps.google.com/?q=Delhi, Delhi' },
  ];

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, href: '#', name: 'Facebook' },
    { icon: <Twitter className="w-5 h-5" />, href: '#', name: 'Twitter' },
    { icon: <Linkedin className="w-5 h-5" />, href: '#', name: 'LinkedIn' },
    { icon: <Instagram className="w-5 h-5" />, href: '#', name: 'Instagram' },
  ];

  return (
    <footer className="bg-linear-to-b from-gray-900 to-gray-950 text-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-green-500 via-emerald-500 to-green-500"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full -ml-40 -mb-40 blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Company Info - 4 columns */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group" aria-label="Surya Enterprises home">
              <Image
                src="/assets/images/logo.jpeg"
                alt="Surya Enterprises"
                width={220}
                height={64}
                className="h-14 w-auto object-contain"
              />
              <span className="text-xl font-bold tracking-tight text-green-400">
                SURYA<span className="text-amber-300">ENTERPRISES</span>
              </span>
            </Link>
            
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Discover the Difference with SURYAENTERPRISES  Limited. We&apos;re redefining agrochemical excellence 
              with quality, innovation, and sustainable practices as your trusted partner in cultivating success.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 pt-2">
              {contactInfo.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors text-sm group"
                >
                  <span className="text-green-500 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  {item.text}
                </a>
              ))}
            </div>
          </div>

          {/* Useful Links - 2 columns */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-green-500 rounded-full"></span>
              USEFUL LINKS
            </h3>
            <ul className="space-y-2">
              {usefulLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-green-400 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <ChevronRight className="w-3 h-3 text-green-500 group-hover:translate-x-1 transition-transform" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products - 2 columns */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-green-500 rounded-full"></span>
              OUR PRODUCTS
            </h3>
            <ul className="space-y-2">
              {products.map((product) => (
                <li key={product.name}>
                  <Link 
                    href={product.href}
                    className="text-gray-400 hover:text-green-400 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <ChevronRight className="w-3 h-3 text-green-500 group-hover:translate-x-1 transition-transform" />
                    {product.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Social - 4 columns */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-green-500 rounded-full"></span>
              STAY CONNECTED
            </h3>
            
            {/* Newsletter */}
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <p className="text-sm text-gray-300 mb-3">
                Subscribe to our newsletter for updates and offers
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button className="bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-3 py-2 rounded-lg transition-all hover:scale-105">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3">Follow Us</h4>
              <div className="flex gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-800/50 hover:bg-green-600 text-gray-400 hover:text-white p-2 rounded-lg transition-all hover:scale-110 border border-gray-700 hover:border-green-500"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © {currentYear} SURYAENTERPRISES  Limited. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs text-gray-500">
              <Link href="/privacy" className="hover:text-green-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-green-400 transition-colors">
                Terms of Use
              </Link>
              <Link href="/sitemap" className="hover:text-green-400 transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;