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
        className="rounded-2xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden bg-gradient-to-r from-[#142D3A] via-[#1A3848] to-[#087F75]"
      >
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-3.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-sm font-bold text-teal-200 border border-white/20 mb-3 uppercase tracking-wider">
            Customer Dashboard
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Welcome back, {currentUser?.name || 'Customer'}! 👋
          </h1>
          <p className="text-teal-100 mt-2 text-base md:text-lg font-medium">
            Live repair tracker & service bookings
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/customer/new-repair"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#087F75] hover:bg-[#06635B] text-white rounded-xl font-bold text-sm transition shadow-md shadow-[#087F75]/40 cursor-pointer"
            >
              <PlusCircle className="w-5 h-5" />
              Book New Repair
            </Link>
            <Link
              to="/customer/my-repairs"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl font-bold text-sm backdrop-blur-sm transition border border-white/30 cursor-pointer"
            >
              Track Repairs
              <ArrowRight className="w-5 h-5" />
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
          title="Total Bookings"
          value={totalRequests}
          icon={Wrench}
          color="primary"
          subtitle="All Bookings"
        />
        <StatCard
          title="Pending"
          value={pendingRequests}
          icon={Clock}
          color="warning"
          subtitle="Action Required"
        />
        <StatCard
          title="In Progress"
          value={inProgressRepairs}
          icon={AlertCircle}
          color="info"
          subtitle="Bench Testing"
        />
        <StatCard
          title="Completed"
          value={completedRepairs}
          icon={CheckCircle2}
          color="success"
          subtitle="Fixed / Delivered"
        />
      </div>

      {/* Active Repair Highlight */}
      {activeRepair && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-[#087F75] bg-teal-50 border border-teal-200 px-3 py-1 rounded-md">
                  {activeRepair.id}
                </span>
                <h2 className="text-xl font-extrabold text-slate-900">
                  {activeRepair.brand} {activeRepair.appliance}
                </h2>
              </div>
              <p className="text-sm font-semibold text-slate-600 mt-1">
                Booked: {activeRepair.createdAt} • Model: {activeRepair.model || 'Standard'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={activeRepair.status} />
              <Link
                to="/customer/my-repairs"
                className="text-sm font-bold text-[#087F75] hover:underline flex items-center gap-1"
              >
                View Details <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-4">
              Live Progress Status
            </h3>
            <ProgressTracker currentStatus={activeRepair.status} />
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-sm font-semibold text-slate-700">
            <div>
              <span className="text-slate-500">Estimated Cost:</span>{' '}
              <span className="font-extrabold text-[#087F75]">
                {activeRepair.cost ? `₹${activeRepair.cost}` : 'Pending Inspection'}
              </span>
            </div>
            <div>
              <span className="text-slate-500">Payment:</span>{' '}
              <span className={activeRepair.paymentStatus === 'Paid' ? 'text-emerald-700 font-extrabold' : 'text-amber-700 font-extrabold'}>
                {activeRepair.paymentStatus || 'Pending'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/customer/chat"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#087F75] hover:text-[#142D3A]"
              >
                <MessageSquare className="w-4 h-4" /> Chat Shop
              </Link>
              {activeRepair.cost && activeRepair.paymentStatus !== 'Paid' && (
                <Link
                  to={`/customer/payments?repairId=${activeRepair.id}`}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg hover:bg-emerald-100 ml-2"
                >
                  <CreditCard className="w-4 h-4" /> Pay Now
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recent Repairs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-extrabold text-slate-900 text-lg">Recent Repairs</h2>
          <Link
            to="/customer/my-repairs"
            className="text-sm font-bold text-[#087F75] hover:underline"
          >
            See all ({myRepairs.length})
          </Link>
        </div>

        {myRepairs.length === 0 ? (
          <EmptyState
            title="No repair requests yet"
            description="Book your first appliance repair now!"
            actionLabel="Book a Repair"
            onAction={() => window.location.href = '/customer/new-repair'}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-800">
              <thead className="bg-slate-50 text-sm font-bold uppercase text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Repair ID</th>
                  <th className="px-6 py-3.5">Appliance</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5">Est. Cost</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myRepairs.slice(0, 5).map((repair) => (
                  <tr key={repair.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-bold text-[#087F75] text-sm whitespace-nowrap">
                      {repair.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 text-sm">{repair.brand} {repair.appliance}</div>
                      <div className="text-sm font-medium text-slate-600 line-clamp-1">{repair.issue}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-600 whitespace-nowrap">
                      {repair.createdAt}
                    </td>
                    <td className="px-6 py-4 text-sm font-extrabold text-slate-900 whitespace-nowrap">
                      {repair.cost ? `₹${repair.cost}` : <span className="text-slate-400">TBD</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={repair.status} />
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <Link
                        to="/customer/my-repairs"
                        className="inline-flex items-center gap-1 text-sm font-bold text-[#087F75] hover:text-[#142D3A]"
                      >
                        Details <ArrowRight className="w-4 h-4" />
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
