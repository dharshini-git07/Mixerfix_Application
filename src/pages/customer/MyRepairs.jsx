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
          <h1 className="text-3xl font-black text-slate-900 font-heading">
            My Repairs
          </h1>
          <p className="text-slate-600 text-base font-medium mt-1">
            Real-time progress, technician notes & payment status.
          </p>
        </div>
        <Link
          to="/customer/new-repair"
          className="inline-flex items-center justify-center px-6 py-3 bg-[#087F75] text-white text-sm font-bold rounded-xl hover:bg-[#06635B] transition shadow-md shadow-[#087F75]/20 whitespace-nowrap"
        >
          + Book Repair
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, appliance or brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm font-semibold rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#087F75]/20"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-600 shrink-0" />
          <span className="text-sm font-bold text-slate-700 shrink-0">Filter:</span>
          {['ALL', 'ACTIVE', 'COMPLETED'].map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition shrink-0 ${
                statusFilter === filter
                  ? 'bg-[#087F75] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
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
          actionText="Book a Repair"
          onAction={() => (window.location.href = '/customer/new-repair')}
        />
      ) : (
        <div className="space-y-4">
          {filteredRepairs.map((repair) => (
            <div
              key={repair.id}
              className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200 shadow-sm hover:border-[#087F75]/40 transition space-y-4"
            >
              {/* Card Top: ID, Brand, Date, Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-[#087F75] bg-teal-50 border border-teal-200 px-3 py-1 rounded-md">
                    {repair.id}
                  </span>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg">
                      {repair.brand} {repair.appliance}
                    </h3>
                    <p className="text-sm font-semibold text-slate-600">
                      Booked: {repair.createdAt} • Pickup: {repair.pickupDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={repair.status} />
                  <button
                    onClick={() => setSelectedRepair(repair)}
                    className="p-2 text-slate-600 hover:text-[#087F75] hover:bg-slate-100 rounded-lg transition"
                    title="View Details"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Problem Description */}
              <div className="bg-slate-50 p-3.5 rounded-xl text-sm font-medium text-slate-700 border border-slate-100">
                <span className="font-bold text-slate-900">Issue: </span>
                {repair.issue}
              </div>

              {/* Progress Tracker */}
              <div className="pt-2">
                <ProgressTracker currentStatus={repair.status} />
              </div>

              {/* Bottom Details & Actions */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-sm font-semibold">
                <div className="flex items-center gap-5">
                  <div>
                    <span className="text-slate-500">Estimate: </span>
                    <span className="font-extrabold text-[#087F75]">
                      {repair.cost ? `₹${repair.cost}` : 'Pending Inspection'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Payment: </span>
                    <span
                      className={`font-extrabold ${
                        repair.paymentStatus === 'Paid'
                          ? 'text-emerald-700'
                          : repair.cost
                          ? 'text-amber-700'
                          : 'text-slate-600'
                      }`}
                    >
                      {repair.paymentStatus || 'Pending'}
                    </span>
                  </div>
                  {repair.assignedCourier && (
                    <div className="hidden sm:inline">
                      <span className="text-slate-500">Courier: </span>
                      <span className="font-bold text-slate-800">{repair.assignedCourier}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2.5">
                  {/* Chat button */}
                  <Link
                    to="/customer/chat"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:text-[#087F75] hover:border-[#087F75] text-sm font-bold transition"
                  >
                    <MessageSquare className="w-4 h-4" /> Chat
                  </Link>

                  {/* Pay button */}
                  {repair.cost && repair.paymentStatus !== 'Paid' && (
                    <Link
                      to={`/customer/payments?repairId=${repair.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition shadow-sm"
                    >
                      <CreditCard className="w-4 h-4" /> Pay ₹{repair.cost}
                    </Link>
                  )}

                  {/* Details modal trigger */}
                  <button
                    onClick={() => setSelectedRepair(repair)}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-[#087F75] text-white text-sm font-bold hover:bg-[#06635B] transition shadow-xs cursor-pointer"
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
