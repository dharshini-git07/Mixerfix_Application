import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Wrench, 
  Clock, 
  CheckCircle2, 
  IndianRupee, 
  Truck, 
  AlertTriangle,
  ArrowRight,
  Eye,
  Check,
  X,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRepairs } from '../../context/RepairContext';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';

const OwnerDashboard = () => {
  const { currentUser } = useAuth();
  const { 
    repairs, 
    payments, 
    approveRepair, 
    rejectRepair, 
    updateCost, 
    assignCourier, 
    updateStatus, 
    deliveryPersonnel 
  } = useRepairs();

  const [selectedRepair, setSelectedRepair] = useState(null);
  const [costInput, setCostInput] = useState('');
  const [courierInput, setCourierInput] = useState(deliveryPersonnel[0].name);

  // Statistics
  const totalRequests = repairs.length;
  const newRequests = repairs.filter((r) => r.status === 'Requested').length;
  const inProgressRepairs = repairs.filter((r) =>
    ['Approved', 'Pickup Assigned', 'Collected', 'At Shop', 'Repair in Progress'].includes(r.status)
  ).length;
  const completedRepairs = repairs.filter((r) =>
    ['Completed', 'Out for Delivery', 'Delivered'].includes(r.status)
  ).length;

  const totalRevenue = payments.reduce((acc, p) => acc + (p.amount || 0), 0);

  const handleQuickApprove = (repair) => {
    approveRepair(repair.id);
  };

  const handleQuickReject = (repair) => {
    rejectRepair(repair.id);
  };

  const handleSaveCost = (repairId) => {
    if (!costInput) return;
    updateCost(repairId, Number(costInput));
    setCostInput('');
    setSelectedRepair(null);
  };

  const handleAssignCourier = (repairId) => {
    assignCourier(repairId, courierInput);
    setSelectedRepair(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div 
        className="rounded-2xl p-6 md:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden bg-gradient-to-r from-[#142D3A] via-[#1A3848] to-[#087F75]"
      >
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-3.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-teal-200 border border-white/20 mb-2 uppercase tracking-wider">
            Workshop Hub
          </span>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Electronics Repair Workshop
          </h1>
          <p className="text-teal-100 mt-1 text-sm md:text-base font-medium">
            Live repair tickets, quotation controls & courier dispatch.
          </p>
        </div>
        <div className="relative z-10 flex gap-2.5">
          <Link
            to="/owner/requests"
            className="px-5 py-2.5 bg-[#087F75] hover:bg-[#06635B] text-white text-sm font-bold rounded-xl transition shadow-md shadow-[#087F75]/30 whitespace-nowrap cursor-pointer"
          >
            Inbound ({newRequests})
          </Link>
          <Link
            to="/owner/deliveries"
            className="px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white text-sm font-bold rounded-xl backdrop-blur-sm transition border border-white/30 whitespace-nowrap cursor-pointer"
          >
            Courier Fleet
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Inbound"
          value={totalRequests}
          icon={Wrench}
          color="primary"
          subtitle="All Tickets"
        />
        <StatCard
          title="New Requests"
          value={newRequests}
          icon={Clock}
          color="warning"
          subtitle="Needs Approval"
        />
        <StatCard
          title="In Workbench"
          value={inProgressRepairs}
          icon={AlertTriangle}
          color="info"
          subtitle="Under Repair"
        />
        <StatCard
          title="Completed"
          value={completedRepairs}
          icon={CheckCircle2}
          color="success"
          subtitle="Ready / Delivered"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${totalRevenue}`}
          icon={IndianRupee}
          color="primary"
          subtitle="Collections"
        />
      </div>

      {/* Main Table: Inbound & Active Repairs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-extrabold text-slate-900 text-lg">Inbound & Active Repairs</h2>
            <p className="text-sm font-medium text-slate-500">Approve requests, set quotes, or assign couriers.</p>
          </div>
          <Link
            to="/owner/requests"
            className="text-sm font-bold text-[#087F75] hover:underline flex items-center gap-1"
          >
            View all ({repairs.length}) <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-800">
            <thead className="bg-slate-50 text-sm font-bold uppercase text-slate-700 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Repair ID</th>
                <th className="px-6 py-3.5">Customer</th>
                <th className="px-6 py-3.5">Appliance</th>
                <th className="px-6 py-3.5">Issue</th>
                <th className="px-6 py-3.5">Est. Cost</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Shop Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {repairs.slice(0, 6).map((repair) => (
                <tr key={repair.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-bold text-[#087F75] text-sm whitespace-nowrap">
                    {repair.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 text-sm">{repair.customerName}</div>
                    <div className="text-xs font-semibold text-slate-500">{repair.customerPhone}</div>
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap">
                    <span className="font-bold text-slate-900">{repair.brand}</span> {repair.appliance}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600 max-w-xs truncate">
                    {repair.issue}
                  </td>
                  <td className="px-6 py-4 text-sm font-extrabold text-slate-900 whitespace-nowrap">
                    {repair.cost ? `₹${repair.cost}` : <span className="text-slate-400 font-normal">Pending</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={repair.status} />
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      {repair.status === 'Requested' && (
                        <>
                          <button
                            onClick={() => handleQuickApprove(repair)}
                            className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition border border-emerald-200"
                            title="Approve Request"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleQuickReject(repair)}
                            className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg transition border border-rose-200"
                            title="Reject Request"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => {
                          setSelectedRepair(repair);
                          setCostInput(repair.cost ? String(repair.cost) : '');
                          setCourierInput(repair.assignedCourier || deliveryPersonnel[0].name);
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-teal-50 text-slate-800 hover:text-[#087F75] text-sm font-bold rounded-xl transition border border-slate-200 cursor-pointer"
                      >
                        Manage
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Repair Management Dialog */}
      {selectedRepair && (
        <Modal
          isOpen={!!selectedRepair}
          onClose={() => setSelectedRepair(null)}
          title={`Workbench Control: ${selectedRepair.id}`}
        >
          <div className="space-y-4 text-xs">
            {/* Appliance & Customer summary */}
            <div className="p-3 bg-bg-light rounded-xl space-y-1">
              <div className="flex justify-between font-bold text-sm text-primary-text">
                <span>{selectedRepair.brand} {selectedRepair.appliance}</span>
                <StatusBadge status={selectedRepair.status} />
              </div>
              <p className="text-secondary-text">Customer: {selectedRepair.customerName} ({selectedRepair.customerPhone})</p>
              <p className="text-secondary-text">Address: {selectedRepair.address}, {selectedRepair.city} - {selectedRepair.pincode}</p>
              <p className="text-secondary-text">Reported Issue: {selectedRepair.issue}</p>
            </div>

            {/* Set Cost Section */}
            <div className="p-3 border border-gray-100 rounded-xl space-y-2">
              <label className="font-semibold text-primary-text block">
                Update Estimated Repair Cost (₹)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={costInput}
                  onChange={(e) => setCostInput(e.target.value)}
                  placeholder="e.g. 750"
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-brand-primary"
                />
                <button
                  type="button"
                  onClick={() => handleSaveCost(selectedRepair.id)}
                  className="px-3 py-2 bg-brand-primary text-white font-medium rounded-lg hover:bg-opacity-90"
                >
                  Save Cost
                </button>
              </div>
            </div>

            {/* Assign Courier Section */}
            <div className="p-3 border border-gray-100 rounded-xl space-y-2">
              <label className="font-semibold text-primary-text block">
                Assign Delivery Executive
              </label>
              <div className="flex gap-2">
                <select
                  value={courierInput}
                  onChange={(e) => setCourierInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary"
                >
                  {deliveryPersonnel.map((dp) => (
                    <option key={dp.id} value={dp.name}>
                      {dp.name} ({dp.phone}) — {dp.status}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => handleAssignCourier(selectedRepair.id)}
                  className="px-3 py-2 bg-brand-secondary text-white font-medium rounded-lg hover:bg-opacity-90"
                >
                  Assign
                </button>
              </div>
            </div>

            {/* Manual Status Override */}
            <div className="p-3 border border-gray-100 rounded-xl space-y-2">
              <label className="font-semibold text-primary-text block">
                Transition Repair Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['At Shop', 'Repair in Progress', 'Completed', 'Out for Delivery'].map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      updateStatus(selectedRepair.id, st);
                      setSelectedRepair(null);
                    }}
                    className="px-2.5 py-1.5 border border-gray-200 rounded-lg hover:bg-brand-accent hover:text-brand-primary text-left font-medium transition"
                  >
                    → {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedRepair(null)}
                className="px-4 py-2 bg-gray-100 text-secondary-text rounded-lg hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default OwnerDashboard;
