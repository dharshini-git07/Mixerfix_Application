import React, { useState } from 'react';
import { 
  IndianRupee, 
  Receipt, 
  CheckCircle, 
  Clock, 
  Search, 
  Download, 
  AlertCircle 
} from 'lucide-react';
import { useRepairs } from '../../context/RepairContext';
import StatCard from '../../components/common/StatCard';

const OwnerPayments = () => {
  const { payments, repairs } = useRepairs();
  const [searchTerm, setSearchTerm] = useState('');

  const totalCollected = payments.reduce((acc, p) => acc + (p.amount || 0), 0);
  const pendingReceivables = repairs
    .filter((r) => r.cost && r.paymentStatus !== 'Paid')
    .reduce((acc, r) => acc + (r.cost || 0), 0);

  const filteredPayments = payments.filter(
    (p) =>
      (p.id || p.paymentId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.repairId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.method || p.paymentMethod || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-primary-text font-heading">
          Financial Ledger & Invoice Records
        </h1>
        <p className="text-secondary-text text-sm mt-1">
          Monitor shop collections, simulated payments, and outstanding receivables across repair tickets.
        </p>
      </div>

      {/* Simulated alert */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-amber-800 text-xs">
        <AlertCircle className="w-5 h-5 text-warning-text shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Sandbox Demonstration Mode:</span> All transaction entries, UPI settlements, and receipts displayed here are generated through mock simulation for frontend workflow validation.
        </div>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Realized Revenue"
          value={`₹${totalCollected}`}
          icon={IndianRupee}
          color="primary"
          subtitle="Paid transactions"
        />
        <StatCard
          title="Pending Receivables"
          value={`₹${pendingReceivables}`}
          icon={Clock}
          color="warning"
          subtitle="Quoted, awaiting customer payment"
        />
        <StatCard
          title="Settled Invoices"
          value={payments.length}
          icon={CheckCircle}
          color="success"
          subtitle="Completed receipts"
        />
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden space-y-4 p-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by transaction or repair ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            />
          </div>
          <span className="text-xs text-secondary-text">
            Showing <span className="font-semibold text-primary-text">{filteredPayments.length}</span> entries
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-primary-text">
            <thead className="bg-bg-light/60 text-xs uppercase text-secondary-text border-b border-gray-100">
              <tr>
                <th className="px-5 py-3 font-semibold">Tx ID</th>
                <th className="px-5 py-3 font-semibold">Repair Ticket</th>
                <th className="px-5 py-3 font-semibold">Amount</th>
                <th className="px-5 py-3 font-semibold">Method</th>
                <th className="px-5 py-3 font-semibold">Settled Date</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPayments.map((p) => (
                <tr key={p.id || p.paymentId} className="hover:bg-gray-50/60 transition text-xs">
                  <td className="px-5 py-3.5 font-bold text-brand-primary">
                    {p.id || p.paymentId}
                  </td>
                  <td className="px-5 py-3.5 font-medium text-primary-text">
                    {p.repairId}
                  </td>
                  <td className="px-5 py-3.5 font-bold text-emerald-700 text-sm">
                    ₹{p.amount}
                  </td>
                  <td className="px-5 py-3.5 text-secondary-text font-medium">
                    <span className="inline-flex items-center gap-1">
                      {p.method || p.paymentMethod || 'Razorpay Standard'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-secondary-text">
                    {p.date || p.paymentDate?.toString().slice(0, 10)}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-semibold rounded-md border border-emerald-200">
                      {p.status || p.paymentStatus || 'Paid'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OwnerPayments;
