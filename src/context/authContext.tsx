'use client'
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import cookies from 'js-cookie'
import { decrypt, encrypt } from '@/utils/criptografia';

// Definindo tipos
type AuthContextType = {
  accessToken: string | null | undefined;
  username: string | null | undefined;
  login: (accessToken: string, username: string) => void;
  logout: () => void;
  getToken: () => string | undefined;
  getUsername: () => string | undefined;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps{
  children: ReactNode;
};

export function AuthProvider({ children }:AuthProviderProps){
  const [accessToken, setAuthToken] = useState<string | null | undefined>(cookies.get('accessToken'))
  const [username, setUsername] = useState<string | null | undefined>(cookies.get('username'))

  const login = (token: string, username: string) => {
    const encryptedToken = encrypt(token);
    cookies.set('accessToken', encryptedToken);
    cookies.set('username', username);
    setAuthToken(encryptedToken);
    setUsername(username)
  };

  const getToken = () : string | undefined => {
      if (accessToken) {
        console.log("Aqui dentro")
        console.log(accessToken)
        const decoded = decrypt(accessToken)
        console.log(decoded)
        return decoded
      }
  }

  const getUsername = () : string | undefined => {
    if (username) {
      return username
    }
}

  const logout = () => {
    setAuthToken(null);
    setUsername(null)
    cookies.remove('accessToken');
    cookies.remove('username');
  };

  return (
    <AuthContext.Provider value={{ accessToken, username, login, logout, getToken, getUsername }}>
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
