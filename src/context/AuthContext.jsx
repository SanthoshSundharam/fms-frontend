import React, { createContext, useState, useContext, useEffect } from 'react';
// Small, safe JWT decoder to avoid bundler/export issues with external libs
const decodeJWT = (token) => {
  if (!token || typeof token !== 'string') return null;
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    // payload is the middle part
    const payload = parts[1];
    // Add padding if necessary
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const json = atob(padded);
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
};
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
          const decoded = decodeJWT(token);
          // Check if token is valid and not expired
          const expMs = decoded && typeof decoded.exp === 'number' ? decoded.exp * 1000 : null;
          if (expMs && expMs > Date.now()) {
            setUser(JSON.parse(savedUser));
          } else {
            // Token missing/invalid or expired -> clear local storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } catch (error) {
        console.error('Invalid token', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    // Backwards-compatible simple setter (used by some tests or manual flows)
    // Distinguish manual-set calls vs. (email,password) calls:
    // - manual: (tokenString, userObject)
    // - api: (emailString, passwordString)
    if (typeof token === 'string' && typeof userData === 'object') {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    }

    // If called as login(email, password) -> call API
    return (async (email, password) => {
      try {
        const res = await authAPI.login({ email, password });
        const data = res.data;
        // Expecting { token, user } or similar
        const tokenFromApi = data.token || data.access_token || data?.data?.token;
        const userFromApi = data.user || data?.data?.user || data;

        if (tokenFromApi) localStorage.setItem('token', tokenFromApi);
        if (userFromApi) {
          localStorage.setItem('user', JSON.stringify(userFromApi));
          setUser(userFromApi);
        }

        return { success: true, data };
      } catch (err) {
        const message = err?.response?.data?.message || err.message || 'Login failed';
        return { success: false, message };
      }
    })(token, userData);
  };

  const logout = () => {
    // try server-side logout then clear locally
    try {
      authAPI.logout().catch(() => {});
    } catch (_) {}
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const register = async (formData) => {
    try {
      const res = await authAPI.register(formData);
      const data = res.data;
      const tokenFromApi = data.token || data.access_token || data?.data?.token;
      const userFromApi = data.user || data?.data?.user || data;

      if (tokenFromApi) localStorage.setItem('token', tokenFromApi);
      if (userFromApi) {
        localStorage.setItem('user', JSON.stringify(userFromApi));
        setUser(userFromApi);
      }

      return { success: true, data };
    } catch (err) {
      const message = err?.response?.data?.message || err.message || 'Registration failed';
      return { success: false, message };
    }
  };

  const isAdmin = () => {
    const currentUser = user ?? (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null);
    if (!currentUser) return false;
    if (typeof currentUser === 'object') {
      if (currentUser.role) return currentUser.role === 'admin';
      if (typeof currentUser.is_admin !== 'undefined') return !!currentUser.is_admin;
    }
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = decodeJWT(token);
        if (decoded?.role) return decoded.role === 'admin';
        if (typeof decoded?.is_admin !== 'undefined') return !!decoded.is_admin;
      } catch (_) {}
    }
    return false;
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAdmin,
  };

  // Provide the auth value to the subtree
  return (
    <AuthContext.Provider value={value}>
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