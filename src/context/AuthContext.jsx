import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as loginApi, signup as signupApi, logout as logoutApi, getMe } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on page load
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await getMe();
      if (response.success) {
        setUser(response.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
      console.error('Auth check failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      setError(null);
      const response = await signupApi(userData);
      if (response.success) {
        setUser(response.user);
        return { success: true };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      return { success: false, error: err.response?.data?.message || err.message };
    }
  };

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await loginApi(credentials);
      if (response.success) {
        setUser(response.user);
        return { success: true };
      } else {
        setError(response.message);
        return { success: false, error: response.message };
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      return { success: false, error: err.response?.data?.message || err.message };
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const value = {
    user,
    setUser,
    loading,
    error,
    signup,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};