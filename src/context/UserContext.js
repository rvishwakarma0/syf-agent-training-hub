// context/UserContext.js - ENHANCED VERSION
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUserBySsoId } from '../util/users-data';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize user from localStorage (NO URL params)
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          // Map trainer -> admin for role consistency
          if (userData.role === 'trainer') {
            userData.role = 'admin';
          }
          setUser({
            ...userData,
            isAuthenticated: true
          });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        localStorage.clear();
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (userData) => {
    try {
      // Map trainer -> admin for consistent role-based access
      const role = userData.role === 'trainer' ? 'admin' : userData.role;
      
      const authenticatedUser = {
        id: userData['sso-id'] || userData.id,
        name: userData.name,
        email: userData.email || `${userData.name.toLowerCase().replace(' ', '.')}@synchrony.com`,
        role: role,
        isAuthenticated: true
      };
      
      setUser(authenticatedUser);
      localStorage.setItem('user', JSON.stringify(authenticatedUser));
      
      // ✅ Navigate based on role - this was missing!
      if (role === 'admin') {
        navigate('/welcome', { replace: true });
      } else {
        navigate('/profile', { replace: true }); // Trainees go to chat
      }
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  };

  const logout = () => {
    setUser(null);
    // Clear ALL storage
    localStorage.clear();
    sessionStorage.clear();
    // Navigate to login
    navigate('/login', { replace: true });
  };

  const hasRole = (requiredRole) => {
    return user?.role === requiredRole;
  };

  const hasAnyRole = (requiredRoles) => {
    return requiredRoles.includes(user?.role);
  };

  const value = {
    user,
    login,
    logout,
    hasRole,
    hasAnyRole,
    isAuthenticated: !!user?.isAuthenticated,
    loading
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
