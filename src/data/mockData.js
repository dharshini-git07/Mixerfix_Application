// Mixer Fix - Mock Initial Data and Constants

export const REPAIR_STAGES = [
  { id: 'Requested', label: 'Requested', step: 1, description: 'Complaint lodged by customer' },
  { id: 'Approved', label: 'Approved', step: 2, description: 'Shop approved and estimated cost' },
  { id: 'Pickup Assigned', label: 'Pickup Assigned', step: 3, description: 'Delivery agent assigned for pickup' },
  { id: 'Collected', label: 'Collected', step: 4, description: 'Appliance collected from customer' },
  { id: 'At Shop', label: 'At Shop', step: 5, description: 'Appliance received at repair center' },
  { id: 'Repair in Progress', label: 'Repair in Progress', step: 6, description: 'Technician working on appliance' },
  { id: 'Completed', label: 'Completed', step: 7, description: 'Repair completed & quality checked' },
  { id: 'Out for Delivery', label: 'Out for Delivery', step: 8, description: 'Out for return delivery to customer' },
  { id: 'Delivered', label: 'Delivered', step: 9, description: 'Safely delivered back to customer' }
];

export const APPLIANCE_CATEGORIES = [
  {
    id: 'mixer-grinder',
    name: 'Mixer and Grinder',
    icon: 'Blender',
    popularIssues: ['Motor burning smell', 'Coupler damaged', 'Blade jammed', 'High vibration / noise', 'Speed control switch faulty'],
    avgRepairTime: '24 - 48 hrs',
    startingPrice: '₹299',
    image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'refrigerator',
    name: 'Refrigerator',
    icon: 'Refrigerator',
    popularIssues: ['Not cooling', 'Water leaking', 'Excessive ice build-up', 'Compressor clicking sound', 'Door seal broken'],
    avgRepairTime: '2 - 3 days',
    startingPrice: '₹599',
    image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'television',
    name: 'Television',
    icon: 'Tv',
    popularIssues: ['Display lines / dark screen', 'Sound but no picture', 'HDMI / Port damaged', 'Power board failure', 'Remote sensor faulty'],
    avgRepairTime: '2 - 4 days',
    startingPrice: '₹699',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'washing-machine',
    name: 'Washing Machine',
    icon: 'WashingMachine',
    popularIssues: ['Drum not spinning', 'Water drainage error (OE/E2)', 'Heavy vibration', 'Water inlet issue (IE)', 'PCB error code'],
    avgRepairTime: '1 - 3 days',
    startingPrice: '₹499',
    image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'electric-fan',
    name: 'Electric Fan',
    icon: 'Fan',
    popularIssues: ['Slow rotation speed', 'Capacitor burnt', 'Bearing noise', 'Oscillation jammed', 'Winding coil burnt'],
    avgRepairTime: '12 - 24 hrs',
    startingPrice: '₹199',
    image: 'https://images.unsplash.com/photo-1618941716939-553df3c6c278?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'water-purifier',
    name: 'Water Purifier',
    icon: 'Droplets',
    popularIssues: ['Water taste bad', 'Continuous beep alarm', 'RO membrane choked', 'Low water flow rate', 'Booster pump failure'],
    avgRepairTime: '24 - 48 hrs',
    startingPrice: '₹399',
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'microwave-oven',
    name: 'Microwave Oven',
    icon: 'Microwave',
    popularIssues: ['Not heating food', 'Turntable plate not rotating', 'Sparking inside chamber', 'Touch panel buttons dead', 'Door switch fault'],
    avgRepairTime: '1 - 2 days',
    startingPrice: '₹449',
    image: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'other-appliances',
    name: 'Other Appliances',
    icon: 'Cpu',
    popularIssues: ['Induction cooktop error E0', 'Air fryer not heating', 'Toaster lever jammed', 'Electric iron thermostat dead', 'Vacuum cleaner suction loss'],
    avgRepairTime: '24 - 48 hrs',
    startingPrice: '₹249',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80'
  }
];

export const POPULAR_BRANDS = [
  'Philips', 'Prestige', 'Bajaj', 'LG', 'Samsung', 'IFB', 'Whirlpool', 'Bosch', 'Havells', 'Usha', 'Kent', 'Aquaguard', 'Morphy Richards', 'Panasonic', 'Sony', 'Other'
];

