import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  Phone, 
  Calendar, 
  CheckCircle, 
  Search, 
  Filter, 
  Package, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRepairs } from '../../context/RepairContext';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';

const AssignedDeliveries = () => {
  const { currentUser } = useAuth();
  const { repairs, updateStatus } = useRepairs();
  const [searchTerm, setSearchTerm] = useState('');
  const [tabFilter, setTabFilter] = useState('ALL');

  // Filter tasks that need delivery handling
  const deliveryTasks = repairs.filter(
    (r) =>
      r.assignedCourier === currentUser?.name ||
      ['Pickup Assigned', 'Collected', 'Out for Delivery', 'Delivered'].includes(r.status)
  );

  const filteredTasks = deliveryTasks.filter((task) => {
    const matchesSearch =
      task.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.appliance.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.address.toLowerCase().includes(searchTerm.toLowerCase());

    const isPickup = ['Pickup Assigned', 'Collected'].includes(task.status);
    const isReturn = ['Out for Delivery', 'Delivered'].includes(task.status);

    const matchesTab =
      tabFilter === 'ALL' ||
      (tabFilter === 'PICKUP' && isPickup) ||
      (tabFilter === 'RETURN' && isReturn) ||
      (tabFilter === 'PENDING' && task.status !== 'Delivered');

    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-primary-text font-heading">
          All Assigned Delivery Tasks
        </h1>
        <p className="text-secondary-text text-sm mt-1">
          Accept assignments, update doorstep transit statuses, and confirm final delivery.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, customer name or street..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          {[
            { id: 'ALL', label: 'All Jobs' },
            { id: 'PENDING', label: 'Active Pipeline' },
            { id: 'PICKUP', label: 'Pickups' },
            { id: 'RETURN', label: 'Returns' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTabFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition shrink-0 ${
                tabFilter === tab.id
                  ? 'bg-brand-primary text-white'
                  : 'bg-bg-light text-secondary-text hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Task Cards Grid */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          title="No assignments found"
          description="Try adjusting your filter or search query."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredTasks.map((task) => {
            const isPickup = ['Pickup Assigned', 'Collected'].includes(task.status);
            const isCompleted = task.status === 'Delivered';

            return (
              <div
                key={task.id}
                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-brand-primary/30 transition space-y-4"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-brand-primary bg-brand-accent px-2.5 py-1 rounded-md">
                      {task.id}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                        isPickup ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {isPickup ? 'Doorstep Pickup' : 'Customer Return'}
                    </span>
                  </div>
                  <StatusBadge status={task.status} />
                </div>

                {/* Appliance & Customer Details */}
                <div>
                  <h3 className="font-bold text-primary-text text-base">
                    {task.brand} {task.appliance}
                  </h3>
                  <p className="text-xs text-secondary-text mt-0.5">
                    Model: {task.model || 'Standard'} • Issue: {task.issue}
                  </p>
                </div>

                <div className="bg-bg-light/60 p-3 rounded-xl space-y-1.5 text-xs">
                  <div className="flex items-center justify-between font-medium text-primary-text">
                    <span>Customer: {task.customerName}</span>
                    <a
                      href={`tel:${task.customerPhone}`}
                      className="text-brand-primary hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Phone className="w-3.5 h-3.5" /> {task.customerPhone}
                    </a>
                  </div>
                  <div className="flex items-start gap-1.5 text-secondary-text">
                    <MapPin className="w-3.5 h-3.5 text-brand-primary shrink-0 mt-0.5" />
                    <span>{task.address}, {task.city} - {task.pincode}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-secondary-text">
                    <Calendar className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                    <span>Scheduled Date: {task.pickupDate}</span>
                  </div>
                </div>

                {/* Action Buttons based on state */}
                <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs text-secondary-text">
                    Payment: <strong className="text-primary-text">{task.paymentStatus || 'Pending'}</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    {task.status === 'Pickup Assigned' && (
                      <button
                        onClick={() => updateStatus(task.id, 'Collected')}
                        className="px-3.5 py-1.5 bg-brand-primary hover:bg-opacity-90 text-white text-xs font-semibold rounded-xl transition shadow-sm"
                      >
                        Mark as Picked Up
                      </button>
                    )}

                    {task.status === 'Collected' && (
                      <button
                        onClick={() => updateStatus(task.id, 'At Shop')}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition shadow-sm"
                      >
                        Mark Reached Shop
                      </button>
                    )}

                    {task.status === 'Completed' && (
                      <button
                        onClick={() => updateStatus(task.id, 'Out for Delivery')}
                        className="px-3.5 py-1.5 bg-brand-primary hover:bg-opacity-90 text-white text-xs font-semibold rounded-xl transition shadow-sm"
                      >
                        Mark Out for Delivery
                      </button>
                    )}

                    {task.status === 'Out for Delivery' && (
                      <button
                        onClick={() => updateStatus(task.id, 'Delivered')}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition shadow-sm flex items-center gap-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Mark as Delivered
                      </button>
                    )}

                    {isCompleted && (
                      <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Handover Complete
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AssignedDeliveries;
