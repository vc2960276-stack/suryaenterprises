// components/ContactContent.jsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  MapPin, Phone, Mail, Building, Users, Clock,
  Send, ChevronRight, Copy, CheckCircle, Globe,
  MessageSquare, Navigation, Award
} from 'lucide-react';

const ContactContent = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    company: '',
    message: ''
  });

  const [copied, setCopied] = useState(null);
  const [formStatus, setFormStatus] = useState(null);

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    setFormStatus('success');
    setTimeout(() => setFormStatus(null), 3000);
  };

  return (
    <div className="bg-linear-to-b from-green-50 to-white">
      {/* Hero Section */}
      <div className="relative h-100 md:h-112.5 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/assets/images/contact.jpg"
            alt="Contact SURYAENTERPRISES"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-r from-green-900/90 via-green-800/70 to-emerald-900/80"></div>
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="text-white max-w-3xl">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/30">
              <MessageSquare className="w-4 h-4 mr-2 text-amber-300" />
              <span className="text-sm font-medium">Get in Touch</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Reach Out to{' '}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-300 to-yellow-400">
                SURYAENTERPRISES
              </span>
            </h1>



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
            <Users className="w-6 h-6 text-green-700" />
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            We're here to assist you. Whether you have inquiries about our products, need technical support,
            or want to explore partnership opportunities, we're just a message away. Feel free to contact us
            through any of the channels below.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">

          {/* Left Column - Contact Info & Form */}
          <div className="space-y-8">

            {/* Visit Our Headquarters Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <Building className="w-6 h-6 text-green-600 mr-2" />
                Visit Our Headquarters
              </h2>
              <p className="text-gray-600 mb-6">
                If you prefer face-to-face interactions, we welcome you to visit our headquarters. Experience
                our commitment to innovation and witness firsthand how we're shaping the future of farming.
              </p>

              {/* Address Cards */}
              <div className="space-y-4">
                {/* Corporate Office */}
                <div className="bg-linear-to-r from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-gray-800 mb-1">Corporate Office</h3>

                      <p className="text-gray-600 text-sm leading-relaxed">
                        24, Business Park, Sector 18,<br />
                        Rohini, New Delhi, Delhi 110085
                      </p>

                      <button
                        onClick={() =>
                          window.open(
                            "https://maps.google.com/?q=Rohini+New+Delhi+India",
                            "_blank"
                          )
                        }
                        className="mt-2 text-green-600 text-sm font-medium flex items-center gap-1 hover:text-green-700"
                      >
                        <Navigation className="w-3 h-3" />
                        Get Directions
                      </button>
                    </div>
                  </div>
                </div>


              </div>
            </div>

            {/* Quick Contact Info */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <Globe className="w-6 h-6 text-green-600 mr-2" />
                Contact Information
              </h2>

              <div className="space-y-4">
                {/* CIN */}
                {/* <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-500">CIN</p>
                      <p className="font-medium text-gray-800">U24290GJ2021PLC126796</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy('U24290GJ2021PLC126796', 'cin')}
                    className="text-gray-400 hover:text-green-600 transition-colors"
                  >
                    {copied === 'cin' ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div> */}

                {/* Toll Free */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-500">Toll Free</p>
                      <p className="font-medium text-gray-800">98766543210</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy('98766543210', 'toll')}
                    className="text-gray-400 hover:text-green-600 transition-colors"
                  >
                    {copied === 'toll' ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>

                {/* Email */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-medium text-gray-800">info@SURYAENTERPRISES.com</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy('info@SURYAENTERPRISES.com', 'email')}
                    className="text-gray-400 hover:text-green-600 transition-colors"
                  >
                    {copied === 'email' ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>

                {/* Mobile */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-500">Mobile</p>
                      <p className="font-medium text-gray-800">+91 9876543210</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy('+91 9876543210', 'mobile')}
                    className="text-gray-400 hover:text-green-600 transition-colors"
                  >
                    {copied === 'mobile' ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Business Hours */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3 text-gray-600">
                  <Clock className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-800">Business Hours</p>
                    <p className="text-sm">Monday - Saturday: 9:00 AM - 6:00 PM</p>
                    <p className="text-sm text-gray-500">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
              <MessageSquare className="w-6 h-6 text-green-600 mr-2" />
              Let's Connect
            </h2>
            <p className="text-gray-600 mb-6">
              Have a question? Need guidance? We're here to help. Use the form below to send us a message,
              and one of our knowledgeable team members will get back to you promptly.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  required
                />
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  required
                />
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Your company name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="How can we help you?"
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition resize-none"
                  required
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-linear-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg hover:shadow-green-200 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Submit
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Form Status */}
              {formStatus === 'success' && (
                <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">
                  Thank you for reaching out! We'll get back to you soon.
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Additional Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center hover:shadow-lg transition">
            <Phone className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-800">Call Us</h3>
            <p className="text-sm text-gray-500">+91 9876543210</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center hover:shadow-lg transition">
            <Mail className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-800">Email Us</h3>
            <p className="text-sm text-gray-500 mt-1">info@SURYAENTERPRISES.com</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center hover:shadow-lg transition">
            <Clock className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-800">Visit Us</h3>
            <p className="text-sm text-gray-500 mt-1">Mon-Sat: 9 AM - 6 PM</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactContent;