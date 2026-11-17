import React from 'react';
import {
  FileText,
  CheckCircle,
  Truck,
  PackageCheck,
  Building2,
  Wrench,
  CheckCircle2,
  Send,
  Home,
  XCircle,
  Clock
} from 'lucide-react';

export default function StatusBadge({ status, size = 'sm' }) {
  const sizeClasses = {
    xs: 'text-xs px-2.5 py-0.5 font-bold',
    sm: 'text-sm px-3 py-1 font-bold',
    md: 'text-base px-3.5 py-1.5 font-bold'
  };

  const getStatusConfig = (st) => {
    switch (st) {
      case 'Requested':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: Clock,
          label: 'Requested'
        };
      case 'Approved':
        return {
          bg: 'bg-sky-50 text-sky-700 border-sky-200',
          icon: CheckCircle,
          label: 'Approved'
        };
      case 'Pickup Assigned':
        return {
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          icon: Truck,
          label: 'Pickup Assigned'
        };
      case 'Collected':
        return {
          bg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
          icon: PackageCheck,
          label: 'Collected'
        };
      case 'At Shop':
        return {
          bg: 'bg-purple-50 text-purple-700 border-purple-200',
          icon: Building2,
          label: 'At Shop'
        };
      case 'Repair in Progress':
        return {
          bg: 'bg-teal-50 text-[#087F75] border-teal-200',
          icon: Wrench,
          label: 'Repair in Progress'
        };
      case 'Completed':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: CheckCircle2,
          label: 'Completed'
        };
      case 'Out for Delivery':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: Send,
          label: 'Out for Delivery'
        };
      case 'Delivered':
        return {
          bg: 'bg-green-100 text-green-800 border-green-300 font-semibold',
          icon: Home,
          label: 'Delivered'
        };
      case 'Rejected':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: XCircle,
          label: 'Rejected'
        };
      case 'Paid':
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold',
          icon: CheckCircle2,
          label: 'Paid'
        };
      case 'Pending':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-300 font-semibold',
          icon: Clock,
          label: 'Pending'
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: FileText,
          label: st
        };
    }
  };

  const config = getStatusConfig(status);
  const IconComponent = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-bold whitespace-nowrap shadow-xs ${config.bg} ${sizeClasses[size] || sizeClasses.sm}`}
    >
      <IconComponent className="w-4 h-4 flex-shrink-0" />
      <span>{config.label}</span>
    </span>
  );
}

