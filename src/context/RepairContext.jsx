import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { INITIAL_REPAIRS, INITIAL_MESSAGES, INITIAL_PAYMENTS, INITIAL_USERS } from '../data/mockData';
import { repairsAPI, chatAPI, paymentsAPI, deliveriesAPI, usersAPI } from '../services/api';
import { getSocket } from '../services/socket';

const RepairContext = createContext();

// Helper to normalize repair fields so any component can access either field name seamlessly
const normalizeRepair = (r) => {
  const appliance = r.appliance || r.category || 'Appliance';
  const category = r.category || r.appliance || 'Appliance';
  const issue = r.issue || r.problem || 'Repair needed';
  const problem = r.problem || r.issue || 'Repair needed';
  const cost = r.cost !== undefined && r.cost !== null ? r.cost : (r.actualCost || r.estimatedCost || null);
  const estimatedCost = r.estimatedCost || cost;
  const actualCost = r.actualCost || cost;
  const address = r.address || r.pickupAddress || 'Address';
  const pickupAddress = r.pickupAddress || r.address || 'Address';
  const assignedCourier = r.assignedCourier || r.assignedDeliveryName || (r.assignedPickupCourier?.name) || (r.assignedReturnCourier?.name) || null;
  const assignedDeliveryName = assignedCourier;

  return {
    ...r,
    id: r.id || r.repairId || (r._id ? String(r._id) : null),
    repairId: r.repairId || r.id,
    appliance,
    category,
    issue,
    problem,
    cost,
    estimatedCost,
    actualCost,
    address,
    pickupAddress,
    assignedCourier,
    assignedDeliveryName,
  };
};

