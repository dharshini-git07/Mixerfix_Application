import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { APPLIANCE_CATEGORIES } from '../../data/mockData';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../context/AuthContext';
import { useRepair } from '../../context/RepairContext';
import {
  Wrench,
  CheckCircle2,
  Clock,
  Truck,
  ShieldCheck,
  Star,
  ArrowRight,
  Sparkles,
  PhoneCall,
  Mail,
  MapPin,
  Calendar,
  Layers,
  Award,
  Zap,
  RotateCcw,
  Send
} from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated, currentUser } = useAuth();
  const { addToast } = useRepair();
  const navigate = useNavigate();

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleBookRepairClick = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=new-request');
    } else if (currentUser?.role === 'customer') {
      navigate('/customer/new-request');
    } else {
      navigate('/login');
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.phone) {
      addToast('Incomplete Form', 'Please enter your name and phone number.', 'warning');
      return;
    }
    setContactSubmitted(true);
    addToast(
      'Message Received!',
      `Thank you ${contactForm.name}, our repair coordinator will contact you shortly at ${contactForm.phone}.`,
      'success'
    );
    setContactForm({ name: '', phone: '', email: '', message: '' });
  };

  const testimonials = [
    {
      name: 'Pooja Hegde',
      location: 'Indiranagar, Bengaluru',
      appliance: 'Prestige Mixer Grinder',
      quote: 'My mixer motor started smoking in the middle of preparing breakfast chutney. Booked on Mixer Fix at 9 AM, agent picked it up by 11 AM, and it was back next evening running smoother than new. Phenomenal service!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'
    },
    {
      name: 'Ramesh Sundaram',
      location: 'Koramangala, Bengaluru',
      appliance: 'LG Washing Machine 7kg',
      quote: 'The live progress tracking gave total peace of mind. I could see the exact stages from pickup to bench testing. The technician even shared notes on what part was replaced. Truly transparent pricing.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150'
    },
    {
      name: 'Dr. Ananya Sen',
      location: 'Whitefield, Bengaluru',
      appliance: 'Samsung 253L Refrigerator',
      quote: 'Other technicians quoted exorbitant rates for compressor replacement. Mixer Fix diagnosed it accurately as a minor defrost sensor fault for a fraction of the cost. 90-day warranty gives solid confidence.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
    }
  ];

  const whyChooseUs = [
    {
      icon: Truck,
      title: 'Free Doorstep Pickup & Return',
      description: 'Our verified delivery couriers handle careful packaging, pickup, and return right to your home.'
    },
    {
      icon: ShieldCheck,
      title: '90-Day Service Warranty',
      description: 'Every completed repair is covered by our comprehensive 90-day parts and labor guarantee.'
    },
    {
      icon: Zap,
      title: 'Real-Time Stage Tracking',
      description: 'Watch your appliance move through 9 precise stages from intake to repair, testing, and return.'
    },
    {
      icon: Award,
      title: 'Verified Master Technicians',
      description: 'Repairs are handled by certified appliance specialists using 100% genuine OEM spare parts.'
    },
    {
      icon: Clock,
      title: 'Rapid 24-48hr Turnaround',
      description: 'Over 85% of appliance repairs are diagnosed, serviced, tested, and returned within 48 hours.'
    },
    {
      icon: RotateCcw,
      title: 'Eco-Friendly Second Life',
      description: 'We help cut down electronic waste by restoring high-grade appliances to peak operating life.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F5F8F8] flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <section id="hero" className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-[#DDF4EF] text-[#087F75] px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase border border-[#087F75]/20 shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Appliance Care Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#142D3A] tracking-tight leading-[1.15]">
                Your Appliances Deserve a{' '}
                <span className="text-[#087F75] relative inline-block">
                  Second Life.
                  <svg
                    className="absolute -bottom-2 left-0 w-full text-[#DDF4EF] -z-10"
                    viewBox="0 0 250 12"
                    fill="currentColor"
                  >
                    <path d="M0,8 C50,0 200,0 250,8 L250,12 L0,12 Z" />
                  </svg>
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Reliable electronic repair services at your fingertips. Register complaints, track repairs and get your appliances delivered with ease.
              </p>

              {/* Call to Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={handleBookRepairClick}
                  className="w-full sm:w-auto px-7 py-3.5 bg-[#087F75] hover:bg-[#06635B] text-white rounded-xl text-base font-bold shadow-lg shadow-[#087F75]/25 hover:shadow-[#087F75]/40 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <Wrench className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  <span>Book a Repair</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <a
                  href="#categories"
                  className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-50 text-[#142D3A] border border-slate-200 rounded-xl text-base font-semibold shadow-xs hover:shadow transition-all text-center"
                >
                  Explore Services
                </a>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/80 max-w-lg mx-auto lg:mx-0">
                <div>
                  <p className="text-2xl font-black text-[#142D3A]">12,500+</p>
                  <p className="text-xs text-slate-500 font-medium">Appliances Restored</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-[#087F75]">98.4%</p>
                  <p className="text-xs text-slate-500 font-medium">Customer Rating</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-[#142D3A]">90 Days</p>
                  <p className="text-xs text-slate-500 font-medium">Warranty Included</p>
                </div>
              </div>
            </div>

            {/* Right Graphic / Interactive Preview */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Background decorative glow */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-[#087F75] to-teal-400 rounded-3xl blur-xl opacity-30 animate-pulse" />

                <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
                  <div className="relative h-64 bg-slate-900 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80"
                      alt="Electronic repair technician at work"
                      className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="text-[11px] font-bold uppercase tracking-wider bg-[#087F75] px-2.5 py-1 rounded-md">
                        Live Tracking Demo
                      </span>
                      <h3 className="text-base font-bold mt-1 text-white">Philips 750W Mixer & Grinder</h3>
                      <p className="text-xs text-slate-300">Repair ID: REP-1001 • In Progress</p>
                    </div>
                  </div>

                  {/* Micro live tracker preview */}
                  <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">Current Phase: At Shop</span>
                      <span className="text-[#087F75] font-bold">Stage 6 of 9</span>
                    </div>

                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-[#087F75] h-full rounded-full w-2/3" />
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="text-slate-400 block text-[10px]">Estimated Cost</span>
                        <strong className="text-slate-800 text-sm">₹650</strong>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="text-slate-400 block text-[10px]">Assigned Agent</span>
                        <strong className="text-slate-800 text-sm">Amit Patel</strong>
                      </div>
                    </div>

                    <button
                      onClick={handleBookRepairClick}
                      className="w-full py-2.5 bg-[#DDF4EF] hover:bg-[#cbf1e8] text-[#087F75] font-bold text-xs rounded-xl transition text-center cursor-pointer"
                    >
                      Track or Book Your Appliance →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Appliance Categories Section */}
      <section id="categories" className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#087F75] bg-[#DDF4EF] px-3.5 py-1.5 rounded-full">
              Comprehensive Care
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#142D3A] tracking-tight mt-3">
              Appliance Categories We Service
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-3">
              From daily kitchen blenders to complex refrigeration compressors, our certified technicians repair all major household electronic appliances.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {APPLIANCE_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-card hover:border-[#087F75]/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-[11px] font-bold text-[#087F75] shadow-xs">
                      Starts {cat.startingPrice}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-bold text-[#142D3A] group-hover:text-[#087F75] transition-colors">
                      {cat.name}
                    </h3>

                    <div className="mt-3 space-y-1.5">
                      <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                        Common Issues:
                      </p>
                      <ul className="text-xs text-slate-500 space-y-1">
                        {cat.popularIssues.slice(0, 3).map((issue, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#087F75] flex-shrink-0" />
                            <span className="truncate">{issue}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Turnaround: {cat.avgRepairTime}</span>
                    <button
                      onClick={handleBookRepairClick}
                      className="text-xs font-bold text-[#087F75] hover:text-[#06635B] flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer"
                    >
                      <span>Fix Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-[#F5F8F8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#087F75] bg-[#DDF4EF] px-3.5 py-1.5 rounded-full">
              Simple 4-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#142D3A] tracking-tight mt-3">
              How Mixer Fix Operates
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-3">
              Digitalized repair management ensuring complete transparency, zero friction, and safe door-to-door delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-soft relative flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#DDF4EF] text-[#087F75] font-black text-lg flex items-center justify-center mb-4">
                  01
                </div>
                <h3 className="text-base font-bold text-[#142D3A]">Register Complaint</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Select your appliance, brand, and problem symptoms. Upload photos/videos and set your preferred pickup slot.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-[#087F75] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Generates Instant Repair ID
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-soft relative flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#DDF4EF] text-[#087F75] font-black text-lg flex items-center justify-center mb-4">
                  02
                </div>
                <h3 className="text-base font-bold text-[#142D3A]">Shop Estimate & Pickup</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  The verified shop owner reviews the problem and provides an initial estimate. A delivery agent is dispatched to collect your appliance.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-[#087F75] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Inspected & Safely Packaged
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-soft relative flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#DDF4EF] text-[#087F75] font-black text-lg flex items-center justify-center mb-4">
                  03
                </div>
                <h3 className="text-base font-bold text-[#142D3A]">Precision Bench Repair</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Certified technicians disassemble, test circuits, install OEM replacement spares, and run comprehensive load testing.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-[#087F75] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Chat Live with Workshop
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-soft relative flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#DDF4EF] text-[#087F75] font-black text-lg flex items-center justify-center mb-4">
                  04
                </div>
                <h3 className="text-base font-bold text-[#142D3A]">Return Delivery & Pay</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Your restored appliance is safely returned back to your doorstep. Complete simulated payment via UPI, Card, or COD.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-[#087F75] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 90-Day Warranty Activated
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#087F75] bg-[#DDF4EF] px-3.5 py-1.5 rounded-full">
              Industry Standard
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#142D3A] tracking-tight mt-3">
              Why Choose Mixer Fix?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-3">
              We bridge the gap between traditional appliance repair workshops and modern digital convenience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUs.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl border border-slate-100 bg-[#F5F8F8]/60 hover:bg-white hover:border-[#087F75]/30 hover:shadow-card transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#087F75] text-white flex items-center justify-center mb-4 shadow-md shadow-[#087F75]/20">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#142D3A]">{item.title}</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-20 bg-[#F5F8F8] border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#087F75] bg-[#DDF4EF] px-3.5 py-1.5 rounded-full">
              Verified Feedback
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#142D3A] tracking-tight mt-3">
              Loved by 10,000+ Appliance Owners
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-soft flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center space-x-1 text-amber-400 mb-3">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 italic leading-relaxed">"{t.quote}"</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center space-x-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#142D3A]">{t.name}</h4>
                    <p className="text-[11px] text-[#087F75] font-medium">{t.appliance}</p>
                    <p className="text-[10px] text-slate-400">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#087F75] bg-[#DDF4EF] px-3.5 py-1.5 rounded-full">
                Our Mission
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#142D3A] tracking-tight">
                Empowering Local Workshops, Ending Appliance Disposable Culture
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Modern electronic appliances are too often discarded prematurely due to lack of reliable, hassle-free repair options. Mixer Fix brings together verified independent technicians, fleet couriers, and customers onto one transparent digital hub.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                By standardizing repair estimations, warranty backing, and providing doorstep logistics, we give appliances a proud second life while saving households up to 70% compared to purchasing new units.
              </p>

              <div className="pt-2 flex items-center gap-6">
                <div>
                  <h4 className="text-2xl font-bold text-[#087F75]">40+</h4>
                  <p className="text-xs text-slate-500">Certified Workshops</p>
                </div>
                <div className="border-l border-slate-200 pl-6">
                  <h4 className="text-2xl font-bold text-[#087F75]">15 Tons</h4>
                  <p className="text-xs text-slate-500">E-Waste Prevented</p>
                </div>
                <div className="border-l border-slate-200 pl-6">
                  <h4 className="text-2xl font-bold text-[#087F75]">100%</h4>
                  <p className="text-xs text-slate-500">Genuine Spares</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&auto=format&fit=crop&q=80"
                alt="Mixer workshop setup"
                className="rounded-3xl shadow-xl border border-slate-100 object-cover w-full h-96"
              />
              <div className="absolute -bottom-6 -left-6 bg-[#142D3A] text-white p-5 rounded-2xl shadow-xl max-w-xs hidden sm:block">
                <p className="text-xs font-semibold text-teal-300">Proudly Founded in Bengaluru</p>
                <p className="text-[11px] text-slate-300 mt-1">
                  Connecting neighborhood experts with modern digital logistics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-[#F5F8F8] border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#087F75] bg-[#DDF4EF] px-3.5 py-1.5 rounded-full">
                Get In Touch
              </span>
              <h2 className="text-3xl font-extrabold text-[#142D3A] tracking-tight">
                Have a Question or Need Special Appliance Assistance?
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Our support coordinators and master technicians are available 7 days a week from 8:00 AM to 9:00 PM.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-center space-x-3 text-slate-700 text-sm">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#087F75] shadow-xs">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Toll-Free Helpline</p>
                    <p className="font-semibold text-slate-900">1800-MIXER-FIX (1800 649 373)</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-slate-700 text-sm">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#087F75] shadow-xs">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Email Inquiries</p>
                    <p className="font-semibold text-slate-900">support@mixerfix.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-slate-700 text-sm">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#087F75] shadow-xs">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Headquarters</p>
                    <p className="font-semibold text-slate-900">Brigade Road, Central Tech Market, Bengaluru</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-soft">
                <h3 className="text-xl font-bold text-[#142D3A] mb-2">Send Us an Inquiry</h3>
                <p className="text-xs text-slate-500 mb-6">
                  Fill in your details and our team will get in touch within 30 minutes.
                </p>

                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="e.g. Ankit Verma"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#087F75]/20 focus:border-[#087F75] outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        placeholder="+91 98765 00000"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#087F75]/20 focus:border-[#087F75] outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="ankit@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#087F75]/20 focus:border-[#087F75] outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Appliance or Problem Description</label>
                    <textarea
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Tell us what appliance needs repair or ask any question..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#087F75]/20 focus:border-[#087F75] outline-hidden resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#087F75] hover:bg-[#06635B] text-white font-bold text-xs rounded-xl shadow-md shadow-[#087F75]/20 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Message</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
