// components/ContactContent.jsx

"use client";

import React, { useState } from "react";
import { MapPin, Phone, Mail, Building, Users, Clock, Send, ChevronRight, Copy, CheckCircle, Globe, MessageSquare, Navigation } from 'lucide-react';

import PageHeader from "../components/shop/PageHeader";
import { SITE } from "../config/site";
const ContactContent = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    company: "",
    message: "",
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

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // No backend for this form yet: hand the message to the visitor's email
    // app instead of pretending it was submitted.
    const body = [
      `Name: ${formData.name}`,
      `Email: ${formData.email}`,
      `Mobile: ${formData.mobile}`,
      `Company: ${formData.company}`,
      "",
      formData.message,
    ].join("\n");
    window.location.href = `mailto:SURYA2026ENT@gmail.com?subject=${encodeURIComponent(
      `Website enquiry from ${formData.name || "a visitor"}`
    )}&body=${encodeURIComponent(body)}`;
    setFormStatus("success");

    setTimeout(() => setFormStatus(null), 6000);
  };

  return (
    <main className="pb-3">
      <PageHeader eyebrow="Get in Touch" title="Reach Out To SURYAENTERPRISES" image="/assets/images/contact.jpg" crumbs={[{ label: "Contact" }]} />

      {/* Main Content */}
      <div className="shell py-3">

        {/* Introduction */}
        <div className="text-center max-w-4xl mx-auto mb-6">
          <div className="inline-flex items-center justify-center p-2 bg-green-100 rounded-full mb-4">
            <Users className="w-6 h-6 text-green-700" />
          </div>

          <p className="text-[15px] text-gray-600 leading-relaxed">
            We&apos;re here to assist you. Whether you have inquiries about
            our products, need technical support, or want to explore
            partnership opportunities, we&apos;re just a message away. Feel
            free to contact us through any of the channels below.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8 mb-6">

          {/* Left Column */}
          <div className="space-y-8">

            {/* Visit Our Headquarters */}
            <div className="bg-white rounded-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <Building className="w-6 h-6 text-green-600 mr-2" />
                Visit Our Offices
              </h2>

              <p className="text-gray-600 mb-6">
                We welcome you to connect with our offices in Delhi and
                Rajasthan. Please find our registered office details below.
              </p>

              {/* Address Cards */}
              <div className="space-y-4">

                {/* Rajasthan Office */}
                <div className="bg-linear-to-r from-green-50 to-emerald-50 rounded-lg p-5 border border-green-100">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />

                    <div>
                      <h3 className="font-bold text-gray-800 mb-1">
                        Rajasthan Registration
                      </h3>

                      <p className="text-gray-600 text-sm leading-relaxed">
                        Shop No. SS-53, Rajdhani Krishi Mandi,
                        <br />
                        Sikar Road, Kukar Kheda,
                        <br />
                        Jaipur, Rajasthan — 302013
                      </p>

                      <p className="text-gray-600 text-sm mt-2">
                        <span className="font-semibold">
                          GSTIN:
                        </span>{" "}
                        08IIPPP7537C1ZO
                      </p>

                      <button
                        onClick={() =>
                          window.open(
                            "https://maps.google.com/?q=Rajdhani+Krishi+Mandi+Jaipur+Rajasthan",
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

                {/* Delhi Office */}
                <div className="bg-linear-to-r from-green-50 to-emerald-50 rounded-lg p-5 border border-green-100">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />

                    <div>
                      <h3 className="font-bold text-gray-800 mb-1">
                        Delhi Registration
                      </h3>

                      <p className="text-gray-600 text-sm leading-relaxed">
                        Ground Floor, 6670, BALMIKI MANDIR,
                        <br />
                        Nabi Karim Road, Nabi Karim,
                        <br />
                        New Delhi, Central Delhi,
                        <br />
                        Delhi — 110055
                      </p>

                      <p className="text-gray-600 text-sm mt-2">
                        <span className="font-semibold">
                          GSTIN:
                        </span>{" "}
                        07IIPPP7537C1ZQ
                      </p>

                      <button
                        onClick={() =>
                          window.open(
                            "https://maps.google.com/?q=BALMIKI+MANDIR+Nabi+Karim+Delhi+India",
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

            {/* Contact Information */}
            <div className="bg-white rounded-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <Globe className="w-6 h-6 text-green-600 mr-2" />
                Contact Information
              </h2>

              <div className="space-y-4">

                {/* Contact & Support */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-green-600" />

                    <div>
                      <p className="text-xs text-gray-500">
                        Contact &amp; Support
                      </p>

                      <p className="font-medium text-gray-800">
                        +91 9650300157
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      handleCopy("+91 9650300157", "support")
                    }
                    className="text-gray-400 hover:text-green-600 transition-colors"
                  >
                    {copied === "support" ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>


                {/* Email */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 min-w-0">
                    <Mail className="w-5 h-5 text-green-600 flex-shrink-0" />

                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">
                        Email
                      </p>

                      <a
                        href="mailto:SURYA2026ENT@gmail.com"
                        className="font-medium text-gray-800 hover:text-green-600 transition-colors break-all"
                      >
                        SURYA2026ENT@gmail.com
                      </a>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      handleCopy(
                        "SURYA2026ENT@gmail.com",
                        "email"
                      )
                    }
                    className="text-gray-400 hover:text-green-600 transition-colors flex-shrink-0 ml-3"
                  >
                    {copied === "email" ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>


              </div>

              {/* Business Hours */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3 text-gray-600">
                  <Clock className="w-5 h-5 text-green-600" />

                  <div>
                    <p className="font-medium text-gray-800">
                      Business Hours
                    </p>

                    <p className="text-sm">{SITE.helpline.hours}</p>

                    <p className="text-sm text-gray-500">
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="bg-white rounded-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
              <MessageSquare className="w-6 h-6 text-green-600 mr-2" />
              Let&apos;s Connect
            </h2>

            <p className="text-gray-600 mb-6">
              Have a question? Need guidance? We&apos;re here to help. Use
              the form below to send us a message, and one of our
              knowledgeable team members will get back to you promptly.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>

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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>

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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number
                </label>

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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>

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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>

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
                className="w-full bg-linear-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-[0_4px_16px_rgba(20,33,26,0.10)] hover:shadow-green-200 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />

                Submit

                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Form Status */}
              {formStatus === "success" && (
                <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">
                  Your email app has opened with this message — press send
                  to reach us, or call +91 9650300157.
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Additional Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">

          {/* Call Us */}
          <div className="bg-white p-6 rounded-lg border border-gray-100 text-center hover:shadow-[0_4px_16px_rgba(20,33,26,0.10)] transition">
            <Phone className="w-8 h-8 text-green-600 mx-auto mb-3" />

            <h3 className="font-semibold text-gray-800">
              Call Us
            </h3>

            <a
              href="tel:+919650300157"
              className="text-sm text-gray-500 hover:text-green-600 transition-colors"
            >
              +91 9650300157
            </a>
          </div>

          {/* Email Us */}
          <div className="bg-white p-6 rounded-lg border border-gray-100 text-center hover:shadow-[0_4px_16px_rgba(20,33,26,0.10)] transition">
            <Mail className="w-8 h-8 text-green-600 mx-auto mb-3" />

            <h3 className="font-semibold text-gray-800">
              Email Us
            </h3>

            <a
              href="mailto:SURYA2026ENT@gmail.com"
              className="text-sm text-gray-500 mt-1 hover:text-green-600 transition-colors break-all"
            >
              SURYA2026ENT@gmail.com
            </a>
          </div>

          {/* Visit Us */}
          <div className="bg-white p-6 rounded-lg border border-gray-100 text-center hover:shadow-[0_4px_16px_rgba(20,33,26,0.10)] transition">
            <MapPin className="w-8 h-8 text-green-600 mx-auto mb-3" />

            <h3 className="font-semibold text-gray-800">
              Visit Us
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Delhi &amp; Jaipur, Rajasthan
            </p>
          </div>

        </div>
      </div>
    </main>
  );
};

export default ContactContent;