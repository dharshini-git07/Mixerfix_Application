import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Wrench, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  PlusCircle, 
  ArrowRight,
  MessageSquare,
  CreditCard,
  Truck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRepairs } from '../../context/RepairContext';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import ProgressTracker from '../../components/common/ProgressTracker';
import EmptyState from '../../components/common/EmptyState';

const CustomerOverview = () => {
  const { currentUser } = useAuth();
  const { repairs } = useRepairs();

  // Filter repairs belonging to this customer
  const myRepairs = repairs.filter(r => r.customerId === currentUser?.id || r.customerEmail === currentUser?.email);

  const totalRequests = myRepairs.length;
  const pendingRequests = myRepairs.filter(r => ['Requested', 'Approved', 'Pickup Assigned'].includes(r.status)).length;
  const inProgressRepairs = myRepairs.filter(r => ['Collected', 'At Shop', 'Repair in Progress'].includes(r.status)).length;
  const completedRepairs = myRepairs.filter(r => ['Completed', 'Out for Delivery', 'Delivered'].includes(r.status)).length;

  // Most recent active repair
  const activeRepair = myRepairs.find(r => r.status !== 'Delivered') || myRepairs[0];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div 
        className="rounded-2xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #142D3A 0%, #173847 50%, #087F75 100%)' }}
      >
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold text-teal-200 border border-white/10 mb-3">
            Customer Dashboard
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {currentUser?.name || 'Customer'}! 👋
          </h1>
          <p className="text-slate-200 mt-2 text-sm md:text-base leading-relaxed">
            Track your appliance repairs, book new technician visits, and stay updated in real time.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/customer/new-repair"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#087F75] hover:bg-[#06635B] text-white rounded-xl font-bold text-sm transition shadow-md shadow-[#087F75]/30 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Book New Repair
            </Link>
            <Link
              to="/customer/my-repairs"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/15 hover:bg-white/25 text-white rounded-xl font-semibold text-sm backdrop-blur-sm transition border border-white/20 cursor-pointer"
            >
              Track Repairs
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <div className="hidden lg:block absolute right-8 -bottom-6 opacity-15 pointer-events-none">
          <Wrench className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Requests"
          value={totalRequests}
          icon={Wrench}
          color="primary"
          subtitle="All-time bookings"
        />
        <StatCard
          title="Pending Requests"
          value={pendingRequests}
          icon={Clock}
          color="warning"
          subtitle="Awaiting pickup or approval"
        />
        <StatCard
          title="Repairs in Progress"
          value={inProgressRepairs}
          icon={AlertCircle}
          color="info"
          subtitle="Currently on workbench"
        />
        <StatCard
          title="Completed Repairs"
          value={completedRepairs}
          icon={CheckCircle2}
          color="success"
          subtitle="Fixed or delivered"
        />
      </div>

      {/* Active Repair Highlight */}
      {activeRepair && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-brand-primary bg-brand-accent px-2.5 py-1 rounded-md">
                  {activeRepair.id}
                </span>
                <h2 className="text-lg font-bold text-primary-text">
                  {activeRepair.brand} {activeRepair.appliance}
                </h2>
              </div>
              <p className="text-xs text-secondary-text mt-1">
                Requested on {activeRepair.createdAt} • Model: {activeRepair.model || 'Standard'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={activeRepair.status} />
              <Link
                to="/customer/my-repairs"
                className="text-xs font-semibold text-brand-primary hover:underline flex items-center gap-1"
              >
                View Full Details <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary-text mb-4">
              Live Progress Status
            </h3>
            <ProgressTracker currentStatus={activeRepair.status} />
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 text-xs text-secondary-text">
            <div>
              <span className="font-medium text-primary-text">Estimated Cost:</span>{' '}
              <span className="font-semibold text-brand-primary">
                {activeRepair.cost ? `₹${activeRepair.cost}` : 'Pending inspection'}
              </span>
            </div>
            <div>
              <span className="font-medium text-primary-text">Payment:</span>{' '}
              <span className={activeRepair.paymentStatus === 'Paid' ? 'text-success-text font-semibold' : 'text-warning-text font-semibold'}>
                {activeRepair.paymentStatus || 'Pending'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/customer/chat"
                className="inline-flex items-center gap-1 text-brand-primary hover:text-brand-secondary font-medium"
              >
                <MessageSquare className="w-3.5 h-3.5" /> Chat Shop
              </Link>
              {activeRepair.cost && activeRepair.paymentStatus !== 'Paid' && (
                <Link
                  to={`/customer/payments?repairId=${activeRepair.id}`}
                  className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium ml-3"
                >
                  <CreditCard className="w-3.5 h-3.5" /> Pay Now
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recent Repairs Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-primary-text text-base">Recent Repair Requests</h2>
          <Link
            to="/customer/my-repairs"
            className="text-xs font-semibold text-brand-primary hover:underline"
          >
            See all ({myRepairs.length})
          </Link>
        </div>

        {myRepairs.length === 0 ? (
          <EmptyState
            title="No repair requests yet"
            description="Book your first appliance repair request in under two minutes!"
            actionLabel="Book a Repair"
            onAction={() => window.location.href = '/customer/new-repair'}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-primary-text">
              <thead className="bg-bg-light/60 text-xs uppercase text-secondary-text border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 font-semibold">Repair ID</th>
                  <th className="px-6 py-3 font-semibold">Appliance</th>
                  <th className="px-6 py-3 font-semibold">Date</th>
                  <th className="px-6 py-3 font-semibold">Est. Cost</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {myRepairs.slice(0, 5).map((repair) => (
                  <tr key={repair.id} className="hover:bg-gray-50/60 transition">
                    <td className="px-6 py-4 font-semibold text-brand-primary text-xs">
                      {repair.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-primary-text">{repair.brand} {repair.appliance}</div>
                      <div className="text-xs text-secondary-text line-clamp-1">{repair.issue}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-secondary-text whitespace-nowrap">
                      {repair.createdAt}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium whitespace-nowrap">
                      {repair.cost ? `₹${repair.cost}` : <span className="text-gray-400">TBD</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={repair.status} />
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <Link
                        to="/customer/my-repairs"
                        className="inline-flex items-center gap-1 text-xs font-medium text-brand-primary hover:text-brand-secondary"
                      >
                        Details <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerOverview;
