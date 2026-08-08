import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockAuthService } from '../services/mockApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load initial user session
    const current = mockAuthService.getCurrentUser();
    setUser(current);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const loggedUser = await mockAuthService.login(email, password);
    setUser(loggedUser);
    return loggedUser;
  };

  const signup = async (name, email, password) => {
    const newUser = await mockAuthService.signup(name, email, password);
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    mockAuthService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
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
