import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/public/LandingPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import DashboardLayout from '../components/layout/DashboardLayout';

// Customer Pages
import CustomerOverview from '../pages/customer/CustomerOverview';
import NewRepairRequest from '../pages/customer/NewRepairRequest';
import MyRepairs from '../pages/customer/MyRepairs';
import CustomerChat from '../pages/customer/CustomerChat';
import CustomerPayments from '../pages/customer/CustomerPayments';
import CustomerProfile from '../pages/customer/CustomerProfile';

// Shop Owner Pages
import OwnerDashboard from '../pages/owner/OwnerDashboard';
import RepairRequests from '../pages/owner/RepairRequests';
import ApprovedRequests from '../pages/owner/ApprovedRequests';
import CustomerList from '../pages/owner/CustomerList';
import DeliveryManagement from '../pages/owner/DeliveryManagement';
import OwnerChat from '../pages/owner/OwnerChat';
import OwnerPayments from '../pages/owner/OwnerPayments';
import OwnerProfile from '../pages/owner/OwnerProfile';

// Delivery Pages
import DeliveryOverview from '../pages/delivery/DeliveryOverview';
import AssignedDeliveries from '../pages/delivery/AssignedDeliveries';
import PickupTasks from '../pages/delivery/PickupTasks';
import ReturnDeliveries from '../pages/delivery/ReturnDeliveries';
import DeliveryProfile from '../pages/delivery/DeliveryProfile';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Customer Routes */}
      <Route path="/customer" element={<DashboardLayout role="customer" />}>
        <Route index element={<Navigate to="/customer/overview" replace />} />
        <Route path="overview" element={<CustomerOverview />} />
        <Route path="new-repair" element={<NewRepairRequest />} />
        <Route path="new-request" element={<NewRepairRequest />} />
        <Route path="my-repairs" element={<MyRepairs />} />
        <Route path="chat" element={<CustomerChat />} />
        <Route path="payments" element={<CustomerPayments />} />
        <Route path="profile" element={<CustomerProfile />} />
      </Route>

      {/* Shop Owner Routes */}
      <Route path="/owner" element={<DashboardLayout role="owner" />}>
        <Route index element={<Navigate to="/owner/dashboard" replace />} />
        <Route path="dashboard" element={<OwnerDashboard />} />
        <Route path="requests" element={<RepairRequests />} />
        <Route path="approved" element={<ApprovedRequests />} />
        <Route path="customers" element={<CustomerList />} />
        <Route path="deliveries" element={<DeliveryManagement />} />
        <Route path="delivery" element={<DeliveryManagement />} />
        <Route path="chat" element={<OwnerChat />} />
        <Route path="payments" element={<OwnerPayments />} />
        <Route path="profile" element={<OwnerProfile />} />
      </Route>

      {/* Delivery Personnel Routes */}
      <Route path="/delivery" element={<DashboardLayout role="delivery" />}>
        <Route index element={<Navigate to="/delivery/overview" replace />} />
        <Route path="overview" element={<DeliveryOverview />} />
        <Route path="assigned" element={<AssignedDeliveries />} />
        <Route path="pickup" element={<PickupTasks />} />
        <Route path="pickups" element={<PickupTasks />} />
        <Route path="returns" element={<ReturnDeliveries />} />
        <Route path="profile" element={<DeliveryProfile />} />
      </Route>

      {/* 404 Catch All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
