import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Users, User, Store, Truck, ChevronDown, RefreshCw } from 'lucide-react';
import { useRepair } from '../../context/RepairContext';

export default function DemoRoleSwitcher() {
  const { currentUser, switchDemoRole } = useAuth();
  const { resetToMockData } = useRepair();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const roles = [
    {
      id: 'customer',
      label: 'Customer',
      name: 'Rahul Sharma',
      icon: User,
      path: '/customer/overview',
      color: 'text-teal-600 bg-teal-50'
    },
    {
      id: 'owner',
      label: 'Shop Owner',
      name: 'Suresh Kumar',
      icon: Store,
      path: '/owner/dashboard',
      color: 'text-sky-600 bg-sky-50'
    },
    {
      id: 'delivery',
      label: 'Delivery Agent',
      name: 'Amit Patel',
      icon: Truck,
      path: '/delivery/overview',
      color: 'text-amber-600 bg-amber-50'
    }
  ];

  const handleRoleSelect = (roleId, path) => {
    switchDemoRole(roleId);
    setIsOpen(false);
    navigate(path);
  };

  const currentRoleObj = roles.find((r) => r.id === currentUser?.role) || roles[0];
  const CurrentIcon = currentRoleObj.icon;

  return (
    <div className="fixed bottom-5 left-5 z-40 font-sans">
      <div className="relative">
        {/* Toggle Pill */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 bg-[#142D3A] text-white px-4 py-2.5 rounded-full shadow-lg hover:bg-slate-800 transition-all border border-slate-700 text-sm font-bold cursor-pointer"
          title="Quick Demo Role Switcher"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300">Role:</span>
          <span className="font-extrabold text-white flex items-center gap-1.5">
            <CurrentIcon className="w-4 h-4 text-teal-300" />
            {currentRoleObj.label}
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute bottom-14 left-0 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2.5 z-50 animate-in slide-in-from-bottom-2 duration-200">
            <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900">Switch Demo Role</p>
                <p className="text-xs font-semibold text-slate-500">1-click role preview</p>
              </div>
              <button
                onClick={() => {
                  resetToMockData();
                  setIsOpen(false);
                }}
                className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md transition cursor-pointer"
                title="Reset sample repairs, chats and payments"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>

            <div className="space-y-1.5 mt-2">
              {roles.map((r) => {
                const IconComponent = r.icon;
                const isSelected = currentUser?.role === r.id;

                return (
                  <button
                    key={r.id}
                    onClick={() => handleRoleSelect(r.id, r.path)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition cursor-pointer ${
                      isSelected
                        ? 'bg-[#DDF4EF] text-[#087F75] font-bold'
                        : 'hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${r.color}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold leading-tight">{r.label}</p>
                        <p className="text-xs font-semibold text-slate-500">{r.name}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="text-xs bg-[#087F75] text-white px-2.5 py-0.5 rounded-full font-bold">
                        Active
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
