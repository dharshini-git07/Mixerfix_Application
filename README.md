# Mixer Fix – Smart Electronic Repair Service Application

Mixer Fix is a modern, centralized electronic appliance repair management platform built with **React 18**, **Vite**, **Tailwind CSS**, **Node.js**, **Express.js**, **MongoDB Atlas / Mongoose**, **Socket.IO**, and **JWT Authentication**. It digitalizes the traditional electronic appliance repair process by seamlessly connecting three key user roles:

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

## ⚡ Backend Architecture (Phase 9)

The backend is built in a dedicated `server` folder with **Express.js**, **Mongoose (MongoDB Atlas)**, **JWT Authentication**, **Multer**, **Socket.IO**, and **Nodemailer**.

### Mongoose Models
- **User:** Customer, Shop Owner, and Delivery courier accounts with bcrypt password hashing and JWT token generation.
- **Repair:** Comprehensive ticket tracking appliance category, brand, model, fault, uploaded media, pickup address, costs, and 9-stage status.
- **Delivery:** Pickup and return courier assignment logistics with address and status synchronization.
- **Message:** Live chat messages between customer and shop owner with Socket.IO broadcasting.
- **Payment:** Simulated payment audit records (UPI, Card, COD) with receipt references.

---

## 📡 REST API Reference

### 1. Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | Public |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT | Public |
| `GET` | `/api/auth/me` | Fetch currently authenticated user profile | Private |

### 2. Repairs (`/api/repairs`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/repairs` | Lodge complaint with Multer image/video uploads | Private (Customer) |
| `GET` | `/api/repairs/my-repairs` | Get logged-in customer's repairs | Private (Customer) |
| `GET` | `/api/repairs` | Get all repair requests (filterable) | Private (Owner/Delivery) |
| `GET` | `/api/repairs/:id` | Get single repair details by ID | Private |
| `PATCH`| `/api/repairs/:id/approve` | Approve repair & set initial estimate | Private (Owner) |
| `PATCH`| `/api/repairs/:id/reject` | Reject repair request with reason | Private (Owner) |
| `PATCH`| `/api/repairs/:id/status` | Transition repair across 9 lifecycle stages | Private (Owner/Delivery) |
| `PATCH`| `/api/repairs/:id/cost` | Update estimated or final repair charges | Private (Owner) |

### 3. Deliveries (`/api/deliveries`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/deliveries` | List active pickup & return delivery tasks | Private (Owner/Delivery) |
| `POST` | `/api/deliveries/assign` | Assign courier to pickup/return task | Private (Owner) |
| `PATCH`| `/api/deliveries/:id/status`| Update courier delivery transit status | Private (Owner/Delivery) |

### 4. Real-Time Chat (`/api/chat`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/chat/:repairId` | Fetch message history for a repair ticket | Private |
| `POST` | `/api/chat/:repairId` | Send new chat message (emits via Socket.IO)| Private |

### 5. Payments (`/api/payments`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/payments` | Record simulated payment & update ticket | Private (Customer/Owner)|
| `GET` | `/api/payments` | Retrieve payment receipts & ledger | Private |

---

## 🛠️ Project Structure

```
mixer/
├── index.html
├── package.json              # Frontend dependencies & root orchestration scripts
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env                      # Frontend API & Socket URL configurations
├── .gitignore
│
├── server/                   # Backend Express & MongoDB Application
│   ├── package.json          # Backend dependencies
│   ├── server.js             # Main server entry & Socket.IO initialization
│   ├── .env                  # Port, JWT secret & MongoDB Atlas URI
│   ├── .env.example
│   ├── config/
│   │   └── db.js             # Mongoose database connection
│   ├── models/
│   │   ├── User.js           # Customer, Owner & Delivery courier schemas
│   │   ├── Repair.js         # Repair ticket schema with 9-stage tracking
│   │   ├── Delivery.js       # Logistics & courier task schema
│   │   ├── Message.js        # Chat messaging schema
│   │   └── Payment.js        # Simulated payment receipt schema
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── repairController.js
│   │   ├── deliveryController.js
│   │   ├── chatController.js
│   │   └── paymentController.js
│   ├── middleware/
│   │   ├── authMiddleware.js # JWT verification & role authorization
│   │   ├── uploadMiddleware.js # Multer image/video upload handler
│   │   └── errorMiddleware.js  # Centralized error formatting
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── repairRoutes.js
│   │   ├── deliveryRoutes.js
│   │   ├── chatRoutes.js
│   │   └── paymentRoutes.js
│   ├── utils/
│   │   ├── generateRepairId.js
│   │   ├── emailService.js
│   │   └── seedData.js       # Sample database seeder
│   └── uploads/              # Uploaded media storage
│
└── src/                      # Frontend React Application
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── services/
    │   ├── api.js            # Centralized Axios client & API helpers
    │   └── socket.js         # Socket.IO client instance
    ├── context/
    │   ├── AuthContext.jsx   # Real JWT auth + offline demo fallback
    │   └── RepairContext.jsx # Real-time state, backend sync & Socket.IO
    ├── data/
    │   └── mockData.js       # Offline fallback constants
    ├── routes/
    │   └── AppRoutes.jsx
    ├── components/
    └── pages/
```

---

## 🚀 Running Frontend and Backend

### 1. Configure MongoDB Atlas (Optional but Recommended)
Open `server/.env` and update `MONGODB_URI`:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/mixerfix?retryWrites=true&w=majority
```
*(If you do not have MongoDB running, the application will automatically run in graceful offline demo mode without breaking.)*

### 2. Start Backend Server
```bash
# From root:
npm run server

# Or with live file watching:
npm run server:dev
```
The backend API server will start on **`http://localhost:5000`**.

### 3. Start Frontend Development Server
In a separate terminal:
```bash
npm run dev
```
Open **`http://localhost:5173`** in your browser.
Both the frontend and backend will be live, fully connected, and synchronized in real time!
