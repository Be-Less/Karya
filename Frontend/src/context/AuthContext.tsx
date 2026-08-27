import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User } from '../types';
import { authApi } from '../api/auth.api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user?: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('karya_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('karya_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logout = useCallback(() => {
    localStorage.removeItem('karya_token');
    localStorage.removeItem('karya_user');
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const activeToken = localStorage.getItem('karya_token');
    if (!activeToken) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await authApi.getProfile();
      if (res && res.user) {
        const userData: User = {
          _id: res.user.userId,
          name: res.user.name || user?.name || 'User',
          email: res.user.email || user?.email || '',
        };
        setUser(userData);
        localStorage.setItem('karya_user', JSON.stringify(userData));
      }
    } catch (err: any) {
      console.warn('Failed to verify user profile token:', err?.message);
      if (err?.status === 401) {
        logout();
      }
    } finally {
      setIsLoading(false);
    }
  }, [user, logout]);

  useEffect(() => {
    refreshUser();
  }, []);

  const login = (newToken: string, newUser?: User) => {
    localStorage.setItem('karya_token', newToken);
    setToken(newToken);
    if (newUser) {
      setUser(newUser);
      localStorage.setItem('karya_user', JSON.stringify(newUser));
    }
    refreshUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
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
