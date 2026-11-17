import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Wrench, Menu, X, ArrowRight, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getDashboardPath = () => {
    if (!currentUser) return '/login';
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
              <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold tracking-wider uppercase text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                Smart Repair
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-600">
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
            {isAuthenticated ? (
              <Link
                to={getDashboardPath()}
                className="flex items-center space-x-2 bg-[#DDF4EF] text-[#087F75] hover:bg-[#c6eee4] px-4 py-2.5 rounded-xl text-sm font-semibold transition"
              >
                <User className="w-4 h-4" />
                <span>Go to Dashboard</span>
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
          <div className="flex md:hidden items-center space-x-2">
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
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-2">
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

          <div className="pt-3 border-t border-slate-100 flex flex-col space-y-2">
            {isAuthenticated ? (
              <Link
                to={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-[#087F75] text-white py-2.5 rounded-xl text-sm font-semibold shadow-xs"
              >
                Open Dashboard ({currentUser?.role})
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

