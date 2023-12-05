'use client'

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import cookies from 'js-cookie'
import { decrypt, encrypt } from '@/utils/criptografia';

// Definindo tipos
type AuthContextType = {
  accessToken: string | null | undefined;
  login: (accessToken: string) => void;
  logout: () => void;
  getToken: () => string | undefined;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps{
  children: ReactNode;
};

export function AuthProvider({ children }:AuthProviderProps){
  const [accessToken, setAuthToken] = useState<string | null | undefined>(cookies.get('accessToken'))

  const login = (token: string) => {
    const encryptedToken = encrypt(token);
    cookies.set('accessToken', encryptedToken);
    setAuthToken(encryptedToken);
  };

  const getToken = () : string | undefined => {
      if (accessToken) {
        const decoded = decrypt(accessToken)
        return decoded
      }
  }

  const logout = () => {
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ accessToken, login, logout, getToken }}>
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
