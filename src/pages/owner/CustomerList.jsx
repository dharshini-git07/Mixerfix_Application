import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  Wrench, 
  Eye, 
  Clock 
} from 'lucide-react';
import { useRepairs } from '../../context/RepairContext';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';

const CustomerList = () => {
  const { repairs } = useRepairs();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Group unique customers from repairs
  const customerMap = repairs.reduce((acc, r) => {
    const key = r.customerEmail || r.customerName;
    if (!acc[key]) {
      acc[key] = {
        name: r.customerName,
        email: r.customerEmail,
        phone: r.customerPhone,
        address: `${r.address}, ${r.city} - ${r.pincode}`,
        repairs: [],
        totalSpent: 0,
      };
    }
    acc[key].repairs.push(r);
    if (r.cost && r.paymentStatus === 'Paid') {
      acc[key].totalSpent += r.cost;
    }
    return acc;
  }, {});

  const customerList = Object.values(customerMap);

  const filtered = customerList.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-primary-text font-heading">
          Customer Directory & Records
        </h1>
        <p className="text-secondary-text text-sm mt-1">
          Review customer service history, contact information, and warranty lifecycle.
        </p>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer name, email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          />
        </div>
        <div className="text-xs text-secondary-text hidden sm:block">
          Total Registered: <span className="font-semibold text-primary-text">{customerList.length}</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-primary-text">
            <thead className="bg-bg-light/60 text-xs uppercase text-secondary-text border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 font-semibold">Customer</th>
                <th className="px-6 py-3 font-semibold">Contact</th>
                <th className="px-6 py-3 font-semibold">Primary Address</th>
                <th className="px-6 py-3 font-semibold text-center">Total Repairs</th>
                <th className="px-6 py-3 font-semibold">Lifetime Spend</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((cust, idx) => (
                <tr key={idx} className="hover:bg-gray-50/60 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand-accent text-brand-primary font-bold flex items-center justify-center text-sm">
                        {cust.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-primary-text">{cust.name}</div>
                        <div className="text-xs text-secondary-text">{cust.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <div className="flex items-center gap-1.5 text-primary-text font-medium">
                      <Phone className="w-3.5 h-3.5 text-brand-primary" /> {cust.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-secondary-text max-w-xs truncate">
                    {cust.address}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block px-2.5 py-0.5 bg-brand-accent/60 text-brand-primary font-bold text-xs rounded-full">
                      {cust.repairs.length}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-primary-text">
                    ₹{cust.totalSpent}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedCustomer(cust)}
                      className="px-3 py-1.5 bg-bg-light hover:bg-brand-primary hover:text-white rounded-lg text-xs font-medium text-secondary-text transition inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> History
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer History Modal */}
      {selectedCustomer && (
        <Modal
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          title={`Service History: ${selectedCustomer.name}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-bg-light/60 rounded-xl space-y-1">
              <div className="flex justify-between font-bold text-sm text-primary-text">
                <span>{selectedCustomer.name}</span>
                <span className="text-brand-primary font-bold">Spent: ₹{selectedCustomer.totalSpent}</span>
              </div>
              <p className="text-secondary-text">Email: {selectedCustomer.email} • Phone: {selectedCustomer.phone}</p>
              <p className="text-secondary-text">Address: {selectedCustomer.address}</p>
            </div>

            <h4 className="font-semibold text-primary-text text-xs uppercase tracking-wider">
              Recorded Repair Tickets ({selectedCustomer.repairs.length})
            </h4>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {selectedCustomer.repairs.map((r) => (
                <div key={r.id} className="p-3 rounded-lg border border-gray-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-brand-primary">{r.id}</span>
                      <span className="font-medium text-primary-text">{r.brand} {r.appliance}</span>
                    </div>
                    <p className="text-secondary-text text-[11px] mt-0.5">{r.issue}</p>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={r.status} />
                    <p className="text-[11px] font-semibold text-primary-text mt-1">
                      {r.cost ? `₹${r.cost}` : 'TBD'}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 bg-brand-primary text-white rounded-xl text-xs font-medium hover:bg-opacity-90"
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

export default CustomerList;
