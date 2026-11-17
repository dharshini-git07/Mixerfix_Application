import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRepair } from '../../context/RepairContext';
import {
  Wrench,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  Store,
  Truck,
  ArrowRight,
  MapPin,
  AlertCircle
} from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const { addToast } = useRepair();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
    address: '',
    city: 'Bengaluru',
    pincode: '560038',
    shopName: '',
    vehicle: '',
    zone: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setError('Please fill in all mandatory contact fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Password confirmation does not match.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = register(formData);
      setIsLoading(false);

      if (res.success) {
        addToast(
          'Account Created!',
          `Welcome to Mixer Fix, ${res.user.name}! Account registered as ${res.user.role}.`,
          'success'
        );

        if (res.user.role === 'owner') {
          navigate('/owner/dashboard');
        } else if (res.user.role === 'delivery') {
          navigate('/delivery/overview');
        } else {
          navigate('/customer/overview');
        }
      } else {
        setError(res.error || 'Failed to create account.');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#F5F8F8] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center">
        <Link to="/" className="inline-flex items-center space-x-2.5">
          <div className="w-11 h-11 rounded-2xl bg-[#087F75] flex items-center justify-center text-white shadow-lg shadow-[#087F75]/20">
            <Wrench className="w-6 h-6" />
          </div>
          <span className="text-2xl font-black text-[#142D3A] tracking-tight">
            Mixer<span className="text-[#087F75]">Fix</span>
          </span>
        </Link>
        <h2 className="mt-4 text-2xl font-extrabold text-[#142D3A]">Create your Mixer Fix account</h2>
        <p className="mt-1 text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#087F75] hover:underline">
            Sign in here
          </Link>
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-card rounded-3xl border border-slate-100">
          {/* Role selector */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-700 mb-2">Registering As:</label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'customer' })}
                className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  formData.role === 'customer'
                    ? 'bg-white text-[#087F75] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Customer</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'owner' })}
                className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  formData.role === 'owner'
                    ? 'bg-white text-[#087F75] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Shop Owner</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'delivery' })}
                className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  formData.role === 'delivery'
                    ? 'bg-white text-[#087F75] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Delivery</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#087F75]/20 focus:border-[#087F75] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#087F75]/20 focus:border-[#087F75] outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your.email@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#087F75]/20 focus:border-[#087F75] outline-hidden"
              />
            </div>

            {/* Role-specific optional fields */}
            {formData.role === 'owner' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Workshop / Shop Name *</label>
                <input
                  type="text"
                  required
                  value={formData.shopName}
                  onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                  placeholder="e.g. Apex Appliance Care Workshop"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#087F75]/20 focus:border-[#087F75] outline-hidden"
                />
              </div>
            )}

            {formData.role === 'delivery' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Vehicle Details</label>
                  <input
                    type="text"
                    value={formData.vehicle}
                    onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                    placeholder="e.g. Hero EV Scooter (KA-03)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#087F75]/20 focus:border-[#087F75] outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Zone</label>
                  <input
                    type="text"
                    value={formData.zone}
                    onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                    placeholder="e.g. East Bengaluru"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#087F75]/20 focus:border-[#087F75] outline-hidden"
                  />
                </div>
              </div>
            )}

            {/* Address fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street / Flat / Area"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#087F75]/20 focus:border-[#087F75] outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pincode</label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  placeholder="560038"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#087F75]/20 focus:border-[#087F75] outline-hidden"
                />
              </div>
            </div>

            {/* Password and confirmation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="At least 6 chars"
                    className="w-full pr-10 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#087F75]/20 focus:border-[#087F75] outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password *</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Re-type password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#087F75]/20 focus:border-[#087F75] outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#087F75] hover:bg-[#06635B] text-white font-bold text-xs rounded-xl shadow-md shadow-[#087F75]/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-3"
            >
              {isLoading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Create Account & Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
