import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRepair } from '../../context/RepairContext';
import {
  Wrench,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Store,
  Truck,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const { addToast } = useRepair();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer'); // 'customer' | 'owner' | 'delivery'
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const redirectTarget = searchParams.get('redirect');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(email.trim(), password, role);
      setIsLoading(false);

      if (res && res.success) {
        addToast(
          'Login Successful',
          `Welcome back, ${res.user.name}! Redirecting to ${res.user.role} portal...`,
          'success'
        );

        const userRole = (res.user.role || '').toLowerCase();
        if (redirectTarget === 'new-request' && userRole === 'customer') {
          navigate('/customer/new-repair');
        } else if (userRole === 'owner') {
          navigate('/owner/dashboard');
        } else if (userRole === 'delivery') {
          navigate('/delivery/overview');
        } else {
          navigate('/customer/overview');
        }
      } else {
        setError(res?.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err) {
      setIsLoading(false);
      setError('Authentication failed. Please verify credentials.');
    }
  };

  // 1-Click Demo Login Quick Fill
  const handleQuickDemoLogin = async (demoRole, demoEmail, demoPass) => {
    setRole(demoRole);
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
    setIsLoading(true);

    try {
      const res = await login(demoEmail, demoPass, demoRole);
      setIsLoading(false);

      if (res && res.success) {
        addToast(
          'Demo Login Active',
          `Logged in as ${res.user.name} (${res.user.role.toUpperCase()})`,
          'success'
        );
        const userRole = (res.user.role || '').toLowerCase();
        if (userRole === 'owner') {
          navigate('/owner/dashboard');
        } else if (userRole === 'delivery') {
          navigate('/delivery/overview');
        } else {
          navigate('/customer/overview');
        }
      } else {
        setError(res?.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err) {
      setIsLoading(false);
      setError('Authentication failed. Please verify credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8F8] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center space-x-2.5">
          <div className="w-11 h-11 rounded-2xl bg-[#087F75] flex items-center justify-center text-white shadow-lg shadow-[#087F75]/20">
            <Wrench className="w-6 h-6" />
          </div>
          <span className="text-2xl font-black text-[#142D3A] tracking-tight">
            Mixer<span className="text-[#087F75]">Fix</span>
          </span>
        </Link>
        <h2 className="mt-4 text-2xl font-extrabold text-[#142D3A]">Sign in to your account</h2>
        <p className="mt-1 text-xs text-slate-500">
          Or{' '}
          <Link to="/register" className="font-semibold text-[#087F75] hover:underline">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-card rounded-3xl border border-slate-100">
          {/* Role selector tabs */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-700 mb-2">Select Your Role</label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  role === 'customer'
                    ? 'bg-white text-[#087F75] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Customer</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('owner')}
                className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  role === 'owner'
                    ? 'bg-white text-[#087F75] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Shop Owner</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('delivery')}
                className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  role === 'delivery'
                    ? 'bg-white text-[#087F75] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Delivery</span>
              </button>
            </div>
          </div>

          {/* Error notice */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    role === 'customer'
                      ? 'customer@mixerfix.com'
                      : role === 'owner'
                      ? 'owner@mixerfix.com'
                      : 'delivery@mixerfix.com'
                  }
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#087F75]/20 focus:border-[#087F75] outline-hidden transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">Password</label>
                <span className="text-[11px] text-slate-400">Default: password123</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#087F75]/20 focus:border-[#087F75] outline-hidden transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#087F75] hover:bg-[#06635B] text-white font-bold text-xs rounded-xl shadow-md shadow-[#087F75]/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In as {role.charAt(0).toUpperCase() + role.slice(1)}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Buttons */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center mb-3">
              One-Click Demo Accounts
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() =>
                  handleQuickDemoLogin('customer', 'customer@mixerfix.com', 'password123')
                }
                className="w-full p-2.5 bg-teal-50 hover:bg-teal-100/70 border border-teal-200/60 rounded-xl text-left flex items-center justify-between text-xs transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#087F75]" />
                  <div>
                    <span className="font-bold text-slate-800">Customer Demo:</span>
                    <span className="text-slate-600 ml-1">Rahul Sharma</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#087F75] bg-white px-2 py-0.5 rounded shadow-2xs">
                  Login →
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('owner', 'owner@mixerfix.com', 'password123')}
                className="w-full p-2.5 bg-sky-50 hover:bg-sky-100/70 border border-sky-200/60 rounded-xl text-left flex items-center justify-between text-xs transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-sky-600" />
                  <div>
                    <span className="font-bold text-slate-800">Shop Owner Demo:</span>
                    <span className="text-slate-600 ml-1">Suresh Kumar</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-sky-700 bg-white px-2 py-0.5 rounded shadow-2xs">
                  Login →
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleQuickDemoLogin('delivery', 'delivery@mixerfix.com', 'password123')
                }
                className="w-full p-2.5 bg-amber-50 hover:bg-amber-100/70 border border-amber-200/60 rounded-xl text-left flex items-center justify-between text-xs transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-600" />
                  <div>
                    <span className="font-bold text-slate-800">Delivery Demo:</span>
                    <span className="text-slate-600 ml-1">Amit Patel</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-amber-700 bg-white px-2 py-0.5 rounded shadow-2xs">
                  Login →
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
