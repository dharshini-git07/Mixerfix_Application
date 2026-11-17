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
    try {
      const res = await authAPI.register({
        name: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        role: userData.role,
        address: userData.address,
        city: userData.city,
        pincode: userData.pincode,
        shopName: userData.shopName,
        vehicle: userData.vehicle,
        zone: userData.zone,
      });

      if (res.success && res.token) {
        setToken(res.token);
        setCurrentUser(res.user);
        setIsBackendOnline(true);
        return { success: true, user: res.user };
      }
    } catch (apiError) {
      // Fall through to local fallback
    }

    const existing = users.find((u) => u.email.toLowerCase() === userData.email.trim().toLowerCase());
    if (existing) {
      return { success: false, error: 'An account with this email address already exists.' };
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      role: userData.role,
      password: userData.password,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userData.fullName)}&backgroundColor=087F75`,
      address: userData.address || 'MG Road',
      city: userData.city || 'Bangalore',
      pincode: userData.pincode || '560001',
      ...(userData.role === 'owner' ? { shopName: userData.shopName || `${userData.fullName}'s Workshop` } : {}),
      ...(userData.role === 'delivery' ? { vehicle: userData.vehicle || 'Electric Two-Wheeler', zone: userData.zone || 'Central Zone' } : {}),
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setCurrentUser(newUser);
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
