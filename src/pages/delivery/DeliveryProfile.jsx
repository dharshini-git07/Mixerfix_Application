import React, { useState } from 'react';
import { Truck, User, Mail, Phone, MapPin, Save, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRepairs } from '../../context/RepairContext';

const DeliveryProfile = () => {
  const { currentUser, updateProfile } = useAuth();
  const { showToast } = useRepairs();

  const [formData, setFormData] = useState({
    name: currentUser?.name || 'Vikas Verma',
    email: currentUser?.email || 'delivery@mixerfix.com',
    phone: currentUser?.phone || '+91 97654 32109',
    vehicleType: 'Electric Cargo Scooter (EV)',
    vehicleNumber: 'KA-01-EV-4492',
    coverageZone: 'Bangalore South (Koramangala, HSR, Indiranagar, Bellandur)',
    dutyStatus: 'Active on Duty',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(formData);
    showToast('Delivery personnel profile updated!', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-primary-text font-heading">
          Delivery Personnel Profile & Vehicle Data
        </h1>
        <p className="text-secondary-text text-sm mt-1">
          Update driver contact information, assigned delivery zone, and vehicle specifications.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 pb-6 border-b border-gray-100">
            <div className="w-20 h-20 rounded-full bg-brand-primary text-white text-2xl font-bold flex items-center justify-center shadow-md">
              <Truck className="w-10 h-10 text-brand-accent" />
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-lg font-bold text-primary-text">{formData.name}</h2>
              <p className="text-xs text-secondary-text">{formData.email} • {formData.vehicleType}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 px-3 py-0.5 bg-emerald-50 text-emerald-700 font-semibold text-xs rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {formData.dutyStatus}
                </span>
                <span className="text-xs text-secondary-text font-medium">Reg: {formData.vehicleNumber}</span>
              </div>
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
                Contact Phone Number
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
                Assigned Vehicle Model
              </label>
              <input
                type="text"
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-primary-text mb-1.5">
                Vehicle Registration Number
              </label>
              <input
                type="text"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-primary-text mb-1.5">
                Duty Status
              </label>
              <select
                name="dutyStatus"
                value={formData.dutyStatus}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 bg-white"
              >
                <option value="Active on Duty">Active on Duty</option>
                <option value="On Short Break">On Short Break</option>
                <option value="Shift Concluded">Shift Concluded</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-primary-text mb-1.5">
                Assigned Delivery Zone / Area
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <textarea
                  name="coverageZone"
                  rows={2}
                  value={formData.coverageZone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-brand-primary text-white rounded-xl text-sm font-semibold hover:bg-opacity-90 transition shadow-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Driver Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeliveryProfile;
