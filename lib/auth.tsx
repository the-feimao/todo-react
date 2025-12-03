import React, { createContext, useContext, useEffect, useState } from 'react';
import { getToken, saveToken, removeToken } from './storage';
import * as SplashScreen from 'expo-splash-screen';
import api from './api';

// keep the splash screen visible while we check token
SplashScreen.preventAutoHideAsync().catch(()=>{});

type User = {
  id: number;
  name: string;
  email: string;
  // add expo_push_token etc
} | null;

type AuthContextType = {
  user: User;
  loading: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children:React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (token) {
          // optionally fetch user profile
          const res = await api.get('/user');
          setUser(res.data);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
        // allow splash screen to hide
        SplashScreen.hideAsync().catch(()=>{});
      }
    })();
  }, []);

  const signIn = async (token: string) => {
    await saveToken(token);
    const res = await api.get('/user');
    setUser(res.data);
  };

  const signOut = async () => {
    await removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
