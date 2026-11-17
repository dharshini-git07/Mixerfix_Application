import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRepair } from '../../context/RepairContext';
import {
  Wrench,
  LayoutDashboard,
  PlusCircle,
  Clock,
  MessageSquare,
  CreditCard,
  User,
  LogOut,
  Menu,
  X,
  CheckCircle2,
  Users,
  Truck,
  PackageCheck,
  RotateCcw,
  Store,
  Bell,
  ChevronRight,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';

const normalizeRole = (r) => {
  if (!r) return '';
  const lower = String(r).toLowerCase().trim();
  if (lower.includes('owner')) return 'owner';
  if (lower.includes('delivery')) return 'delivery';
  if (lower.includes('customer')) return 'customer';
  return lower;
};

export default function DashboardLayout({ children, role }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, logout, switchDemoRole } = useAuth();
  const { repairs } = useRepair();
  const navigate = useNavigate();
  const location = useLocation();

  // Authentication check
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const userRoleKey = normalizeRole(currentUser.role);
  const targetRoleKey = normalizeRole(role);

  // Role-based access control
  if (targetRoleKey && userRoleKey !== targetRoleKey) {
    return (
      <div className="min-h-screen bg-[#F5F8F8] flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
            Role Restricted
          </span>
          <h3 className="text-xl font-bold text-slate-900 mt-3">
            {targetRoleKey === 'owner' ? 'Shop Owner' : targetRoleKey === 'delivery' ? 'Delivery Fleet' : 'Customer'} Portal
          </h3>
          <p className="text-sm font-medium text-slate-600 mt-2">
            Requires <strong>{targetRoleKey.toUpperCase()}</strong> credentials. Switch account below.
          </p>

          <div className="mt-6 space-y-2">
            <button
              onClick={() => {
                switchDemoRole(targetRoleKey);
              }}
              className="w-full py-3 bg-[#087F75] hover:bg-[#06635B] text-white font-bold text-sm rounded-xl shadow-xs transition cursor-pointer"
            >
              Switch to {targetRoleKey.toUpperCase()}
            </button>
            <Link
              to={
                userRoleKey === 'owner'
                  ? '/owner/dashboard'
                  : userRoleKey === 'delivery'
                  ? '/delivery/overview'
                  : '/customer/overview'
              }
              className="w-full block py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-xl transition"
            >
              My Dashboard ({currentUser.role})
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Nav items based on role
  const getNavItems = () => {
    switch (targetRoleKey) {
      case 'owner':
        return [
          { label: 'Dashboard', path: '/owner/dashboard', icon: LayoutDashboard },
          { label: 'Repair Requests', path: '/owner/requests', icon: Clock, badge: repairs.filter(r => r.status === 'Requested').length },
          { label: 'Approved & Active', path: '/owner/approved', icon: CheckCircle2 },
          { label: 'Customers', path: '/owner/customers', icon: Users },
          { label: 'Delivery Fleet', path: '/owner/deliveries', icon: Truck },
          { label: 'Live Chat', path: '/owner/chat', icon: MessageSquare },
          { label: 'Revenue & Payments', path: '/owner/payments', icon: CreditCard },
          { label: 'Shop Profile', path: '/owner/profile', icon: User },
        ];
      case 'delivery':
        return [
          { label: 'Overview', path: '/delivery/overview', icon: LayoutDashboard },
          { label: 'Assigned Deliveries', path: '/delivery/assigned', icon: Truck },
          { label: 'Pickup Tasks', path: '/delivery/pickup', icon: PackageCheck, badge: repairs.filter(r => r.status === 'Pickup Assigned').length },
          { label: 'Return Deliveries', path: '/delivery/returns', icon: RotateCcw, badge: repairs.filter(r => r.status === 'Completed' || r.status === 'Out for Delivery').length },
          { label: 'Agent Profile', path: '/delivery/profile', icon: User },
        ];
      case 'customer':
      default:
        return [
          { label: 'Overview', path: '/customer/overview', icon: LayoutDashboard },
          { label: 'New Repair Request', path: '/customer/new-repair', icon: PlusCircle, highlight: true },
          { label: 'My Repairs', path: '/customer/my-repairs', icon: Clock, badge: repairs.length },
          { label: 'Support Chat', path: '/customer/chat', icon: MessageSquare },
          { label: 'Payments', path: '/customer/payments', icon: CreditCard },
          { label: 'My Profile', path: '/customer/profile', icon: User },
        ];
    }
  };

  const navItems = getNavItems();

  const getRoleHeaderInfo = () => {
    switch (targetRoleKey) {
      case 'owner':
        return {
          title: 'Shop Owner Hub',
          subtitle: 'Workshop Management',
          badge: 'Shop Partner',
          color: 'bg-sky-50 text-sky-800 border-sky-200'
        };
      case 'delivery':
        return {
          title: 'Delivery Fleet',
          subtitle: 'Fleet Operations',
          badge: 'Active Courier',
          color: 'bg-amber-50 text-amber-800 border-amber-200'
        };
      case 'customer':
      default:
        return {
          title: 'Customer Portal',
          subtitle: 'Appliances & Orders',
          badge: 'Customer Account',
          color: 'bg-teal-50 text-[#087F75] border-teal-200'
        };
    }
  };

  const headerInfo = getRoleHeaderInfo();

  return (
    <div className="min-h-screen bg-[#F5F8F8] flex flex-col lg:flex-row font-sans">
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-[#087F75] flex items-center justify-center text-white">
            <Wrench className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-[#142D3A] text-lg">
            Mixer<span className="text-[#087F75]">Fix</span>
          </span>
        </Link>

        <div className="flex items-center space-x-2">
          <span className={`text-xs font-bold uppercase px-2.5 py-1 rounded-full border ${headerInfo.color}`}>
            {targetRoleKey}
          </span>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#142D3A] text-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:min-h-screen flex flex-col justify-between ${
          sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo Header */}
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#087F75] flex items-center justify-center text-white shadow-md shadow-[#087F75]/20">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tight">
                  Mixer<span className="text-[#087F75]">Fix</span>
                </span>
                <span className="block text-xs text-teal-300 font-bold uppercase tracking-wider">Smart Care</span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-300 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Card in Sidebar */}
          <div className="p-4 mx-3 my-3 bg-slate-800/80 rounded-xl border border-slate-700/80 flex items-center space-x-3">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
              alt={currentUser?.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-teal-400"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{currentUser?.name}</p>
              <span className="inline-block text-xs text-teal-300 font-bold uppercase tracking-wider">
                {targetRoleKey === 'owner' ? 'Shop Owner' : targetRoleKey === 'delivery' ? 'Courier' : 'Customer'}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-2 space-y-1">
            {navItems.map((item) => {
              const IconComp = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                    isActive
                      ? 'bg-[#087F75] text-white shadow-md shadow-[#087F75]/30'
                      : item.highlight
                      ? 'bg-teal-900/60 text-teal-200 hover:bg-teal-900 border border-teal-600'
                      : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <IconComp
                      className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-white' : item.highlight ? 'text-teal-300' : 'text-slate-300 group-hover:text-white'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-white text-[#087F75]'
                          : 'bg-[#087F75] text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            <Store className="w-4 h-4" />
            <span>Public Website</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-sm font-bold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <header className="hidden lg:flex items-center justify-between bg-white border-b border-slate-200 px-8 py-3.5 sticky top-0 z-20 shadow-xs">
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-lg font-extrabold text-slate-900">{headerInfo.title}</h2>
              <span className={`text-xs font-bold px-3 py-0.5 rounded-full border ${headerInfo.color}`}>
                {headerInfo.badge}
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-600 mt-0.5">{headerInfo.subtitle}</p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Quick Demo Switcher Prompt */}
            <div className="flex items-center gap-2 bg-slate-100 px-3.5 py-1.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700">
              <span className="text-slate-500">User:</span>
              <strong className="text-slate-900 font-bold">{currentUser?.name}</strong>
              <span className="text-slate-300">|</span>
              <Link to="/#hero" className="text-[#087F75] hover:underline font-bold text-sm">Home</Link>
            </div>

            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
              alt={currentUser?.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-[#087F75]/30 shadow-xs"
            />
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
