// components/ManagementContent.jsx
import React from 'react';
import Image from 'next/image';
import { Users, Award, Leaf, Target, HeartHandshake, Quote, ChevronRight } from 'lucide-react';

const ManagementContent = () => {
  return (
    <div className="bg-linear-to-b from-green-50 to-white">
      {/* Hero Section */}
      <div className="relative h-100 md:h-125 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/assets/images/handshake.jpg"
            alt="Management team"
            fill
            className="object-fit"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-r from-green-900/90 via-green-800/70 to-emerald-900/80"></div>
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="text-white max-w-3xl">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/30">
              <Users className="w-4 h-4 mr-2 text-amber-300" />
              <span className="text-sm font-medium">Leadership Team</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Meet Our{' '}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-300 to-yellow-400">
                Management
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-100 mb-4 font-light max-w-2xl">
              Dedicated leaders driving innovation and agricultural excellence
            </p>
            
            <div className="w-24 h-1 bg-amber-400 rounded-full mt-8"></div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-white to-transparent"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        
        {/* Introduction */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center p-2 bg-green-100 rounded-full mb-4">
            <Award className="w-6 h-6 text-green-700" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Our{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-green-700 to-emerald-600">
              Leadership
            </span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            At SURYAENTERPRISES, our success is a collective effort led by a dedicated and experienced management team. 
            Meet the individuals who drive our company's vision, innovation, and commitment to agricultural excellence.
          </p>
        </div>

        {/* CMD Section */}
        <div className="mb-20">
          <div className="grid md:grid-cols-5 gap-8 items-center">
            {/* Left side - Message (takes 3 columns) */}
            <div className="md:col-span-3 relative">
              <div className="absolute -top-4 -left-4 text-6xl text-amber-200 opacity-50">"</div>
              <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <Quote className="w-6 h-6 text-amber-500 mr-2" />
                  Message from CMD Desk
                </h3>
                
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>Dear Friends and Partners,</p>
                  <p>
                    I am delighted to welcome you to the digital home of SURYAENTERPRISES Greens Ltd., where we cultivate 
                    progress, nurture innovation, and empower a greener tomorrow. For over 12 years formerly known as 
                    'Solar Crop Science', SURYAENTERPRISES has stood as a beacon of agricultural excellence. Our journey, 
                    rooted in dedication and driven by science, has led us to develop AgroChemical solutions that not 
                    only transform crops but also shape the landscape of modern farming.
                  </p>
                  <p>
                    I invite you to explore our website and discover a world of possibilities. From our meticulously 
                    crafted products to insightful agricultural resources, our platform is designed to be your companion 
                    in growth. Whether you're an experienced farmer, a novice cultivator, or an industry partner, 
                    SURYAENTERPRISES is here to support you at every step.
                  </p>
                  <p>
                    Thank you for being part of the SURYAENTERPRISES family. Together, let's continue to cultivate excellence 
                    and sow the seeds of prosperity.
                  </p>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="font-bold text-gray-800">Warm regards,</p>
                  <p className="text-lg font-semibold text-green-700">Sushil Dubey – CMD</p>
                </div>
              </div>
            </div>

            {/* Right side - Smaller Placeholder Image (takes 2 columns) */}
            <div className="md:col-span-2 relative">
              {/* Smaller Image Placeholder */}
              <div className="bg-linear-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-lg border border-gray-200 aspect-[3/4] max-w-[300px] mx-auto">
                <div className="h-2/3 bg-linear-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                  <div className="text-center">
                    <Users className="w-12 h-12 text-green-300 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">Photo</p>
                  </div>
                </div>
                <div className="h-1/3 bg-white p-4">
                  <h4 className="text-xl font-bold text-gray-800">Sushil Dubey</h4>
                  <p className="text-sm text-green-600 font-medium">Chairman & Managing Director</p>
                </div>
              </div>
              
              {/* Smaller decorative elements */}
              <div className="absolute -bottom-3 -right-3 w-16 h-16 bg-amber-100 rounded-full -z-10"></div>
              <div className="absolute -top-3 -left-3 w-12 h-12 bg-green-100 rounded-full -z-10"></div>
            </div>
          </div>
        </div>

        {/* CEO Section */}
        <div className="mb-20">
          <div className="grid md:grid-cols-5 gap-8 items-center">
            {/* Left side - Smaller Placeholder Image (takes 2 columns) */}
            <div className="md:col-span-2 relative order-2 md:order-1">
              {/* Smaller Image Placeholder */}
              <div className="bg-linear-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-lg border border-gray-200 aspect-[3/4] max-w-[300px] mx-auto">
                <div className="h-2/3 bg-linear-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                  <div className="text-center">
                    <Users className="w-12 h-12 text-amber-300 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">Photo</p>
                  </div>
                </div>
                <div className="h-1/3 bg-white p-4">
                  <h4 className="text-xl font-bold text-gray-800">Dharmraj Sinh Jadeja</h4>
                  <p className="text-sm text-green-600 font-medium">Director & CEO</p>
                </div>
              </div>
              
              {/* Smaller decorative elements */}
              <div className="absolute -bottom-3 -left-3 w-16 h-16 bg-amber-100 rounded-full -z-10"></div>
              <div className="absolute -top-3 -right-3 w-12 h-12 bg-green-100 rounded-full -z-10"></div>
            </div>

            {/* Right side - Message (takes 3 columns) */}
            <div className="md:col-span-3 relative order-1 md:order-2">
              <div className="absolute -top-4 -right-4 text-6xl text-amber-200 opacity-50">"</div>
              <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <Quote className="w-6 h-6 text-amber-500 mr-2" />
                  Board of Directors
                </h3>
                
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    As CEO and Director, I'm honoured to lead a team dedicated to delivering innovative and sustainable 
                    Agro Chemical solutions. With a deep understanding of the needs of farmers, we strive to provide 
                    excellence, quality, and support in every product we offer.
                  </p>
                  <p>
                    Our vision extends beyond business – we're cultivating a greener, more prosperous future for 
                    agriculture. Join us in this journey of growth, innovation, and empowerment. Together, let's sow 
                    the seeds of success.
                  </p>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="font-bold text-gray-800">Best regards,</p>
                  <p className="text-lg font-semibold text-green-700">Dharmraj Sinh Jadeja</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Join Our Journey Section */}
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-green-600 to-emerald-600 p-12 text-white mb-16">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mt-20 -mr-20"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -mb-16 -ml-16"></div>
          
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <HeartHandshake className="w-16 h-16 mx-auto mb-6 text-amber-300" />
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Join Our Journey</h3>
            <p className="text-xl text-white/90 leading-relaxed">
              The leadership team at SURYAENTERPRISES  Limited is united by a shared vision of agricultural progress 
              and sustainable growth. Together, we work tirelessly to bring innovative solutions to farmers, empower 
              communities, and shape the future of farming.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center mt-8">
              <button className="px-8 py-3 bg-white text-green-700 rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:-translate-y-1 inline-flex items-center">
                Explore Careers
                <ChevronRight className="ml-2 h-5 w-5" />
              </button>
              <button className="px-8 py-3 bg-transparent text-white rounded-full font-semibold border-2 border-white hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
                Contact Leadership
              </button>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center">
            <Target className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-800">Vision-Driven</h4>
            <p className="text-sm text-gray-500">Leading with purpose and clarity</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center">
            <Leaf className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-800">Sustainable Growth</h4>
            <p className="text-sm text-gray-500">Committed to green future</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center">
            <Users className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-800">Farmer First</h4>
            <p className="text-sm text-gray-500">Empowering farming communities</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagementContent;