// components/InstitutionalProducts.jsx - CORRECTED VERSION
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  FlaskConical, Beaker, Search, Filter, Download,
  ChevronDown, ChevronUp, Leaf, Droplets, Wind,
  Grid3x3, List, Star, Award, TrendingUp, Package
} from 'lucide-react';

const InstitutionalProducts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filterPurity, setFilterPurity] = useState('all');

  // ONLY the data you provided - no extra categories
  const products = [
    { name: 'Paraquate Dichloride', purity: '42%' },
    { name: 'Prophenophos', purity: '94%' },
    { name: 'Thiomathoxam', purity: '97%' },
    { name: 'Validamycin', purity: '62%' },
    { name: '2,4-D Amine Salt', purity: '97%' },
    { name: 'Azoxystrobin', purity: '98%' },
    { name: 'Acephate', purity: '97%' },
    { name: 'Chlorantraniliprole (CTPR)', purity: '95%' },
    { name: 'Chlorpyrifos', purity: '95%' },
    { name: 'Atrazine', purity: '97%' },
    { name: 'Cypermethrin', purity: '95%' },
    { name: 'Emamectin Benzoate', purity: '72%' },
    { name: 'Gibberellic Acid', purity: '98%' },
    { name: 'Glyphosate', purity: '97%' },
    { name: 'Hexaconazole', purity: '93%' },
    { name: 'Imidacloprid', purity: '96%' },
    { name: 'Lambdacyhalothrin', purity: '98%' },
    { name: 'Lambdacyhalothrin (Powder)', purity: '95%' },
    { name: 'Monocrotophos', purity: '75%' },
    { name: 'Pandimethalin', purity: '93%' },
  ];

  // Purity ranges for filter
  const purityRanges = [
    'all',
    '40-50%',
    '50-60%',
    '60-70%',
    '70-80%',
    '80-90%',
    '90-95%',
    '95-100%'
  ];

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesPurity = true;
    if (filterPurity !== 'all') {
      const purityValue = parseInt(product.purity);
      if (filterPurity === '40-50%') matchesPurity = purityValue >= 40 && purityValue < 50;
      else if (filterPurity === '50-60%') matchesPurity = purityValue >= 50 && purityValue < 60;
      else if (filterPurity === '60-70%') matchesPurity = purityValue >= 60 && purityValue < 70;
      else if (filterPurity === '70-80%') matchesPurity = purityValue >= 70 && purityValue < 80;
      else if (filterPurity === '80-90%') matchesPurity = purityValue >= 80 && purityValue < 90;
      else if (filterPurity === '90-95%') matchesPurity = purityValue >= 90 && purityValue < 95;
      else if (filterPurity === '95-100%') matchesPurity = purityValue >= 95 && purityValue <= 100;
    }
    
    return matchesSearch && matchesPurity;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'purity') {
      const purityA = parseInt(a.purity);
      const purityB = parseInt(b.purity);
      return purityB - purityA;
    }
    return 0;
  });

  // Get purity color based on percentage
  const getPurityColor = (purity) => {
    const value = parseInt(purity);
    if (value >= 95) return 'text-green-600 bg-green-100';
    if (value >= 90) return 'text-emerald-600 bg-emerald-100';
    if (value >= 80) return 'text-amber-600 bg-amber-100';
    if (value >= 70) return 'text-orange-600 bg-orange-100';
    if (value >= 60) return 'text-red-600 bg-red-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="bg-linear-to-b from-green-50 to-white min-h-screen">
      {/* Hero Section */}
      <div className="relative h-75 md:h-87.5 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/assets/images/Frame-162665.png"
            alt="Institutional Products"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-r from-green-900/90 via-green-800/70 to-emerald-900/80"></div>
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="text-white max-w-3xl">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/30">
              <Package className="w-4 h-4 mr-2 text-amber-300" />
              <span className="text-sm font-medium">Institutional Grade</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Institutional{' '}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-300 to-yellow-400">
                Products
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-100 mb-4 font-light max-w-2xl">
              High-purity agrochemical solutions with complete technical specifications
            </p>
            
            <div className="w-24 h-1 bg-amber-400 rounded-full mt-8"></div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-white to-transparent"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-4 text-center border border-gray-100">
            <div className="text-2xl font-bold text-green-600">{products.length}</div>
            <div className="text-sm text-gray-500">Total Products</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center border border-gray-100">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(products.reduce((acc, p) => acc + parseInt(p.purity), 0) / products.length)}%
            </div>
            <div className="text-sm text-gray-500">Avg. Purity</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center border border-gray-100 col-span-2 md:col-span-1">
            <div className="text-2xl font-bold text-green-600">
              {products.filter(p => parseInt(p.purity) >= 95).length}
            </div>
            <div className="text-sm text-gray-500">95%+ Purity</div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            {/* Search */}
            <div className="flex-1 min-w-62.5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800 placeholder-gray-500"
                />
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap gap-3">
              {/* Purity Filter */}
              <select
                value={filterPurity}
                onChange={(e) => setFilterPurity(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-800 placeholder-gray-500"
              >
                {purityRanges.map(range => (
                  <option key={range} value={range}>
                    {range === 'all' ? 'All Purity Levels' : range}
                  </option>
                ))}
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-800 placeholder-gray-500"
              >
                <option value="name">Sort by Name (A-Z)</option>
                <option value="purity">Sort by Purity (High to Low)</option>
              </select>

              {/* View Toggle */}
              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 ${viewMode === 'grid' ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 ${viewMode === 'list' ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              {/* Export Button */}
              <button className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2">
                <Download className="w-5 h-5" />
                <span className="hidden md:inline">Export List</span>
              </button>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || filterPurity !== 'all') && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-500">Active filters:</span>
              {searchTerm && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1">
                  Search: "{searchTerm}"
                  <button onClick={() => setSearchTerm('')} className="ml-1 hover:text-green-900">×</button>
                </span>
              )}
              {filterPurity !== 'all' && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1">
                  Purity: {filterPurity}
                  <button onClick={() => setFilterPurity('all')} className="ml-1 hover:text-green-900">×</button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4 text-gray-600">
          Showing <span className="font-bold text-green-600">{sortedProducts.length}</span> of {products.length} products
        </div>

        {/* Products Display */}
        {viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product, index) => (
              <div
                key={index}
                onClick={() => setSelectedProduct(selectedProduct === index ? null : index)}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden border-2 transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-1 ${
                  selectedProduct === index ? 'border-green-500' : 'border-gray-100'
                }`}
              >
                {/* Purity Indicator Bar */}
                <div 
                  className="h-2 w-full"
                  style={{
                    background: `linear-gradient(90deg, 
                      ${parseInt(product.purity) >= 95 ? '#10b981' : 
                        parseInt(product.purity) >= 90 ? '#34d399' : 
                        parseInt(product.purity) >= 80 ? '#f59e0b' : 
                        parseInt(product.purity) >= 70 ? '#f97316' : 
                        parseInt(product.purity) >= 60 ? '#ef4444' : '#6b7280'} 
                      ${parseInt(product.purity)}%, #e5e7eb ${parseInt(product.purity)}%)`
                  }}
                ></div>
                
                <div className="p-5">
                  {/* Product Name */}
                  <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2 min-h-14
                  ">
                    {product.name}
                  </h3>

                  {/* Purity Badge - Prominent */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">Purity</span>
                    <span className={`text-xl font-bold px-4 py-2 rounded-lg ${getPurityColor(product.purity)}`}>
                      {product.purity}
                    </span>
                  </div>

                  {/* Technical Specifications Placeholder */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-400">Form:</span>
                        <p className="font-medium text-gray-700">Technical</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Packaging:</span>
                        <p className="font-medium text-gray-700">As required</p>
                      </div>
                    </div>
                  </div>

                  {/* Expand/Collapse Indicator */}
                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <FlaskConical className="w-3 h-3" />
                      Technical Grade
                    </span>
                    {selectedProduct === index ? (
                      <ChevronUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>

                  {/* Expanded Details */}
                  {selectedProduct === index && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="space-y-2 text-sm">
                        <p className="text-gray-600">
                          <span className="font-medium">Product:</span> {product.name}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Purity:</span> {product.purity}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">CAS:</span> Available on request
                        </p>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition">
                          Get Quote
                        </button>
                        <button className="px-3 py-2 border border-green-600 text-green-600 rounded-lg text-sm font-medium hover:bg-green-50 transition">
                          Details
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Product Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Purity</th>
                  {/* <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Action</th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedProducts.map((product, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800">{product.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${getPurityColor(product.purity)}`}>
                        {product.purity}
                      </span>
                    </td>
                    {/* <td className="px-6 py-4 text-right">
                      <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                        Request Quote
                      </button>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* No Results */}
        {sortedProducts.length === 0 && (
          <div className="text-center py-16">
            <Beaker className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Purity Legend */}
        <div className="mt-8 bg-white rounded-xl p-4 border border-gray-100">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Purity Levels:</h4>
          <div className="flex flex-wrap gap-4">
            <span className="flex items-center gap-1 text-xs text-gray-800"><span className="w-3 h-3 bg-green-500 rounded-full"></span> 95-100% (Highest)</span>
            <span className="flex items-center gap-1 text-xs text-gray-800"><span className="w-3 h-3 bg-emerald-500 rounded-full"></span> 90-94%</span>
            <span className="flex items-center gap-1 text-xs text-gray-800"><span className="w-3 h-3 bg-amber-500 rounded-full"></span> 80-89%</span>
            <span className="flex items-center gap-1 text-xs text-gray-800"><span className="w-3 h-3 bg-orange-500 rounded-full"></span> 70-79%</span>
            <span className="flex items-center gap-1 text-xs text-gray-800"><span className="w-3 h-3 bg-red-500 rounded-full"></span> 60-69%</span>
            <span className="flex items-center gap-1 text-xs text-gray-800"><span className="w-3 h-3 bg-gray-500 rounded-full"></span> Below 60%</span>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <Award className="w-10 h-10 text-green-600 mb-3" />
            <h3 className="font-bold text-gray-800 mb-2">Institutional Grade</h3>
            <p className="text-sm text-gray-500">High-purity products for institutional partners</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <Package className="w-10 h-10 text-green-600 mb-3" />
            <h3 className="font-bold text-gray-800 mb-2">Bulk Supply</h3>
            <p className="text-sm text-gray-500">Custom packaging and volume discounts</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <Star className="w-10 h-10 text-green-600 mb-3" />
            <h3 className="font-bold text-gray-800 mb-2">Quality Assured</h3>
            <p className="text-sm text-gray-500">Rigorous testing for purity and consistency</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionalProducts;