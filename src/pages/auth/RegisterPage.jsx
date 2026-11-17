import React, { useState, useEffect } from 'react';
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
  Phone,
  Store,
  Truck,
  ArrowRight,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Navigation,
  FileBadge
} from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const { addToast } = useRepair();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlRole = searchParams.get('role');
  const initialRole = ['customer', 'owner', 'delivery'].includes(urlRole?.toLowerCase())
    ? urlRole.toLowerCase()
    : 'customer';

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: initialRole,
    address: '',
    city: 'Bangalore',
    pincode: '560038',
    shopName: '',
    gstin: '',
    vehicle: '',
    vehicleNumber: '',
    zone: 'Central & East Bengaluru'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Synchronize role state if URL query param changes
  useEffect(() => {
    if (urlRole && ['customer', 'owner', 'delivery'].includes(urlRole.toLowerCase())) {
      setFormData((prev) => ({ ...prev, role: urlRole.toLowerCase() }));
    }
  }, [urlRole]);

  const handleRoleChange = (newRole) => {
    setFormData((prev) => ({ ...prev, role: newRole }));
    setSearchParams({ role: newRole });
    setError('');
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setError('Please fill in all mandatory contact fields (Full Name, Phone, and Email).');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError('Please provide a valid email address.');
      return;
    }

    // Phone validation
    const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setError('Please provide a valid 10-digit mobile number.');
      return;
    }

    // Role-specific validation
    if (formData.role === 'delivery') {
      if (!formData.vehicle.trim()) {
        setError('Please specify your vehicle type (e.g. Electric Scooter, Motorcycle).');
        return;
      }
      if (!formData.zone.trim()) {
        setError('Please select or enter your preferred delivery zone.');
        return;
      }
    }

    if (formData.role === 'owner') {
      if (!formData.shopName.trim()) {
        setError('Please specify your workshop / shop name.');
        return;
      }
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
    try {
      const res = await register(formData);
      setIsLoading(false);

      if (res && res.success) {
        addToast(
          'Account Created Successfully!',
          `Welcome to Mixer Fix, ${res.user.name}! Your account is active as ${res.user.role.toUpperCase()}.`,
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
        setError(res?.error || 'Failed to create account.');
      }
    } catch (err) {
      setIsLoading(false);
      setError(err?.message || 'Failed to create account. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8F8] flex flex-col justify-center py-10 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center">
        <Link to="/" className="inline-flex items-center space-x-2.5 group">
          <div className="w-11 h-11 rounded-2xl bg-[#087F75] flex items-center justify-center text-white shadow-lg shadow-[#087F75]/20 group-hover:scale-105 transition-transform">
            <Wrench className="w-6 h-6" />
          </div>
          <span className="text-2xl font-black text-[#142D3A] tracking-tight">
            Mixer<span className="text-[#087F75]">Fix</span>
          </span>
        </Link>
        <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-[#142D3A] tracking-tight">
          Create your Mixer Fix account
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Already registered?{' '}
          <Link to={`/login?role=${formData.role}`} className="font-semibold text-[#087F75] hover:underline">
            Sign in to existing account
          </Link>
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl px-4 sm:px-0">
        <div className="bg-white py-7 px-6 sm:px-8 shadow-card rounded-3xl border border-slate-100">
          {/* Role selector tabs */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Account Role:
              </label>
              <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                {formData.role === 'customer'
                  ? 'Appliance Owner'
                  : formData.role === 'delivery'
                  ? 'Field Delivery Partner'
                  : 'Workshop Center'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/60">
              <button
                type="button"
                onClick={() => handleRoleChange('customer')}
                className={`py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  formData.role === 'customer'
                    ? 'bg-white text-[#087F75] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Customer</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('delivery')}
                className={`py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  formData.role === 'delivery'
                    ? 'bg-white text-amber-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Truck className="w-4 h-4" />
                <span>Delivery Agent</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('owner')}
                className={`py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  formData.role === 'owner'
                    ? 'bg-white text-sky-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>Shop Owner</span>
              </button>
            </div>

            {/* Role explanation micro-banner */}
            <div className="mt-2.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/60 text-[11px] text-slate-600 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#087F75]" />
              <span>
                {formData.role === 'customer' &&
                  'Book doorstep appliance repairs, monitor 9-stage diagnostics, and pay securely.'}
                {formData.role === 'delivery' &&
                  'Join the urban dispatch fleet for doorstep appliance pickups, drop-offs, and return deliveries.'}
                {formData.role === 'owner' &&
                  'Manage workshop repair tickets, dispatch couriers, estimate costs, and track shop revenue.'}
              </span>
            </div>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {/* Full Name & Phone Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder={
                      formData.role === 'delivery'
                        ? 'e.g. Amit Patel'
                        : formData.role === 'owner'
                        ? 'e.g. Suresh Kumar'
                        : 'e.g. Rahul Sharma'
                    }
                    className="w-full pl-9 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#087F75]/20 focus:border-[#087F75] outline-hidden transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Phone Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#087F75]/20 focus:border-[#087F75] outline-hidden transition"
                  />
                </div>
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={
                    formData.role === 'delivery'
                      ? 'driver@example.com'
                      : formData.role === 'owner'
                      ? 'owner@repairshop.com'
                      : 'customer@example.com'
                  }
                  className="w-full pl-9 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#087F75]/20 focus:border-[#087F75] outline-hidden transition"
                />
              </div>
            </div>

            {/* Role-Specific Fields for Delivery Agent */}
            {formData.role === 'delivery' && (
              <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/60 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <Truck className="w-4 h-4 text-amber-700" />
                  <span>Courier Fleet & Vehicle Information</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Vehicle Type & Model <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.vehicle}
                      onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                      placeholder="e.g. Hero Electric Nyx / Activa"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-hidden transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Vehicle Number Plate
                    </label>
                    <input
                      type="text"
                      value={formData.vehicleNumber}
                      onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                      placeholder="e.g. KA-03-EM-8472"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-hidden transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Preferred Operating Zone <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.zone}
                    onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-hidden transition cursor-pointer"
                  >
                    <option value="Central & East Bengaluru (Indiranagar / Koramangala / Whitefield)">
                      Central & East Bengaluru (Indiranagar / Koramangala / Whitefield)
                    </option>
                    <option value="South Bengaluru (Jayanagar / JP Nagar / BTM / HSR)">
                      South Bengaluru (Jayanagar / JP Nagar / BTM / HSR)
                    </option>
                    <option value="North & West Bengaluru (Malleshwaram / Rajajinagar / Hebbal)">
                      North & West Bengaluru (Malleshwaram / Rajajinagar / Hebbal)
                    </option>
                    <option value="All City Metro Zones">All City Metro Zones</option>
                  </select>
                </div>
              </div>
            )}

            {/* Role-Specific Fields for Shop Owner */}
            {formData.role === 'owner' && (
              <div className="p-4 bg-sky-50/50 rounded-2xl border border-sky-200/60 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-sky-900">
                  <Store className="w-4 h-4 text-sky-700" />
                  <span>Workshop Business Specifications</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Workshop Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.shopName}
                      onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                      placeholder="e.g. Master Electronic Care"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 outline-hidden transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Business GSTIN (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.gstin}
                      onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                      placeholder="e.g. 29ABCDE1234F1Z5"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 outline-hidden transition"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Address & City Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {formData.role === 'owner'
                    ? 'Workshop Address'
                    : formData.role === 'delivery'
                    ? 'Base Hub / Home Address'
                    : 'Doorstep Pickup Address'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Flat / Building, 12th Main, Indiranagar"
                    className="w-full pl-9 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#087F75]/20 focus:border-[#087F75] outline-hidden transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pincode</label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  placeholder="560038"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#087F75]/20 focus:border-[#087F75] outline-hidden transition"
                />
              </div>
            </div>

            {/* Password and confirmation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="At least 6 characters"
                    className="w-full pl-9 pr-10 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#087F75]/20 focus:border-[#087F75] outline-hidden transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Re-type password"
                    className="w-full pl-9 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#087F75]/20 focus:border-[#087F75] outline-hidden transition"
                  />
                </div>
              </div>
            </div>

            {/* Registration Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-3 ${
                formData.role === 'delivery'
                  ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
                  : formData.role === 'owner'
                  ? 'bg-sky-700 hover:bg-sky-800 shadow-sky-700/20'
                  : 'bg-[#087F75] hover:bg-[#06635B] shadow-[#087F75]/20'
              }`}
            >
              {isLoading ? (
                <span>Setting up your account...</span>
              ) : (
                <>
                  <span>
                    {formData.role === 'delivery'
                      ? 'Register as Delivery Agent & Enter Fleet'
                      : formData.role === 'owner'
                      ? 'Register Workshop Hub & Access Portal'
                      : 'Create Customer Account & Continue'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Feature Badges */}
          <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
            <div className="flex flex-col items-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mb-1" />
              <span className="text-[10px] text-slate-600 font-medium">Instant Activation</span>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mb-1" />
              <span className="text-[10px] text-slate-600 font-medium">Role Dashboards</span>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mb-1" />
              <span className="text-[10px] text-slate-600 font-medium">Live Order Sync</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
