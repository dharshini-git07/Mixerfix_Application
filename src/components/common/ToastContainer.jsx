import React from 'react';
import { useRepair } from '../../context/RepairContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useRepair();

  if (!toasts.length) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />;
      case 'danger':
        return <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-primary flex-shrink-0" />;
    }
  };

  const getBorder = (type) => {
    switch (type) {
      case 'success':
        return 'border-l-4 border-emerald-500 bg-white';
      case 'warning':
        return 'border-l-4 border-amber-500 bg-white';
      case 'danger':
        return 'border-l-4 border-rose-500 bg-white';
      case 'info':
      default:
        return 'border-l-4 border-primary bg-white';
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-4 rounded-xl shadow-xl shadow-slate-900/10 border border-slate-100 flex items-start space-x-3 transition-all duration-300 transform translate-y-0 ${getBorder(
            toast.type
          )}`}
        >
          {getIcon(toast.type)}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-slate-900 leading-tight">{toast.title}</h4>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

