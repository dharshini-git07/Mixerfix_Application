# Mixer Fix – Smart Electronic Repair Service Application

Mixer Fix is a modern, centralized electronic appliance repair platform built with **React 18**, **Vite**, **Tailwind CSS**, and **Lucide React**. It seamlessly digitalizes the traditional electronic appliance repair process by connecting three key user roles:

1. **Customer:** Register repair complaints with photos/videos, track 9-stage repair progress, chat with shop owners, and complete simulated payments (UPI, Card, COD).
2. **Shop Owner:** Manage inbound repair requests, review appliance faults, estimate repair charges, advance workbench repair stages, and dispatch delivery personnel.
3. **Delivery Personnel:** View doorstep pickup and return delivery assignments, navigate customer addresses, and update transit statuses in real time.

---

## 🎨 Design System

- **Primary Color:** `#087F75` (Deep Teal)
- **Secondary Color:** `#142D3A` (Navy Slate)
- **Background:** `#F5F8F8`
- **Card Background:** `#FFFFFF`
- **Accent:** `#DDF4EF` (Soft Mint)
- **Primary Text:** `#263238`
- **Secondary Text:** `#718096`
- **Status Indicators:** Success (`#16A34A`), Warning (`#F59E0B`), Danger (`#DC2626`)
- **Typography:** Inter / Poppins

---

## 🔑 Demo Login Credentials

You can log in directly using the 1-click **Demo Login** buttons on `/login` or use the persistent floating role switcher pill in the bottom right corner of the screen:

| Role | Email | Password |
|---|---|---|
| **Customer** | `customer@mixerfix.com` | `password123` |
| **Shop Owner** | `owner@mixerfix.com` | `password123` |
| **Delivery Personnel** | `delivery@mixerfix.com` | `password123` |

---

## 🔄 9-Stage Repair Lifecycle

1. **Requested:** Customer submits complaint form with issue description and photos.
2. **Approved:** Shop owner reviews and approves the repair request.
3. **Pickup Assigned:** Courier is dispatched to collect the appliance from customer's doorstep.
4. **Collected:** Delivery personnel collects the appliance.
5. **At Shop:** Appliance reaches workshop workbench.
6. **Repair in Progress:** Technician inspects, replaces components, and conducts safety tests.
7. **Completed:** Repair is finished and cost quote is confirmed.
8. **Out for Delivery:** Courier is returning the fixed appliance to the customer.
9. **Delivered:** Customer inspects and receives appliance; simulated payment is marked settled.

---

## 🛠️ Project Structure

```
mixer/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .gitignore
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── context/
│   │   ├── AuthContext.jsx       # Authentication & role management
│   │   └── RepairContext.jsx     # Shared state, 9-stage sync, messaging, payments
│   ├── data/
│   │   └── mockData.js           # Appliance categories, initial repairs & chats
│   ├── routes/
│   │   └── AppRoutes.jsx         # Role-based protected routes
│   ├── components/
│   │   ├── common/
│   │   │   ├── StatusBadge.jsx
│   │   │   ├── ProgressTracker.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── ToastContainer.jsx
│   │   │   ├── DemoRoleSwitcher.jsx
│   │   │   └── EmptyState.jsx
│   │   └── layout/
│   │       ├── Navbar.jsx
│   │       ├── Footer.jsx
│   │       └── DashboardLayout.jsx
│   └── pages/
│       ├── public/
│       │   └── LandingPage.jsx
│       ├── auth/
│       │   ├── LoginPage.jsx
│       │   └── RegisterPage.jsx
│       ├── customer/
│       │   ├── CustomerOverview.jsx
│       │   ├── NewRepairRequest.jsx
│       │   ├── MyRepairs.jsx
│       │   ├── CustomerChat.jsx
│       │   ├── CustomerPayments.jsx
│       │   └── CustomerProfile.jsx
│       ├── owner/
│       │   ├── OwnerDashboard.jsx
│       │   ├── RepairRequests.jsx
│       │   ├── ApprovedRequests.jsx
│       │   ├── CustomerList.jsx
│       │   ├── DeliveryManagement.jsx
│       │   ├── OwnerChat.jsx
│       │   ├── OwnerPayments.jsx
│       │   └── OwnerProfile.jsx
│       └── delivery/
│           ├── DeliveryOverview.jsx
│           ├── AssignedDeliveries.jsx
│           ├── PickupTasks.jsx
│           ├── ReturnDeliveries.jsx
│           └── DeliveryProfile.jsx
```

---

## 🚀 Running the Project

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build
```
