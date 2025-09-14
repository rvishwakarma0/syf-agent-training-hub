// context/UserContext.js - ENHANCED VERSION
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

  // Initialize user from localStorage (NO URL params)
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
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
      const authenticatedUser = {
        id: userData['sso-id'] || userData.id,
        name: userData.name,
        email: userData.email || `${userData.name.toLowerCase().replace(' ', '.')}@synchrony.com`,
        role: userData.role,
        isAuthenticated: true
      };
      
      setUser(authenticatedUser);
      localStorage.setItem('user', JSON.stringify(authenticatedUser));
      
      // ✅ Navigate based on role - this was missing!
      if (userData.role === 'admin') {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/welcome', { replace: true });  
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
