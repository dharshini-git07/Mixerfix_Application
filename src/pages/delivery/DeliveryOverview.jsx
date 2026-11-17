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
        className="rounded-2xl p-6 md:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden bg-gradient-to-r from-[#142D3A] via-[#1A3848] to-[#087F75]"
      >
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-3.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-teal-200 border border-white/20 mb-2 uppercase tracking-wider">
            Courier Fleet
          </span>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Hello, {currentUser?.name || 'Driver'}! 🚚
          </h1>
          <p className="text-teal-100 mt-1 text-sm md:text-base font-medium">
            Active task list for doorstep pickups and return deliveries.
          </p>
        </div>
        <div className="relative z-10 flex gap-2">
          <Link
            to="/delivery/assigned"
            className="px-5 py-2.5 bg-[#087F75] hover:bg-[#06635B] text-white text-sm font-bold rounded-xl transition shadow-md shadow-[#087F75]/30 whitespace-nowrap cursor-pointer"
          >
            Dispatch Tasklist
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tasks"
          value={totalAssignments}
          icon={Truck}
          color="primary"
          subtitle="Assigned"
        />
        <StatCard
          title="Pending Pickups"
          value={pendingPickups}
          icon={Clock}
          color="warning"
          subtitle="Pickups Pending"
        />
        <StatCard
          title="In Transit"
          value={pickedUp}
          icon={PackageCheck}
          color="info"
          subtitle="En Route"
        />
        <StatCard
          title="Delivered"
          value={delivered}
          icon={CheckCircle2}
          color="success"
          subtitle="Completed"
        />
      </div>

      {/* Priority Action Tasks */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold text-slate-900 text-lg">Active Deliveries</h2>
          <Link
            to="/delivery/assigned"
            className="text-sm font-bold text-[#087F75] hover:underline flex items-center gap-1"
          >
            All Assigned ({myTasks.length}) <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {myTasks.length === 0 ? (
          <EmptyState
            title="No delivery tasks pending"
            description="You are all caught up! New assigned tasks will appear here."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myTasks.slice(0, 4).map((task) => {
              const isPickup = ['Pickup Assigned', 'Collected'].includes(task.status);

              return (
                <div
                  key={task.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 hover:border-[#087F75]/40 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#087F75] bg-teal-50 border border-teal-200 px-3 py-1 rounded-md">
                      {task.id}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                        isPickup ? 'bg-amber-100 text-amber-900 border-amber-200' : 'bg-emerald-100 text-emerald-900 border-emerald-200'
                      }`}
                    >
                      {isPickup ? 'Doorstep Pickup' : 'Return Delivery'}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">
                      {task.brand} {task.appliance}
                    </h3>
                    <p className="text-sm font-semibold text-slate-700 mt-1">
                      Customer: {task.customerName}
                    </p>
                    <p className="text-sm font-medium text-slate-600 mt-1 flex items-start gap-1.5">
                      <MapPin className="w-4 h-4 text-[#087F75] shrink-0 mt-0.5" />
                      <span>{task.address}, {task.city} - {task.pincode}</span>
                    </p>
                    <p className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-[#087F75]" />
                      <a href={`tel:${task.customerPhone}`} className="hover:underline">
                        {task.customerPhone}
                      </a>
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                    <StatusBadge status={task.status} />

                    {/* Quick advance buttons */}
                    {task.status === 'Pickup Assigned' && (
                      <button
                        onClick={() => updateStatus(task.id, 'Collected')}
                        className="px-4 py-2 bg-[#087F75] hover:bg-[#06635B] text-white text-sm font-bold rounded-xl transition shadow-xs cursor-pointer"
                      >
                        Mark Picked Up
                      </button>
                    )}
                    {task.status === 'Collected' && (
                      <button
                        onClick={() => updateStatus(task.id, 'At Shop')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition shadow-xs cursor-pointer"
                      >
                        Reached Shop
                      </button>
                    )}
                    {task.status === 'Out for Delivery' && (
                      <button
                        onClick={() => updateStatus(task.id, 'Delivered')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition shadow-xs cursor-pointer"
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
