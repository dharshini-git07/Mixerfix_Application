import Payment from '../models/Payment.js';
import Repair from '../models/Repair.js';
import {
  getRazorpayInstance,
  isRazorpayConfigured,
  verifyPaymentSignature,
  verifyWebhookSignature,
} from '../config/razorpay.js';

// ==========================================
// 1. Create Razorpay Order
// @route   POST /api/payments/create-order
// @access  Private (Customer, Owner)
// ==========================================
export const createRazorpayOrder = async (req, res, next) => {
  try {
    const { repairId } = req.body;

    if (!repairId) {
      return res.status(400).json({ success: false, message: 'Repair ID is required' });
    }

    // Find repair record
    const repair = await Repair.findOne({
      $or: [
        { repairId: repairId.toUpperCase() },
        { _id: repairId.match(/^[0-9a-fA-F]{24}$/) ? repairId : null },
      ],
    });

    if (!repair) {
      return res.status(404).json({ success: false, message: 'Repair record not found' });
    }

    // Check ownership (only owner or customer associated with repair)
    if (
      req.user.role === 'customer' &&
      repair.customer.toString() !== req.user._id.toString() &&
      repair.customerEmail.toLowerCase() !== req.user.email.toLowerCase()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only create payment orders for your own repairs.',
      });
    }

    // Check if already paid
    if (repair.paymentStatus === 'Paid') {
      return res.status(400).json({
        success: false,
        message: 'This repair invoice has already been settled and paid.',
      });
    }

    // Trusted cost calculated exclusively from MongoDB record
    const trustedCost = repair.actualCost || repair.estimatedCost;
    if (!trustedCost || trustedCost <= 0) {
      return res.status(400).json({
        success: false,
        message: 'This repair does not have an approved inspection cost yet.',
      });
    }

    // Convert INR to Paise (1 INR = 100 Paise)
    const amountInPaise = Math.round(trustedCost * 100);
    const receiptId = `rcpt_${repair.repairId}_${Date.now()}`.slice(0, 40);

    const razorpay = getRazorpayInstance();
    let order;

    if (razorpay) {
      // Official Razorpay SDK order creation
      order = await razorpay.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: receiptId,
        notes: {
          repairId: repair.repairId,
          customerId: req.user._id.toString(),
          customerName: req.user.name,
          customerEmail: req.user.email,
          customerPhone: req.user.phone,
          appliance: `${repair.brand} ${repair.category}`,
        },
      });
    } else {
      // Test mode simulated order when Razorpay keys are pending in .env
      order = {
        id: `order_test_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`,
        entity: 'order',
        amount: amountInPaise,
        amount_paid: 0,
        amount_due: amountInPaise,
        currency: 'INR',
        receipt: receiptId,
        status: 'created',
        attempts: 0,
        notes: {
          repairId: repair.repairId,
          appliance: `${repair.brand} ${repair.category}`,
        },
        created_at: Math.floor(Date.now() / 1000),
      };
    }

    // Register pending payment record in database
    const payCount = await Payment.countDocuments();
    const paymentId = `PAY-${100 + payCount + 1}`;

    await Payment.create({
      paymentId,
      repair: repair._id,
      repairId: repair.repairId,
      customer: req.user._id,
      customerName: req.user.name,
      customerEmail: req.user.email,
      amount: trustedCost,
      currency: 'INR',
      paymentMethod: 'Razorpay',
      paymentStatus: 'Created',
      razorpayOrderId: order.id,
      receiptNumber: receiptId,
      transactionReference: order.id,
      details: {
        orderId: order.id,
        amountInPaise,
        createdAt: new Date(),
        testMode: true,
      },
    });

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount, // in paise for Razorpay Checkout
      amountInRupees: trustedCost,
      currency: order.currency || 'INR',
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
      isLiveRazorpay: isRazorpayConfigured(),
      repair: {
        id: repair.repairId,
        brand: repair.brand,
        appliance: `${repair.brand} ${repair.category}`,
        cost: trustedCost,
        status: repair.status,
      },
      customer: {
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 2. Verify Razorpay Payment Signature
// @route   POST /api/payments/verify
// @access  Private (Customer, Owner)
// ==========================================
export const verifyRazorpayPayment = async (req, res, next) => {
  try {
    const {
      repairId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentMethod: clientMethod,
    } = req.body;

    if (!repairId || !razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification parameters missing (repairId, orderId, paymentId).',
      });
    }

    // Find repair record
    const repair = await Repair.findOne({
      $or: [
        { repairId: repairId.toUpperCase() },
        { _id: repairId.match(/^[0-9a-fA-F]{24}$/) ? repairId : null },
      ],
    });

    if (!repair) {
      return res.status(404).json({ success: false, message: 'Repair record not found' });
    }

    // Check ownership
    if (
      req.user.role === 'customer' &&
      repair.customer.toString() !== req.user._id.toString() &&
      repair.customerEmail.toLowerCase() !== req.user.email.toLowerCase()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You cannot verify payment for this repair.',
      });
    }

    // Idempotency check: if repair is already paid with this payment ID, return existing record
    if (repair.paymentStatus === 'Paid' && repair.paymentId === razorpay_payment_id) {
      const existingPayment = await Payment.findOne({ razorpayPaymentId: razorpay_payment_id });
      return res.status(200).json({
        success: true,
        message: 'Payment already verified and confirmed.',
        payment: existingPayment,
        repair,
      });
    }

    // Signature Verification using HMAC SHA256
    let isSignatureValid = false;
    if (isRazorpayConfigured()) {
      isSignatureValid = verifyPaymentSignature({
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
      });

      if (!isSignatureValid) {
        // Log failure in payment record
        await Payment.findOneAndUpdate(
          { razorpayOrderId: razorpay_order_id },
          {
            paymentStatus: 'Failed',
            failureReason: 'Invalid cryptographic signature mismatch',
          }
        );

        return res.status(400).json({
          success: false,
          message: 'Invalid payment signature. Payment verification failed on server.',
        });
      }
    } else {
      // In sandbox development without Razorpay keys, allow test checkout
      isSignatureValid = true;
    }

    // Fetch actual payment status and method from Razorpay SDK if live
    let determinedMethod = clientMethod || 'Razorpay';
    const razorpay = getRazorpayInstance();
    if (razorpay && !razorpay_payment_id.startsWith('pay_sim_')) {
      try {
        const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);
        if (paymentDetails && paymentDetails.method) {
          determinedMethod = `Razorpay - ${paymentDetails.method.toUpperCase()}`;
        }
      } catch (err) {
        console.warn(`[Razorpay] Could not fetch payment info: ${err.message}`);
      }
    }

    const trustedCost = repair.actualCost || repair.estimatedCost || 500;
    const receiptNumber = `RCPT-${repair.repairId}-${Date.now().toString().slice(-6)}`;

    // Update or Create Payment Record in MongoDB
    let payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
    if (!payment) {
      const payCount = await Payment.countDocuments();
      payment = new Payment({
        paymentId: `PAY-${100 + payCount + 1}`,
        repair: repair._id,
        repairId: repair.repairId,
        customer: req.user._id,
        customerName: req.user.name,
        customerEmail: req.user.email,
        amount: trustedCost,
        currency: 'INR',
      });
    }

    payment.razorpayOrderId = razorpay_order_id;
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature || 'verified_in_test_mode';
    payment.signatureVerified = isSignatureValid;
    payment.paymentStatus = 'Paid';
    payment.paymentMethod = determinedMethod;
    payment.transactionReference = razorpay_payment_id;
    payment.receiptNumber = receiptNumber;
    payment.paymentDate = new Date();
    payment.details = {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      verifiedAt: new Date(),
      settledAmount: trustedCost,
    };

    await payment.save();

    // Update Repair model payment state
    repair.paymentStatus = 'Paid';
    repair.paymentMethod = determinedMethod;
    repair.paymentId = razorpay_payment_id;
    repair.razorpayOrderId = razorpay_order_id;
    repair.razorpayPaymentId = razorpay_payment_id;
    repair.paidAt = new Date();
    await repair.save();

    // Broadcast real-time updates via Socket.IO
    const io = req.app.get('io');
    if (io) {
      io.emit('payment:processed', payment);
      io.emit('repair:updated', repair);
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified and invoice settled successfully!',
      payment,
      repair,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 3. Razorpay Webhook Handler
// @route   POST /api/payments/webhook
// @access  Public (Signature Verified)
// ==========================================
export const handleRazorpayWebhook = async (req, res, next) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // Verify webhook signature if configured
    if (webhookSecret) {
      const rawBody = req.rawBody ? req.rawBody.toString('utf8') : JSON.stringify(req.body);
      const isValid = verifyWebhookSignature(rawBody, signature);
      if (!isValid) {
        console.warn('[Razorpay Webhook] Invalid webhook signature detected.');
        return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
      }
    }

    const event = req.body.event;
    const payload = req.body.payload;

    console.log(`[Razorpay Webhook] Received Event: ${event}`);

    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = payload.payment?.entity;
      const orderId = paymentEntity?.order_id;
      const paymentId = paymentEntity?.id;
      const repairId = paymentEntity?.notes?.repairId;

      if (repairId) {
        const repair = await Repair.findOne({ repairId: repairId.toUpperCase() });
        if (repair && repair.paymentStatus !== 'Paid') {
          repair.paymentStatus = 'Paid';
          repair.paymentMethod = `Razorpay - ${paymentEntity?.method?.toUpperCase() || 'WEBHOOK'}`;
          repair.paymentId = paymentId;
          repair.paidAt = new Date();
          await repair.save();

          await Payment.findOneAndUpdate(
            { razorpayOrderId: orderId },
            {
              paymentStatus: 'Paid',
              razorpayPaymentId: paymentId,
              transactionReference: paymentId,
              signatureVerified: true,
              paymentDate: new Date(),
            },
            { upsert: false }
          );

          const io = req.app.get('io');
          if (io) {
            io.emit('repair:updated', repair);
          }
        }
      }
    } else if (event === 'payment.failed') {
      const paymentEntity = payload.payment?.entity;
      const orderId = paymentEntity?.order_id;
      if (orderId) {
        await Payment.findOneAndUpdate(
          { razorpayOrderId: orderId },
          {
            paymentStatus: 'Failed',
            failureReason: paymentEntity?.error_description || 'Payment transaction failed',
          }
        );
      }
    }

    // Always respond with 200 to acknowledge webhook receipt
    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('[Razorpay Webhook Error]:', error.message);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// ==========================================
