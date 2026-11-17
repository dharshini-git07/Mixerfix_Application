import React from 'react';
import { PackageOpen } from 'lucide-react';

export default function EmptyState({
  icon: Icon = PackageOpen,
  title = 'No items found',
  description = 'There are no records to display at this moment.',
  actionText,
  onAction
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border border-slate-100 shadow-soft">
      <div className="w-14 h-14 rounded-2xl bg-[#DDF4EF] flex items-center justify-center text-[#087F75] mb-3.5">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <p className="text-sm font-semibold text-slate-600 max-w-sm mt-1">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-5 py-2.5 bg-[#087F75] hover:bg-[#06635B] text-white text-sm font-bold rounded-xl transition shadow-sm cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
