// components/QualityAssuranceContent.jsx
import React from 'react';
import Image from 'next/image';
import { CheckCircle, Award, Shield, FlaskConical, Factory, Users, ChevronRight, Trophy } from 'lucide-react';

import PageHeader from "../components/shop/PageHeader";
const QualityAssuranceContent = () => {
  return (
    <main className="pb-3">
      <PageHeader eyebrow="Quality First" title="Quality Assurance" subtitle="Consistently Delivering Excellence" image="/assets/images/quality.jpeg" crumbs={[{ label: "Quality Assurance" }]} />

      {/* Main Content */}
      <div className="shell py-3">
        
        {/* Introduction */}
        <div className="text-center max-w-4xl mx-auto mb-6">
          <div className="inline-flex items-center justify-center p-2 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-6 h-6 text-green-700" />
          </div>
          <h2 className="font-display text-[22px] md:text-2xl font-bold text-gray-900 mb-6">
            Consistently{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-green-700 to-emerald-600">
              Delivering Excellence
            </span>
          </h2>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-lg p-5 md:p-6 border border-gray-100 mb-6">
          
          {/* Quality Text */}
          <div className="space-y-6 text-gray-600 text-lg leading-relaxed mb-6">
            <p>
              Every product that bears the SURYAENTERPRISES name undergoes rigorous testing at multiple stages of production. 
              From sourcing raw materials to the final formulation, precision and consistency are our hallmarks. Our 
              dedicated quality control team, comprising experienced chemists and agronomists, employs scientific 
              methodologies to ensure that each product meets the highest industry standards.
            </p>
          </div>

          {/* Certifications Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-6">
            {/* ISO Certification */}
            <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-lg p-8 border border-blue-100 hover:shadow-[0_4px_16px_rgba(20,33,26,0.10)] transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="shrink-0">
                  <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">ISO Certification</h3>
                  <p className="text-gray-600 mb-3">
                    We are proud to hold the{' '}
                    <span className="font-bold text-blue-700">ISO 305023041314Q</span>{' '}
                    certification, a globally recognized mark of excellence in quality management.
                  </p>
                  <p className="text-gray-600">
                    This certification validates our commitment to adhering to the most stringent quality standards, 
                    enhancing customer satisfaction, and continuously improving our processes.
                  </p>
                </div>
              </div>
            </div>

            {/* ZED Certification */}
            <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-lg p-8 border border-green-100 hover:shadow-[0_4px_16px_rgba(20,33,26,0.10)] transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="shrink-0">
                  <div className="w-16 h-16 bg-linear-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">ZED Certification</h3>
                  <p className="text-gray-600 mb-3">
                    Our <span className="font-bold text-green-700">ZED (Zero Defect Zero Effect)</span>{' '}
                    certification stands as a testament to our commitment to quality and sustainability.
                  </p>
                  <p className="text-gray-600">
                    This certification validates our pledge to operate with zero defects in products and processes, 
                    along with our dedication to reducing adverse effects on the environment.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Testing Facilities */}
          <div className="bg-linear-to-r from-amber-50 to-orange-50 rounded-lg p-8 border border-amber-100 mb-6">
            <div className="flex items-start gap-4">
              <div className="shrink-0">
                <div className="w-16 h-16 bg-linear-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <FlaskConical className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Advanced Testing Facilities</h3>
                <p className="text-gray-600 leading-relaxed">
                  Supported by advanced testing facilities equipped with cutting-edge equipment, we conduct 
                  comprehensive tests to ensure that our products meet and exceed defined specifications. As we move 
                  forward, our investment in laboratories and research facilities demonstrates our pursuit of excellence 
                  and innovation. Join us in our journey as we advance towards new horizons of quality and innovation.
                </p>
              </div>
            </div>
          </div>

          {/* Circular Image Placeholders */}
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16 py-8">
  {/* First Circle */}
  <div className="text-center">
    <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full bg-linear-to-br from-green-100 to-emerald-100 flex items-center justify-center border-4 border-white mx-auto mb-4 hover:scale-105 transition-transform duration-300 overflow-hidden">
      <Image
        src="/assets/images/zed-logo.png"
        alt="ZED Certification"
        fill
        className="object-contain p-2" // p-2 adds padding around the logo
        sizes="(max-width: 768px) 160px, 192px"
      />
    </div>
    <p className="text-gray-600 font-medium">ZED Certified</p>
    <p className="text-sm text-gray-400">Zero Defect Zero Effect</p>
  </div>

  {/* Second Circle */}
  <div className="text-center">
    <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full bg-linear-to-br from-amber-100 to-orange-100 flex items-center justify-center border-4 border-white mx-auto mb-4 hover:scale-105 transition-transform duration-300 overflow-hidden">
      <Image
        src="/assets/images/iso-logo.png"
        alt="ISO Certification"
        fill
        className="object-contain p-2" // p-2 adds padding around the logo
        sizes="(max-width: 768px) 160px, 192px"
      />
    </div>
    <p className="text-gray-600 font-medium">ISO Certified</p>
    <p className="text-sm text-gray-400">ISO 305023041314Q</p>
  </div>
</div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          <div className="text-center p-6 bg-white rounded-lg border border-gray-100">
            <Shield className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-800">100%</div>
            <div className="text-sm text-gray-500">Quality Tested</div>
          </div>
          <div className="text-center p-6 bg-white rounded-lg border border-gray-100">
            <Factory className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-800">5+</div>
            <div className="text-sm text-gray-500">Testing Stages</div>
          </div>
          <div className="text-center p-6 bg-white rounded-lg border border-gray-100">
            <Users className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-800">25+</div>
            <div className="text-sm text-gray-500">Quality Experts</div>
          </div>
          <div className="text-center p-6 bg-white rounded-lg border border-gray-100">
            <Award className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-800">2</div>
            <div className="text-sm text-gray-500">International Certifications</div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <button className="px-8 py-4 bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-full font-semibold hover:shadow-[0_4px_16px_rgba(20,33,26,0.10)] hover:shadow-green-200 transition-all duration-300 inline-flex items-center">
            Learn More About Our Quality Process
            <ChevronRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </main>
  );
};

export default QualityAssuranceContent;