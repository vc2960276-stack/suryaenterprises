// components/QualityAssuranceContent.jsx
import React from 'react';
import Image from 'next/image';
import { CheckCircle, Award, Shield, FlaskConical, Factory, Leaf, Users, ChevronRight, Star, Trophy } from 'lucide-react';

const QualityAssuranceContent = () => {
  return (
    <div className="bg-linear-to-b from-green-50 to-white">
      {/* Hero Section */}
      <div className="relative h-100 md:h-125 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/assets/images/quality.jpeg"
            alt="Quality Assurance"
            fill
            className="object-fit"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-r from-green-900/90 via-green-800/70 to-emerald-900/80"></div>
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="text-white max-w-3xl">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/30">
              <Shield className="w-4 h-4 mr-2 text-amber-300" />
              <span className="text-sm font-medium">Quality First</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Quality{' '}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-300 to-yellow-400">
                Assurance
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-100 mb-4 font-light max-w-2xl">
              Consistently Delivering Excellence
            </p>
            
            <div className="w-24 h-1 bg-amber-400 rounded-full mt-8"></div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-white to-transparent"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        
        {/* Introduction */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <div className="inline-flex items-center justify-center p-2 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-6 h-6 text-green-700" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Consistently{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-green-700 to-emerald-600">
              Delivering Excellence
            </span>
          </h2>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 mb-12">
          
          {/* Quality Text */}
          <div className="space-y-6 text-gray-600 text-lg leading-relaxed mb-12">
            <p>
              Every product that bears the SURYAENTERPRISES name undergoes rigorous testing at multiple stages of production. 
              From sourcing raw materials to the final formulation, precision and consistency are our hallmarks. Our 
              dedicated quality control team, comprising experienced chemists and agronomists, employs scientific 
              methodologies to ensure that each product meets the highest industry standards.
            </p>
          </div>

          {/* Certifications Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* ISO Certification */}
            <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="shrink-0">
                  <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
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
            <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="shrink-0">
                  <div className="w-16 h-16 bg-linear-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
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
          <div className="bg-linear-to-r from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-100 mb-12">
            <div className="flex items-start gap-4">
              <div className="shrink-0">
                <div className="w-16 h-16 bg-linear-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
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
    <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full bg-linear-to-br from-green-100 to-emerald-100 flex items-center justify-center shadow-xl border-4 border-white mx-auto mb-4 hover:scale-105 transition-transform duration-300 overflow-hidden">
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
    <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full bg-linear-to-br from-amber-100 to-orange-100 flex items-center justify-center shadow-xl border-4 border-white mx-auto mb-4 hover:scale-105 transition-transform duration-300 overflow-hidden">
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
          <div className="text-center p-6 bg-white rounded-2xl shadow-md border border-gray-100">
            <Shield className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-800">100%</div>
            <div className="text-sm text-gray-500">Quality Tested</div>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-md border border-gray-100">
            <Factory className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-800">5+</div>
            <div className="text-sm text-gray-500">Testing Stages</div>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-md border border-gray-100">
            <Users className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-800">25+</div>
            <div className="text-sm text-gray-500">Quality Experts</div>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-md border border-gray-100">
            <Award className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-800">2</div>
            <div className="text-sm text-gray-500">International Certifications</div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <button className="px-8 py-4 bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-green-200 transition-all duration-300 hover:-translate-y-1 inline-flex items-center">
            Learn More About Our Quality Process
            <ChevronRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QualityAssuranceContent;