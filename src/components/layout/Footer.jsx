import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#142D3A] text-slate-300 pt-16 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#087F75] flex items-center justify-center text-white shadow-lg shadow-[#087F75]/30">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                Mixer<span className="text-[#087F75]">Fix</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Your trusted partner in smart electronic repair services. We digitize appliance maintenance with door-to-door pickup, verified workshops, transparent estimates, and live progress tracking.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-teal-400 bg-teal-950/60 border border-teal-800/60 px-3 py-1.5 rounded-full font-medium">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                90-Day Repair Warranty Guaranteed
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Services</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><a href="/#categories" className="hover:text-teal-400 transition">Mixer & Grinder Repair</a></li>
              <li><a href="/#categories" className="hover:text-teal-400 transition">Refrigerator Service</a></li>
              <li><a href="/#categories" className="hover:text-teal-400 transition">Television & LED Display</a></li>
              <li><a href="/#categories" className="hover:text-teal-400 transition">Washing Machine PCB & Motor</a></li>
              <li><a href="/#categories" className="hover:text-teal-400 transition">Microwave & Oven Fix</a></li>
              <li><a href="/#categories" className="hover:text-teal-400 transition">Water Purifier Filter & RO</a></li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link to="/login" className="hover:text-teal-400 transition">Customer Portal</Link></li>
              <li><Link to="/login" className="hover:text-teal-400 transition">Shop Owner Hub</Link></li>
              <li><Link to="/login" className="hover:text-teal-400 transition">Delivery Agent Portal</Link></li>
              <li><a href="/#how-it-works" className="hover:text-teal-400 transition">How It Works</a></li>
              <li><a href="/#about" className="hover:text-teal-400 transition">Why Choose MixerFix</a></li>
              <li><a href="/#contact" className="hover:text-teal-400 transition">Customer Support</a></li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Contact & Support</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-teal-400 mt-1 flex-shrink-0" />
                <span>Brigade Road, Central Tech Hub, Bengaluru, 560001</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <span>+91 (080) 2449-3890 / 1800-MIXER-FIX</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <span>support@mixerfix.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Mixer Fix Technologies Pvt Ltd. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Smart Repairs
            </span>
            <span>•</span>
            <span className="text-slate-400">Terms of Service</span>
            <span>•</span>
            <span className="text-slate-400">Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