export const INITIAL_USERS = [
  {
    id: 'cust-1',
    name: 'Rahul Sharma',
    email: 'customer@mixerfix.com',
    phone: '+91 98765 43210',
    role: 'customer',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    address: 'Flat 402, Green Valley Heights, 12th Main, Indiranagar',
    city: 'Bengaluru',
    pincode: '560038'
  },
  {
    id: 'owner-1',
    name: 'Suresh Kumar',
    shopName: 'Master Electronics Workshop & Spares',
    email: 'owner@mixerfix.com',
    phone: '+91 98234 56789',
    role: 'owner',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    address: 'Shop #14, Tech Plaza, Brigade Road',
    city: 'Bengaluru',
    pincode: '560001'
  },
  {
    id: 'del-1',
    name: 'Amit Patel',
    email: 'delivery@mixerfix.com',
    phone: '+91 91234 56780',
    role: 'delivery',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
    vehicle: 'Hero Electric Nyx (KA-03-EM-8472)',
    zone: 'East Bengaluru (Indiranagar / Koramangala / Whitefield)',
    activeDeliveriesCount: 2,
    completedCount: 38
  },
  {
    id: 'del-2',
    name: 'Vikram Singh',
    email: 'vikram.delivery@mixerfix.com',
    phone: '+91 99887 76655',
    role: 'delivery',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    vehicle: 'Bajaj Chetak EV (KA-05-JX-1190)',
    zone: 'South Bengaluru (Jayanagar / JP Nagar)',
    activeDeliveriesCount: 1,
    completedCount: 42
  },
  {
    id: 'del-3',
    name: 'Karthik Rao',
    email: 'karthik.delivery@mixerfix.com',
    phone: '+91 97766 55443',
    role: 'delivery',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    vehicle: 'Ather 450X (KA-04-HE-7721)',
    zone: 'North Bengaluru (Hebbal / Yelahanka)',
    activeDeliveriesCount: 0,
    completedCount: 29
  }
];

