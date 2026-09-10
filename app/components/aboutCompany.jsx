// components/AboutContent.jsx
import React from 'react';
import { 
  Leaf, Sprout, Droplets, Shield, Wind, Sun, FlaskConical, 
  Flower2, Bug, Sparkles, Beaker, Factory, TestTube, 
  Truck, TrendingUp, Target, Atom, HeartHandshake, Globe,
  CheckCircle, ArrowRight, Star, Award, Zap
} from 'lucide-react';

const AboutContent = () => {
  return (
    <div className="bg-linear-to-b from-green-50 to-white">
      {/* Full Width Video Banner with Fade */}
      <div className="relative w-full h-[clamp(32rem,calc(100vh-4rem),48rem)] overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <iframe
            src="https://player.vimeo.com/video/858332896?muted=1&autoplay=1&loop=1&background=1&app_id=122963"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[177.77777778vh] min-w-full min-h-full"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title="Agricultural Video Background"
            style={{ 
              pointerEvents: 'none',
              aspectRatio: '16/9',
            }}
          ></iframe>
          
          {/* Premium Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-r from-green-950/85 via-green-900/45 to-emerald-950/55"></div>
          <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-white via-white/55 to-transparent"></div>
        </div>

        {/* Banner Text Overlay */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="text-white max-w-3xl pt-8 md:pt-0">

            
            <h1 className="text-[clamp(2.75rem,6vw,5.5rem)] font-bold mb-4 leading-[0.95] tracking-tight">
              SURYA<span className="text-amber-300">ENTERPRISES</span>
            </h1>

          </div>
        </div>
      </div>

      {/* About Text Section */}
      <div className="relative -mt-32 z-10">
        <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          
          {/* Main Content Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 lg:p-16 border border-gray-100">
            
            {/* Header with Icon */}
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-green-100 rounded-2xl">
                <Leaf className="w-8 h-8 text-green-700" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-green-600 tracking-wider">ABOUT THE COMPANY</h2>
                <div className="w-12 h-0.5 bg-green-200 mt-1"></div>
              </div>
            </div>

            {/* Main Title */}
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
              Nurturing Growth, 
              <span className="text-transparent bg-clip-text bg-linear-to-r from-green-700 to-emerald-600 block">
                Sustaining Tomorrow
              </span>
            </h3>
            
            {/* Company Description */}
            <div className="space-y-6 text-gray-600 text-lg leading-relaxed mb-12">
              <p className="text-xl text-gray-700 font-medium border-l-4 border-green-500 pl-6 italic">
                "Headquartered in Delhi, India, we are a renowned Agro Chemical company committed to revolutionizing agriculture."
              </p>
              
              <p>
                <span className="font-semibold text-green-700 text-xl">SURYAENTERPRISES </span> stands at the 
                forefront of agricultural innovation, delivering precision-engineered solutions that empower farmers 
                across the nation. Our comprehensive range of products and unwavering commitment to quality have 
                established us as a trusted partner in India's agricultural growth story.
              </p>

              <p>
                We believe in the power of sustainable innovation. Every product we develop, from pesticides to 
                plant growth regulators, is crafted with meticulous attention to environmental responsibility and 
                farmer prosperity. Our mission extends beyond business—it's about cultivating a greener, more 
                abundant future for generations to come.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="text-center p-6 bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                <div className="text-3xl font-bold text-green-700 mb-1">25+</div>
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

            {/* Product Categories */}
            <div className="mb-16">
              <div className="text-center mb-10">
                <h4 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                  Our <span className="text-green-600">Premium</span> Products
                </h4>
                <p className="text-gray-500 max-w-2xl mx-auto">
                  Crafting excellence in every solution, tailored for modern agriculture
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Chemicals Card */}
                <div className="group relative bg-linear-to-br from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200/20 rounded-full -mt-10 -mr-10 group-hover:scale-150 transition-transform duration-700"></div>
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-linear-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <FlaskConical className="w-8 h-8 text-white" />
                    </div>
                    
                    <h5 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-purple-700 transition-colors">
                      Chemicals
                    </h5>
                    
                    <p className="text-gray-600 leading-relaxed">
                      Our state-of-the-art facilities produce a wide range of high-quality chemicals, 
                      catering to your diverse agricultural needs.
                    </p>
                    
                    <div className="mt-6 flex items-center text-purple-600 font-medium">
                      <span>Explore Range</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* Fertilizers Card */}
                <div className="group relative bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/20 rounded-full -mt-10 -mr-10 group-hover:scale-150 transition-transform duration-700"></div>
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-linear-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Flower2 className="w-8 h-8 text-white" />
                    </div>
                    
                    <h5 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-green-700 transition-colors">
                      Fertilizers
                    </h5>
                    
                    <p className="text-gray-600 leading-relaxed">
                      Our specialized fertilizers are formulated to optimize plant nutrition, 
                      promoting healthy growth and robust yields for farmers.
                    </p>
                    
                    <div className="mt-6 flex items-center text-green-600 font-medium">
                      <span>Explore Range</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* Pesticides Card */}
                <div className="group relative bg-linear-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full -mt-10 -mr-10 group-hover:scale-150 transition-transform duration-700"></div>
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-linear-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Bug className="w-8 h-8 text-white" />
                    </div>
                    
                    <h5 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-amber-700 transition-colors">
                      Pesticides
                    </h5>
                    
                    <p className="text-gray-600 leading-relaxed">
                      We develop effective and environmentally responsible pesticides, 
                      safeguarding crops from pests and ensuring sustainable farming practices.
                    </p>
                    
                    <div className="mt-6 flex items-center text-amber-600 font-medium">
                      <span>Explore Range</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Understanding Your Crop Section */}
            <div className="relative mb-16">
              <div className="absolute inset-0 bg-linear-to-r from-green-100/50 to-emerald-100/50 rounded-3xl -m-4"></div>
              
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-10 border border-green-200 shadow-xl overflow-hidden">
                <div className="absolute top-0 left-0 w-40 h-40 bg-green-200/20 rounded-full -mt-20 -ml-20"></div>
                <div className="absolute bottom-0 right-0 w-60 h-60 bg-emerald-200/20 rounded-full -mb-30 -mr-30"></div>
                
                <div className="relative z-10 text-center max-w-4xl mx-auto">
                  <div className="flex justify-center gap-2 mb-4">
                    <Sparkles className="w-6 h-6 text-amber-500" />
                    <Sparkles className="w-8 h-8 text-green-500" />
                    <Sparkles className="w-6 h-6 text-amber-500" />
                  </div>
                  
                  <h4 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                    We understand your <span className="text-transparent bg-clip-text bg-linear-to-r from-green-600 to-emerald-600">crop's need</span>
                  </h4>
                  
                  <p className="text-xl text-gray-700 leading-relaxed mb-8">
                    Nurtured in Gujarat, <span className="font-bold text-green-700">SURYAENTERPRISES</span> is your trusted agrochemical companion, 
                    devoted to crafting top-tier solutions - chemicals, fertilizers, pesticides - tailored to your crop's desires. 
                    <span className="block mt-4 text-2xl font-bold text-green-600">Let's grow greatness together!</span>
                  </p>
                  
                  <div className="flex flex-wrap gap-4 justify-center">
                    <button className="px-8 py-4 bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-green-200 transition-all duration-300 hover:-translate-y-1">
                      Discover Our Products
                    </button>
                    <button className="px-8 py-4 bg-white text-green-700 rounded-full font-semibold border-2 border-green-600 hover:bg-green-50 transition-all duration-300 hover:-translate-y-1">
                      Talk to Our Experts
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Manufacturing Process Section */}
            <div className="mb-20">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center p-2 bg-green-100 rounded-full mb-4">
                  <Factory className="w-6 h-6 text-green-700" />
                </div>
                <h4 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                  Manufacturing <span className="text-green-600">Process</span>
                </h4>
                <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                  The manufacturing process at SURYAENTERPRISES follows a systematic four-step approach 
                  to ensure quality and efficiency
                </p>
              </div>

              {/* Process Steps */}
              <div className="grid md:grid-cols-4 gap-6">
                {/* Step 1 - Formulation */}
                <div className="group relative">
                  <div className="absolute -inset-1 bg-linear-to-r from-purple-600 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                  <div className="relative bg-white p-8 rounded-2xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-purple-100 rounded-full -mt-6 -mr-6 opacity-50"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-14 h-14 bg-linear-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <Beaker className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-5xl font-black text-purple-100">01</span>
                      </div>
                      
                      <h5 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-purple-700 transition-colors">
                        Formulation
                      </h5>
                      
                      <p className="text-gray-600 leading-relaxed">
                        Our experts meticulously design the optimal chemical, fertilizer, or pesticide 
                        formula based on extensive research and understanding of crop needs.
                      </p>
                      
                      <div className="mt-4 h-1 w-12 bg-purple-200 rounded-full group-hover:w-20 transition-all duration-500"></div>
                    </div>
                  </div>
                </div>

                {/* Step 2 - Production */}
                <div className="group relative">
                  <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-cyan-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                  <div className="relative bg-white p-8 rounded-2xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 rounded-full -mt-6 -mr-6 opacity-50"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-14 h-14 bg-linear-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <Factory className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-5xl font-black text-blue-100">02</span>
                      </div>
                      
                      <h5 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-700 transition-colors">
                        Production
                      </h5>
                      
                      <p className="text-gray-600 leading-relaxed">
                        State-of-the-art facilities and rigorous quality control measures are employed 
                        to manufacture products, adhering to approved formulations and industry standards.
                      </p>
                      
                      <div className="mt-4 h-1 w-12 bg-blue-200 rounded-full group-hover:w-20 transition-all duration-500"></div>
                    </div>
                  </div>
                </div>

                {/* Step 3 - Testing */}
                <div className="group relative">
                  <div className="absolute -inset-1 bg-linear-to-r from-amber-600 to-orange-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                  <div className="relative bg-white p-8 rounded-2xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-amber-100 rounded-full -mt-6 -mr-6 opacity-50"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-14 h-14 bg-linear-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <TestTube className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-5xl font-black text-amber-100">03</span>
                      </div>
                      
                      <h5 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-amber-700 transition-colors">
                        Testing
                      </h5>
                      
                      <p className="text-gray-600 leading-relaxed">
                        Each batch undergoes rigorous testing for efficacy, safety, and compliance with 
                        regulatory standards, ensuring only the highest-quality products reach our customers.
                      </p>
                      
                      <div className="mt-4 h-1 w-12 bg-amber-200 rounded-full group-hover:w-20 transition-all duration-500"></div>
                    </div>
                  </div>
                </div>

                {/* Step 4 - Distribution */}
                <div className="group relative">
                  <div className="absolute -inset-1 bg-linear-to-r from-green-600 to-emerald-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                  <div className="relative bg-white p-8 rounded-2xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-green-100 rounded-full -mt-6 -mr-6 opacity-50"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-14 h-14 bg-linear-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <Truck className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-5xl font-black text-green-100">04</span>
                      </div>
                      
                      <h5 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-green-700 transition-colors">
                        Distribution
                      </h5>
                      
                      <p className="text-gray-600 leading-relaxed">
                        Once approved, products are carefully packaged to preserve integrity. Efficient 
                        distribution channels ensure timely delivery to farmers across the nation.
                      </p>
                      
                      <div className="mt-4 h-1 w-12 bg-green-200 rounded-full group-hover:w-20 transition-all duration-500"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Why Choose Our Products Section */}
            <div className="mb-20">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center p-2 bg-amber-100 rounded-full mb-4">
                  <Star className="w-6 h-6 text-amber-700" />
                </div>
                <h4 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                  Why Choose <span className="text-amber-600">Our Products?</span>
                </h4>
                <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                  Discover what makes SURYAENTERPRISES the trusted choice for farmers across India
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Proven Results */}
                <div className="group bg-white p-8 rounded-2xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-linear-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <TrendingUp className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <div>
                      <h5 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-700 transition-colors">
                        Proven Results
                      </h5>
                      <p className="text-gray-600 leading-relaxed">
                        Our products have consistently delivered remarkable outcomes, boosting yields and crop health, 
                        making us a trusted choice among farmers.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tailored Solutions */}
                <div className="group bg-white p-8 rounded-2xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Target className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <div>
                      <h5 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-700 transition-colors">
                        Tailored Solutions
                      </h5>
                      <p className="text-gray-600 leading-relaxed">
                        We understand the unique needs of each crop and field, providing customized solutions that 
                        maximize effectiveness and address specific agricultural challenges.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Advanced Formulas */}
                <div className="group bg-white p-8 rounded-2xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-linear-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Atom className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <div>
                      <h5 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-700 transition-colors">
                        Advanced Formulas
                      </h5>
                      <p className="text-gray-600 leading-relaxed">
                        SURYAENTERPRISES products are formulated with precision, utilizing advanced chemistry and technology 
                        to create formulas that deliver optimal performance.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sustainability Focus */}
                <div className="group bg-white p-8 rounded-2xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-linear-to-br from-green-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <HeartHandshake className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <div>
                      <h5 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-700 transition-colors">
                        Sustainability Focus
                      </h5>
                      <p className="text-gray-600 leading-relaxed">
                        We're committed to environmentally responsible practices, ensuring that our products not only 
                        benefit your crops but also promote sustainable, long-term farming.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Innovation Edge */}
                <div className="group bg-white p-8 rounded-2xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-linear-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Zap className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <div>
                      <h5 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-amber-700 transition-colors">
                        Innovation Edge
                      </h5>
                      <p className="text-gray-600 leading-relaxed">
                        Our team of experts continually pushes the boundaries of agrochemical science, offering you 
                        the latest innovations to stay ahead in modern agriculture.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Eco-Friendly Approach */}
                <div className="group bg-white p-8 rounded-2xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-linear-to-br from-emerald-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Globe className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <div>
                      <h5 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-emerald-700 transition-colors">
                        Eco-Friendly Approach
                      </h5>
                      <p className="text-gray-600 leading-relaxed">
                        We believe in sustainable farming practices that contribute to a healthier planet. Our products 
                        are designed to minimize environmental impact while maximizing productivity.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Commitment Banner */}
            <div className="bg-linear-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white relative overflow-hidden mb-12">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mt-10 -mr-10"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -mb-10 -ml-10"></div>
              
              <div className="relative z-10">
                <h4 className="text-2xl font-bold mb-3">Our Commitment to Excellence</h4>
                <p className="text-white/90 max-w-3xl">
                  At SURYAENTERPRISES, quality isn't just a standard—it's our foundation. Every product undergoes 
                  rigorous testing and research to ensure it meets the highest standards of efficacy and safety. 
                  We're not just creating agricultural solutions; we're cultivating trust, one farmer at a time.
                </p>
                <div className="flex gap-4 mt-6">
                  <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm">ISO 9001:2024 Certified</span>
                  <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm">Green India Initiative Partner</span>
                </div>
              </div>
            </div>

            {/* Footer Quote */}
            <div className="text-center border-t border-gray-200 pt-8">
              <p className="text-gray-500 italic text-lg">
                "Shaping the future of agriculture through innovation, sustainability, and unwavering dedication to the farming community."
              </p>
              <div className="flex justify-center gap-2 mt-4">
                <Leaf className="w-4 h-4 text-green-500" />
                <Leaf className="w-4 h-4 text-green-500" />
                <Leaf className="w-4 h-4 text-green-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutContent;