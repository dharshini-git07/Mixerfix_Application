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
        className="rounded-2xl p-6 md:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #142D3A 0%, #173847 50%, #087F75 100%)' }}
      >
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold text-teal-200 border border-white/10 mb-2">
            Master Workshop Command Center
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Mixer Fix Electronic Repairs Hub
          </h1>
          <p className="text-slate-200 mt-1 text-xs md:text-sm">
            Logged in as {currentUser?.name || 'Shop Manager'} • Monitoring live repair workflow & courier dispatch
          </p>
        </div>
        <div className="relative z-10 flex gap-2">
          <Link
            to="/owner/requests"
            className="px-4 py-2.5 bg-[#087F75] hover:bg-[#06635B] text-white text-xs font-bold rounded-xl transition shadow-md shadow-[#087F75]/30 whitespace-nowrap cursor-pointer"
          >
            Review Inbound ({newRequests})
          </Link>
          <Link
            to="/owner/deliveries"
            className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white text-xs font-semibold rounded-xl backdrop-blur-sm transition border border-white/20 whitespace-nowrap cursor-pointer"
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
          subtitle="All repair tickets"
        />
        <StatCard
          title="New Requests"
          value={newRequests}
          icon={Clock}
          color="warning"
          subtitle="Awaiting shop approval"
        />
        <StatCard
          title="In Workbench"
          value={inProgressRepairs}
          icon={AlertTriangle}
          color="info"
          subtitle="Active pipeline"
        />
        <StatCard
          title="Completed"
          value={completedRepairs}
          icon={CheckCircle2}
          color="success"
          subtitle="Fixed or dispatched"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${totalRevenue}`}
          icon={IndianRupee}
          color="primary"
          subtitle="Simulated collections"
        />
      </div>

      {/* Main Table: Inbound & Active Repairs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-primary-text text-base">Inbound & Active Repairs</h2>
            <p className="text-xs text-secondary-text">Approve requests, assign quotes, or dispatch couriers</p>
          </div>
          <Link
            to="/owner/requests"
            className="text-xs font-semibold text-brand-primary hover:underline flex items-center gap-1"
          >
            View all ({repairs.length}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-primary-text">
            <thead className="bg-bg-light/60 text-xs uppercase text-secondary-text border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 font-semibold">Repair ID</th>
                <th className="px-6 py-3 font-semibold">Customer</th>
                <th className="px-6 py-3 font-semibold">Appliance</th>
                <th className="px-6 py-3 font-semibold">Issue</th>
                <th className="px-6 py-3 font-semibold">Est. Cost</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Shop Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {repairs.slice(0, 6).map((repair) => (
                <tr key={repair.id} className="hover:bg-gray-50/60 transition">
                  <td className="px-6 py-4 font-bold text-brand-primary text-xs">
                    {repair.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-primary-text text-xs">{repair.customerName}</div>
                    <div className="text-[11px] text-secondary-text">{repair.customerPhone}</div>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <span className="font-semibold text-primary-text">{repair.brand}</span> {repair.appliance}
                  </td>
                  <td className="px-6 py-4 text-xs text-secondary-text max-w-xs truncate">
                    {repair.issue}
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold whitespace-nowrap">
                    {repair.cost ? `₹${repair.cost}` : <span className="text-gray-400 font-normal">Pending</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={repair.status} />
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {repair.status === 'Requested' && (
                        <>
                          <button
                            onClick={() => handleQuickApprove(repair)}
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition"
                            title="Approve Request"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleQuickReject(repair)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg transition"
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
                        className="px-2.5 py-1.5 bg-bg-light hover:bg-brand-accent text-secondary-text hover:text-brand-primary text-xs font-medium rounded-lg transition"
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
