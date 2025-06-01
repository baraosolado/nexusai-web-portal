
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, Admin } from '@/types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    admin: null,
    token: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on app load
    const token = localStorage.getItem('nexus_token');
    const adminData = localStorage.getItem('nexus_admin');
    
    if (token && adminData) {
      try {
        const admin = JSON.parse(adminData);
        setAuthState({
          isAuthenticated: true,
          admin,
          token,
        });
      } catch (error) {
        console.error('Error parsing stored admin data:', error);
        localStorage.removeItem('nexus_token');
        localStorage.removeItem('nexus_admin');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call - replace with actual API integration
      if (email === 'admin@nexusai.com' && password === 'admin123') {
        const admin: Admin = {
          id: '1',
          email: 'admin@nexusai.com',
          role: 'admin',
          createdAt: new Date().toISOString(),
        };
        
        const token = 'mock_jwt_token_' + Date.now();
        
        setAuthState({
          isAuthenticated: true,
          admin,
          token,
        });
        
        localStorage.setItem('nexus_token', token);
        localStorage.setItem('nexus_admin', JSON.stringify(admin));
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      admin: null,
      token: null,
    });
    localStorage.removeItem('nexus_token');
    localStorage.removeItem('nexus_admin');
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
