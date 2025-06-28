
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, Admin } from '@/types';

console.log('AuthContext: Importações carregadas, React:', typeof React);
console.log('AuthContext: createContext disponível:', typeof createContext);

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

// Criar o contexto com um valor padrão mais seguro
const AuthContext = createContext<AuthContextType | null>(null);

console.log('AuthContext: Contexto criado com sucesso');

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  console.log('AuthProvider: Componente sendo renderizado');
  
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    admin: null,
    token: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: useEffect executado para verificar token');
    // Check for existing token on app load
    const token = localStorage.getItem('nexus_token');
    const adminData = localStorage.getItem('nexus_admin');
    
    if (token && adminData) {
      try {
        const admin = JSON.parse(adminData);
        console.log('AuthProvider: Token e dados de admin encontrados', { admin });
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
    console.log('AuthProvider: Tentativa de login para:', email);
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
        
        console.log('AuthProvider: Login realizado com sucesso');
        return true;
      }
      console.log('AuthProvider: Credenciais inválidas');
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    console.log('AuthProvider: Logout executado');
    setAuthState({
      isAuthenticated: false,
      admin: null,
      token: null,
    });
    localStorage.removeItem('nexus_token');
    localStorage.removeItem('nexus_admin');
  };

  const contextValue: AuthContextType = {
    ...authState,
    login,
    logout,
    loading,
  };

  console.log('AuthProvider: Renderizando provider com valor:', contextValue);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
