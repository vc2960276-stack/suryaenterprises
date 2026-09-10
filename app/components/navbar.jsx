// components/Navbar.jsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ChevronDown, ShoppingCart } from 'lucide-react';

const getStoredCartCount = () => {
  if (typeof window === 'undefined') return 0;

  try {
    const savedCart = window.localStorage.getItem('surya-cart');
    const cart = savedCart ? JSON.parse(savedCart) : {};
    return Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  } catch {
    return 0;
  }
};

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(getStoredCartCount);
  const pathname = usePathname();

  useEffect(() => {
    const updateCartCount = () => {
      setCartCount(getStoredCartCount());
    };

    window.addEventListener('surya-cart-updated', updateCartCount);
    return () => window.removeEventListener('surya-cart-updated', updateCartCount);
  }, []);

  const navigation = [
    { name: 'Home', href: '/' },
    { 
      name: 'Company Profile', 
      href: '#',
      dropdown: [
        { name: 'About Us', href: '/aboutUs' },
        { name: 'Management', href: '/management' }
      ]
    },
    { 
      name: 'Products', 
      href: '#',
      dropdown: [
        { name: 'All Products', href: '/products' },
        { name: 'Insecticides', href: '/products/insecticides' },
        { name: 'Herbicides', href: '/products/herbicides' },
        { name: 'Fungicides', href: '/products/fungicides' },
        { name: 'PGR and Others', href: '/products/pgr-and-others' },
        { name: 'Institutional', href: '/products/institutional' }
      ]
    },
    { name: 'Quality Assurance', href: '/quality-assurance' },
    { name: 'Career', href: '/career' },
    { name: 'Contact', href: '/contact' }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="shrink-0">
            <Link href="/" className="inline-flex items-center gap-3" aria-label="Surya Enterprises home">
              <Image
                src="/assets/images/logo.jpeg"
                alt="Surya Enterprises"
                width={180}
                height={52}
                priority
                className="h-11 w-auto object-contain"
              />
              <span className="hidden text-lg font-bold tracking-tight text-emerald-700 lg:inline">
                SURYA<span className="text-amber-600">ENTERPRISES</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {navigation.map((item, index) => (
              <div key={item.name} className="relative">
                {item.dropdown ? (
                  <button
                    onClick={() => toggleDropdown(index)}
                    className={`px-3 py-2 text-sm font-medium transition inline-flex items-center ${
                      pathname.startsWith(item.dropdown[0]?.href?.split('/')[1] || '')
                        ? 'text-emerald-600'
                        : 'text-gray-700 hover:text-emerald-600'
                    }`}
                  >
                    {item.name}
                    <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${
                      openDropdown === index ? 'rotate-180' : ''
                    }`} />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`px-3 py-2 text-sm font-medium transition ${
                      pathname === item.href
                        ? 'text-emerald-600 border-b-2 border-emerald-600'
                        : 'text-gray-700 hover:text-emerald-600'
                    }`}
                  >
                    {item.name}
                  </Link>
                )}

                {/* Dropdown Menu */}
                {item.dropdown && openDropdown === index && (
                  <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                    {item.dropdown.map((dropItem) => (
                      <div key={dropItem.name}>
                        {dropItem.subdropdown ? (
                          <div className="relative group">
                            <div className="px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center justify-between">
                              <Link
                                href={dropItem.href}
                                className="flex-1"
                                onClick={() => setOpenDropdown(null)}
                              >
                                {dropItem.name}
                              </Link>
                              <ChevronDown className="h-3 w-3 -rotate-90" />
                            </div>
                            
                            {/* Sub Dropdown */}
                            <div className="absolute left-full top-0 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 hidden group-hover:block">
                              {dropItem.subdropdown.map((subItem) => (
                                <Link
                                  key={subItem.name}
                                  href={subItem.href}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                                  onClick={() => setOpenDropdown(null)}
                                >
                                  {subItem.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <Link
                            href={dropItem.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                            onClick={() => setOpenDropdown(null)}
                          >
                            {dropItem.name}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Search Bar and CTA */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 border-2 border-green-700 px-5 py-2.5 font-semibold text-green-700 transition hover:bg-green-700 hover:text-white"
            >
              <ShoppingCart className="h-5 w-5" aria-hidden="true" />
              Cart <span className="text-sm">({cartCount} Items)</span>
            </Link>
            {/* Search Bar */}
            {/* <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
              />
              <button
                type="submit"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form> */}

            {/* CTA Button */}
            
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <Link
              href="/cart"
              aria-label={`Cart with ${cartCount} items`}
              className="inline-flex items-center gap-1 text-green-700"
            >
              <ShoppingCart className="h-5 w-5" aria-hidden="true" />
              <span className="text-xs font-semibold">{cartCount}</span>
            </Link>
            {/* Mobile Search Toggle */}
            {/* <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-emerald-600 focus:outline-none"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button> */}
            
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-emerald-600 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="px-2 pb-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
                <button
                  type="submit"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Mobile Navigation Links */}
            <div className="space-y-1 px-2 pb-3">
              {navigation.map((item, index) => (
                <div key={item.name}>
                  {item.dropdown ? (
                    <div>
                      <button
                        onClick={() => toggleDropdown(index)}
                        className="w-full flex items-center justify-between px-3 py-2 text-base font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-md"
                      >
                        {item.name}
                        <ChevronDown className={`h-4 w-4 transition-transform ${
                          openDropdown === index ? 'rotate-180' : ''
                        }`} />
                      </button>
                      
                      {openDropdown === index && (
                        <div className="pl-4 space-y-1 mt-1">
                          {item.dropdown.map((dropItem) => (
                            <div key={dropItem.name}>
                              {dropItem.subdropdown ? (
                                <div>
                                  <div className="px-3 py-2 text-sm font-medium text-gray-600">
                                    {dropItem.name}
                                  </div>
                                  <div className="pl-4 space-y-1">
                                    {dropItem.subdropdown.map((subItem) => (
                                      <Link
                                        key={subItem.name}
                                        href={subItem.href}
                                        className="block px-3 py-2 text-sm text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-md"
                                        onClick={() => {
                                          setIsMobileMenuOpen(false);
                                          setOpenDropdown(null);
                                        }}
                                      >
                                        {subItem.name}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <Link
                                  href={dropItem.href}
                                  className="block px-3 py-2 text-sm text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-md"
                                  onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    setOpenDropdown(null);
                                  }}
                                >
                                  {dropItem.name}
                                </Link>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={`block px-3 py-2 rounded-md text-base font-medium ${
                        pathname === item.href
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-emerald-600'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
              
              {/* Mobile CTA Button */}
              
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;    