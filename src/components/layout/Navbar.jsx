import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Wrench, Menu, X, ArrowRight, User, ShieldCheck, ChevronDown, Store, Truck, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portalDropdownOpen, setPortalDropdownOpen] = useState(false);
  const { currentUser, isAuthenticated, switchDemoRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getDashboardPath = () => {
    if (!currentUser) return '/customer/overview';
    switch (currentUser.role) {
      case 'owner':
        return '/owner/dashboard';
      case 'delivery':
        return '/delivery/overview';
      case 'customer':
      default:
        return '/customer/overview';
    }
  };

  const navLinks = [
    { label: 'Home', href: '/#hero' },
    { label: 'Services', href: '/#services' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Appliances', href: '/#categories' },
    { label: 'About Us', href: '/#about' },
    { label: 'Contact', href: '/#contact' }
  ];

  const handleNavClick = (e, href) => {
    setMobileMenuOpen(false);
    if (href.startsWith('/#')) {
      e.preventDefault();
      const targetId = href.replace('/#', '');
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 150);
      } else {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  const handleRolePortalClick = (roleKey, path) => {
    switchDemoRole(roleKey);
    setPortalDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#087F75] flex items-center justify-center text-white shadow-md shadow-[#087F75]/20 group-hover:scale-105 transition-transform">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-[#142D3A]">
                Mixer<span className="text-[#087F75]">Fix</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-bold tracking-wider uppercase text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                Smart Repair
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6 text-sm font-bold text-slate-700">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="hover:text-[#087F75] transition-colors py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Quick Portals Dropdown */}
            <div className="relative">
              <button
                onClick={() => setPortalDropdownOpen(!portalDropdownOpen)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition cursor-pointer border border-slate-200"
              >
                <LayoutDashboard className="w-4 h-4 text-[#087F75]" />
                <span>3 Role Portals</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${portalDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {portalDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3.5 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Select Role Dashboard</p>
                  </div>
                  <button
                    onClick={() => handleRolePortalClick('customer', '/customer/overview')}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-teal-50 flex items-center gap-3 transition cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal-100 text-[#087F75] flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">1. Customer Portal</p>
                      <p className="text-xs font-semibold text-slate-500">Book, Track, Pay</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleRolePortalClick('owner', '/owner/dashboard')}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-sky-50 flex items-center gap-3 transition cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
                      <Store className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">2. Shop Owner Hub</p>
                      <p className="text-xs font-semibold text-slate-500">Repairs & Dispatch</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleRolePortalClick('delivery', '/delivery/overview')}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-amber-50 flex items-center gap-3 transition cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">3. Delivery Fleet</p>
                      <p className="text-xs font-semibold text-slate-500">Pickups & Returns</p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {isAuthenticated ? (
              <Link
                to={getDashboardPath()}
                className="flex items-center space-x-2 bg-[#DDF4EF] text-[#087F75] hover:bg-[#c6eee4] px-4 py-2.5 rounded-xl text-sm font-semibold transition"
              >
                <User className="w-4 h-4" />
                <span>My Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-slate-700 hover:text-[#087F75] px-3 py-2 text-sm font-medium transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="bg-[#087F75] hover:bg-[#06635B] text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-[#087F75]/20 transition flex items-center space-x-1.5"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          {/* Quick Role Portal Buttons on Mobile */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2.5">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Role Portals:</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleRolePortalClick('customer', '/customer/overview')}
                className="p-2.5 rounded-xl bg-white border border-slate-200 text-center hover:bg-teal-50"
              >
                <User className="w-5 h-5 text-[#087F75] mx-auto mb-1" />
                <span className="text-xs font-bold text-slate-800 block">Customer</span>
              </button>
              <button
                onClick={() => handleRolePortalClick('owner', '/owner/dashboard')}
                className="p-2.5 rounded-xl bg-white border border-slate-200 text-center hover:bg-sky-50"
              >
                <Store className="w-5 h-5 text-sky-600 mx-auto mb-1" />
                <span className="text-xs font-bold text-slate-800 block">Shop Owner</span>
              </button>
              <button
                onClick={() => handleRolePortalClick('delivery', '/delivery/overview')}
                className="p-2.5 rounded-xl bg-white border border-slate-200 text-center hover:bg-amber-50"
              >
                <Truck className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                <span className="text-xs font-bold text-slate-800 block">Delivery</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#087F75] rounded-lg transition"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col space-y-2">
            {isAuthenticated ? (
              <Link
                to={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-[#087F75] text-white py-2.5 rounded-xl text-sm font-semibold shadow-xs"
              >
                Open My Dashboard ({currentUser?.role})
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl text-sm font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl text-sm font-semibold text-white bg-[#087F75] hover:bg-[#06635B]"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
