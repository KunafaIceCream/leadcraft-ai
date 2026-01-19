import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/lib/types';
import { storage } from '@/lib/storage';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = storage.getUser();
    if (savedUser && storage.isAuthenticated()) {
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulated login - in production, this would call an API
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    if (password.length < 6) {
      throw new Error('Invalid credentials');
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      name: email.split('@')[0],
    };
    
    storage.setUser(newUser);
    setUser(newUser);
  };

  const signup = async (email: string, password: string, name: string) => {
    // Simulated signup
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      name,
    };
    
    storage.setUser(newUser);
    setUser(newUser);
  };

  const logout = () => {
    storage.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
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
