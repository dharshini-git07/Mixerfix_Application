import React from 'react';
import { REPAIR_STAGES } from '../../data/mockData';
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
  AlertCircle
} from 'lucide-react';

const STAGE_ICONS = {
  'Requested': FileText,
  'Approved': CheckCircle,
  'Pickup Assigned': Truck,
  'Collected': PackageCheck,
  'At Shop': Building2,
  'Repair in Progress': Wrench,
  'Completed': CheckCircle2,
  'Out for Delivery': Send,
  'Delivered': Home
};

export default function ProgressTracker({ currentStatus, repairDetails = {} }) {
  if (currentStatus === 'Rejected') {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold text-rose-900">Request Rejected</h4>
          <p className="text-xs text-rose-700 mt-1">
            {repairDetails.rejectionReason || 'This repair request could not be serviced.'}
          </p>
        </div>
      </div>
    );
  }

  // Find index of current stage (0-based)
  const currentIndex = REPAIR_STAGES.findIndex((s) => s.id === currentStatus);
  const activeStep = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="w-full">
      {/* Desktop Horizontal Tracker */}
      <div className="hidden lg:block">
        <div className="relative flex items-center justify-between">
          {/* Background Connecting Line */}
          <div className="absolute top-5 left-6 right-6 h-1 bg-slate-200 -z-0" />
          
          {/* Active Filled Progress Line */}
          <div
            className="absolute top-5 left-6 h-1 bg-[#087F75] transition-all duration-500 ease-out -z-0"
            style={{
              width: `${(activeStep / (REPAIR_STAGES.length - 1)) * 92}%`
            }}
          />

          {REPAIR_STAGES.map((stage, idx) => {
            const isCompleted = idx < activeStep;
            const isCurrent = idx === activeStep;
            const isUpcoming = idx > activeStep;
            const IconComp = STAGE_ICONS[stage.id] || FileText;

            return (
              <div key={stage.id} className="relative z-10 flex flex-col items-center group">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 font-semibold text-xs border-2 ${
                    isCompleted
                      ? 'bg-[#087F75] border-[#087F75] text-white shadow-md shadow-[#087F75]/20'
                      : isCurrent
                      ? 'bg-white border-[#087F75] text-[#087F75] ring-4 ring-[#DDF4EF] scale-110'
                      : 'bg-white border-slate-300 text-slate-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  ) : (
                    <IconComp className="w-5 h-5" />
                  )}
                </div>

                <div className="mt-2 text-center max-w-[90px]">
                  <span
                    className={`block text-xs leading-tight font-bold ${
                      isCurrent
                        ? 'text-[#087F75]'
                        : isCompleted
                        ? 'text-slate-800'
                        : 'text-slate-500'
                    }`}
                  >
                    {stage.label}
                  </span>
                  <span className="block text-xs font-semibold text-slate-500 mt-0.5">
                    Step {stage.step}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tablet & Mobile Vertical/Compact Stepper */}
      <div className="lg:hidden">
        <div className="bg-slate-50/90 p-3.5 rounded-xl border border-slate-200 mb-3">
          <div className="flex items-center justify-between text-sm font-semibold text-slate-700 mb-1.5">
            <span>Stage {activeStep + 1} of 9</span>
            <span className="text-[#087F75] font-bold">{Math.round(((activeStep + 1) / 9) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-[#087F75] h-full rounded-full transition-all duration-500"
              style={{ width: `${((activeStep + 1) / 9) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-3 relative pl-3 before:absolute before:left-6 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {REPAIR_STAGES.map((stage, idx) => {
            const isCompleted = idx < activeStep;
            const isCurrent = idx === activeStep;
            const isUpcoming = idx > activeStep;
            const IconComp = STAGE_ICONS[stage.id] || FileText;

            return (
              <div key={stage.id} className="relative flex items-center space-x-3 text-left">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border text-xs z-10 transition-all ${
                    isCompleted
                      ? 'bg-[#087F75] border-[#087F75] text-white'
                      : isCurrent
                      ? 'bg-white border-2 border-[#087F75] text-[#087F75] ring-2 ring-[#DDF4EF]'
                      : 'bg-white border-slate-300 text-slate-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  ) : (
                    <IconComp className="w-4 h-4" />
                  )}
                </div>

                <div className="flex-1 min-w-0 py-0.5">
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-sm font-bold ${
                        isCurrent
                          ? 'text-[#087F75]'
                          : isCompleted
                          ? 'text-slate-900'
                          : 'text-slate-500'
                      }`}
                    >
                      {stage.label}
                    </p>
                    {isCurrent && (
                      <span className="text-xs font-bold uppercase tracking-wider text-[#087F75] bg-[#DDF4EF] px-2 py-0.5 rounded-md">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-slate-600 truncate">{stage.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

