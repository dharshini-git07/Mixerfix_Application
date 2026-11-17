import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Truck, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  PackageCheck,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRepairs } from '../../context/RepairContext';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';

const DeliveryOverview = () => {
  const { currentUser } = useAuth();
  const { repairs, updateStatus } = useRepairs();

  // Filter tasks assigned to this driver or general courier queue
  const myTasks = repairs.filter(
    (r) =>
      r.assignedCourier === currentUser?.name ||
      ['Pickup Assigned', 'Collected', 'Out for Delivery'].includes(r.status)
  );

  const totalAssignments = myTasks.length;
  const pendingPickups = myTasks.filter((r) => r.status === 'Pickup Assigned').length;
  const pickedUp = myTasks.filter((r) => r.status === 'Collected').length;
  const delivered = repairs.filter((r) => r.status === 'Delivered').length;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div 
        className="rounded-2xl p-6 md:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #142D3A 0%, #173847 50%, #087F75 100%)' }}
      >
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold text-teal-200 border border-white/10 mb-2">
            Field Courier Terminal
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Hello, {currentUser?.name || 'Driver'}! 🚚
          </h1>
          <p className="text-slate-200 mt-1 text-xs md:text-sm">
            You have <span className="font-bold text-teal-200">{pendingPickups}</span> pending pickups and <span className="font-bold text-teal-200">{myTasks.filter(r => r.status === 'Out for Delivery').length}</span> return deliveries today.
          </p>
        </div>
        <div className="relative z-10 flex gap-2">
          <Link
            to="/delivery/assigned"
            className="px-4 py-2.5 bg-[#087F75] hover:bg-[#06635B] text-white text-xs font-bold rounded-xl transition shadow-md shadow-[#087F75]/30 whitespace-nowrap cursor-pointer"
          >
            Open Dispatch Tasklist
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Assignments"
          value={totalAssignments}
          icon={Truck}
          color="primary"
          subtitle="Assigned courier jobs"
        />
        <StatCard
          title="Pending Pickups"
          value={pendingPickups}
          icon={Clock}
          color="warning"
          subtitle="Doorstep visits queued"
        />
        <StatCard
          title="Collected / En Route"
          value={pickedUp}
          icon={PackageCheck}
          color="info"
          subtitle="In transit to workshop"
        />
        <StatCard
          title="Delivered"
          value={delivered}
          icon={CheckCircle2}
          color="success"
          subtitle="Returned to customer"
        />
      </div>

      {/* Priority Action Tasks */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-primary-text text-base">Active Field Deliveries</h2>
          <Link
            to="/delivery/assigned"
            className="text-xs font-semibold text-brand-primary hover:underline flex items-center gap-1"
          >
            All Assigned ({myTasks.length}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {myTasks.length === 0 ? (
          <EmptyState
            title="No delivery tasks pending"
            description="You are caught up! When shop owners assign pickups or returns, they will appear here."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myTasks.slice(0, 4).map((task) => {
              const isPickup = ['Pickup Assigned', 'Collected'].includes(task.status);

              return (
                <div
                  key={task.id}
                  className="p-4 rounded-xl border border-gray-100 bg-bg-light/40 space-y-3 hover:border-brand-primary/30 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-primary bg-brand-accent px-2 py-0.5 rounded">
                      {task.id}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        isPickup ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {isPickup ? 'Doorstep Pickup' : 'Return Delivery'}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-primary-text text-sm">
                      {task.brand} {task.appliance}
                    </h3>
                    <p className="text-xs text-secondary-text mt-0.5">
                      Customer: {task.customerName}
                    </p>
                    <p className="text-xs text-secondary-text mt-1 flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-brand-primary shrink-0 mt-0.5" />
                      <span>{task.address}, {task.city} - {task.pincode}</span>
                    </p>
                    <p className="text-xs text-primary-text mt-1 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-brand-primary" />
                      <a href={`tel:${task.customerPhone}`} className="hover:underline font-semibold">
                        {task.customerPhone}
                      </a>
                    </p>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                    <StatusBadge status={task.status} />

                    {/* Quick advance buttons */}
                    {task.status === 'Pickup Assigned' && (
                      <button
                        onClick={() => updateStatus(task.id, 'Collected')}
                        className="px-3 py-1.5 bg-brand-primary text-white text-xs font-semibold rounded-lg hover:bg-opacity-90"
                      >
                        Mark Picked Up
                      </button>
                    )}
                    {task.status === 'Collected' && (
                      <button
                        onClick={() => updateStatus(task.id, 'At Shop')}
                        className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-opacity-90"
                      >
                        Reached Shop
                      </button>
                    )}
                    {task.status === 'Out for Delivery' && (
                      <button
                        onClick={() => updateStatus(task.id, 'Delivered')}
                        className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-opacity-90"
                      >
                        Mark Delivered
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryOverview;
