import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USERS } from '../data/mockData';

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

  useEffect(() => {
    localStorage.setItem('mixerfix_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('mixerfix_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('mixerfix_current_user');
    }
  }, [currentUser]);

  // Login action
  const login = (email, password, expectedRole) => {
    const foundUser = users.find(
      u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );

    if (foundUser) {
      if (expectedRole && foundUser.role !== expectedRole) {
        return {
          success: false,
          error: `This account is registered as ${foundUser.role.toUpperCase()}, not ${expectedRole.toUpperCase()}. Please select the correct role.`
        };
      }
      setCurrentUser(foundUser);
      return { success: true, user: foundUser };
    }

    // Allow flexible demo login if matches standard credentials
    const roleFallback = users.find(u => u.role === (expectedRole || 'customer'));
    if (password === 'password123' && roleFallback) {
      setCurrentUser(roleFallback);
      return { success: true, user: roleFallback };
    }

    return {
      success: false,
      error: 'Invalid email or password. You can also use one of the Demo Quick Login buttons below.'
    };
  };

  // Switch demo account directly
  const switchDemoRole = (role) => {
    const user = users.find(u => u.role === role);
    if (user) {
      setCurrentUser(user);
      return user;
    }
    return null;
  };

  // Register new user
  const register = (userData) => {
    const existing = users.find(u => u.email.toLowerCase() === userData.email.trim().toLowerCase());
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
      city: userData.city || 'Bengaluru',
      pincode: userData.pincode || '560001',
      ...(userData.role === 'owner' ? { shopName: userData.shopName || `${userData.fullName}'s Workshop` } : {}),
      ...(userData.role === 'delivery' ? { vehicle: userData.vehicle || 'Electric Two-Wheeler', zone: userData.zone || 'Central Zone' } : {})
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setCurrentUser(newUser);
    return { success: true, user: newUser };
  };

  // Update profile
  const updateProfile = (updatedFields) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedFields };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
  };

  // Logout action
  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        login,
        register,
        logout,
        switchDemoRole,
        updateProfile,
        isAuthenticated: !!currentUser
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

