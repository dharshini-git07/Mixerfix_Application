import React, { useState } from 'react';
import { 
  Truck, 
  UserCheck, 
  MapPin, 
  Phone, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  PackageCheck
} from 'lucide-react';
import { useRepairs } from '../../context/RepairContext';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';

const DeliveryManagement = () => {
  const { 
    repairs, 
    deliveryPersonnel, 
    assignCourier, 
    updateStatus 
  } = useRepairs();

  const [selectedRepair, setSelectedRepair] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(deliveryPersonnel[0].name);

  // Unassigned pickups or pending dispatches
  const pendingAssignments = repairs.filter(
    (r) => r.status === 'Approved' || (r.status === 'Completed' && !r.assignedCourier)
  );

  // Active deliveries currently out on road
  const activeDeliveries = repairs.filter(
    (r) => ['Pickup Assigned', 'Collected', 'Out for Delivery'].includes(r.status)
  );

  const handleAssign = (repairId) => {
    assignCourier(repairId, selectedDriver);
    setSelectedRepair(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-primary-text font-heading">
          Courier Fleet & Dispatch Management
        </h1>
        <p className="text-secondary-text text-sm mt-1">
          Coordinate pickup from customer doorsteps and schedule appliance returns upon repair completion.
        </p>
      </div>

      {/* Fleet Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {deliveryPersonnel.map((dp) => {
          // Count active assignments for this courier
          const activeTasks = repairs.filter(
            (r) => r.assignedCourier === dp.name && r.status !== 'Delivered'
          ).length;

          return (
            <div
              key={dp.id}
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm">
                    {dp.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-primary-text text-sm">{dp.name}</h3>
                    <p className="text-xs text-secondary-text flex items-center gap-1">
                      <Phone className="w-3 h-3 text-brand-primary" /> {dp.phone}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                  {dp.status}
                </span>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-secondary-text">
                <span>Active Live Tasks:</span>
                <span className="font-bold text-brand-primary bg-brand-accent px-2 py-0.5 rounded-md">
                  {activeTasks} jobs
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pending Dispatch Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-primary-text text-base flex items-center gap-2">
            <Clock className="w-4 h-4 text-warning-text" />
            Orders Ready for Driver Assignment ({pendingAssignments.length})
          </h2>
          <span className="text-xs text-secondary-text">Requires courier dispatch</span>
        </div>

        {pendingAssignments.length === 0 ? (
          <div className="p-6 text-center text-xs text-secondary-text bg-bg-light/50 rounded-xl">
            ✨ All approved orders and completed repairs have been assigned to couriers!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingAssignments.map((repair) => {
              const isPickup = repair.status === 'Approved';

              return (
                <div
                  key={repair.id}
                  className="p-4 rounded-xl border border-gray-100 hover:border-brand-primary/30 transition bg-bg-light/30 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-primary bg-brand-accent px-2 py-0.5 rounded">
                      {repair.id}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        isPickup ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {isPickup ? 'Needs Pickup' : 'Ready for Return'}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-semibold text-primary-text text-sm">
                      {repair.brand} {repair.appliance}
                    </h4>
                    <p className="text-xs text-secondary-text mt-0.5">
                      Customer: {repair.customerName} ({repair.customerPhone})
                    </p>
                    <p className="text-xs text-secondary-text mt-0.5 flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-brand-primary shrink-0 mt-0.5" />
                      <span>{repair.address}, {repair.city}</span>
                    </p>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                    <span className="text-xs text-secondary-text">Date: {repair.pickupDate}</span>
                    <button
                      onClick={() => setSelectedRepair(repair)}
                      className="px-3 py-1.5 bg-brand-primary text-white text-xs font-semibold rounded-lg hover:bg-opacity-90 flex items-center gap-1 transition"
                    >
                      <UserCheck className="w-3.5 h-3.5" /> Assign Driver
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Active In-Transit Shipments */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-bold text-primary-text text-base flex items-center gap-2">
            <Truck className="w-4 h-4 text-brand-primary" />
            Live In-Transit Tasks ({activeDeliveries.length})
          </h2>
        </div>

        {activeDeliveries.length === 0 ? (
          <div className="p-6 text-center text-xs text-secondary-text">
            No courier deliveries currently in transit.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-primary-text">
              <thead className="bg-bg-light/60 text-xs uppercase text-secondary-text border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 font-semibold">Repair ID</th>
                  <th className="px-6 py-3 font-semibold">Driver</th>
                  <th className="px-6 py-3 font-semibold">Customer & Address</th>
                  <th className="px-6 py-3 font-semibold">Stage</th>
                  <th className="px-6 py-3 font-semibold text-right">Quick Transition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {activeDeliveries.map((repair) => (
                  <tr key={repair.id} className="hover:bg-gray-50/60 transition">
                    <td className="px-6 py-4 font-bold text-brand-primary text-xs">
                      {repair.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-xs text-primary-text">{repair.assignedCourier || 'Assigned'}</div>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <div className="font-medium text-primary-text">{repair.customerName}</div>
                      <div className="text-[11px] text-secondary-text truncate max-w-xs">{repair.address}</div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={repair.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      {repair.status === 'Pickup Assigned' && (
                        <button
                          onClick={() => updateStatus(repair.id, 'Collected')}
                          className="px-2.5 py-1 text-xs bg-brand-accent text-brand-primary font-semibold rounded-lg hover:bg-brand-primary hover:text-white transition"
                        >
                          Mark Collected
                        </button>
                      )}
                      {repair.status === 'Collected' && (
                        <button
                          onClick={() => updateStatus(repair.id, 'At Shop')}
                          className="px-2.5 py-1 text-xs bg-emerald-50 text-emerald-700 font-semibold rounded-lg hover:bg-emerald-600 hover:text-white transition"
                        >
                          Receive At Shop
                        </button>
                      )}
                      {repair.status === 'Out for Delivery' && (
                        <button
                          onClick={() => updateStatus(repair.id, 'Delivered')}
                          className="px-2.5 py-1 text-xs bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition"
                        >
                          Mark Delivered
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Assignment Modal */}
      {selectedRepair && (
        <Modal
          isOpen={!!selectedRepair}
          onClose={() => setSelectedRepair(null)}
          title={`Assign Courier: ${selectedRepair.id}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-bg-light/60 rounded-xl space-y-1">
              <p className="font-bold text-primary-text text-sm">
                {selectedRepair.brand} {selectedRepair.appliance}
              </p>
              <p className="text-secondary-text">Customer: {selectedRepair.customerName} ({selectedRepair.customerPhone})</p>
              <p className="text-secondary-text">Address: {selectedRepair.address}, {selectedRepair.city}</p>
            </div>

            <div>
              <label className="block font-semibold text-primary-text mb-1">
                Select Delivery Personnel
              </label>
              <select
                value={selectedDriver}
                onChange={(e) => setSelectedDriver(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary"
              >
                {deliveryPersonnel.map((dp) => (
                  <option key={dp.id} value={dp.name}>
                    {dp.name} ({dp.phone}) — Status: {dp.status}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedRepair(null)}
                className="px-4 py-2 border border-gray-200 text-secondary-text rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleAssign(selectedRepair.id)}
                className="px-4 py-2 bg-brand-primary text-white font-semibold rounded-xl hover:bg-opacity-90"
              >
                Confirm Assignment
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DeliveryManagement;
