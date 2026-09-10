// app/about/page.js
import React from 'react';
import AboutContent from './components/aboutCompany';
import ProductGallery from './products/components/productGallery';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50">
     <AboutContent/>
      <div className="mx-auto max-w-[1760px] bg-white px-6 pb-16 md:px-12 lg:px-16">
        <ProductGallery category="Featured" />
      </div>
    </main>
  );
}