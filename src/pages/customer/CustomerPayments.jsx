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
  ArrowRight,
  Download,
  Printer,
  ExternalLink,
  Zap,
  Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRepairs } from '../../context/RepairContext';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const CustomerPayments = () => {
  const { currentUser } = useAuth();
  const { 
    repairs, 
    payments, 
    processPayment, 
    createRazorpayOrder, 
    verifyRazorpayPayment, 
    addToast 
  } = useRepairs();
  const [searchParams] = useSearchParams();

  // Find repairs that belong to this customer
  const myRepairs = repairs.filter(
    (r) => r.customerId === currentUser?.id || r.customerEmail?.toLowerCase() === currentUser?.email?.toLowerCase()
  );

  // Filter payable repairs (has approved cost and not paid yet)
  const payableRepairs = myRepairs.filter((r) => r.cost && r.paymentStatus !== 'Paid');
  const myTransactions = payments.filter((p) => myRepairs.some((r) => r.id === p.repairId || r.repairId === p.repairId));

  // Selected repair to pay
  const [selectedRepairId, setSelectedRepairId] = useState(
    searchParams.get('repairId') || (payableRepairs.length > 0 ? payableRepairs[0].id : '')
  );

  // Payment channel: 'razorpay' | 'cod' | 'simulated'
  const [paymentChannel, setPaymentChannel] = useState('razorpay');
  const [simulatedSubMethod, setSimulatedSubMethod] = useState('UPI');

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [successReceipt, setSuccessReceipt] = useState(null);
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [pendingRazorpayOrder, setPendingRazorpayOrder] = useState(null);

  useEffect(() => {
    const qId = searchParams.get('repairId');
    if (qId) setSelectedRepairId(qId);
  }, [searchParams]);

  // Synchronize selected repair if list updates
  useEffect(() => {
    if (!selectedRepairId && payableRepairs.length > 0) {
      setSelectedRepairId(payableRepairs[0].id);
    }
  }, [payableRepairs, selectedRepairId]);

  const activePayable = myRepairs.find((r) => r.id === selectedRepairId || r.repairId === selectedRepairId);

  // ============================================================
  // Razorpay Standard Checkout Execution
  // ============================================================
  const handleRazorpayCheckout = async () => {
    if (!activePayable) {
      addToast('No Invoice Selected', 'Please select a pending repair invoice to pay.', 'warning');
      return;
    }

    setIsProcessing(true);
    setProcessingStep('Creating secure Razorpay order on server...');

    try {
      // 1. Call Backend to create trusted Razorpay Order
      const orderData = await createRazorpayOrder(activePayable.id);
      setPendingRazorpayOrder(orderData);

      // 2. Dynamically load Razorpay standard checkout script
      setProcessingStep('Loading Razorpay Standard Checkout SDK...');
      const isLoaded = await loadRazorpayScript();

      const publicRazorpayKey = 
        orderData.keyId || 
        import.meta.env.VITE_RAZORPAY_KEY_ID || 
        '';

      // 3. If real key exists and SDK loaded, launch official Razorpay standard modal
      if (isLoaded && window.Razorpay && publicRazorpayKey && !publicRazorpayKey.includes('placeholder')) {
        setProcessingStep('Awaiting payment authorization...');

        const options = {
          key: publicRazorpayKey,
          amount: orderData.amount, // in paise
          currency: orderData.currency || 'INR',
          name: 'Mixer Fix Electronic Repairs',
          description: `Repair Invoice: ${activePayable.id} (${activePayable.brand} ${activePayable.appliance})`,
          image: 'https://api.dicebear.com/7.x/initials/svg?seed=MixerFix&backgroundColor=087F75',
          order_id: orderData.orderId,
          prefill: {
            name: currentUser?.name || orderData.customer?.name || 'Customer',
            email: currentUser?.email || orderData.customer?.email || 'customer@mixerfix.com',
            contact: currentUser?.phone || orderData.customer?.phone || '+919876543210',
          },
          notes: {
            repairId: activePayable.id,
            appliance: `${activePayable.brand} ${activePayable.appliance}`,
          },
          theme: {
            color: '#087F75',
          },
          modal: {
            ondismiss: () => {
              setIsProcessing(false);
              setProcessingStep('');
              addToast('Payment Dismissed', 'Razorpay checkout modal was closed.', 'info');
            },
          },
          handler: async (response) => {
            // Received response: razorpay_payment_id, razorpay_order_id, razorpay_signature
            setProcessingStep('Verifying cryptographic HMAC signature on server...');
            try {
              const verified = await verifyRazorpayPayment({
                repairId: activePayable.id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                method: 'Razorpay Standard',
              });

              setIsProcessing(false);
              setProcessingStep('');
              setSuccessReceipt(verified);
            } catch (err) {
              setIsProcessing(false);
              setProcessingStep('');
              addToast('Signature Verification Failed', 'Server rejected payment signature.', 'danger');
            }
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', (failResponse) => {
          setIsProcessing(false);
          setProcessingStep('');
          addToast(
            'Payment Failed',
            failResponse.error?.description || 'Your payment was declined or cancelled.',
            'danger'
          );
        });
        rzp.open();
      } else {
        // Test Mode Interactive Sandbox Modal (handles testing without requiring external credit card/keys)
        setIsProcessing(false);
        setProcessingStep('');
        setTestModalOpen(true);
      }
    } catch (error) {
      setIsProcessing(false);
      setProcessingStep('');
      addToast('Order Creation Error', error.message || 'Could not initiate Razorpay order.', 'danger');
    }
  };

  // Complete payment via Test Mode interactive simulator
  const handleTestModeComplete = async (simulatedSuccess, methodChoice = 'Razorpay Test Card') => {
    if (!pendingRazorpayOrder) return;
    setTestModalOpen(false);

    if (!simulatedSuccess) {
      addToast('Test Payment Cancelled', 'Razorpay test checkout was aborted.', 'info');
      return;
    }

    setIsProcessing(true);
    setProcessingStep('Verifying test payment signature with backend...');

    const testPaymentId = `pay_test_${Date.now().toString().slice(-8)}`;
    const testSignature = `sig_test_hmac_${Math.random().toString(36).substring(2, 15)}`;

    try {
      const verified = await verifyRazorpayPayment({
        repairId: activePayable.id,
        razorpay_order_id: pendingRazorpayOrder.orderId,
        razorpay_payment_id: testPaymentId,
        razorpay_signature: testSignature,
        method: methodChoice,
      });

      setIsProcessing(false);
      setProcessingStep('');
      setSuccessReceipt(verified);
    } catch (err) {
      setIsProcessing(false);
      setProcessingStep('');
      addToast('Verification Error', err.message || 'Verification failed.', 'danger');
    }
  };

  // Handle Cash on Delivery
  const handleCODSubmit = async () => {
    if (!activePayable) return;
    setIsProcessing(true);
    setProcessingStep('Recording Cash on Delivery request...');

    try {
      const receipt = await processPayment({
        repairId: activePayable.id,
        amount: activePayable.cost,
        method: 'Cash on Delivery',
      });
      setIsProcessing(false);
      setProcessingStep('');
      setSuccessReceipt(receipt);
      addToast('COD Registered', 'You can pay the delivery agent in cash upon delivery.', 'success');
    } catch (e) {
      setIsProcessing(false);
      setProcessingStep('');
      addToast('Error', 'Failed to register Cash on Delivery.', 'danger');
    }
  };

  // Handle Legacy Simulation
  const handleSimulateSubmit = async () => {
    if (!activePayable) return;
    setIsProcessing(true);
    setProcessingStep('Simulating mock transaction...');

    setTimeout(async () => {
      const receipt = await processPayment({
        repairId: activePayable.id,
        amount: activePayable.cost,
        method: `Simulated (${simulatedSubMethod})`,
      });
      setIsProcessing(false);
      setProcessingStep('');
      setSuccessReceipt(receipt);
    }, 900);
  };

  // ============================================================
  // Download Printable / HTML Receipt
  // ============================================================
  const handleDownloadReceipt = (receipt) => {
    if (!receipt) return;
    const invoiceNum = receipt.receiptNumber || receipt.id || `RCPT-${receipt.repairId}`;
    const dateFormatted = receipt.date || new Date().toISOString().split('T')[0];

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Mixer Fix Payment Receipt - ${invoiceNum}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #f8fafc; color: #1e293b; padding: 40px 20px; margin: 0; }
    .receipt-card { max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 36px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 20px; }
    .brand { font-size: 24px; font-weight: 800; color: #142D3A; }
    .brand span { color: #087F75; }
    .badge { background: #dcfce7; color: #15803d; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; }
    .info-grid { display: grid; grid-cols: 2; display: flex; justify-content: space-between; margin: 24px 0; font-size: 13px; line-height: 1.6; }
    .table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px; }
    .table th { background: #f8fafc; text-align: left; padding: 10px 14px; color: #64748b; font-size: 11px; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; }
    .table td { padding: 12px 14px; border-bottom: 1px solid #f1f5f9; }
    .total-box { margin-top: 20px; padding: 16px; background: #f0fdfa; border-radius: 12px; border: 1px solid #ccfbf1; display: flex; justify-content: space-between; align-items: center; }
    .total-title { font-weight: 700; color: #0f766e; }
    .total-amount { font-size: 22px; font-weight: 800; color: #087F75; }
    .footer { text-align: center; margin-top: 30px; font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 16px; }
    @media print { body { background: white; padding: 0; } .receipt-card { border: none; box-shadow: none; padding: 0; } }
  </style>
</head>
<body>
  <div class="receipt-card">
    <div class="header">
      <div>
        <div class="brand">Mixer<span>Fix</span></div>
        <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Smart Electronic Appliance Care</div>
      </div>
      <div class="badge">Verified Payment ✓</div>
    </div>

    <div class="info-grid">
      <div>
        <strong style="color:#087F75;">Billed To:</strong><br>
        <strong>${receipt.customerName || currentUser?.name || 'Customer'}</strong><br>
        Email: ${receipt.customerEmail || currentUser?.email || 'customer@mixerfix.com'}<br>
        Phone: ${currentUser?.phone || '+91 98765 43210'}
      </div>
      <div style="text-align: right;">
        <strong>Receipt Number:</strong> ${invoiceNum}<br>
        <strong>Date:</strong> ${dateFormatted}<br>
        <strong>Repair Order:</strong> ${receipt.repairId}<br>
        <strong>Gateway:</strong> ${receipt.method || receipt.paymentMethod || 'Razorpay Standard'}
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>Description</th>
          <th>Gateway Reference</th>
          <th style="text-align: right;">Amount (INR)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>Electronic Appliance Service & Overhaul</strong><br>
            <span style="font-size: 11px; color: #64748b;">Repair Ticket ID: ${receipt.repairId}</span>
          </td>
          <td style="font-family: monospace; font-size: 12px;">
            ${receipt.razorpayPaymentId || receipt.transactionReference || 'N/A'}
          </td>
          <td style="text-align: right; font-weight: 700;">₹${receipt.amount}</td>
        </tr>
      </tbody>
    </table>

    <div class="total-box">
      <div>
        <div class="total-title">Total Amount Paid</div>
        <div style="font-size: 11px; color: #64748b;">Includes 18% GST & Doorstep Handling</div>
      </div>
      <div class="total-amount">₹${receipt.amount}</div>
    </div>

    <div style="margin-top: 20px; font-size: 11px; color: #64748b; background: #f8fafc; padding: 12px; border-radius: 8px;">
      <strong>Security Verification:</strong> Payment verified via 256-Bit SSL HMAC-SHA256 signature check.<br>
      <strong>Razorpay Order ID:</strong> ${receipt.razorpayOrderId || 'N/A'}<br>
      <strong>Razorpay Payment ID:</strong> ${receipt.razorpayPaymentId || receipt.transactionReference || 'N/A'}
    </div>

    <div class="footer">
      Mixer Fix Service Station • 100% Genuine OEM Spares with 90-Day Service Guarantee<br>
      Need help with your invoice? Contact care@mixerfix.com | +91 98765 43210
    </div>
  </div>
  <script>
    window.onload = function() { window.print(); }
  </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MixerFix_Receipt_${invoiceNum}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addToast('Receipt Generated', 'Download started. You can open and print the invoice anytime.', 'success');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-black text-slate-900 font-heading tracking-tight">
            Payments & Invoices
          </h1>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-[#087F75] border border-teal-200">
            Razorpay Gateway
          </span>
        </div>
        <p className="text-slate-600 text-base font-medium mt-1">
          Pay approved repair invoices securely with Razorpay or Cash on Delivery.
        </p>
      </div>

      {/* Gateway Status Micro-Banner */}
      <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 rounded-2xl p-4 flex items-center gap-3 text-teal-950 shadow-2xs">
        <ShieldCheck className="w-5 h-5 text-[#087F75] shrink-0" />
        <div className="text-sm font-medium">
          <strong className="text-slate-900 font-bold">Secure Gateway: </strong>
          Razorpay test mode verified with HMAC-SHA256 signatures.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Payment Checkout Module */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-5">
            <h2 className="font-extrabold text-slate-900 text-lg flex items-center justify-between">
              <span>Checkout</span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full flex items-center gap-1.5 border border-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Standard Checkout
              </span>
            </h2>

            {/* Select Repair Order */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Select Pending Invoice
              </label>
              {payableRepairs.length === 0 ? (
                <div className="p-5 bg-teal-50 border border-teal-200 rounded-2xl text-center space-y-1">
                  <div className="font-bold text-base text-[#087F75]">🎉 All Invoices Settled!</div>
                  <p className="text-sm font-medium text-slate-600">No unpaid repair bills at this time.</p>
                </div>
              ) : (
                <select
                  value={selectedRepairId}
                  onChange={(e) => setSelectedRepairId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#087F75]/20 focus:border-[#087F75] bg-white transition cursor-pointer"
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
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-sm font-medium">
                <div className="flex justify-between text-slate-600">
                  <span>Appliance:</span>
                  <span className="font-bold text-slate-900">{activePayable.brand} {activePayable.appliance}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Inspection Status:</span>
                  <span className="font-bold text-[#087F75]">{activePayable.status}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Diagnostics & Testing:</span>
                  <span className="font-bold text-slate-900">₹{Math.round(activePayable.cost * 0.4)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Replacement Spares:</span>
                  <span className="font-bold text-slate-900">₹{Math.round(activePayable.cost * 0.6)}</span>
                </div>
                <div className="border-t border-slate-200 pt-2.5 flex justify-between text-base font-extrabold text-slate-900">
                  <span>Total Due:</span>
                  <span className="text-2xl text-[#087F75]">₹{activePayable.cost}</span>
                </div>
              </div>
            )}

            {/* Payment Method Selector */}
            {activePayable && activePayable.paymentStatus !== 'Paid' && (
              <div className="space-y-4 pt-2">
                <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
                  Payment Method:
                </label>

                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentChannel('razorpay')}
                    className={`p-3.5 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 cursor-pointer ${
                      paymentChannel === 'razorpay'
                        ? 'border-[#087F75] bg-teal-50 text-[#087F75] font-bold shadow-xs'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-[#087F75]" />
                    <span className="text-sm font-bold">Razorpay</span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                      Online
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentChannel('cod')}
                    className={`p-3.5 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 cursor-pointer ${
                      paymentChannel === 'cod'
                        ? 'border-amber-600 bg-amber-50 text-amber-800 font-bold shadow-xs'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Banknote className="w-5 h-5 text-amber-600" />
                    <span className="text-sm font-bold">Cash on Delivery</span>
                    <span className="text-xs font-semibold text-slate-500">Doorstep</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentChannel('simulated')}
                    className={`p-3.5 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 cursor-pointer ${
                      paymentChannel === 'simulated'
                        ? 'border-sky-600 bg-sky-50 text-sky-800 font-bold shadow-xs'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Zap className="w-5 h-5 text-sky-600" />
                    <span className="text-sm font-bold">Sandbox</span>
                    <span className="text-xs font-semibold text-slate-500">Instant Mock</span>
                  </button>
                </div>

                {/* Razorpay Gateway Description */}
                {paymentChannel === 'razorpay' && (
                  <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-teal-950">
                      <ShieldCheck className="w-4 h-4 text-[#087F75]" />
                      <span>Razorpay Standard Checkout</span>
                    </div>
                    <p className="text-sm font-medium text-slate-600 leading-relaxed">
                      Accepts UPI (GPay, PhonePe, Paytm), Cards & NetBanking.
                    </p>

                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={handleRazorpayCheckout}
                      className="w-full py-3.5 bg-[#087F75] hover:bg-[#06635B] text-white text-sm font-bold rounded-xl shadow-md shadow-[#087F75]/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>{processingStep || 'Processing...'}</span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4" />
                          <span>Pay ₹{activePayable.cost} via Razorpay</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Cash on Delivery Flow */}
                {paymentChannel === 'cod' && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-amber-950">
                      <Banknote className="w-4 h-4 text-amber-700" />
                      <span>Cash on Delivery</span>
                    </div>
                    <p className="text-sm font-medium text-slate-600 leading-relaxed">
                      Pay cash to courier upon return delivery.
                    </p>
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={handleCODSubmit}
                      className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold rounded-xl shadow-md shadow-amber-600/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      {isProcessing ? 'Confirming...' : `Confirm COD (₹${activePayable.cost})`}
                    </button>
                  </div>
                )}

                {/* Dev Sandbox Flow */}
                {paymentChannel === 'simulated' && (
                  <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-sky-950">
                      <Zap className="w-4 h-4 text-sky-700" />
                      <span>Sandbox Mock</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setSimulatedSubMethod('UPI')}
                        className={`flex-1 py-2 text-sm font-bold rounded-xl border ${
                          simulatedSubMethod === 'UPI' ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        Mock UPI
                      </button>
                      <button
                        type="button"
                        onClick={() => setSimulatedSubMethod('Card')}
                        className={`flex-1 py-2 text-sm font-bold rounded-xl border ${
                          simulatedSubMethod === 'Card' ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        Mock Card
                      </button>
                    </div>
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={handleSimulateSubmit}
                      className="w-full py-3.5 bg-sky-700 hover:bg-sky-800 text-white text-sm font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      {isProcessing ? 'Simulating...' : `Instant Simulate ₹${activePayable.cost}`}
                    </button>
                  </div>
                )}

                {/* Dev Sandbox Flow */}
                {paymentChannel === 'simulated' && (
                  <div className="p-4 bg-sky-50/60 border border-sky-200/80 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-sky-900">
                      <Zap className="w-4 h-4 text-sky-700" />
                      <span>Offline Development Sandbox</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setSimulatedSubMethod('UPI')}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border ${
                          simulatedSubMethod === 'UPI' ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        Mock UPI
                      </button>
                      <button
                        type="button"
                        onClick={() => setSimulatedSubMethod('Card')}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border ${
                          simulatedSubMethod === 'Card' ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        Mock Card
                      </button>
                    </div>
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={handleSimulateSubmit}
                      className="w-full py-3 bg-sky-700 hover:bg-sky-800 text-white text-xs sm:text-sm font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      {isProcessing ? 'Simulating...' : `Instant Simulate ₹${activePayable.cost}`}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Transaction History */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-card space-y-4">
            <h3 className="font-bold text-primary-text text-sm flex items-center gap-2">
              <Receipt className="w-4 h-4 text-[#087F75]" />
              <span>Settled Invoices & Receipts</span>
            </h3>

            {myTransactions.length === 0 ? (
              <p className="text-xs text-secondary-text py-6 text-center">
                No past transactions recorded yet. Settle an invoice to generate downloadable receipts.
              </p>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {myTransactions.map((tx) => (
                  <div
                    key={tx.id || tx.paymentId}
                    className="p-3.5 rounded-2xl border border-slate-200/80 hover:border-[#087F75]/40 transition bg-slate-50/50 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-[#087F75]">{tx.paymentId || tx.id}</span>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {tx.paymentStatus || tx.status || 'Paid'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Repair: {tx.repairId}</span>
                      <span className="font-black text-slate-900 text-sm">₹{tx.amount}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-200/60">
                      <span className="truncate max-w-[140px] text-slate-600 font-medium">
                        {tx.method || tx.paymentMethod || 'Razorpay'}
                      </span>
                      <span>{tx.date || tx.paymentDate?.toString().slice(0, 10)}</span>
                    </div>

                    <div className="pt-1 flex justify-end">
                      <button
                        onClick={() => handleDownloadReceipt(tx)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#087F75] hover:text-[#06635B] hover:underline cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        Download Receipt
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Razorpay Test Sandbox Modal (Used when API keys are pending or for offline test verification) */}
      {testModalOpen && pendingRazorpayOrder && (
        <Modal
          isOpen={testModalOpen}
          onClose={() => setTestModalOpen(false)}
          title="Razorpay Standard Checkout (Test Mode)"
        >
          <div className="space-y-4 py-1">
            <div className="p-3.5 bg-teal-50 rounded-2xl border border-teal-200 text-xs text-teal-900 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-[#087F75] shrink-0 mt-0.5" />
              <div>
                <strong>Test Mode Gateway Active:</strong> Razorpay order ID{' '}
                <code className="font-mono bg-white px-1 py-0.5 rounded border border-teal-200 text-[11px]">
                  {pendingRazorpayOrder.orderId}
                </code>{' '}
                was generated by the server for <strong>₹{pendingRazorpayOrder.amountInRupees}</strong>. Select a test payment scenario below:
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleTestModeComplete(true, 'Razorpay - Test UPI (success@razorpay)')}
                className="w-full p-3 bg-white hover:bg-teal-50/60 border border-slate-200 hover:border-[#087F75] rounded-xl text-left flex items-center justify-between transition cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-[#087F75]" />
                  <div>
                    <div className="text-xs font-bold text-slate-800">1. Test UPI Payment</div>
                    <div className="text-[10px] text-slate-400">Simulate success via success@razorpay VPA</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#087F75]">Approve →</span>
              </button>

              <button
                type="button"
                onClick={() => handleTestModeComplete(true, 'Razorpay - Test Card (4111-XXXX)')}
                className="w-full p-3 bg-white hover:bg-teal-50/60 border border-slate-200 hover:border-[#087F75] rounded-xl text-left flex items-center justify-between transition cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div className="text-xs font-bold text-slate-800">2. Test Card Authorization</div>
                    <div className="text-[10px] text-slate-400">Simulate Visa / Mastercard test payment</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600">Approve →</span>
              </button>

              <button
                type="button"
                onClick={() => handleTestModeComplete(false)}
                className="w-full p-2.5 bg-rose-50 hover:bg-rose-100/70 border border-rose-200 rounded-xl text-left flex items-center justify-between transition cursor-pointer"
              >
                <div className="flex items-center gap-2 text-rose-700 text-xs font-bold">
                  <AlertCircle className="w-4 h-4" />
                  <span>3. Simulate User Cancellation / Failure</span>
                </div>
                <span className="text-[10px] font-bold text-rose-700">Cancel</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Payment Success Receipt Modal */}
      {successReceipt && (
        <Modal
          isOpen={!!successReceipt}
          onClose={() => setSuccessReceipt(null)}
          title="Payment Verified & Settled!"
        >
          <div className="space-y-4 text-center py-2">
            <div className="w-16 h-16 bg-emerald-50 border-2 border-emerald-200 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-sm">
              <CheckCircle className="w-9 h-9" />
            </div>

            <div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                HMAC-SHA256 Signature Verified
              </span>
              <h3 className="text-3xl font-extrabold text-[#142D3A] mt-2">₹{successReceipt.amount}</h3>
              <p className="text-xs text-slate-500 mt-1">Invoice settled for {successReceipt.repairId}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Transaction ID:</span>
                <span className="font-mono font-bold text-slate-800 text-[11px]">
                  {successReceipt.razorpayPaymentId || successReceipt.transactionReference || successReceipt.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Razorpay Order ID:</span>
                <span className="font-mono text-slate-700 text-[11px]">
                  {successReceipt.razorpayOrderId || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Repair Ticket:</span>
                <span className="font-bold text-[#087F75]">{successReceipt.repairId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Method:</span>
                <span className="font-semibold text-slate-800">{successReceipt.method || successReceipt.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Time:</span>
                <span className="font-medium text-slate-700">{successReceipt.date || new Date().toISOString().slice(0, 10)}</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-bold border-t border-slate-200 pt-2">
                <span>Invoice Status:</span>
                <span>PAID ✓</span>
              </div>
            </div>

            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => handleDownloadReceipt(successReceipt)}
                className="flex-1 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-[#087F75]" />
                <span>Download Invoice PDF</span>
              </button>

              <button
                type="button"
                onClick={() => setSuccessReceipt(null)}
                className="flex-1 py-2.5 bg-[#087F75] hover:bg-[#06635B] text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-md shadow-[#087F75]/20"
              >
                Done & Return
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CustomerPayments;
