import React, { useState } from 'react';
import { Store, User, Mail, Phone, MapPin, Save, Clock, Award, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRepairs } from '../../context/RepairContext';

const OwnerProfile = () => {
  const { currentUser, updateProfile } = useAuth();
  const { showToast } = useRepairs();

  const [formData, setFormData] = useState({
    name: currentUser?.name || 'Suresh Kumar',
    email: currentUser?.email || 'owner@mixerfix.com',
    phone: currentUser?.phone || '+91 98450 12345',
    shopName: 'Mixer Fix Electronic Repairs & Service Station',
    address: '#14, 5th Cross, 80 Feet Road, Indiranagar',
    city: 'Bangalore',
    pincode: '560038',
    operatingHours: '09:00 AM – 08:30 PM (Mon-Sat)',
    gstin: '29ABCDE1234F1Z5',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(formData);
    showToast('Shop Owner workshop profile saved!', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-primary-text font-heading">
          Workshop & Service Center Profile
        </h1>
        <p className="text-secondary-text text-sm mt-1">
          Configure business details, workshop operating hours, and technician management credentials.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 pb-6 border-b border-gray-100">
            <div className="w-20 h-20 rounded-full bg-brand-secondary text-white text-2xl font-bold flex items-center justify-center shadow-md">
              <Store className="w-10 h-10 text-brand-accent" />
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-lg font-bold text-primary-text">{formData.shopName}</h2>
              <p className="text-xs text-secondary-text">Managing Director: {formData.name} • {formData.email}</p>
              <span className="inline-flex items-center gap-1 mt-2 px-3 py-0.5 bg-emerald-50 text-emerald-700 font-semibold text-xs rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" /> Certified Master Repair Center
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-primary-text mb-1.5">
                Shop Manager / Proprietor Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-primary-text mb-1.5">
                Official Business Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-primary-text mb-1.5">
                Helpline Phone
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-primary-text mb-1.5">
                Operating Hours
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="operatingHours"
                  value={formData.operatingHours}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-primary-text mb-1.5">
                Workshop Physical Address
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <textarea
                  name="address"
                  rows={2}
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 resize-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-primary-text mb-1.5">
                Tax Registration / GSTIN
              </label>
              <input
                type="text"
                name="gstin"
                value={formData.gstin}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-primary-text mb-1.5">
                Workshop City & Pincode
              </label>
              <input
                type="text"
                value={`${formData.city} - ${formData.pincode}`}
                disabled
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-brand-primary text-white rounded-xl text-sm font-semibold hover:bg-opacity-90 transition shadow-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Business Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default OwnerProfile;