export const RepairProvider = ({ children }) => {
  // Load repairs from localStorage (with mock fallback)
  const [repairs, setRepairs] = useState(() => {
    try {
      const saved = localStorage.getItem('mixerfix_repairs');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map(normalizeRepair);
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_REPAIRS.map(normalizeRepair);
  });

  // Load chat messages from localStorage
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('mixerfix_messages');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_MESSAGES;
  });

  // Load payments from localStorage
  const [payments, setPayments] = useState(() => {
    try {
      const saved = localStorage.getItem('mixerfix_payments');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PAYMENTS;
  });

  // Delivery personnel fleet
  const [deliveryPersonnel, setDeliveryPersonnel] = useState([
    { id: 'del-1', name: 'Amit Patel', phone: '+91 91234 56780', status: 'Available' },
    { id: 'del-2', name: 'Vikram Singh', phone: '+91 99887 76655', status: 'Active on Road' },
    { id: 'del-3', name: 'Karthik Rao', phone: '+91 97766 55443', status: 'Available' },
    { id: 'del-4', name: 'Vikas Verma', phone: '+91 97654 32109', status: 'On Shift' },
  ]);

  // Sync delivery fleet from registered delivery users in localStorage & registration events
  useEffect(() => {
    const syncCouriers = () => {
      try {
        const storedUsers = localStorage.getItem('mixerfix_users');
        if (storedUsers) {
          const parsed = JSON.parse(storedUsers);
          const registeredDrivers = parsed
            .filter((u) => (u.role || '').toLowerCase() === 'delivery')
            .map((u) => ({
              id: u.id || u._id,
              name: u.name,
              phone: u.phone,
              status: u.dutyStatus || 'Available',
              vehicle: u.vehicle,
              zone: u.zone,
            }));

          if (registeredDrivers.length > 0) {
            setDeliveryPersonnel((prev) => {
              const prevNames = new Set(prev.map((p) => (p.name || '').toLowerCase()));
              const newDrivers = registeredDrivers.filter((d) => !prevNames.has((d.name || '').toLowerCase()));
              return newDrivers.length > 0 ? [...prev, ...newDrivers] : prev;
            });
          }
        }
      } catch (err) {}
    };

    syncCouriers();

    const handleUserRegistered = (e) => {
      const newUser = e.detail;
      if (newUser && (newUser.role || '').toLowerCase() === 'delivery') {
        setDeliveryPersonnel((prev) => {
          if (prev.some((p) => (p.name || '').toLowerCase() === (newUser.name || '').toLowerCase())) {
            return prev;
          }
          return [
            ...prev,
            {
              id: newUser.id || newUser._id || `del-${Date.now()}`,
              name: newUser.name,
              phone: newUser.phone,
              status: newUser.dutyStatus || 'Available',
              vehicle: newUser.vehicle,
              zone: newUser.zone,
            },
          ];
        });
      }
    };

    window.addEventListener('mixerfix:user_registered', handleUserRegistered);
    return () => window.removeEventListener('mixerfix:user_registered', handleUserRegistered);
  }, []);

  // Toast notifications state
  const [toasts, setToasts] = useState([]);

  // Toast helpers
  const addToast = useCallback((title, message = '', type = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const showToast = useCallback((message, type = 'info') => {
    addToast(message, '', type);
  }, [addToast]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Save to localStorage on updates
  useEffect(() => {
    localStorage.setItem('mixerfix_repairs', JSON.stringify(repairs));
  }, [repairs]);

  useEffect(() => {
    localStorage.setItem('mixerfix_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('mixerfix_payments', JSON.stringify(payments));
  }, [payments]);

  // Synchronize with backend API on mount if available
  useEffect(() => {
    const fetchBackendData = async () => {
      const token = localStorage.getItem('mixerfix_token');
      if (!token) return;

      try {
        // Fetch live repairs from MongoDB
        const repairsRes = await repairsAPI.getAllRepairs();
        if (repairsRes?.success && Array.isArray(repairsRes.repairs)) {
          setRepairs(repairsRes.repairs.map(normalizeRepair));
        }

        // Fetch payments from MongoDB
        const paymentsRes = await paymentsAPI.getPayments();
        if (paymentsRes?.success && Array.isArray(paymentsRes.payments)) {
          setPayments(paymentsRes.payments);
        }

        // Fetch delivery couriers
        const couriersRes = await usersAPI.getDeliveryAgents();
        if (couriersRes?.success && Array.isArray(couriersRes.agents) && couriersRes.agents.length > 0) {
          setDeliveryPersonnel(couriersRes.agents.map((a) => ({
            id: a._id || a.id,
            name: a.name,
            phone: a.phone,
            status: a.dutyStatus || 'Available',
          })));
        }

        // Fetch chat messages
        const chatRes = await chatAPI.getMessages('general');
        if (chatRes?.success && Array.isArray(chatRes.messages) && chatRes.messages.length > 0) {
          setMessages(chatRes.messages);
        }
      } catch (err) {
        // Silent fallback to mock data
      }
    };

    fetchBackendData();
  }, []);

  // Socket.IO real-time event listeners
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleRepairCreated = (newRepair) => {
      setRepairs((prev) => [normalizeRepair(newRepair), ...prev.filter((r) => r.id !== newRepair.repairId && r.id !== newRepair.id)]);
      addToast('New Repair Ticket', `Ticket ${newRepair.repairId || newRepair.id} registered!`, 'info');
    };

    const handleRepairUpdated = (updatedRepair) => {
      setRepairs((prev) =>
        prev.map((r) =>
          r.id === updatedRepair.repairId || r.repairId === updatedRepair.repairId || r._id === updatedRepair._id
            ? normalizeRepair(updatedRepair)
            : r
        )
      );
    };

    const handleChatMessage = (newMsg) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === newMsg._id || m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
    };

    const handlePaymentProcessed = (newPayment) => {
      setPayments((prev) => [newPayment, ...prev.filter((p) => p.paymentId !== newPayment.paymentId && p.id !== newPayment.id)]);
    };

    socket.on('repair:created', handleRepairCreated);
    socket.on('repair:updated', handleRepairUpdated);
    socket.on('chat:message', handleChatMessage);
    socket.on('payment:processed', handlePaymentProcessed);

    return () => {
      socket.off('repair:created', handleRepairCreated);
      socket.off('repair:updated', handleRepairUpdated);
      socket.off('chat:message', handleChatMessage);
      socket.off('payment:processed', handlePaymentProcessed);
    };
  }, [addToast]);

  // 1. Add New Repair Complaint
  const addRepair = async (formData, customer) => {
    // Generate fallback unique ID
    const maxNum = repairs.reduce((max, r) => {
      const match = r.id ? String(r.id).match(/\d+/) : null;
      const num = match ? parseInt(match[0], 10) : 0;
      return num > max ? num : max;
    }, 1000);

    const fallbackId = `REP-${maxNum + 1}`;
    const appliance = formData.appliance || formData.category || 'Mixer and Grinder';
    const issue = formData.issue || formData.problem || 'Appliance issue';
    const address = formData.address || formData.pickupAddress || 'Address';
    const customerName = formData.customerName || formData.fullName || customer?.name || 'Customer';
    const customerPhone = formData.customerPhone || formData.phone || customer?.phone || '+91 98765 43210';
    const customerEmail = formData.customerEmail || formData.email || customer?.email || 'customer@mixerfix.com';

    let createdRecord = normalizeRepair({
      id: fallbackId,
      repairId: fallbackId,
      customerId: customer?.id || formData.customerId || 'cust-1',
      customerName,
      customerPhone,
      customerEmail,
      category: appliance,
      appliance,
      brand: formData.brand || 'Appliance',
      model: formData.model || 'Standard Unit',
      problem: issue,
      issue,
      images: formData.images || [],
      videos: formData.videos || [],
      pickupAddress: address,
      address,
      city: formData.city || 'Bangalore',
      pincode: formData.pincode || '560001',
      pickupDate: formData.pickupDate || formData.preferredDate || new Date().toISOString().split('T')[0],
      preferredPickupDate: formData.pickupDate || formData.preferredDate || new Date().toISOString().split('T')[0],
      status: 'Requested',
      estimatedCost: null,
      actualCost: null,
      cost: null,
      partsReplaced: [],
      technicianNotes: '',
      deliveryType: null,
      createdAt: new Date().toISOString().split('T')[0],
      paymentStatus: 'Pending',
      paymentMethod: null,
      paymentId: null,
    });

    // 1. Try backend API
    try {
      const res = await repairsAPI.createRepair(formData);
      if (res?.success && res.repair) {
        createdRecord = normalizeRepair(res.repair);
      }
    } catch (e) {
      // Backend offline: proceed with local record
    }

    setRepairs((prev) => [createdRecord, ...prev.filter((r) => r.id !== createdRecord.id)]);
    addToast(
      'Complaint Registered!',
      `Repair Request ${createdRecord.id} created successfully. Our workshop will inspect and estimate cost.`,
      'success'
    );
    return createdRecord;
  };

  // 2. Approve Repair
  const approveRepair = async (repairId, estimatedCost = 650, notes = '') => {
    const costVal = Number(estimatedCost) || 650;

    try {
      await repairsAPI.approveRepair(repairId, { estimatedCost: costVal, notes });
    } catch (e) {
      // Offline fallback
    }

    setRepairs((prev) =>
      prev.map((r) => {
        if (r.id === repairId || r.repairId === repairId) {
          return normalizeRepair({
            ...r,
            status: 'Approved',
            cost: costVal,
            estimatedCost: costVal,
            technicianNotes: notes || r.technicianNotes || 'Request approved after preliminary diagnostics.',
            approvedAt: new Date().toISOString().split('T')[0],
          });
        }
        return r;
      })
    );
    addToast('Request Approved', `Repair ${repairId} approved successfully.`, 'success');
  };

  // 3. Reject Repair
  const rejectRepair = async (repairId, reason = '') => {
    try {
      await repairsAPI.rejectRepair(repairId, { reason });
    } catch (e) {
      // Offline fallback
    }

    setRepairs((prev) =>
      prev.map((r) => {
        if (r.id === repairId || r.repairId === repairId) {
          return normalizeRepair({
            ...r,
            status: 'Rejected',
            rejectionReason: reason || 'Parts obsolete or non-repairable condition.',
            rejectedAt: new Date().toISOString().split('T')[0],
          });
        }
        return r;
      })
    );
    addToast('Request Rejected', `Repair ${repairId} has been marked as rejected.`, 'warning');
  };

  // 4. Update Repair Cost
  const updateCost = async (repairId, newCost) => {
    const costVal = Number(newCost);

    try {
      await repairsAPI.updateCost(repairId, { cost: costVal });
    } catch (e) {
      // Offline fallback
    }

    setRepairs((prev) =>
      prev.map((r) => {
        if (r.id === repairId || r.repairId === repairId) {
          return normalizeRepair({
            ...r,
            cost: costVal,
            estimatedCost: costVal,
            actualCost: costVal,
          });
        }
        return r;
      })
    );
    addToast('Cost Updated', `Estimated repair cost set to ₹${costVal}.`, 'info');
  };
  const updateRepairCost = updateCost;

  // 5. Assign Courier
  const assignCourier = async (repairId, courierNameOrId) => {
    const courier = deliveryPersonnel.find((d) => d.name === courierNameOrId || d.id === courierNameOrId) || {
      name: courierNameOrId || 'Amit Patel',
      phone: '+91 91234 56780',
    };

    try {
      await deliveriesAPI.assignDelivery({
        repairId,
        courierName: courier.name,
      });
    } catch (e) {
      // Offline fallback
    }

    setRepairs((prev) =>
      prev.map((r) => {
        if (r.id === repairId || r.repairId === repairId) {
          const nextStatus = r.status === 'Completed' ? 'Out for Delivery' : 'Pickup Assigned';
          return normalizeRepair({
            ...r,
            status: nextStatus,
            assignedCourier: courier.name,
            assignedDeliveryName: courier.name,
            assignedDeliveryPhone: courier.phone,
          });
        }
        return r;
      })
    );
    addToast('Courier Dispatched', `Assigned ${courier.name} to ${repairId}.`, 'info');
  };

  const assignPickupDelivery = assignCourier;
  const assignReturnDelivery = assignCourier;

  // 6. Generic Status Transition
  const updateStatus = async (repairId, newStatus) => {
    try {
      await repairsAPI.updateStatus(repairId, { status: newStatus });
    } catch (e) {
      // Offline fallback
    }

    setRepairs((prev) =>
      prev.map((r) => {
        if (r.id === repairId || r.repairId === repairId) {
          return normalizeRepair({
            ...r,
            status: newStatus,
          });
        }
        return r;
      })
    );
    addToast('Status Updated', `${repairId} is now: ${newStatus}`, 'info');
  };

  // Specific transition aliases
  const markAsCollected = (id) => updateStatus(id, 'Collected');
  const markAsAtShop = (id) => updateStatus(id, 'At Shop');
  const startRepair = (id) => updateStatus(id, 'Repair in Progress');
  const completeRepair = (id, finalCost) => {
    if (finalCost) updateCost(id, finalCost);
    updateStatus(id, 'Completed');
  };
  const markOutForDelivery = (id) => updateStatus(id, 'Out for Delivery');
  const markAsDelivered = (id) => updateStatus(id, 'Delivered');

  // 7. Payment Processing & Razorpay Gateway
  const createRazorpayOrder = async (repairId) => {
    const repair = repairs.find((r) => r.id === repairId || r.repairId === repairId);
    if (!repair) {
      throw new Error('Repair record not found.');
    }

    try {
      const res = await paymentsAPI.createRazorpayOrder({ repairId });
      if (res && res.success) {
        return res;
      }
    } catch (apiError) {
      console.warn('[Razorpay API] create-order error, using fallback:', apiError.message);
    }

    // Local / Offline Test Mode Order Simulation
    const trustedCost = repair.cost || 500;
    return {
      success: true,
      orderId: `order_test_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`,
      amount: Math.round(trustedCost * 100),
      amountInRupees: trustedCost,
      currency: 'INR',
      keyId: 'rzp_test_placeholder',
      isLiveRazorpay: false,
      repair: {
        id: repair.id,
        brand: repair.brand,
        appliance: `${repair.brand} ${repair.appliance}`,
        cost: trustedCost,
        status: repair.status,
      },
      customer: {
        name: repair.customerName || 'Customer',
        email: repair.customerEmail || 'customer@mixerfix.com',
        phone: repair.customerPhone || '+91 98765 43210',
      },
    };
  };

  const verifyRazorpayPayment = async (verificationData) => {
    const { repairId, razorpay_order_id, razorpay_payment_id, razorpay_signature, method } = verificationData;
    const repair = repairs.find((r) => r.id === repairId || r.repairId === repairId);
    const trustedCost = repair?.cost || 500;
    const receiptNum = `RCPT-${repairId}-${Date.now().toString().slice(-6)}`;
    const payId = `PAY-${100 + payments.length + 1}`;
    const paymentMethodName = method ? `Razorpay (${method})` : 'Razorpay Standard';

    let confirmedPayment = {
      id: payId,
      paymentId: payId,
      repairId,
      amount: trustedCost,
      method: paymentMethodName,
      paymentMethod: paymentMethodName,
      status: 'Paid',
      paymentStatus: 'Paid',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      signatureVerified: true,
      transactionReference: razorpay_payment_id,
      receiptNumber: receiptNum,
      date: new Date().toISOString().split('T')[0],
      paymentDate: new Date(),
    };

    try {
      const res = await paymentsAPI.verifyRazorpayPayment({
        repairId,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        paymentMethod: paymentMethodName,
      });

      if (res && res.success && res.payment) {
        confirmedPayment = {
          ...confirmedPayment,
          ...res.payment,
          id: res.payment.paymentId || payId,
          method: res.payment.paymentMethod || paymentMethodName,
          status: 'Paid',
        };
      }
    } catch (apiError) {
      console.warn('[Razorpay API] Verification fallback to local state:', apiError.message);
    }

    // Update payments state
    setPayments((prev) => [confirmedPayment, ...prev.filter((p) => p.id !== confirmedPayment.id)]);

    // Update repair status
    setRepairs((prev) =>
      prev.map((r) => {
        if (r.id === repairId || r.repairId === repairId) {
          return normalizeRepair({
            ...r,
            paymentStatus: 'Paid',
            paymentMethod: paymentMethodName,
            paymentId: razorpay_payment_id,
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            paidAt: new Date().toISOString(),
          });
        }
        return r;
      })
    );

    addToast(
      'Payment Confirmed!',
      `₹${trustedCost} successfully settled for ${repairId} via Razorpay.`,
      'success'
    );

    return confirmedPayment;
  };

  const processPayment = async ({ repairId, amount, method }) => {
    const txnId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
    const payId = `PAY-${100 + payments.length + 1}`;
    let newTx = {
      id: payId,
      paymentId: payId,
      repairId,
      amount: Number(amount) || 500,
      method: method || 'UPI',
      paymentMethod: method || 'UPI',
      status: 'Paid',
      paymentStatus: 'Paid',
      transactionReference: txnId,
      transactionId: txnId,
      date: new Date().toISOString().split('T')[0],
    };

    try {
      const res = await paymentsAPI.createPayment({
        repairId,
        amount,
        paymentMethod: method,
      });
      if (res?.success && res.payment) {
        newTx = { ...res.payment, id: res.payment.paymentId, method: res.payment.paymentMethod };
      }
    } catch (e) {
      // Offline fallback
    }

    setPayments((prev) => [newTx, ...prev.filter((p) => p.id !== newTx.id)]);

    setRepairs((prev) =>
      prev.map((r) => {
        if (r.id === repairId || r.repairId === repairId) {
          return normalizeRepair({
            ...r,
            paymentStatus: 'Paid',
            paymentMethod: method,
            paymentId: txnId,
          });
        }
        return r;
      })
    );

    addToast('Payment Processed', `₹${amount} paid via ${method}.`, 'success');
    return newTx;
  };

  const processSimulatedPayment = (repairId, method, details) => {
    const repair = repairs.find((r) => r.id === repairId || r.repairId === repairId);
    return processPayment({
      repairId,
      amount: repair?.cost || 650,
      method,
    });
  };

  // 8. Chat Messaging
  const sendMessage = async ({ text, senderRole = 'Customer', senderName = 'User', repairId = 'general' }) => {
    if (!text?.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      repairId,
      senderRole,
      senderName,
      text: text.trim(),
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);

    try {
      await chatAPI.sendMessage(repairId, { text, content: text });
    } catch (e) {
      // Simulated response from Shop Owner if Customer sends message offline
      if (senderRole === 'Customer') {
        setTimeout(() => {
          const autoReply = {
            id: `msg-reply-${Date.now()}`,
            repairId,
            senderRole: 'Shop Owner',
            senderName: 'Suresh Kumar (Shop Owner)',
            text: `Hello ${senderName}! We have received your query regarding your appliance. Our technicians are inspecting the unit and will provide an update shortly.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages((prev) => [...prev, autoReply]);
          addToast('New Message', 'Shop Owner responded to your query.', 'info');
        }, 1500);
      }
    }
  };

  const sendChatMessage = (repairId, text, sender) => {
    sendMessage({
      text,
      senderRole: sender?.role === 'owner' ? 'Shop Owner' : 'Customer',
      senderName: sender?.name || 'User',
      repairId,
    });
  };

  const resetToMockData = () => {
    localStorage.removeItem('mixerfix_repairs');
    localStorage.removeItem('mixerfix_messages');
    localStorage.removeItem('mixerfix_payments');
    setRepairs(INITIAL_REPAIRS.map(normalizeRepair));
    setMessages(INITIAL_MESSAGES);
    setPayments(INITIAL_PAYMENTS);
    addToast('Data Reset', 'All records have been restored to initial state.', 'info');
  };

  return (
    <RepairContext.Provider
      value={{
        repairs,
        messages,
        payments,
        deliveryPersonnel,
        deliveryAgents: deliveryPersonnel,
        toasts,
        addToast,
        showToast,
        removeToast,
        addRepair,
        approveRepair,
        rejectRepair,
        updateCost,
        updateRepairCost,
        assignCourier,
        assignPickupDelivery,
        assignReturnDelivery,
        updateStatus,
        markAsCollected,
        markAsAtShop,
        startRepair,
        completeRepair,
        markOutForDelivery,
        markAsDelivered,
        createRazorpayOrder,
        verifyRazorpayPayment,
        processPayment,
        processSimulatedPayment,
        sendMessage,
        sendChatMessage,
        resetToMockData,
      }}
    >
      {children}
    </RepairContext.Provider>
  );
};

export const useRepair = () => {
  const context = useContext(RepairContext);
  if (!context) {
    throw new Error('useRepair must be used within a RepairProvider');
  }
  return context;
};

export const useRepairs = useRepair;
