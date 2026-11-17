import React, { useState } from 'react';
import { 
  CheckCircle, 
  Wrench, 
  Truck, 
  Clock, 
  Play, 
  CheckSquare, 
  Eye, 
  AlertCircle 
} from 'lucide-react';
import { useRepairs } from '../../context/RepairContext';
import StatusBadge from '../../components/common/StatusBadge';
import ProgressTracker from '../../components/common/ProgressTracker';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';

const ApprovedRequests = () => {
  const { repairs, updateStatus, assignCourier, deliveryPersonnel } = useRepairs();
  const [selectedRepair, setSelectedRepair] = useState(null);
  const [courierName, setCourierName] = useState(deliveryPersonnel[0].name);

  // Filter approved or active workbench items
  const approvedList = repairs.filter((r) =>
    ['Approved', 'Pickup Assigned', 'Collected', 'At Shop', 'Repair in Progress', 'Completed'].includes(r.status)
  );

  const handleNextStatus = (repair) => {
    const transitions = {
      Approved: 'Pickup Assigned',
      'Pickup Assigned': 'Collected',
      Collected: 'At Shop',
      'At Shop': 'Repair in Progress',
      'Repair in Progress': 'Completed',
      Completed: 'Out for Delivery',
    };

    const next = transitions[repair.status];
    if (next) {
      if (next === 'Pickup Assigned' && !repair.assignedCourier) {
        assignCourier(repair.id, courierName);
      } else {
        updateStatus(repair.id, next);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-primary-text font-heading">
          Approved Workbench & Active Pipeline
        </h1>
        <p className="text-secondary-text text-sm mt-1">
          Monitor approved repair orders, advance workbench stages, and coordinate fulfillment.
        </p>
      </div>

      {/* List */}
      {approvedList.length === 0 ? (
        <EmptyState
          title="No approved requests yet"
          description="Approve incoming repair tickets from the Repair Requests tab to queue them on the workbench."
        />
      ) : (
        <div className="space-y-4">
          {approvedList.map((repair) => (
            <div
              key={repair.id}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4 hover:border-brand-primary/30 transition"
            >
              {/* Card top */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-brand-primary bg-brand-accent px-2.5 py-1 rounded-md">
                    {repair.id}
                  </span>
                  <div>
                    <h3 className="font-bold text-primary-text text-base">
                      {repair.brand} {repair.appliance}
                    </h3>
                    <p className="text-xs text-secondary-text">
                      Customer: {repair.customerName} ({repair.customerPhone}) • Approved: {repair.createdAt}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={repair.status} />
                  <button
                    onClick={() => setSelectedRepair(repair)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg text-secondary-text hover:text-brand-primary"
                    title="View Full History"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress tracker */}
              <ProgressTracker currentStatus={repair.status} />

              {/* Action and detail row */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-4 text-secondary-text">
                  <div>
                    <span>Est. Cost: </span>
                    <span className="font-semibold text-primary-text">
                      {repair.cost ? `₹${repair.cost}` : 'TBD'}
                    </span>
                  </div>
                  <div>
                    <span>Payment: </span>
                    <span className={repair.paymentStatus === 'Paid' ? 'text-success-text font-semibold' : 'text-warning-text font-semibold'}>
                      {repair.paymentStatus || 'Pending'}
                    </span>
                  </div>
                  <div>
                    <span>Assigned Courier: </span>
                    <span className="font-medium text-brand-secondary">
                      {repair.assignedCourier || 'None'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Status advance button */}
                  {repair.status === 'Approved' && (
                    <div className="flex items-center gap-2">
                      <select
                        value={courierName}
                        onChange={(e) => setCourierName(e.target.value)}
                        className="px-2 py-1.5 rounded-lg border border-gray-200 text-xs bg-white"
                      >
                        {deliveryPersonnel.map((d) => (
                          <option key={d.id} value={d.name}>{d.name}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => {
                          assignCourier(repair.id, courierName);
                        }}
                        className="px-3 py-1.5 bg-brand-primary text-white text-xs font-semibold rounded-lg hover:bg-opacity-90 flex items-center gap-1.5"
                      >
                        <Truck className="w-3.5 h-3.5" /> Assign Pickup Courier
                      </button>
                    </div>
                  )}

                  {repair.status === 'Collected' && (
                    <button
                      onClick={() => updateStatus(repair.id, 'At Shop')}
                      className="px-3 py-1.5 bg-brand-primary text-white text-xs font-semibold rounded-lg hover:bg-opacity-90"
                    >
                      Receive At Shop
                    </button>
                  )}

                  {repair.status === 'At Shop' && (
                    <button
                      onClick={() => updateStatus(repair.id, 'Repair in Progress')}
                      className="px-3 py-1.5 bg-amber-600 text-white text-xs font-semibold rounded-lg hover:bg-opacity-90 flex items-center gap-1"
                    >
                      <Play className="w-3.5 h-3.5" /> Start Repair
                    </button>
                  )}

                  {repair.status === 'Repair in Progress' && (
                    <button
                      onClick={() => updateStatus(repair.id, 'Completed')}
                      className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-opacity-90 flex items-center gap-1"
                    >
                      <CheckSquare className="w-3.5 h-3.5" /> Mark Repaired
                    </button>
                  )}

                  {repair.status === 'Completed' && (
                    <button
                      onClick={() => updateStatus(repair.id, 'Out for Delivery')}
                      className="px-3 py-1.5 bg-brand-primary text-white text-xs font-semibold rounded-lg hover:bg-opacity-90 flex items-center gap-1"
                    >
                      <Truck className="w-3.5 h-3.5" /> Dispatch for Return
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {selectedRepair && (
        <Modal
          isOpen={!!selectedRepair}
          onClose={() => setSelectedRepair(null)}
          title={`Workbench Specs – ${selectedRepair.id}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-bg-light/60 rounded-xl space-y-2">
              <div className="flex justify-between font-bold text-sm text-primary-text">
                <span>{selectedRepair.brand} {selectedRepair.appliance}</span>
                <StatusBadge status={selectedRepair.status} />
              </div>
              <p className="text-secondary-text">Issue Reported: {selectedRepair.issue}</p>
              <p className="text-secondary-text">Pickup Address: {selectedRepair.address}, {selectedRepair.city}</p>
              <p className="text-secondary-text">Customer: {selectedRepair.customerName} ({selectedRepair.customerPhone})</p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedRepair(null)}
                className="px-4 py-2 bg-brand-primary text-white rounded-xl text-xs font-medium"
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

export default ApprovedRequests;
