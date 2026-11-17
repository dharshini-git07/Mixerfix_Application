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
            <p className="text-slate-300 text-sm font-medium leading-relaxed max-w-sm">
              Smart doorstep appliance repairs, verified workshops & live stage tracking.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <span className="inline-flex items-center gap-2 text-sm text-teal-300 bg-teal-950/80 border border-teal-700/80 px-3.5 py-1.5 rounded-full font-bold">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                90-Day Warranty Guaranteed
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Services</h4>
            <ul className="space-y-2.5 text-sm font-medium text-slate-300">
              <li><a href="/#categories" className="hover:text-teal-400 transition">Mixer & Grinder</a></li>
              <li><a href="/#categories" className="hover:text-teal-400 transition">Refrigerator</a></li>
              <li><a href="/#categories" className="hover:text-teal-400 transition">Television & LED</a></li>
              <li><a href="/#categories" className="hover:text-teal-400 transition">Washing Machine</a></li>
              <li><a href="/#categories" className="hover:text-teal-400 transition">Microwave Oven</a></li>
              <li><a href="/#categories" className="hover:text-teal-400 transition">Water Purifier</a></li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Portals</h4>
            <ul className="space-y-2.5 text-sm font-medium text-slate-300">
              <li><Link to="/login" className="hover:text-teal-400 transition">Customer Portal</Link></li>
              <li><Link to="/login" className="hover:text-teal-400 transition">Shop Owner Hub</Link></li>
              <li><Link to="/login" className="hover:text-teal-400 transition">Delivery Agent</Link></li>
              <li><a href="/#how-it-works" className="hover:text-teal-400 transition">How It Works</a></li>
              <li><a href="/#about" className="hover:text-teal-400 transition">About Us</a></li>
              <li><a href="/#contact" className="hover:text-teal-400 transition">Contact</a></li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Support</h4>
            <ul className="space-y-3 text-sm font-medium text-slate-300">
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-teal-400 mt-1 flex-shrink-0" />
                <span>Brigade Road, Bengaluru 560001</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <span>1800-MIXER-FIX (Toll Free)</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <span>support@mixerfix.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-sm font-medium text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Mixer Fix Technologies. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1.5 font-semibold text-slate-300">
              Made with <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> for Smart Repairs
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

