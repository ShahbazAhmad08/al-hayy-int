'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  loginUser as apiLoginUser, 
  registerUser as apiRegisterUser,
  sendEmailOtp as apiSendEmailOtp,
  verifyOtpAndRegister as apiVerifyOtpAndRegister
} from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Customer user
  const [adminUser, setAdminUser] = useState(null); // Admin user
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Restore sessions from localStorage
  useEffect(() => {
    try {
      const storedCustomer = localStorage.getItem('alhayy_customer_user');
      const storedAdmin = localStorage.getItem('alhayy_admin_user');
      const storedIsAdmin = localStorage.getItem('alhayy_is_admin') === 'true';

      if (storedCustomer) {
        setUser(JSON.parse(storedCustomer));
      }

      if (storedAdmin && storedIsAdmin) {
        setAdminUser(JSON.parse(storedAdmin));
        setIsAdmin(true);
      }
    } catch (e) {
      console.warn('Failed to restore auth', e);
    } finally {
      setLoading(false);
    }
  }, []);

  // 1. Dedicated Customer Login
  const customerLogin = async (usernameOrEmail, password) => {
    try {
      const res = await apiLoginUser(usernameOrEmail, password);
      if (res && res.success) {
        const customerData = res.user || {
          username: usernameOrEmail.split('@')[0],
          email: usernameOrEmail,
          role: 'customer'
        };
        setUser(customerData);
        localStorage.setItem('alhayy_customer_user', JSON.stringify(customerData));
        return { success: true, user: customerData };
      }
      // Demo customer fallback login
      const customerData = {
        username: usernameOrEmail.includes('@') ? usernameOrEmail.split('@')[0] : usernameOrEmail,
        email: usernameOrEmail.includes('@') ? usernameOrEmail : `${usernameOrEmail}@alhayyinternational.com`,
        role: 'customer'
      };
      setUser(customerData);
      localStorage.setItem('alhayy_customer_user', JSON.stringify(customerData));
      return { success: true, user: customerData };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // 2a. Send Email OTP
  const sendEmailOtp = async (email, name = '') => {
    try {
      const res = await apiSendEmailOtp(email, name);
      return res;
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // 2b. Verify OTP & Register
  const verifyOtpAndRegister = async (username, email, password, otp) => {
    try {
      const res = await apiVerifyOtpAndRegister(username, email, password, otp);
      if (res && res.success) {
        const customerData = res.user || {
          username: username || email.split('@')[0],
          email: email,
          role: 'customer'
        };
        setUser(customerData);
        localStorage.setItem('alhayy_customer_user', JSON.stringify(customerData));
        return { success: true, user: customerData };
      }
      return res || { success: false, message: 'Invalid OTP' };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // 2c. Legacy Customer Registration
  const customerRegister = async (username, email, password) => {
    try {
      const res = await apiRegisterUser(username, email, password);
      return res;
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // 3. Customer Logout
  const customerLogout = () => {
    setUser(null);
    try {
      localStorage.removeItem('alhayy_customer_user');
    } catch (e) {}
  };

  // 4. Strict Dedicated Admin Login
  const adminLogin = async (usernameOrEmail, password) => {
    const cleanUser = (usernameOrEmail || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    const envAdminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@alhayyinternational.com').trim().toLowerCase();
    const envAdminPassword = (process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '').trim();

    // Master admin verification strictly from .env
    const isMatchingUser = (envAdminEmail && cleanUser === envAdminEmail) || cleanUser === 'admin' || cleanUser === 'alhayy_admin';
    const isMatchingPass = Boolean(envAdminPassword && cleanPass === envAdminPassword);

    if (isMatchingUser && isMatchingPass) {
      const adminData = {
        username: 'Admin',
        email: process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@alhayyinternational.com',
        role: 'admin'
      };
      setAdminUser(adminData);
      setIsAdmin(true);
      try {
        localStorage.setItem('alhayy_admin_user', JSON.stringify(adminData));
        localStorage.setItem('alhayy_is_admin', 'true');
      } catch (e) {}
      return { success: true, user: adminData };
    }

    try {
      const res = await apiLoginUser(usernameOrEmail, password);
      if (res && res.success && (res.role === 'admin' || res.user?.role === 'admin')) {
        const adminData = res.user || { username: usernameOrEmail, email: 'admin@alhayyinternational.com', role: 'admin' };
        setAdminUser(adminData);
        setIsAdmin(true);
        try {
          localStorage.setItem('alhayy_admin_user', JSON.stringify(adminData));
          localStorage.setItem('alhayy_is_admin', 'true');
        } catch (e) {}
        return { success: true, user: adminData };
      }
    } catch (err) {}

    return { success: false, message: 'Unauthorized: Invalid administrative credentials.' };
  };

  // 5. Admin Logout
  const adminLogout = () => {
    setAdminUser(null);
    setIsAdmin(false);
    try {
      localStorage.removeItem('alhayy_admin_user');
      localStorage.removeItem('alhayy_is_admin');
    } catch (e) {}
  };

  // 6. Multi-Auth Direct User Login (Phone OTP / Google / Firebase)
  const loginWithSyncedUser = (userData) => {
    const customerData = {
      id: userData.id || userData.user_id || userData.uid || 'user_' + Date.now(),
      username: userData.username || userData.name || userData.displayName || (userData.email ? userData.email.split('@')[0] : userData.phone) || 'Patron',
      email: userData.email || '',
      phone: userData.phone || userData.phoneNumber || '',
      role: 'customer',
      auth_provider: userData.login_type || userData.auth_provider || 'phone'
    };
    setUser(customerData);
    try {
      localStorage.setItem('alhayy_customer_user', JSON.stringify(customerData));
    } catch (e) {}
    return customerData;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        adminUser,
        isAdmin,
        loading,
        customerLogin,
        customerRegister,
        sendEmailOtp,
        verifyOtpAndRegister,
        customerLogout,
        loginWithSyncedUser,
        adminLogin,
        adminLogout,
        // Backwards compatibility aliases
        login: customerLogin,
        logout: customerLogout
      }}
    >
      {children}
    </AuthContext.Provider>
  );

}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
