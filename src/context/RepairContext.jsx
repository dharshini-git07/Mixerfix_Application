import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { INITIAL_REPAIRS, INITIAL_MESSAGES, INITIAL_PAYMENTS, INITIAL_USERS } from '../data/mockData';

const RepairContext = createContext();

export const RepairProvider = ({ children }) => {
  // Load repairs from localStorage
  const [repairs, setRepairs] = useState(() => {
    const saved = localStorage.getItem('mixerfix_repairs');
    return saved ? JSON.parse(saved) : INITIAL_REPAIRS;
  });

  // Load chat messages from localStorage
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('mixerfix_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  // Load payments from localStorage
  const [payments, setPayments] = useState(() => {
    const saved = localStorage.getItem('mixerfix_payments');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  // Toast notifications state
  const [toasts, setToasts] = useState([]);

  // Toast helper
  const addToast = useCallback((title, message, type = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

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

  // Delivery agents list from users
  const deliveryAgents = INITIAL_USERS.filter((u) => u.role === 'delivery');

  // 1. Customer: Add New Repair Complaint
  const addRepair = (formData, customer) => {
    const maxNum = repairs.reduce((max, r) => {
      const num = parseInt(r.id?.replace('REP-', ''), 10);
      return !isNaN(num) && num > max ? num : max;
    }, 1000);
    const newId = `REP-${maxNum + 1}`;

    const newRepair = {
      id: newId,
      customerId: customer?.id || 'cust-1',
      customerName: formData.fullName || customer?.name || 'Customer',
      customerPhone: formData.phone || customer?.phone || '+91 98765 43210',
      customerEmail: formData.email || customer?.email || 'customer@mixerfix.com',
      category: formData.category,
      brand: formData.brand,
      model: formData.model || 'Standard Unit',
      problem: formData.problem,
      images: formData.images || [],
      videos: formData.videos || [],
      pickupAddress: formData.pickupAddress,
      city: formData.city || 'Bengaluru',
      pincode: formData.pincode,
      preferredDate: formData.preferredDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
      preferredTimeSlot: formData.preferredTimeSlot || '10:00 AM - 01:00 PM',
      status: 'Requested', // Stage 1
      estimatedCost: null,
      actualCost: null,
      partsReplaced: [],
      technicianNotes: '',
      assignedDeliveryId: null,
      assignedDeliveryName: null,
      assignedDeliveryPhone: null,
      deliveryType: null,
      createdAt: new Date().toISOString(),
      paymentStatus: 'Pending',
      paymentMethod: null,
      paymentId: null
    };

    setRepairs((prev) => [newRepair, ...prev]);
    addToast(
      'Complaint Registered!',
      `Repair Request ${newId} created successfully. Our shop owner will review and estimate cost.`,
      'success'
    );
    return newRepair;
  };

  // 2. Shop Owner: Approve Repair Request
  const approveRepair = (repairId, estimatedCost, notes = '') => {
    setRepairs((prev) =>
      prev.map((r) => {
        if (r.id === repairId) {
          return {
            ...r,
            status: 'Approved', // Stage 2
            estimatedCost: Number(estimatedCost),
            technicianNotes: notes || 'Request approved after preliminary diagnostics.',
            approvedAt: new Date().toISOString()
          };
        }
        return r;
      })
    );
    addToast(
      'Request Approved',
      `Repair ${repairId} approved with estimated cost ₹${estimatedCost}.`,
      'success'
    );
  };

  // 3. Shop Owner: Reject Repair Request
  const rejectRepair = (repairId, reason) => {
    setRepairs((prev) =>
      prev.map((r) => {
        if (r.id === repairId) {
          return {
            ...r,
            status: 'Rejected',
            rejectionReason: reason || 'Parts obsolete or non-repairable condition.',
            rejectedAt: new Date().toISOString()
          };
        }
        return r;
      })
    );
    addToast('Request Rejected', `Repair ${repairId} has been marked as rejected.`, 'warning');
  };

  // 4. Shop Owner: Assign Pickup Delivery Task
  const assignPickupDelivery = (repairId, deliveryAgentId) => {
    const agent = deliveryAgents.find((a) => a.id === deliveryAgentId) || deliveryAgents[0];
    setRepairs((prev) =>
      prev.map((r) => {
        if (r.id === repairId) {
          return {
            ...r,
            status: 'Pickup Assigned', // Stage 3
            assignedDeliveryId: agent.id,
            assignedDeliveryName: agent.name,
            assignedDeliveryPhone: agent.phone,
            deliveryType: 'pickup',
            pickupAssignedAt: new Date().toISOString()
          };
        }
        return r;
      })
    );
    addToast(
      'Pickup Task Assigned',
      `Assigned to delivery agent ${agent.name} for pickup.`,
      'info'
    );
  };

  // 5. Delivery Personnel: Mark as Picked Up / Collected
  const markAsCollected = (repairId) => {
    setRepairs((prev) =>
      prev.map((r) => {
        if (r.id === repairId) {
          return {
            ...r,
            status: 'Collected', // Stage 4
            collectedAt: new Date().toISOString()
          };
        }
        return r;
      })
    );
    addToast('Appliance Picked Up', `Appliance for ${repairId} safely collected from customer.`, 'success');
  };

  // 6. Delivery Personnel or Shop Owner: Mark Reached Shop / At Shop
  const markAsAtShop = (repairId) => {
    setRepairs((prev) =>
      prev.map((r) => {
        if (r.id === repairId) {
          return {
            ...r,
            status: 'At Shop', // Stage 5
            deliveryType: 'pickup_completed',
            atShopAt: new Date().toISOString()
          };
        }
        return r;
      })
    );
    addToast('At Shop', `Appliance for ${repairId} is now securely at the repair center.`, 'info');
  };

  // 7. Shop Owner: Start Repair (Repair in Progress)
  const startRepair = (repairId, notes) => {
    setRepairs((prev) =>
      prev.map((r) => {
        if (r.id === repairId) {
          return {
            ...r,
            status: 'Repair in Progress', // Stage 6
            technicianNotes: notes || r.technicianNotes || 'Disassembly and electrical bench diagnosis started.',
            inProgressAt: new Date().toISOString()
          };
        }
        return r;
      })
    );
    addToast('Repair Started', `Technician has begun servicing ${repairId}.`, 'info');
  };

  // 8. Shop Owner: Complete Repair
  const completeRepair = (repairId, finalCost, notes, parts = []) => {
    setRepairs((prev) =>
      prev.map((r) => {
        if (r.id === repairId) {
          return {
            ...r,
            status: 'Completed', // Stage 7
            actualCost: Number(finalCost) || r.estimatedCost || 500,
            technicianNotes: notes || 'Repairs completed and safety test verified.',
            partsReplaced: parts.length > 0 ? parts : (r.partsReplaced?.length ? r.partsReplaced : ['Standard Service Kit']),
            deliveryType: 'ready_for_return',
            completedAt: new Date().toISOString()
          };
        }
        return r;
      })
    );
    addToast('Repair Completed!', `Repair ${repairId} marked as completed. Customer can now review & pay.`, 'success');
  };

  // 9. Shop Owner: Assign Return Delivery
  const assignReturnDelivery = (repairId, deliveryAgentId) => {
    const agent = deliveryAgents.find((a) => a.id === deliveryAgentId) || deliveryAgents[0];
    setRepairs((prev) =>
      prev.map((r) => {
        if (r.id === repairId) {
          return {
            ...r,
            status: 'Out for Delivery', // Stage 8
            assignedDeliveryId: agent.id,
            assignedDeliveryName: agent.name,
            assignedDeliveryPhone: agent.phone,
            deliveryType: 'return_delivery',
            outForDeliveryAt: new Date().toISOString()
          };
        }
        return r;
      })
    );
    addToast(
      'Out for Return Delivery',
      `Assigned return delivery of ${repairId} to ${agent.name}.`,
      'info'
    );
  };

  // 10. Delivery Personnel: Mark Out for Delivery (if assigned earlier as return pending)
  const markOutForDelivery = (repairId) => {
    setRepairs((prev) =>
      prev.map((r) => {
        if (r.id === repairId) {
          return {
            ...r,
            status: 'Out for Delivery', // Stage 8
            deliveryType: 'return_delivery',
            outForDeliveryAt: new Date().toISOString()
          };
        }
        return r;
      })
    );
    addToast('Out for Delivery', `${repairId} is on the way to customer address.`, 'info');
  };

  // 11. Delivery Personnel: Mark Delivered
  const markAsDelivered = (repairId) => {
    setRepairs((prev) =>
      prev.map((r) => {
        if (r.id === repairId) {
          return {
            ...r,
            status: 'Delivered', // Stage 9 (Final)
            deliveryType: 'delivered',
            deliveredAt: new Date().toISOString()
          };
        }
        return r;
      })
    );
    addToast('Delivered!', `Appliance for ${repairId} successfully handed over to customer.`, 'success');
  };

  // 12. Update Repair Cost directly
  const updateRepairCost = (repairId, newCost) => {
    setRepairs((prev) =>
      prev.map((r) => {
        if (r.id === repairId) {
          return {
            ...r,
            estimatedCost: Number(newCost),
            actualCost: Number(newCost)
          };
        }
        return r;
      })
    );
    addToast('Cost Updated', `Estimated repair cost set to ₹${newCost}.`, 'info');
  };

  // 13. Simulated Payment Module
  const processSimulatedPayment = (repairId, method, paymentDetails = {}) => {
    const targetRepair = repairs.find((r) => r.id === repairId);
    if (!targetRepair) return { success: false, error: 'Repair not found' };

    const amount = targetRepair.actualCost || targetRepair.estimatedCost || 500;
    const txnId = `TXN-${method.toUpperCase().slice(0, 4)}-${Math.floor(1000000 + Math.random() * 9000000)}`;

    const newPayment = {
      id: `PAY-${100 + payments.length + 1}`,
      repairId: targetRepair.id,
      customerName: targetRepair.customerName,
      appliance: `${targetRepair.category} - ${targetRepair.brand} ${targetRepair.model}`,
      amount: amount,
      method: method, // 'UPI' | 'Debit/Credit Card' | 'Cash on Delivery'
      status: 'Paid',
      transactionId: txnId,
      date: new Date().toISOString(),
      details: paymentDetails
    };

    setPayments((prev) => [newPayment, ...prev]);

    setRepairs((prev) =>
      prev.map((r) => {
        if (r.id === repairId) {
          return {
            ...r,
            paymentStatus: 'Paid',
            paymentMethod: method,
            paymentId: txnId,
            paidAt: new Date().toISOString()
          };
        }
        return r;
      })
    );

    addToast(
      'Payment Simulated Successfully!',
      `₹${amount} paid via ${method}. Transaction ID: ${txnId}`,
      'success'
    );

    return { success: true, payment: newPayment };
  };

  // 14. Chat: Send Message
  const sendChatMessage = (repairId, text, sender) => {
    if (!text.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      repairId: repairId || 'general',
      senderId: sender.id,
      senderName: sender.name,
      senderRole: sender.role,
      receiverRole: sender.role === 'customer' ? 'owner' : 'customer',
      text: text.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, newMsg]);

    // Simulated auto-reply from Shop Owner if customer sends a message and owner isn't actively chatting
    if (sender.role === 'customer') {
      setTimeout(() => {
        const firstName = sender?.name ? sender.name.split(' ')[0] : 'there';
        const autoReply = {
          id: `msg-reply-${Date.now()}`,
          repairId: repairId || 'general',
          senderId: 'owner-1',
          senderName: 'Suresh Kumar (Shop Owner)',
          senderRole: 'owner',
          receiverRole: 'customer',
          text: `Thank you for reaching out, ${firstName}! Our repair desk has noted your message regarding ${repairId === 'general' ? 'your inquiry' : repairId}. We're on it and will keep you updated.`,
          timestamp: new Date().toISOString()
        };
        setMessages((prev) => [...prev, autoReply]);
        addToast('New Message', 'Shop Owner responded to your query.', 'info');
      }, 1500);
    }
  };

  // Reset to default mock data
  const resetToMockData = () => {
    localStorage.removeItem('mixerfix_repairs');
    localStorage.removeItem('mixerfix_messages');
    localStorage.removeItem('mixerfix_payments');
    setRepairs(INITIAL_REPAIRS);
    setMessages(INITIAL_MESSAGES);
    setPayments(INITIAL_PAYMENTS);
    addToast('Data Reset', 'All records have been restored to initial demo state.', 'info');
  };

  return (
    <RepairContext.Provider
      value={{
        repairs,
        messages,
        payments,
        deliveryAgents,
        toasts,
        addToast,
        removeToast,
        addRepair,
        approveRepair,
        rejectRepair,
        assignPickupDelivery,
        markAsCollected,
        markAsAtShop,
        startRepair,
        completeRepair,
        assignReturnDelivery,
        markOutForDelivery,
        markAsDelivered,
        updateRepairCost,
        processSimulatedPayment,
        sendChatMessage,
        resetToMockData
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
