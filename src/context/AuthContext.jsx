import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USERS } from '../data/mockData';
import { authAPI, usersAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Load initial users from localStorage or default
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('mixerfix_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  // Current logged in user (defaults to Customer for quick start)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('mixerfix_current_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0]; // Rahul Sharma (Customer)
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('mixerfix_token') || null;
  });

  const [isBackendOnline, setIsBackendOnline] = useState(false);

  // Sync users to localStorage
  useEffect(() => {
    localStorage.setItem('mixerfix_users', JSON.stringify(users));
  }, [users]);

  // Sync currentUser and token to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('mixerfix_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('mixerfix_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('mixerfix_token', token);
    } else {
      localStorage.removeItem('mixerfix_token');
    }
  }, [token]);

  // Validate session against backend if token exists
  useEffect(() => {
    const verifySession = async () => {
      const storedToken = localStorage.getItem('mixerfix_token');
      if (storedToken) {
        try {
          const res = await authAPI.getMe();
          if (res.success && res.user) {
            setCurrentUser(res.user);
            setIsBackendOnline(true);
          }
        } catch (err) {
          // Keep offline state
        }
      }
    };
    verifySession();
  }, []);

  // Login action (Attempts backend API, smoothly falls back to mock demo)
  const login = async (email, password, expectedRole) => {
    // 1. Try real Backend API
    try {
      const res = await authAPI.login({ email, password, expectedRole });
      if (res.success && res.token) {
        setToken(res.token);
        setCurrentUser(res.user);
        setIsBackendOnline(true);
        return { success: true, user: res.user };
      }
    } catch (apiError) {
      // Backend not running or invalid credentials - try local fallback
    }

    // 2. Mock Fallback
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanRole = (expectedRole || '').trim().toLowerCase();

    const foundUser = users.find(
      (u) => (u.email || '').trim().toLowerCase() === cleanEmail && u.password === password
    );

    if (foundUser) {
      const userRole = (foundUser.role || '').toLowerCase();
      if (cleanRole && userRole !== cleanRole) {
        return {
          success: false,
          error: `This account is registered as ${foundUser.role.toUpperCase()}, not ${expectedRole.toUpperCase()}. Please select the correct role tab.`,
        };
      }
      setCurrentUser(foundUser);
      return { success: true, user: foundUser };
    }

    // Allow flexible demo login if matches standard credentials
    const targetRole = cleanRole || 'customer';
    const roleFallback = users.find((u) => (u.role || '').toLowerCase() === targetRole);
    if (password === 'password123' && roleFallback) {
      setCurrentUser(roleFallback);
      return { success: true, user: roleFallback };
    }

    return {
      success: false,
      error: 'Invalid email or password. You can also use one of the Demo Quick Login buttons below.',
    };
  };

  // Switch demo account directly
  const switchDemoRole = (role) => {
    const targetRole = (role || '').toLowerCase();
    const user = users.find((u) => (u.role || '').toLowerCase() === targetRole);
    if (user) {
      setCurrentUser(user);
      return user;
    }
    return null;
  };

  // Register new user (Attempts backend API, falls back to local)
  const register = async (userData) => {
    const role = (userData.role || 'customer').toLowerCase();
    const fullName = (userData.fullName || userData.name || '').trim();
    const email = (userData.email || '').trim().toLowerCase();
    const phone = (userData.phone || '').trim();

    try {
      const res = await authAPI.register({
        name: fullName,
        email,
        phone,
        password: userData.password,
        role,
        address: userData.address || '',
        city: userData.city || 'Bangalore',
        pincode: userData.pincode || '560038',
        shopName: role === 'owner' ? (userData.shopName || `${fullName}'s Workshop`) : undefined,
        vehicle: role === 'delivery' ? (userData.vehicle || 'Electric Two-Wheeler (EV)') : undefined,
        vehicleNumber: role === 'delivery' ? (userData.vehicleNumber || 'KA-04-DL-9821') : undefined,
        zone: role === 'delivery' ? (userData.zone || 'Central & East Bengaluru') : undefined,
        dutyStatus: role === 'delivery' ? 'Active on Duty' : undefined,
      });

      if (res.success && res.token) {
        setToken(res.token);
        setCurrentUser(res.user);
        setIsBackendOnline(true);

        // Keep local user store in sync
        setUsers((prev) => {
          const filtered = prev.filter((u) => u.email.toLowerCase() !== email);
          return [...filtered, { ...res.user, password: userData.password }];
        });

        // Notify app components (e.g. RepairContext for delivery roster)
        window.dispatchEvent(new CustomEvent('mixerfix:user_registered', { detail: res.user }));

        return { success: true, user: res.user };
      }
    } catch (apiError) {
      // If server responded with a 400 error (e.g. duplicate email), surface it
      const isOffline =
        apiError.message?.includes('Network Error') ||
        apiError.message?.includes('ECONNREFUSED') ||
        apiError.message?.includes('Failed to fetch') ||
        !apiError.response;

      if (!isOffline && apiError.response?.data?.message) {
        return { success: false, error: apiError.response.data.message };
      }
    }

    // Local / Offline Registration Fallback
    const existing = users.find((u) => (u.email || '').toLowerCase() === email);
    if (existing) {
      return { success: false, error: 'An account with this email address already exists. Please sign in instead.' };
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: fullName,
      email,
      phone,
      role,
      password: userData.password,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}&backgroundColor=087F75`,
      address: userData.address || 'Flat 402, Green Glen Layout, Indiranagar',
      city: userData.city || 'Bangalore',
      pincode: userData.pincode || '560038',
      ...(role === 'owner'
        ? {
            shopName: userData.shopName || `${fullName}'s Electronics Workshop`,
            gstin: userData.gstin || '29ABCDE1234F1Z5',
            operatingHours: '09:00 AM – 08:30 PM (Mon-Sat)',
          }
        : {}),
      ...(role === 'delivery'
        ? {
            vehicle: userData.vehicle || 'Electric Two-Wheeler (EV)',
            vehicleNumber: userData.vehicleNumber || 'KA-04-DL-9821',
            zone: userData.zone || 'Central & East Bengaluru',
            dutyStatus: 'Active on Duty',
            activeDeliveriesCount: 0,
            completedCount: 0,
          }
        : {}),
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setCurrentUser(newUser);

    // Notify app components
    window.dispatchEvent(new CustomEvent('mixerfix:user_registered', { detail: newUser }));

    return { success: true, user: newUser };
  };

  // Update profile
  const updateProfile = async (updatedFields) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedFields };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));

    try {
      await usersAPI.updateProfile(updatedFields);
    } catch (e) {
      // Offline fallback silent
    }
  };

  // Logout action
  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('mixerfix_token');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        token,
        isBackendOnline,
        login,
        register,
        logout,
        switchDemoRole,
        updateProfile,
        isAuthenticated: !!currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
