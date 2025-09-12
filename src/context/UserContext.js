import React, { createContext, useContext, useState, useEffect } from 'react';
import { ROLES } from '../util/roles';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: null,
    name: '',
    email: '',
    role: null,
    isAuthenticated: false,
  });

  // Initialize user from localStorage or URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const roleFromUrl = urlParams.get('role');
    
    // Check localStorage first
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
    } else if (roleFromUrl && (roleFromUrl === 'admin' || roleFromUrl === 'trainee')) {
      // Set user based on URL parameter (for demo purposes)
      const demoUser = {
        id: 1,
        name: roleFromUrl === 'admin' ? 'Admin User' : 'Trainee User',
        email: `${roleFromUrl}@synchrony.com`,
        role: roleFromUrl,
        isAuthenticated: true,
      };
      setUser(demoUser);
      localStorage.setItem('user', JSON.stringify(demoUser));
    }
  }, []);

  const login = (userData) => {
    const authenticatedUser = {
      ...userData,
      isAuthenticated: true,
    };
    setUser(authenticatedUser);
    localStorage.setItem('user', JSON.stringify(authenticatedUser));
  };

  const logout = () => {
    const loggedOutUser = {
      id: null,
      name: '',
      email: '',
      role: null,
      isAuthenticated: false,
    };
    setUser(loggedOutUser);
    localStorage.removeItem('user');
  };

  const hasRole = (requiredRole) => {
    return user.role === requiredRole;
  };

  const hasAnyRole = (requiredRoles) => {
    return requiredRoles.includes(user.role);
  };

  const value = {
    user,
    login,
    logout,
    hasRole,
    hasAnyRole,
    isAuthenticated: user.isAuthenticated,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