export const INITIAL_REPAIRS = [
  {
    id: 'REP-1001',
    customerId: 'cust-1',
    customerName: 'Rahul Sharma',
    customerPhone: '+91 98765 43210',
    customerEmail: 'customer@mixerfix.com',
    category: 'Mixer and Grinder',
    brand: 'Philips',
    model: 'HL7756/00 750W Turbo',
    problem: 'Motor makes loud humming noise, jar coupler is shredded and slight burning smell on speed 3.',
    images: [
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80'
    ],
    videos: [],
    pickupAddress: 'Flat 402, Green Valley Heights, 12th Main, Indiranagar',
    city: 'Bengaluru',
    pincode: '560038',
    preferredDate: '2026-11-18',
    preferredTimeSlot: '10:00 AM - 01:00 PM',
    status: 'Repair in Progress', // 6th stage
    estimatedCost: 650,
    actualCost: 650,
    partsReplaced: ['Heavy Duty Coupler Teeth', 'Carbon Brushes (Pair)'],
    technicianNotes: 'Armature windings tested OK. Replaced worn carbon brushes and motor coupler. Final balancing underway.',
    assignedDeliveryId: 'del-1',
    assignedDeliveryName: 'Amit Patel',
    assignedDeliveryPhone: '+91 91234 56780',
    deliveryType: 'pickup_completed',
    createdAt: '2026-11-15T09:30:00.000Z',
    approvedAt: '2026-11-15T11:00:00.000Z',
    pickupAssignedAt: '2026-11-15T11:30:00.000Z',
    collectedAt: '2026-11-16T10:15:00.000Z',
    atShopAt: '2026-11-16T12:00:00.000Z',
    paymentStatus: 'Pending',
    paymentMethod: null,
    paymentId: null
  },
  {
    id: 'REP-1002',
    customerId: 'cust-1',
    customerName: 'Rahul Sharma',
    customerPhone: '+91 98765 43210',
    customerEmail: 'customer@mixerfix.com',
    category: 'Microwave Oven',
    brand: 'IFB',
    model: '20PG3S 20L Grill',
    problem: 'Display turns on but keypad touch buttons for start and timer are unresponsive.',
    images: [
      'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&auto=format&fit=crop&q=80'
    ],
    videos: [],
    pickupAddress: 'Flat 402, Green Valley Heights, 12th Main, Indiranagar',
    city: 'Bengaluru',
    pincode: '560038',
    preferredDate: '2026-11-19',
    preferredTimeSlot: '02:00 PM - 05:00 PM',
    status: 'Pickup Assigned', // 3rd stage
    estimatedCost: 850,
    actualCost: null,
    partsReplaced: [],
    technicianNotes: 'Membrane touch panel ribbon cable requires replacement or connector pin repair.',
    assignedDeliveryId: 'del-1',
    assignedDeliveryName: 'Amit Patel',
    assignedDeliveryPhone: '+91 91234 56780',
    deliveryType: 'pickup',
    createdAt: '2026-11-16T14:20:00.000Z',
    approvedAt: '2026-11-16T16:00:00.000Z',
    pickupAssignedAt: '2026-11-17T08:30:00.000Z',
    paymentStatus: 'Pending',
    paymentMethod: null,
    paymentId: null
  },
  {
    id: 'REP-1003',
    customerId: 'cust-1',
    customerName: 'Rahul Sharma',
    customerPhone: '+91 98765 43210',
    customerEmail: 'customer@mixerfix.com',
    category: 'Washing Machine',
    brand: 'LG',
    model: 'FHM1207ZDL 7.0 Kg Inverter Direct Drive',
    problem: 'Showing error IE (Water Inlet Error). Water supply pressure is adequate, seems inlet solenoid valve is clogged or faulty.',
    images: [
      'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&auto=format&fit=crop&q=80'
    ],
    videos: [],
    pickupAddress: 'Flat 402, Green Valley Heights, 12th Main, Indiranagar',
    city: 'Bengaluru',
    pincode: '560038',
    preferredDate: '2026-11-20',
    preferredTimeSlot: '11:00 AM - 02:00 PM',
    status: 'Requested', // 1st stage
    estimatedCost: null,
    actualCost: null,
    partsReplaced: [],
    technicianNotes: '',
    assignedDeliveryId: null,
    assignedDeliveryName: null,
    assignedDeliveryPhone: null,
    deliveryType: null,
    createdAt: '2026-11-17T06:50:00.000Z',
    paymentStatus: 'Pending',
    paymentMethod: null,
    paymentId: null
  },
  {
    id: 'REP-1004',
    customerId: 'cust-1',
    customerName: 'Rahul Sharma',
    customerPhone: '+91 98765 43210',
    customerEmail: 'customer@mixerfix.com',
    category: 'Refrigerator',
    brand: 'Samsung',
    model: 'RT28T3742S8/HL 253L Digital Inverter',
    problem: 'Freezer cooling properly, but lower vegetable crisper and beverage compartment is lukewarm.',
    images: [
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=600&auto=format&fit=crop&q=80'
    ],
    videos: [],
    pickupAddress: 'Flat 402, Green Valley Heights, 12th Main, Indiranagar',
    city: 'Bengaluru',
    pincode: '560038',
    preferredDate: '2026-11-10',
    preferredTimeSlot: '10:00 AM - 01:00 PM',
    status: 'Completed', // 7th stage - ready for payment or return delivery assignment
    estimatedCost: 1200,
    actualCost: 1200,
    partsReplaced: ['Defrost Timer Bi-metal Sensor', 'Air Damper Thermostat'],
    technicianNotes: 'Evaporator coil ice-clog cleared. Defrost heater sensor replaced. Air passage re-calibrated. Tested cooling 4°C in fridge.',
    assignedDeliveryId: 'del-2',
    assignedDeliveryName: 'Vikram Singh',
    assignedDeliveryPhone: '+91 99887 76655',
    deliveryType: 'ready_for_return',
    createdAt: '2026-11-10T10:00:00.000Z',
    approvedAt: '2026-11-10T11:30:00.000Z',
    pickupAssignedAt: '2026-11-10T13:00:00.000Z',
    collectedAt: '2026-11-11T11:00:00.000Z',
    atShopAt: '2026-11-11T13:30:00.000Z',
    completedAt: '2026-11-13T17:00:00.000Z',
    paymentStatus: 'Paid',
    paymentMethod: 'UPI',
    paymentId: 'TXN-UPI-9847291',
    paidAt: '2026-11-14T09:15:00.000Z'
  },
  {
    id: 'REP-1005',
    customerId: 'cust-1',
    customerName: 'Rahul Sharma',
    customerPhone: '+91 98765 43210',
    customerEmail: 'customer@mixerfix.com',
    category: 'Television',
    brand: 'Sony',
    model: 'Bravia KD-43X75K 4K Ultra HD',
    problem: 'Audio working crystal clear but screen was flashing green vertical raster bars across center.',
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&auto=format&fit=crop&q=80'
    ],
    videos: [],
    pickupAddress: 'Flat 402, Green Valley Heights, 12th Main, Indiranagar',
    city: 'Bengaluru',
    pincode: '560038',
    preferredDate: '2026-11-01',
    preferredTimeSlot: '03:00 PM - 06:00 PM',
    status: 'Delivered', // 9th stage - fully complete cycle
    estimatedCost: 1950,
    actualCost: 1950,
    partsReplaced: ['T-Con Board FPC Ribbon Cable', 'Gamma Voltage IC'],
    technicianNotes: 'FPC bonding inspected and re-seated. Gamma IC resoldered on timing controller. 48-hour burn-in test passed with 100% color accuracy.',
    assignedDeliveryId: 'del-1',
    assignedDeliveryName: 'Amit Patel',
    assignedDeliveryPhone: '+91 91234 56780',
    deliveryType: 'delivered',
    createdAt: '2026-11-01T08:00:00.000Z',
    approvedAt: '2026-11-01T09:30:00.000Z',
    pickupAssignedAt: '2026-11-01T10:00:00.000Z',
    collectedAt: '2026-11-01T15:00:00.000Z',
    atShopAt: '2026-11-01T17:30:00.000Z',
    completedAt: '2026-11-03T14:00:00.000Z',
    outForDeliveryAt: '2026-11-04T10:00:00.000Z',
    deliveredAt: '2026-11-04T14:30:00.000Z',
    paymentStatus: 'Paid',
    paymentMethod: 'Debit Card',
    paymentId: 'TXN-CARD-4421890',
    paidAt: '2026-11-04T14:35:00.000Z'
  }
];

