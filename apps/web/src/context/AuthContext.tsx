import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '@kemitir/shared';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isValidator: boolean;
  isAdmin: boolean;
  isCitizen: boolean;
  login: (token: string, user: UserProfile) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isValidator: false,
  isAdmin: false,
  isCitizen: false,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('kemitir_token'));
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('kemitir_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Verify and sync profile on boot if token is present
  useEffect(() => {
    if (!token) return;

    fetch('/api/v1/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          if (data?.data) {
            setUser(data.data);
            localStorage.setItem('kemitir_user', JSON.stringify(data.data));
          }
        } else if (res.status === 401) {
          // Token is genuinely invalid or expired
          logout();
        }
      })
      .catch(() => {
        // Keep cached user if offline or network blip
      });
  }, [token]);

  const login = (newToken: string, newUser: UserProfile) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('kemitir_token', newToken);
    localStorage.setItem('kemitir_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('kemitir_token');
    localStorage.removeItem('kemitir_user');
  };

  const isValidator = user?.role === 'validator';
  const isAdmin = user?.role === 'admin';
  const isCitizen = user?.role === 'citizen';
  const isAuthenticated = Boolean(token && user);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isValidator,
        isAdmin,
        isCitizen,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