// 4. Get My Payments (Customer)
// @route   GET /api/payments/my-payments
// @access  Private (Customer)
// ==========================================
export const getMyPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ customer: req.user._id })
      .populate('repair', 'brand category status actualCost estimatedCost repairId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 5. Get Payment Receipt Details By ID
// @route   GET /api/payments/:paymentId
// @access  Private
// ==========================================
export const getPaymentById = async (req, res, next) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findOne({
      $or: [
        { paymentId },
        { razorpayPaymentId: paymentId },
        { _id: paymentId.match(/^[0-9a-fA-F]{24}$/) ? paymentId : null },
      ],
    })
      .populate('repair', 'brand category model status actualCost pickupAddress city pincode repairId')
      .populate('customer', 'name email phone address');

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    // Role check
    if (
      req.user.role === 'customer' &&
      payment.customer._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Unauthorized to view this receipt' });
    }

    res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 6. Existing Simulated & Cash on Delivery Processing
// @route   POST /api/payments
// @access  Private (Customer, Owner)
// ==========================================
export const createPayment = async (req, res, next) => {
  try {
    const { repairId, amount, paymentMethod, method } = req.body;

    const repair = await Repair.findOne({
      $or: [
        { _id: repairId.match(/^[0-9a-fA-F]{24}$/) ? repairId : null },
        { repairId: repairId.toUpperCase() },
      ],
    });

    if (!repair) {
      return res.status(404).json({ success: false, message: 'Repair record not found' });
    }

    const payCount = await Payment.countDocuments();
    const paymentId = `PAY-${100 + payCount + 1}`;
    const selectedMethod = paymentMethod || method || 'Cash on Delivery';
    const txnRef = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
    const paymentAmount = Number(amount) || repair.actualCost || repair.estimatedCost || 500;
    const isCOD = selectedMethod.toLowerCase().includes('cash') || selectedMethod.toLowerCase().includes('delivery');

    const payment = await Payment.create({
      paymentId,
      repair: repair._id,
      repairId: repair.repairId,
      customer: req.user._id,
      customerName: req.user.name,
      customerEmail: req.user.email,
      amount: paymentAmount,
      currency: 'INR',
      paymentMethod: selectedMethod,
      paymentStatus: isCOD ? 'Pending' : 'Paid',
      transactionReference: txnRef,
      receiptNumber: `RCPT-${repair.repairId}-${Date.now().toString().slice(-6)}`,
      paymentDate: new Date(),
      details: {
        method: selectedMethod,
        isSimulated: !isCOD,
        isCashOnDelivery: isCOD,
        clearedAt: isCOD ? null : new Date(),
      },
    });

    repair.paymentStatus = isCOD ? 'Pending' : 'Paid';
    repair.paymentMethod = selectedMethod;
    repair.paymentId = txnRef;
    if (!isCOD) {
      repair.paidAt = new Date();
    }
    await repair.save();

    const io = req.app.get('io');
    if (io) {
      io.emit('payment:processed', payment);
      io.emit('repair:updated', repair);
    }

    res.status(201).json({
      success: true,
      message: isCOD ? 'Cash on Delivery confirmed' : 'Simulated payment processed successfully',
      payment,
      repair,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 7. Get Payment Ledger History (Owner / General)
// @route   GET /api/payments
// @access  Private
// ==========================================
export const getPayments = async (req, res, next) => {
  try {
    const filter = {};

    if (req.user.role === 'customer') {
      filter.customer = req.user._id;
    }

    if (req.query.repairId) {
      filter.repairId = req.query.repairId.toUpperCase();
    }

    const payments = await Payment.find(filter)
      .populate('repair', 'brand category status actualCost')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    next(error);
  }
};
