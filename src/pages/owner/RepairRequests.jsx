import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Check, 
  X, 
  Eye, 
  Edit3, 
  Truck, 
  Image as ImageIcon,
  Video,
  AlertCircle
} from 'lucide-react';
import { useRepairs } from '../../context/RepairContext';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';

const RepairRequests = () => {
  const { 
    repairs, 
    approveRepair, 
    rejectRepair, 
    updateCost, 
    assignCourier, 
    updateStatus, 
    deliveryPersonnel 
  } = useRepairs();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedRepair, setSelectedRepair] = useState(null);
  const [editingCostRepair, setEditingCostRepair] = useState(null);
  const [newCost, setNewCost] = useState('');
  const [selectedCourier, setSelectedCourier] = useState(deliveryPersonnel[0].name);

  // Filtering
  const filtered = repairs.filter((r) => {
    const matchesSearch =
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.appliance.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.brand.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === 'ALL' ||
      (filterStatus === 'NEW' && r.status === 'Requested') ||
      (filterStatus === 'APPROVED' && r.status === 'Approved') ||
      (filterStatus === 'IN_SHOP' && ['Collected', 'At Shop', 'Repair in Progress'].includes(r.status)) ||
      (filterStatus === 'COMPLETED' && ['Completed', 'Out for Delivery', 'Delivered'].includes(r.status)) ||
      r.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleSaveCost = (e) => {
    e.preventDefault();
    if (!editingCostRepair || !newCost) return;
    updateCost(editingCostRepair.id, Number(newCost));
    setEditingCostRepair(null);
    setNewCost('');
  };

  const handleAssignDelivery = (repairId) => {
    assignCourier(repairId, selectedCourier);
    setSelectedRepair(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-primary-text font-heading">
          Appliance Repair Management
        </h1>
        <p className="text-secondary-text text-sm mt-1">
          Review incoming complaints, approve repair estimates, inspect evidence, and track turnaround times.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, customer, appliance..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-secondary-text shrink-0" />
          <span className="text-xs font-medium text-secondary-text shrink-0">Filter:</span>
          {[
            { id: 'ALL', label: 'All' },
            { id: 'NEW', label: 'New Inbound' },
            { id: 'APPROVED', label: 'Approved' },
            { id: 'IN_SHOP', label: 'In Shop' },
            { id: 'COMPLETED', label: 'Finished' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition shrink-0 ${
                filterStatus === tab.id
                  ? 'bg-brand-primary text-white'
                  : 'bg-bg-light text-secondary-text hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Repairs Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            title="No repair requests found"
            description="No repair requests match your current search or filter criteria."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-primary-text">
              <thead className="bg-bg-light/60 text-xs uppercase text-secondary-text border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3 font-semibold">Repair ID</th>
                  <th className="px-5 py-3 font-semibold">Customer</th>
                  <th className="px-5 py-3 font-semibold">Appliance</th>
                  <th className="px-5 py-3 font-semibold">Issue</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Cost</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((repair) => (
                  <tr key={repair.id} className="hover:bg-gray-50/60 transition">
                    <td className="px-5 py-4 font-bold text-brand-primary text-xs">
                      {repair.id}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-medium text-xs text-primary-text">{repair.customerName}</div>
                      <div className="text-[11px] text-secondary-text">{repair.customerPhone}</div>
                    </td>
                    <td className="px-5 py-4 text-xs">
                      <div className="font-semibold text-primary-text">{repair.brand} {repair.appliance}</div>
                      <div className="text-[11px] text-gray-400">Model: {repair.model || 'N/A'}</div>
                    </td>
                    <td className="px-5 py-4 text-xs text-secondary-text max-w-xs truncate">
                      {repair.issue}
                    </td>
                    <td className="px-5 py-4 text-xs text-secondary-text whitespace-nowrap">
                      {repair.createdAt}
                    </td>
                    <td className="px-5 py-4 text-xs whitespace-nowrap">
                      {repair.cost ? (
                        <span className="font-semibold text-primary-text">₹{repair.cost}</span>
                      ) : (
                        <span className="text-gray-400 italic">Not set</span>
                      )}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <StatusBadge status={repair.status} />
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {repair.status === 'Requested' && (
                          <>
                            <button
                              onClick={() => approveRepair(repair.id)}
                              className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition"
                              title="Approve Request"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => rejectRepair(repair.id)}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg transition"
                              title="Reject Request"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => {
                            setEditingCostRepair(repair);
                            setNewCost(repair.cost ? String(repair.cost) : '');
                          }}
                          className="p-1.5 hover:bg-gray-100 text-secondary-text hover:text-brand-primary rounded-lg transition"
                          title="Update Repair Cost"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setSelectedRepair(repair)}
                          className="p-1.5 hover:bg-gray-100 text-secondary-text hover:text-brand-primary rounded-lg transition"
                          title="View Full Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedRepair && (
        <Modal
          isOpen={!!selectedRepair}
          onClose={() => setSelectedRepair(null)}
          title={`Repair Request – ${selectedRepair.id}`}
        >
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-base text-primary-text">
                  {selectedRepair.brand} {selectedRepair.appliance}
                </h3>
                <p className="text-secondary-text">Registered: {selectedRepair.createdAt}</p>
              </div>
              <StatusBadge status={selectedRepair.status} />
            </div>

            <div className="grid grid-cols-2 gap-3 bg-bg-light/60 p-3 rounded-xl">
              <div>
                <p className="text-secondary-text">Customer Name</p>
                <p className="font-semibold text-primary-text">{selectedRepair.customerName}</p>
              </div>
              <div>
                <p className="text-secondary-text">Phone Number</p>
                <p className="font-semibold text-primary-text">{selectedRepair.customerPhone}</p>
              </div>
              <div>
                <p className="text-secondary-text">Email</p>
                <p className="font-medium text-primary-text">{selectedRepair.customerEmail}</p>
              </div>
              <div>
                <p className="text-secondary-text">Pickup Date</p>
                <p className="font-medium text-primary-text">{selectedRepair.pickupDate}</p>
              </div>
              <div className="col-span-2">
                <p className="text-secondary-text">Address</p>
                <p className="font-medium text-primary-text">{selectedRepair.address}, {selectedRepair.city} - {selectedRepair.pincode}</p>
              </div>
            </div>

            <div>
              <p className="font-semibold text-primary-text mb-1">Reported Problem Description</p>
              <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg text-secondary-text">
                {selectedRepair.issue}
              </div>
            </div>

            {/* Media previews */}
            {selectedRepair.images && selectedRepair.images.length > 0 && (
              <div>
                <p className="font-semibold text-primary-text mb-1.5 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-brand-primary" /> Customer Uploaded Photos ({selectedRepair.images.length})
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {selectedRepair.images.map((img, i) => (
                    <div key={i} className="h-20 rounded-lg overflow-hidden border border-gray-200">
                      <img src={img} alt="Appliance" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Assign Courier Option */}
            <div className="p-3 border border-gray-100 rounded-xl space-y-2">
              <label className="font-semibold text-primary-text block flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-brand-primary" />
                Assign Courier for Pickup / Return
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedCourier}
                  onChange={(e) => setSelectedCourier(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-xs bg-white"
                >
                  {deliveryPersonnel.map((dp) => (
                    <option key={dp.id} value={dp.name}>
                      {dp.name} — ({dp.status})
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => handleAssignDelivery(selectedRepair.id)}
                  className="px-3 py-2 bg-brand-primary text-white font-medium rounded-lg hover:bg-opacity-90"
                >
                  Assign Delivery
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedRepair(null)}
                className="px-4 py-2 bg-gray-100 text-secondary-text rounded-xl hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Cost Modal */}
      {editingCostRepair && (
        <Modal
          isOpen={!!editingCostRepair}
          onClose={() => setEditingCostRepair(null)}
          title={`Set Estimated Repair Cost – ${editingCostRepair.id}`}
        >
          <form onSubmit={handleSaveCost} className="space-y-4">
            <p className="text-xs text-secondary-text">
              Enter the estimated repair charge for {editingCostRepair.brand} {editingCostRepair.appliance}.
              The customer will see this amount and can complete payment.
            </p>
            <div>
              <label className="block text-xs font-medium text-primary-text mb-1">
                Amount in INR (₹)
              </label>
              <input
                type="number"
                value={newCost}
                onChange={(e) => setNewCost(e.target.value)}
                placeholder="e.g. 850"
                required
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingCostRepair(null)}
                className="px-4 py-2 border border-gray-200 rounded-xl text-xs text-secondary-text hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-brand-primary text-white rounded-xl text-xs font-semibold hover:bg-opacity-90"
              >
                Save Cost
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default RepairRequests;
