import Payment from '../models/Payment.js';
import Repair from '../models/Repair.js';

// @desc    Process simulated payment & record receipt
// @route   POST /api/payments
// @access  Private (Customer, Owner)
export const createPayment = async (req, res, next) => {
  try {
    const { repairId, amount, paymentMethod, method } = req.body;

    const repair = await Repair.findOne({
      $or: [{ _id: repairId.match(/^[0-9a-fA-F]{24}$/) ? repairId : null }, { repairId: repairId.toUpperCase() }],
    });

    if (!repair) {
      return res.status(404).json({ success: false, message: 'Repair record not found' });
    }

    const payCount = await Payment.countDocuments();
    const paymentId = `PAY-${100 + payCount + 1}`;
    const selectedMethod = paymentMethod || method || 'UPI';
    const txnRef = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
    const paymentAmount = Number(amount) || repair.actualCost || repair.estimatedCost || 500;

    // Create payment record (Notice: NEVER stores sensitive card numbers/CVV/PINs)
    const payment = await Payment.create({
      paymentId,
      repair: repair._id,
      repairId: repair.repairId,
      customer: req.user._id,
      customerName: req.user.name,
      amount: paymentAmount,
      paymentMethod: selectedMethod,
      paymentStatus: 'Paid',
      transactionReference: txnRef,
      paymentDate: new Date(),
      details: {
        method: selectedMethod,
        isSimulated: true,
        clearedAt: new Date(),
      },
    });

    // Update repair status
    repair.paymentStatus = 'Paid';
    repair.paymentMethod = selectedMethod;
    repair.paymentId = txnRef;
    await repair.save();

    // Socket.io event
    const io = req.app.get('io');
    if (io) {
      io.emit('payment:processed', payment);
      io.emit('repair:updated', repair);
    }

    res.status(201).json({
      success: true,
      message: 'Simulated payment processed successfully',
      payment,
      repair,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get payment ledger history
// @route   GET /api/payments
// @access  Private
export const getPayments = async (req, res, next) => {
  try {
    const filter = {};

    // Customer can only view their own payments
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
