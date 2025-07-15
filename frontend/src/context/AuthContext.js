import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import backend_url from '../config/config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount (for page refresh)
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get(`${backend_url}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      return true;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      if (error.response?.data?.code === 'TOKEN_EXPIRED' || error.response?.status === 401) {
        // Token expired or invalid, redirect to login
        localStorage.removeItem('token');
        window.location.href = '/';
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post(`${backend_url}/users/login`, {
        email,
        password
      });
      const { token, ...userData } = response.data;
      localStorage.setItem('token', token);
      setUser(userData);
      
      // Set up automatic logout after 1 hour
      setTimeout(() => {
        logout();
      }, 60 * 60 * 1000); // 1 hour in milliseconds
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await axios.post(`${backend_url}/users/register`, userData);
      const { token, ...user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      
      // Set up automatic logout after 1 hour
      setTimeout(() => {
        logout();
      }, 60 * 60 * 1000); // 1 hour in milliseconds
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Call logout endpoint to invalidate token on server
        await axios.post(`${backend_url}/users/logout`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and redirect to login
      localStorage.removeItem('token');
      setUser(null);
      window.location.href = '/';
    }
  };

  // Permission checking functions
  const hasPermission = (action) => {
    if (!user) return false;
    if (user.isMasterAdmin) return true;
    return user.permissions?.[action] || false;
  };

  const canCreate = () => hasPermission('canCreate');
  const canEdit = () => hasPermission('canEdit');
  const canDelete = () => hasPermission('canDelete');
  const canView = () => hasPermission('canView');
  const isMasterAdmin = () => user?.isMasterAdmin || false;

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    // Permission functions
    hasPermission,
    canCreate,
    canEdit,
    canDelete,
    canView,
    isMasterAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
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