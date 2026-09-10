// components/AboutContent.jsx
import React from 'react';
import Image from 'next/image';
import { Leaf, Sprout, Target, HeartHandshake, Beaker, Globe, Award, Users, ChevronRight } from 'lucide-react';

const AboutContent = () => {
  return (
    <div className="bg-linear-to-b from-green-50 to-white">
      {/* Hero Section with Background Image */}
      <div className="relative h-125 md:h-150 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
        <Image
  src="/assets/images/hand-palm-corn.jpg"
  alt="Agricultural field"
  fill
  className="object-fit"
  priority
/>
          <div className="absolute inset-0 bg-linear-to-r from-green-900/90 via-green-800/70 to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="text-white max-w-3xl">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/30">
              <Sprout className="w-4 h-4 mr-2 text-amber-300" />
              <span className="text-sm font-medium">Est. 2012 • Gujarat, India</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Welcome to{' '}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-300 to-yellow-400">
                SURYAENTERPRISES
              </span>
            </h1>
            
            <p className="text-2xl md:text-3xl text-gray-100 mb-4 font-light">
              Your Trusted Partner in Agrochemical Excellence!
            </p>
            
            <div className="w-24 h-1 bg-amber-400 rounded-full mt-8"></div>
          </div>
        </div>

        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-white to-transparent"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-10xl  px-4 sm:px-6 lg:px-8 ">
        
        {/* Introduction Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 lg:p-16 border border-gray-100 mb-16">
          
          {/* Welcome Text */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="inline-flex items-center justify-center p-2 bg-green-100 rounded-full mb-6">
              <Leaf className="w-6 h-6 text-green-700" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Your Trusted Partner in{' '}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-green-700 to-emerald-600">
                Agrochemical Excellence
              </span>
            </h2>
            
            <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
              <p className="text-xl text-gray-700">
                At SURYAENTERPRISES, we're not just an agrochemical company; we're your allies in cultivating success. 
                Based in the thriving agricultural heartland of Gujarat, India, we've established ourselves as a 
                beacon of quality, innovation, and sustainability in the industry.
              </p>
              
              <div className="bg-linear-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
                <p className="text-gray-700 italic">
                  Being for over 12 years in the business, formerly known as 'Solar Crop Science', our journey began 
                  with a simple yet powerful mission: to empower farmers and nourish the earth. With a deep understanding 
                  of crop needs and a relentless commitment to innovation, we've been transforming the way agriculture thrives.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <div className="text-center p-6 bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
              <div className="text-3xl font-bold text-green-700 mb-1">12+</div>
              <div className="text-sm text-gray-600">Years of Excellence</div>
            </div>
            <div className="text-center p-6 bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
              <div className="text-3xl font-bold text-green-700 mb-1">150+</div>
              <div className="text-sm text-gray-600">Innovative Products</div>
            </div>
            <div className="text-center p-6 bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
              <div className="text-3xl font-bold text-green-700 mb-1">50k+</div>
              <div className="text-sm text-gray-600">Farmers Empowered</div>
            </div>
            <div className="text-center p-6 bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
              <div className="text-3xl font-bold text-green-700 mb-1">22</div>
              <div className="text-sm text-gray-600">States Covered</div>
            </div>
          </div>

          {/* Mission Section */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center p-2 bg-amber-100 rounded-full mb-4">
                <Target className="w-6 h-6 text-amber-700" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                Our <span className="text-amber-600">Mission</span>
              </h3>
            </div>

            <div className="bg-linear-to-r from-amber-50 to-orange-50 rounded-3xl p-10 border border-amber-100">
              <p className="text-xl text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
                At SURYAENTERPRISES, our mission is to empower farmers and growers with the tools they need to cultivate 
                healthy, productive crops while nurturing the land that sustains us all. We believe in striking a 
                harmonious balance between technological innovation and sustainable practices, ensuring that future 
                generations inherit a thriving and abundant planet.
              </p>
            </div>
          </div>

          {/* Three Pillars */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Scientific Excellence */}
            <div className="group bg-white p-8 rounded-2xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Beaker className="w-8 h-8 text-white" />
              </div>
              
              <h4 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-blue-700 transition-colors">
                Scientific Excellence
              </h4>
              
              <p className="text-gray-600 leading-relaxed">
                Our products are the result of rigorous research, cutting-edge technology, and a team of dedicated 
                experts who share a passion for agricultural progress. By harnessing the power of chemistry, biology, 
                and agronomy, we develop solutions that address the unique challenges faced by farmers in today's 
                ever-changing world.
              </p>
            </div>

            {/* Commitment to Sustainability */}
            <div className="group bg-white p-8 rounded-2xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="w-16 h-16 bg-linear-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Globe className="w-8 h-8 text-white" />
              </div>
              
              <h4 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-green-700 transition-colors">
                Commitment to Sustainability
              </h4>
              
              <p className="text-gray-600 leading-relaxed">
                We are acutely aware of our responsibility to the environment and the communities we serve. Every 
                product we create is designed to maximize yields while minimizing environmental impact. From responsible 
                sourcing of raw materials to eco-friendly packaging, sustainability is woven into the fabric of 
                SURYAENTERPRISES Greens Ltd.
              </p>
            </div>

            {/* Empowering Farmers */}
            <div className="group bg-white p-8 rounded-2xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="w-16 h-16 bg-linear-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              
              <h4 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-amber-700 transition-colors">
                Empowering Farmers
              </h4>
              
              <p className="text-gray-600 leading-relaxed">
                More than a provider of AgroChemical solutions, we see ourselves as partners in your success. Through 
                knowledge-sharing, education, and ongoing support, we strive to empower farmers with the insights and 
                resources needed to overcome challenges and achieve remarkable results.
              </p>
            </div>
          </div>

          {/* Legacy Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-green-600 to-emerald-600 p-12 text-white mb-16">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mt-20 -mr-20"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -mb-16 -ml-16"></div>
            
            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <Award className="w-16 h-16 mx-auto mb-6 text-amber-300" />
              <h3 className="text-3xl md:text-4xl font-bold mb-4">Our Legacy of Excellence</h3>
              <p className="text-xl text-white/90 leading-relaxed">
                From our beginnings as Solar Crop Science to becoming SURYAENTERPRISES Greens Ltd., our journey of over a decade 
                has been defined by unwavering commitment to quality, innovation, and farmer success. We continue to build 
                on this legacy, driving agricultural progress across India.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <h4 className="text-2xl font-bold text-gray-800 mb-4">Ready to grow with us?</h4>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="px-8 py-4 bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-green-200 transition-all duration-300 hover:-translate-y-1 inline-flex items-center">
                Explore Our Products
                <ChevronRight className="ml-2 h-5 w-5" />
              </button>
              <button className="px-8 py-4 bg-white text-green-700 rounded-full font-semibold border-2 border-green-600 hover:bg-green-50 transition-all duration-300 hover:-translate-y-1">
                Contact Our Team
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutContent;