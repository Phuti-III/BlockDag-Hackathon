// 1. Create: src/contexts/AuthContext.tsx
"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthUser {
  address: string;
  privateKey: string;
  role: 'user' | 'lawEnforcement';
  name: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (role: 'user' | 'lawEnforcement') => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_ACCOUNTS = {
  user: {
    address: "0x8732F4d3F2f91BbB19F061F119F397d5cbC17d3c",
    privateKey: process.env.NEXT_PUBLIC_USER_PRIVATE_KEY || "0x" + "0".repeat(64),
    role: 'user' as const,
    name: 'Demo User'
  },
  lawEnforcement: {
    address: "0x0a213702b6050FbF645925dAb4a143F0002a4B97",
    privateKey: process.env.NEXT_PUBLIC_LAW_ENFORCEMENT_PRIVATE_KEY || "0x" + "0".repeat(64),
    role: 'lawEnforcement' as const,
    name: 'Law Enforcement Officer'
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('uyinene_auth_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (role: 'user' | 'lawEnforcement') => {
    const selectedAccount = DEMO_ACCOUNTS[role];
    const authUser: AuthUser = {
      address: selectedAccount.address,
      privateKey: selectedAccount.privateKey,
      role: selectedAccount.role,
      name: selectedAccount.name
    };
    
    setUser(authUser);
    sessionStorage.setItem('uyinene_auth_user', JSON.stringify(authUser));
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('uyinene_auth_user');
  };

  const value = {
    user,
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
