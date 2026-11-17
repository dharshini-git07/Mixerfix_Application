import React from 'react';
import { 
  Package, 
  MapPin, 
  Phone, 
  Calendar, 
  CheckCircle, 
  ArrowRight,
  Clock 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRepairs } from '../../context/RepairContext';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';

const PickupTasks = () => {
  const { currentUser } = useAuth();
  const { repairs, updateStatus } = useRepairs();

  // Pickups are repairs in 'Pickup Assigned' or 'Collected'
  const pickupList = repairs.filter((r) =>
    ['Pickup Assigned', 'Collected'].includes(r.status)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-primary-text font-heading">
          Customer Doorstep Pickups
        </h1>
        <p className="text-secondary-text text-sm mt-1">
          Pick up broken appliances from customer residences and transport them safely to the workshop.
        </p>
      </div>

      {pickupList.length === 0 ? (
        <EmptyState
          title="No pending pickup tasks"
          description="There are currently no appliances waiting for doorstep collection."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {pickupList.map((task) => (
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
                  Reported Issue: {task.issue}
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
                <div className="flex items-center gap-1.5 text-secondary-text">
                  <Calendar className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                  <span>Pickup Scheduled: {task.pickupDate}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-end gap-2">
                {task.status === 'Pickup Assigned' && (
                  <button
                    onClick={() => updateStatus(task.id, 'Collected')}
                    className="px-4 py-2 bg-brand-primary text-white text-xs font-semibold rounded-xl hover:bg-opacity-90 transition shadow-sm"
                  >
                    Mark as Picked Up
                  </button>
                )}
                {task.status === 'Collected' && (
                  <button
                    onClick={() => updateStatus(task.id, 'At Shop')}
                    className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 transition shadow-sm"
                  >
                    Mark Reached Shop
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PickupTasks;
