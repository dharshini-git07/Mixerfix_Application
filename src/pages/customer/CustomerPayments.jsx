import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  CreditCard, 
  Smartphone, 
  Banknote, 
  CheckCircle, 
  AlertCircle, 
  ShieldCheck, 
  Receipt, 
  Clock, 
  ArrowRight 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRepairs } from '../../context/RepairContext';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';

const CustomerPayments = () => {
  const { currentUser } = useAuth();
  const { repairs, payments, processPayment } = useRepairs();
  const [searchParams] = useSearchParams();

  // Find repairs that belong to this customer
  const myRepairs = repairs.filter(
    (r) => r.customerId === currentUser?.id || r.customerEmail === currentUser?.email
  );

  // Filter payable repairs (has cost and not paid)
  const payableRepairs = myRepairs.filter((r) => r.cost && r.paymentStatus !== 'Paid');
  const myTransactions = payments.filter((p) => myRepairs.some((r) => r.id === p.repairId));

  // Selected repair to pay
  const [selectedRepairId, setSelectedRepairId] = useState(
    searchParams.get('repairId') || (payableRepairs.length > 0 ? payableRepairs[0].id : '')
  );

  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [upiId, setUpiId] = useState('user@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8892');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('•••');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState(null);

  useEffect(() => {
    const qId = searchParams.get('repairId');
    if (qId) setSelectedRepairId(qId);
  }, [searchParams]);

  const activePayable = myRepairs.find((r) => r.id === selectedRepairId);

  const handleSimulatePayment = (e) => {
    e.preventDefault();
    if (!activePayable) return;

    setIsProcessing(true);

    setTimeout(() => {
      const receipt = processPayment({
        repairId: activePayable.id,
        amount: activePayable.cost,
        method: paymentMethod,
      });

      setIsProcessing(false);
      setSuccessReceipt(receipt);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-primary-text font-heading">
          Service Payments & Invoices
        </h1>
        <p className="text-secondary-text text-sm mt-1">
          Review repair quotes, complete mock settlements, and access instant receipts.
        </p>
      </div>

      {/* Simulated Sandbox Warning Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-amber-800">
        <AlertCircle className="w-5 h-5 text-warning-text shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <span className="font-bold">Sandbox Demonstration Mode:</span> This is a mock payment gateway.
          No actual credit card, bank charge, or UPI debit will be incurred. All transactions are simulated for testing the Mixer Fix repair lifecycle.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Payment Checkout Module */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
            <h2 className="font-bold text-primary-text text-base flex items-center justify-between">
              <span>Checkout & Payment</span>
              <span className="text-xs font-normal text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 256-Bit SSL Demo
              </span>
            </h2>

            {/* Select Repair Order */}
            <div>
              <label className="block text-xs font-medium text-primary-text mb-1.5">
                Select Pending Repair Order
              </label>
              {payableRepairs.length === 0 ? (
                <div className="p-4 bg-bg-light/60 rounded-xl text-center text-xs text-secondary-text">
                  🎉 You have no outstanding bills to pay! All repairs are either paid or pending shop inspection.
                </div>
              ) : (
                <select
                  value={selectedRepairId}
                  onChange={(e) => setSelectedRepairId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 bg-white"
                >
                  {payableRepairs.map((repair) => (
                    <option key={repair.id} value={repair.id}>
                      {repair.id} — {repair.brand} {repair.appliance} (₹{repair.cost})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Cost Breakdown if selected */}
            {activePayable && activePayable.paymentStatus !== 'Paid' && (
              <div className="bg-bg-light/50 p-4 rounded-xl border border-gray-100 space-y-2 text-xs">
                <div className="flex justify-between text-secondary-text">
                  <span>Appliance & Issue:</span>
                  <span className="font-medium text-primary-text">{activePayable.brand} {activePayable.appliance}</span>
                </div>
                <div className="flex justify-between text-secondary-text">
                  <span>Technician Labor & Diagnosis:</span>
                  <span className="font-medium text-primary-text">₹{Math.round(activePayable.cost * 0.4)}</span>
                </div>
                <div className="flex justify-between text-secondary-text">
                  <span>Replaced Parts & Consumables:</span>
                  <span className="font-medium text-primary-text">₹{Math.round(activePayable.cost * 0.6)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between text-sm font-bold text-primary-text">
                  <span>Total Amount Due:</span>
                  <span className="text-brand-primary">₹{activePayable.cost}</span>
                </div>
              </div>
            )}

            {/* Payment Method Selector */}
            {activePayable && activePayable.paymentStatus !== 'Paid' && (
              <form onSubmit={handleSimulatePayment} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-medium text-primary-text mb-2">
                    Select Simulated Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('UPI')}
                      className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                        paymentMethod === 'UPI'
                          ? 'border-brand-primary bg-brand-accent/30 text-brand-primary font-semibold'
                          : 'border-gray-200 text-secondary-text hover:bg-gray-50'
                      }`}
                    >
                      <Smartphone className="w-5 h-5" />
                      <span className="text-xs">UPI App</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('Card')}
                      className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                        paymentMethod === 'Card'
                          ? 'border-brand-primary bg-brand-accent/30 text-brand-primary font-semibold'
                          : 'border-gray-200 text-secondary-text hover:bg-gray-50'
                      }`}
                    >
                      <CreditCard className="w-5 h-5" />
                      <span className="text-xs">Debit / Credit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('Cash on Delivery')}
                      className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                        paymentMethod === 'Cash on Delivery'
                          ? 'border-brand-primary bg-brand-accent/30 text-brand-primary font-semibold'
                          : 'border-gray-200 text-secondary-text hover:bg-gray-50'
                      }`}
                    >
                      <Banknote className="w-5 h-5" />
                      <span className="text-xs">Pay on Return</span>
                    </button>
                  </div>
                </div>

                {/* Conditional fields for method */}
                {paymentMethod === 'UPI' && (
                  <div className="space-y-2 bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                    <label className="block text-xs font-medium text-primary-text">
                      Virtual Payment Address (VPA / UPI ID)
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. mobile@upi or name@okaxis"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 bg-white"
                    />
                    <p className="text-[11px] text-secondary-text">Google Pay, PhonePe, Paytm, BHIM</p>
                  </div>
                )}

                {paymentMethod === 'Card' && (
                  <div className="space-y-3 bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                    <div>
                      <label className="block text-xs font-medium text-primary-text mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 bg-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-primary-text mb-1">
                          Expiry MM/YY
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-primary-text mb-1">
                          CVV
                        </label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          maxLength={3}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'Cash on Delivery' && (
                  <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 text-xs text-secondary-text">
                    💵 You can pay cash directly to the delivery personnel upon inspection and delivery of your appliance.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-opacity-90 transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Authorizing Simulated Payment...
                    </>
                  ) : (
                    `Pay ₹${activePayable.cost} (Simulated)`
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Transaction History */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-primary-text text-sm flex items-center gap-2">
              <Receipt className="w-4 h-4 text-brand-primary" />
              Payment Records & Receipts
            </h3>

            {myTransactions.length === 0 ? (
              <p className="text-xs text-secondary-text py-4 text-center">
                No past transactions recorded yet.
              </p>
            ) : (
              <div className="space-y-3">
                {myTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3.5 rounded-xl border border-gray-100 hover:border-brand-primary/30 transition bg-bg-light/40 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-brand-primary">{tx.id}</span>
                      <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {tx.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-secondary-text">Repair ID: {tx.repairId}</span>
                      <span className="font-bold text-primary-text text-sm">₹{tx.amount}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1 border-t border-gray-100">
                      <span>Method: {tx.method}</span>
                      <span>{tx.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Success Modal */}
      {successReceipt && (
        <Modal
          isOpen={!!successReceipt}
          onClose={() => setSuccessReceipt(null)}
          title="Payment Successful!"
        >
          <div className="space-y-4 text-center py-2">
            <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <p className="text-xs text-secondary-text">Simulated Transaction Complete</p>
              <h3 className="text-2xl font-bold text-primary-text mt-1">₹{successReceipt.amount}</h3>
            </div>

            <div className="bg-bg-light p-4 rounded-xl text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-secondary-text">Transaction ID:</span>
                <span className="font-semibold text-primary-text">{successReceipt.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-text">Repair Order:</span>
                <span className="font-semibold text-primary-text">{successReceipt.repairId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-text">Payment Method:</span>
                <span className="font-medium text-primary-text">{successReceipt.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-text">Timestamp:</span>
                <span className="font-medium text-primary-text">{successReceipt.date}</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Status:</span>
                <span>{successReceipt.status}</span>
              </div>
            </div>

            <button
              onClick={() => setSuccessReceipt(null)}
              className="w-full py-2.5 bg-brand-primary text-white text-xs font-semibold rounded-xl hover:bg-opacity-90 transition"
            >
              Done & Return
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CustomerPayments;
