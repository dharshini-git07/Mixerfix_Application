import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Save, Bell, Shield, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRepairs } from '../../context/RepairContext';

const CustomerProfile = () => {
  const { currentUser, updateProfile } = useAuth();
  const { showToast } = useRepairs();

  const [formData, setFormData] = useState({
    name: currentUser?.name || 'Customer Account',
    email: currentUser?.email || 'customer@mixerfix.com',
    phone: currentUser?.phone || '+91 98765 43210',
    address: currentUser?.address || 'Flat 402, Green Glen Layout, Indiranagar',
    city: currentUser?.city || 'Bangalore',
    pincode: currentUser?.pincode || '560038',
  });

  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    smsAlerts: true,
    whatsappAlerts: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(formData);
    showToast('Customer profile updated successfully!', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-primary-text font-heading">
          Account Profile & Settings
        </h1>
        <p className="text-secondary-text text-sm mt-1">
          Manage your personal information, delivery addresses, and notification preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 pb-6 border-b border-gray-100">
            <div className="w-20 h-20 rounded-full bg-brand-primary text-white text-2xl font-bold flex items-center justify-center shadow-md">
              {formData.name.charAt(0).toUpperCase()}
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-lg font-bold text-primary-text">{formData.name}</h2>
              <p className="text-xs text-secondary-text">{formData.email}</p>
              <span className="inline-block mt-2 px-3 py-0.5 bg-brand-accent text-brand-primary font-semibold text-xs rounded-full">
                Verified Customer
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-primary-text mb-1.5">
                Full Name
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
                Email Address
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
                Contact Phone
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
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-primary-text mb-1.5">
                Default Pickup & Delivery Address
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
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Bell className="w-4 h-4 text-brand-primary" />
            <h2 className="font-semibold text-primary-text text-sm">Real-Time Alerts & Updates</h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-xs font-medium text-primary-text">WhatsApp Repair Progress Updates</p>
                <p className="text-[11px] text-secondary-text">Receive instant messages as your appliance status changes.</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.whatsappAlerts}
                onChange={() => handleToggle('whatsappAlerts')}
                className="w-4 h-4 accent-brand-primary rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-xs font-medium text-primary-text">Email Invoices & Work Summary</p>
                <p className="text-[11px] text-secondary-text">Detailed cost breakdown and warranty receipt via email.</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.emailUpdates}
                onChange={() => handleToggle('emailUpdates')}
                className="w-4 h-4 accent-brand-primary rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-xs font-medium text-primary-text">SMS Courier Arrival Alerts</p>
                <p className="text-[11px] text-secondary-text">OTP and driver contact details sent before home visit.</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.smsAlerts}
                onChange={() => handleToggle('smsAlerts')}
                className="w-4 h-4 accent-brand-primary rounded cursor-pointer"
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
            <Save className="w-4 h-4" /> Save Profile Details
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerProfile;
