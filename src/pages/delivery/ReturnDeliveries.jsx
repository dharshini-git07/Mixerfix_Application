import React from 'react';
import { 
  Truck, 
  MapPin, 
  Phone, 
  CheckCircle, 
  AlertCircle, 
  Banknote,
  Clock
} from 'lucide-react';
import { useRepairs } from '../../context/RepairContext';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';

const ReturnDeliveries = () => {
  const { repairs, updateStatus } = useRepairs();

  // Return tasks are repairs that are Completed, Out for Delivery, or Delivered
  const returnList = repairs.filter((r) =>
    ['Completed', 'Out for Delivery', 'Delivered'].includes(r.status)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-primary-text font-heading">
          Return Deliveries to Customers
        </h1>
        <p className="text-secondary-text text-sm mt-1">
          Deliver repaired and tested electronic appliances back to customers and collect simulated COD if due.
        </p>
      </div>

      {returnList.length === 0 ? (
        <EmptyState
          title="No return deliveries right now"
          description="Repaired appliances will appear here once the shop owner marks them repaired."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {returnList.map((task) => (
            <div
              key={task.id}
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4 hover:border-brand-primary/30 transition"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-xs font-bold text-brand-primary bg-brand-accent px-2.5 py-1 rounded-md">
                  {task.id}
                </span>
                <StatusBadge status={task.status} />
              </div>

              <div>
                <h3 className="font-bold text-primary-text text-base">
                  {task.brand} {task.appliance}
                </h3>
                <p className="text-xs text-secondary-text mt-0.5">
                  Repaired Issue: {task.issue}
                </p>
              </div>

              <div className="bg-bg-light/60 p-3 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-primary-text">Customer: {task.customerName}</span>
                  <a
                    href={`tel:${task.customerPhone}`}
                    className="text-brand-primary font-semibold hover:underline flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call Customer
                  </a>
                </div>
                <div className="flex items-start gap-1.5 text-secondary-text">
                  <MapPin className="w-3.5 h-3.5 text-brand-primary shrink-0 mt-0.5" />
                  <span>{task.address}, {task.city} - {task.pincode}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-gray-200">
                  <span className="text-secondary-text">Payment Status:</span>
                  <span
                    className={`font-bold ${
                      task.paymentStatus === 'Paid' ? 'text-success-text' : 'text-warning-text'
                    }`}
                  >
                    {task.paymentStatus === 'Paid' ? 'Paid in Full' : `Collect Cash: ₹${task.cost || 'TBD'}`}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-end gap-2">
                {task.status === 'Completed' && (
                  <button
                    onClick={() => updateStatus(task.id, 'Out for Delivery')}
                    className="px-4 py-2 bg-brand-primary text-white text-xs font-semibold rounded-xl hover:bg-opacity-90 transition shadow-sm"
                  >
                    Start Return Delivery
                  </button>
                )}

                {task.status === 'Out for Delivery' && (
                  <button
                    onClick={() => updateStatus(task.id, 'Delivered')}
                    className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 transition shadow-sm flex items-center gap-1"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Mark Delivered & Handover
                  </button>
                )}

                {task.status === 'Delivered' && (
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Handover Complete
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReturnDeliveries;
