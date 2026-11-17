import React from 'react';

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  color = 'primary',
  subtext,
  subtitle
}) {
  const colorMap = {
    primary: {
      bg: 'bg-teal-50',
      text: 'text-[#087F75]',
      border: 'border-teal-100',
      glow: 'group-hover:ring-[#087F75]/20'
    },
    secondary: {
      bg: 'bg-slate-100',
      text: 'text-[#142D3A]',
      border: 'border-slate-200',
      glow: 'group-hover:ring-[#142D3A]/20'
    },
    warning: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-100',
      glow: 'group-hover:ring-amber-500/20'
    },
    info: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-100',
      glow: 'group-hover:ring-blue-500/20'
    },
    success: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-100',
      glow: 'group-hover:ring-emerald-500/20'
    },
    danger: {
      bg: 'bg-rose-50',
      text: 'text-rose-600',
      border: 'border-rose-100',
      glow: 'group-hover:ring-rose-500/20'
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-100',
      glow: 'group-hover:ring-amber-500/20'
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-100',
      glow: 'group-hover:ring-emerald-500/20'
    },
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-100',
      glow: 'group-hover:ring-blue-500/20'
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      border: 'border-purple-100',
      glow: 'group-hover:ring-purple-500/20'
    }
  };

  const scheme = colorMap[color] || colorMap.primary;
  const displaySub = trendLabel || subtitle || subtext;

  return (
    <div className={`group bg-white p-5 rounded-2xl border border-slate-100 shadow-soft hover:shadow-md transition-all duration-300 relative overflow-hidden ring-1 ring-slate-100 ${scheme.glow}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-slate-700">{title}</p>
          <h3 className="text-3xl font-extrabold text-slate-900 mt-1.5 tracking-tight">{value}</h3>
          
          {(trend || displaySub) && (
            <div className="flex items-center gap-2 mt-2">
              {trend && (
                <span className="text-sm font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {trend}
                </span>
              )}
              {displaySub && <span className="text-sm font-semibold text-slate-600">{displaySub}</span>}
            </div>
          )}
        </div>

        {Icon && (
          <div className={`p-3 rounded-xl ${scheme.bg} ${scheme.text} transition-transform duration-300 group-hover:scale-110`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
}
