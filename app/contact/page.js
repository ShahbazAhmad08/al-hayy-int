'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, MessageSquare, Send, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { submitContact } from '@/lib/api';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: 'General Atelier Inquiry', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitContact(formData);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#AA7E18]">
          Bespoke Concierge & Support
        </span>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#070E1E]">
          Connect With Al Hayy International
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
          For custom bridal orders, size alterations, bespoke packaging, or atelier queries, our concierge is at your service.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Info Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 bg-white rounded-3xl border border-[#E5D9C8] space-y-6 shadow-sm">
            <h3 className="font-serif-luxury text-lg font-bold text-[#070E1E]">
              Srinagar Atelier Office
            </h3>

            <div className="space-y-4 text-xs text-stone-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="block text-[#070E1E] font-semibold">Flagship Boutique & Loom:</strong>
                  <span>Boulevard Road, Near Dal Lake, Srinagar, Jammu & Kashmir 190001</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="block text-[#070E1E] font-semibold">Email:</strong>
                  <span>contact@alhayyinternational.com</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="block text-[#070E1E] font-semibold">Customer Care & Orders:</strong>
                  <a href="tel:+91962248076" className="text-[#AA7E18] font-mono font-bold hover:underline">
                    +91 96224 8076
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="block text-[#070E1E] font-semibold">Atelier Hours:</strong>
                  <span>Mon – Sat: 10:00 AM – 8:00 PM IST</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://wa.me/91962248076?text=Salam%20Al%20Hayy%20International%20Atelier,%20I%20have%20an%20inquiry."
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-[#070E1E] text-[#F7E7B6] border border-[#D4AF37]/50 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:bg-[#102142] transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
                <span>Instant WhatsApp Concierge</span>
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form Column */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 bg-white rounded-3xl border border-[#E5D9C8] shadow-sm space-y-6">
            <h3 className="font-serif-luxury text-xl font-bold text-[#070E1E]">
              Send an Atelier Inquiry
            </h3>

            {submitted ? (
              <div className="p-8 text-center space-y-3 bg-[#FAF7F2] rounded-2xl border border-[#D4AF37]/40">
                <CheckCircle2 className="w-10 h-10 text-[#AA7E18] mx-auto" />
                <h4 className="font-serif-luxury text-lg font-bold text-[#070E1E]">Message Received</h4>
                <p className="text-xs text-stone-600 max-w-xs mx-auto">
                  Shukriya! Our master atelier representative will connect with you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Zoya Khan"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full py-2.5 px-3.5 rounded-xl border border-[#E5D9C8] text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 962248076"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full py-2.5 px-3.5 rounded-xl border border-[#E5D9C8] text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="patron@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full py-2.5 px-3.5 rounded-xl border border-[#E5D9C8] text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Your Inquiry / Message *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about the size customization, bridal ensemble, luxury gift box, or styling advice you seek..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full py-2.5 px-3.5 rounded-xl border border-[#E5D9C8] text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#070E1E] text-[#F7E7B6] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#102142] border border-[#D4AF37]/40 shadow-md transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
                      <span>Submitting Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#D4AF37]" />
                      <span>Submit Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