export const INITIAL_MESSAGES = [
  {
    id: 'msg-1',
    repairId: 'REP-1001',
    senderId: 'cust-1',
    senderName: 'Rahul Sharma',
    senderRole: 'customer',
    receiverRole: 'owner',
    text: 'Hello Suresh ji, did you inspect the Philips mixer motor? Is the winding safe?',
    timestamp: '2026-11-16T13:10:00.000Z'
  },
  {
    id: 'msg-2',
    repairId: 'REP-1001',
    senderId: 'owner-1',
    senderName: 'Suresh Kumar (Shop Owner)',
    senderRole: 'owner',
    receiverRole: 'customer',
    text: 'Hello Rahul! Yes, we opened the motor housing. Fortunately copper winding is intact, only the carbon brushes and the top jar coupler were stripped. We are installing heavy duty original replacements.',
    timestamp: '2026-11-16T13:45:00.000Z'
  },
  {
    id: 'msg-3',
    repairId: 'REP-1001',
    senderId: 'cust-1',
    senderName: 'Rahul Sharma',
    senderRole: 'customer',
    receiverRole: 'owner',
    text: 'That is great news! Please ensure the coupler alignment is checked so jars don\'t wobble.',
    timestamp: '2026-11-16T14:00:00.000Z'
  },
  {
    id: 'msg-4',
    repairId: 'REP-1001',
    senderId: 'owner-1',
    senderName: 'Suresh Kumar (Shop Owner)',
    senderRole: 'owner',
    receiverRole: 'customer',
    text: 'Absolutely! We do a 10-minute dynamic load test with water in the jar before clearing.',
    timestamp: '2026-11-16T14:20:00.000Z'
  },
  {
    id: 'msg-5',
    repairId: 'REP-1002',
    senderId: 'cust-1',
    senderName: 'Rahul Sharma',
    senderRole: 'customer',
    receiverRole: 'owner',
    text: 'Hi, when will the delivery personnel come for the IFB microwave pickup?',
    timestamp: '2026-11-17T09:00:00.000Z'
  },
  {
    id: 'msg-6',
    repairId: 'REP-1002',
    senderId: 'owner-1',
    senderName: 'Suresh Kumar (Shop Owner)',
    senderRole: 'owner',
    receiverRole: 'customer',
    text: 'Amit Patel is assigned and will arrive at your address during your chosen slot (2:00 PM - 5:00 PM). He will carry protective bubble wrap packaging.',
    timestamp: '2026-11-17T09:15:00.000Z'
  }
];

export const INITIAL_PAYMENTS = [
  {
    id: 'PAY-101',
    repairId: 'REP-1005',
    customerName: 'Rahul Sharma',
    appliance: 'Television - Sony Bravia KD-43X75K',
    amount: 1950,
    method: 'Debit Card',
    cardLast4: '4092',
    status: 'Paid',
    transactionId: 'TXN-CARD-4421890',
    date: '2026-11-04T14:35:00.000Z'
  },
  {
    id: 'PAY-102',
    repairId: 'REP-1004',
    customerName: 'Rahul Sharma',
    appliance: 'Refrigerator - Samsung 253L Double Door',
    amount: 1200,
    method: 'UPI',
    upiId: 'rahul.sharma@okaxis',
    status: 'Paid',
    transactionId: 'TXN-UPI-9847291',
    date: '2026-11-14T09:15:00.000Z'
  }
];
