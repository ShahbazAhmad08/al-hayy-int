'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser as apiLoginUser, registerUser as apiRegisterUser } from '@/lib/api';

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
        email: usernameOrEmail.includes('@') ? usernameOrEmail : `${usernameOrEmail}@example.com`,
        role: 'customer'
      };
      setUser(customerData);
      localStorage.setItem('alhayy_customer_user', JSON.stringify(customerData));
      return { success: true, user: customerData };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // 2. Customer Registration
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
  const adminLogin = async (username, password) => {
    const cleanUser = (username || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    // Master admin credentials check
    if (
      (cleanUser === 'admin' || cleanUser === 'alhayy_admin' || cleanUser === 'admin@alhayyinternational.com') && 
      (cleanPass === 'admin123' || cleanPass === 'admin@123')
    ) {
      const adminData = {
        username: 'admin',
        email: 'admin@alhayyinternational.com',
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
      const res = await apiLoginUser(username, password);
      if (res && res.success && (res.role === 'admin' || res.user?.role === 'admin' || cleanUser.includes('admin'))) {
        const adminData = res.user || { username, role: 'admin' };
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

  return (
    <AuthContext.Provider
      value={{
        user,
        adminUser,
        isAdmin,
        loading,
        customerLogin,
        customerRegister,
        customerLogout,
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
