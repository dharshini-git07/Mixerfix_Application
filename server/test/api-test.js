// Standalone API Integration Tester for Mixer Fix
const BASE_URL = process.env.API_URL || 'http://localhost:5000/api';

async function runTests() {
  console.log('--- STARTING MIXER FIX BACKEND API VERIFICATION SUITE ---');
  console.log(`Target Base URL: ${BASE_URL}\n`);

  let customerToken = '';
  let ownerToken = '';
  let deliveryToken = '';
  let testRepairId = '';

  // 1. Health check
  try {
    const healthRes = await fetch(`${BASE_URL}/health`);
    const health = await healthRes.json();
    console.log('✓ [Health Check]:', health.status === 'ok' ? 'PASSED' : 'FAILED', health);
  } catch (e) {
    console.error('✗ [Health Check Failed - Is server running?]:', e.message);
    return;
  }

  // 2. Auth: Register Customer
  try {
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Automated Test Customer',
        email: `test-${Date.now()}@mixerfix.com`,
        phone: '+91 99887 11223',
        password: 'password123',
        role: 'customer',
        address: 'MG Road Test Residence',
      }),
    });
    const regData = await regRes.json();
    console.log('✓ [POST /api/auth/register]:', regData.success ? 'PASSED' : 'FAILED');
    if (regData.token) customerToken = regData.token;
  } catch (e) {
    console.error('✗ [Register Test]:', e.message);
  }

  // 3. Auth: Login Owner
  try {
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'owner@mixerfix.com',
        password: 'password123',
      }),
    });
    const loginData = await loginRes.json();
    console.log('✓ [POST /api/auth/login (Owner)]:', loginData.success ? 'PASSED' : 'FAILED');
    if (loginData.token) ownerToken = loginData.token;
  } catch (e) {
    console.error('✗ [Owner Login Test]:', e.message);
  }

  // 4. Auth: Get Current Profile
  if (customerToken) {
    try {
      const meRes = await fetch(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${customerToken}` },
      });
      const meData = await meRes.json();
      console.log('✓ [GET /api/auth/me]:', meData.success ? 'PASSED' : 'FAILED', `User: ${meData.user?.name}`);
    } catch (e) {
      console.error('✗ [GetMe Test]:', e.message);
    }
  }

  // 5. Repairs: Create Complaint
  if (customerToken) {
    try {
      const repairRes = await fetch(`${BASE_URL}/repairs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerToken}`,
        },
        body: JSON.stringify({
          category: 'Mixer and Grinder',
          brand: 'Prestige',
          model: 'Iris 750W',
          problem: 'Blade jammed and heavy spark at speed control dial.',
          pickupAddress: '7th Cross Indiranagar',
          preferredPickupDate: '2026-11-20',
        }),
      });
      const repairData = await repairRes.json();
      console.log('✓ [POST /api/repairs (Create Complaint)]:', repairData.success ? 'PASSED' : 'FAILED');
      if (repairData.repair) {
        testRepairId = repairData.repair.repairId;
        console.log(`   Generated Repair ID: ${testRepairId}`);
      }
    } catch (e) {
      console.error('✗ [Create Repair Test]:', e.message);
    }
  }

  // 6. Repairs: Get My Repairs
  if (customerToken) {
    try {
      const myRes = await fetch(`${BASE_URL}/repairs/my-repairs`, {
        headers: { Authorization: `Bearer ${customerToken}` },
      });
      const myData = await myRes.json();
      console.log('✓ [GET /api/repairs/my-repairs]:', myData.success ? 'PASSED' : 'FAILED', `Count: ${myData.count}`);
    } catch (e) {
      console.error('✗ [Get My Repairs Test]:', e.message);
    }
  }

  // 7. Repairs: Shop Owner Approval & Cost Update
  if (ownerToken && testRepairId) {
    try {
      const appRes = await fetch(`${BASE_URL}/repairs/${testRepairId}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ownerToken}`,
        },
        body: JSON.stringify({
          estimatedCost: 750,
          notes: 'Tested coupler and brush assembly. Approved for service.',
        }),
      });
      const appData = await appRes.json();
      console.log('✓ [PATCH /api/repairs/:id/approve]:', appData.success ? 'PASSED' : 'FAILED');
    } catch (e) {
      console.error('✗ [Approve Repair Test]:', e.message);
    }
  }

  // 8. Deliveries: Assign Courier
  if (ownerToken && testRepairId) {
    try {
      const assignRes = await fetch(`${BASE_URL}/deliveries/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ownerToken}`,
        },
        body: JSON.stringify({
          repairId: testRepairId,
          courierName: 'Amit Patel',
          deliveryType: 'pickup',
        }),
      });
      const assignData = await assignRes.json();
      console.log('✓ [POST /api/deliveries/assign]:', assignData.success ? 'PASSED' : 'FAILED');
    } catch (e) {
      console.error('✗ [Assign Delivery Test]:', e.message);
    }
  }

  // 9. Chat: Send & Retrieve Messages
  if (customerToken && testRepairId) {
    try {
      const sendRes = await fetch(`${BASE_URL}/chat/${testRepairId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerToken}`,
        },
        body: JSON.stringify({
          content: 'Hello, what is the expected turnaround time for this mixer repair?',
        }),
      });
      const sendData = await sendRes.json();
      console.log('✓ [POST /api/chat/:repairId]:', sendData.success ? 'PASSED' : 'FAILED');

      const getRes = await fetch(`${BASE_URL}/chat/${testRepairId}`, {
        headers: { Authorization: `Bearer ${customerToken}` },
      });
      const getData = await getRes.json();
      console.log('✓ [GET /api/chat/:repairId]:', getData.success ? 'PASSED' : 'FAILED', `Messages: ${getData.count}`);
    } catch (e) {
      console.error('✗ [Chat Test]:', e.message);
    }
  }

  // 10. Payments: Simulated Checkout
  if (customerToken && testRepairId) {
    try {
      const payRes = await fetch(`${BASE_URL}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerToken}`,
        },
        body: JSON.stringify({
          repairId: testRepairId,
          amount: 750,
          paymentMethod: 'UPI',
        }),
      });
      const payData = await payRes.json();
      console.log('✓ [POST /api/payments]:', payData.success ? 'PASSED' : 'FAILED', `Tx: ${payData.payment?.transactionReference}`);
    } catch (e) {
      console.error('✗ [Payment Test]:', e.message);
    }
  }

  console.log('\n--- ALL BACKEND API VERIFICATIONS EXECUTED ---');
}

runTests();
