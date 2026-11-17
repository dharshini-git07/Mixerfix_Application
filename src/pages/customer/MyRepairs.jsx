import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Eye, 
  MessageSquare, 
  CreditCard, 
  Calendar, 
  MapPin, 
  Wrench, 
  CheckCircle,
  Truck,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRepairs } from '../../context/RepairContext';
import StatusBadge from '../../components/common/StatusBadge';
import ProgressTracker from '../../components/common/ProgressTracker';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';

const MyRepairs = () => {
  const { currentUser } = useAuth();
  const { repairs } = useRepairs();

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedRepair, setSelectedRepair] = useState(null);

  // Filter repairs belonging to this customer
  const customerRepairs = repairs.filter(
    (r) => r.customerId === currentUser?.id || r.customerEmail === currentUser?.email
  );

  const filteredRepairs = customerRepairs.filter((repair) => {
    const matchesSearch =
      repair.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repair.appliance.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repair.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repair.issue.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && repair.status !== 'Delivered' && repair.status !== 'Rejected') ||
      (statusFilter === 'COMPLETED' && repair.status === 'Delivered') ||
      repair.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary-text font-heading">
            My Repair Requests
          </h1>
          <p className="text-secondary-text text-sm mt-1">
            Track real-time progress, technician notes, and payment status for all your appliances.
          </p>
        </div>
        <Link
          to="/customer/new-repair"
          className="inline-flex items-center justify-center px-4 py-2.5 bg-brand-primary text-white text-sm font-medium rounded-xl hover:bg-opacity-90 transition shadow-sm whitespace-nowrap"
        >
          + New Repair
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, brand or appliance..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-secondary-text shrink-0" />
          <span className="text-xs font-medium text-secondary-text shrink-0">Filter:</span>
          {['ALL', 'ACTIVE', 'COMPLETED'].map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition shrink-0 ${
                statusFilter === filter
                  ? 'bg-brand-primary text-white'
                  : 'bg-bg-light text-secondary-text hover:bg-gray-100'
              }`}
            >
              {filter === 'ALL' ? 'All Repairs' : filter === 'ACTIVE' ? 'In Progress' : 'Delivered'}
            </button>
          ))}
        </div>
      </div>

      {/* Repairs List */}
      {filteredRepairs.length === 0 ? (
        <EmptyState
          title="No repair requests found"
          description={
            searchTerm || statusFilter !== 'ALL'
              ? 'Try adjusting your search criteria or filters.'
              : 'You have not booked any appliance repairs yet.'
          }
          actionLabel="Book a Repair"
          onAction={() => (window.location.href = '/customer/new-repair')}
        />
      ) : (
        <div className="space-y-4">
          {filteredRepairs.map((repair) => (
            <div
              key={repair.id}
              className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm hover:border-brand-primary/30 transition space-y-4"
            >
              {/* Card Top: ID, Brand, Date, Badge */}
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
                      Requested on {repair.createdAt} • Pickup: {repair.pickupDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={repair.status} />
                  <button
                    onClick={() => setSelectedRepair(repair)}
                    className="p-2 text-secondary-text hover:text-brand-primary hover:bg-bg-light rounded-lg transition"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Problem Description */}
              <div className="bg-bg-light/60 p-3 rounded-xl text-xs text-secondary-text">
                <span className="font-semibold text-primary-text">Reported Issue: </span>
                {repair.issue}
              </div>

              {/* Progress Tracker */}
              <div className="pt-2">
                <ProgressTracker currentStatus={repair.status} />
              </div>

              {/* Bottom Details & Actions */}
              <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-5">
                  <div>
                    <span className="text-secondary-text">Estimated Cost: </span>
                    <span className="font-semibold text-primary-text">
                      {repair.cost ? `₹${repair.cost}` : 'Pending Inspection'}
                    </span>
                  </div>
                  <div>
                    <span className="text-secondary-text">Payment: </span>
                    <span
                      className={`font-semibold ${
                        repair.paymentStatus === 'Paid'
                          ? 'text-success-text'
                          : repair.cost
                          ? 'text-warning-text'
                          : 'text-secondary-text'
                      }`}
                    >
                      {repair.paymentStatus || 'Pending'}
                    </span>
                  </div>
                  {repair.assignedCourier && (
                    <div className="hidden sm:inline">
                      <span className="text-secondary-text">Courier: </span>
                      <span className="font-medium text-brand-secondary">{repair.assignedCourier}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Chat button */}
                  <Link
                    to="/customer/chat"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-secondary-text hover:text-brand-primary hover:border-brand-primary text-xs font-medium transition"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Chat
                  </Link>

                  {/* Pay button (enabled if cost is set and not paid) */}
                  {repair.cost && repair.paymentStatus !== 'Paid' && (
                    <Link
                      to={`/customer/payments?repairId=${repair.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition shadow-sm"
                    >
                      <CreditCard className="w-3.5 h-3.5" /> Pay ₹{repair.cost}
                    </Link>
                  )}

                  {/* Details modal trigger */}
                  <button
                    onClick={() => setSelectedRepair(repair)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-primary text-white text-xs font-medium hover:bg-opacity-90 transition"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Repair Detail Modal */}
      {selectedRepair && (
        <Modal
          isOpen={!!selectedRepair}
          onClose={() => setSelectedRepair(null)}
          title={`Repair Details – ${selectedRepair.id}`}
        >
          <div className="space-y-5">
            {/* Top overview */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-primary-text text-lg">
                  {selectedRepair.brand} {selectedRepair.appliance}
                </h3>
                <p className="text-xs text-secondary-text">Model: {selectedRepair.model || 'Standard'}</p>
              </div>
              <StatusBadge status={selectedRepair.status} />
            </div>

            {/* Tracker in modal */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-secondary-text mb-3">
                Current Repair Phase
              </p>
              <ProgressTracker currentStatus={selectedRepair.status} />
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-bg-light/60 p-4 rounded-xl">
              <div>
                <p className="text-secondary-text">Customer Name</p>
                <p className="font-semibold text-primary-text">{selectedRepair.customerName}</p>
              </div>
              <div>
                <p className="text-secondary-text">Contact Phone</p>
                <p className="font-semibold text-primary-text">{selectedRepair.customerPhone}</p>
              </div>
              <div>
                <p className="text-secondary-text">Pickup Address</p>
                <p className="font-medium text-primary-text">{selectedRepair.address}, {selectedRepair.city} - {selectedRepair.pincode}</p>
              </div>
              <div>
                <p className="text-secondary-text">Preferred Pickup Date</p>
                <p className="font-medium text-primary-text">{selectedRepair.pickupDate}</p>
              </div>
              <div>
                <p className="text-secondary-text">Estimated Repair Cost</p>
                <p className="font-bold text-brand-primary text-sm">
                  {selectedRepair.cost ? `₹${selectedRepair.cost}` : 'Pending inspection'}
                </p>
              </div>
              <div>
                <p className="text-secondary-text">Payment Status</p>
                <p className="font-semibold text-primary-text">{selectedRepair.paymentStatus || 'Pending'}</p>
              </div>
              {selectedRepair.assignedCourier && (
                <div className="col-span-2">
                  <p className="text-secondary-text">Assigned Delivery Executive</p>
                  <p className="font-medium text-brand-secondary">{selectedRepair.assignedCourier}</p>
                </div>
              )}
            </div>

            {/* Issue Description */}
            <div>
              <h4 className="text-xs font-semibold text-primary-text mb-1">Issue Description</h4>
              <p className="text-xs text-secondary-text bg-gray-50 p-3 rounded-lg border border-gray-100">
                {selectedRepair.issue}
              </p>
            </div>

            {/* Uploaded Media */}
            {selectedRepair.images && selectedRepair.images.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-primary-text mb-2">Attached Photos</h4>
                <div className="grid grid-cols-3 gap-2">
                  {selectedRepair.images.map((img, i) => (
                    <div key={i} className="h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                      <img src={img} alt="Appliance" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal actions */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
              <Link
                to="/customer/chat"
                className="px-4 py-2 border border-gray-200 text-secondary-text hover:text-brand-primary text-xs font-medium rounded-xl transition"
              >
                Chat with Shop
              </Link>
              {selectedRepair.cost && selectedRepair.paymentStatus !== 'Paid' && (
                <Link
                  to={`/customer/payments?repairId=${selectedRepair.id}`}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-xl transition"
                >
                  Proceed to Payment
                </Link>
              )}
              <button
                onClick={() => setSelectedRepair(null)}
                className="px-4 py-2 bg-brand-primary text-white text-xs font-medium rounded-xl hover:bg-opacity-90 transition"
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

export default MyRepairs;
