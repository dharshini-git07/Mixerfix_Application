import axios from 'axios';

// Support VITE_API_BASE_URL (standard production) and VITE_API_URL (fallback)
const configuredUrl =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api';

const cleanBaseUrl = configuredUrl.replace(/\/+$/, '');
export const API_BASE_URL = cleanBaseUrl.endsWith('/api') ? cleanBaseUrl : `${cleanBaseUrl}/api`;

// Create configured Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor: Attach JWT bearer token to outbound requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mixerfix_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor: Handle response errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred.';
    return Promise.reject(new Error(message));
  }
);

// ==========================================
// Authentication APIs
// ==========================================
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
};

// ==========================================
// Repair Management APIs
// ==========================================
export const repairsAPI = {
  createRepair: (formData) => {
    // If formData contains File objects, send as multipart/form-data
    if (formData instanceof FormData) {
      return api.post('/repairs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return api.post('/repairs', formData);
  },
  getMyRepairs: () => api.get('/repairs/my-repairs'),
  getAllRepairs: (params) => api.get('/repairs', { params }),
  getRepairById: (id) => api.get(`/repairs/${id}`),
  approveRepair: (id, payload) => api.patch(`/repairs/${id}/approve`, payload),
  rejectRepair: (id, payload) => api.patch(`/repairs/${id}/reject`, payload),
  updateStatus: (id, payload) => api.patch(`/repairs/${id}/status`, payload),
  updateCost: (id, payload) => api.patch(`/repairs/${id}/cost`, payload),
};

// ==========================================
// Delivery APIs
// ==========================================
export const deliveriesAPI = {
  getDeliveries: (params) => api.get('/deliveries', { params }),
  assignDelivery: (payload) => api.post('/deliveries/assign', payload),
  updateDeliveryStatus: (id, payload) => api.patch(`/deliveries/${id}/status`, payload),
};

// ==========================================
// Chat APIs
// ==========================================
export const chatAPI = {
  getMessages: (repairId) => api.get(`/chat/${repairId}`),
  sendMessage: (repairId, payload) => api.post(`/chat/${repairId}`, payload),
};

// ==========================================
// Payment APIs
// ==========================================
export const paymentsAPI = {
  createRazorpayOrder: (payload) => api.post('/payments/create-order', payload),
  verifyRazorpayPayment: (payload) => api.post('/payments/verify', payload),
  getMyPayments: () => api.get('/payments/my-payments'),
  getPaymentById: (paymentId) => api.get(`/payments/${paymentId}`),
  createPayment: (payload) => api.post('/payments', payload),
  getPayments: (params) => api.get('/payments', { params }),
};

// ==========================================
// User & Fleet APIs
// ==========================================
export const usersAPI = {
  updateProfile: (profileData) => api.put('/users/profile', profileData),
  getUsers: (params) => api.get('/users', { params }),
  getDeliveryAgents: () => api.get('/users/delivery-agents'),
};

export default api;
