import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { EnvConfig } from '../config/env';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  user: { username: string; role: string } | null;
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
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      // Check localStorage first (for backwards compatibility)
      const savedAuth = localStorage.getItem('adminAuth');
      if (savedAuth) {
        const authData = JSON.parse(savedAuth);
        setIsAuthenticated(true);
        setUser(authData.user);
      }

      // Also check Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
        setUser({ username: 'admin', role: 'admin' });
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setIsAuthenticated(true);
        setUser({ username: 'admin', role: 'admin' });
        localStorage.setItem('adminAuth', JSON.stringify({
          isAuthenticated: true,
          user: { username: 'admin', role: 'admin' }
        }));
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('adminAuth');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Get admin credentials from environment configuration
      const adminUsername = EnvConfig.ADMIN_USERNAME;
      const adminPassword = EnvConfig.ADMIN_PASSWORD;
      const adminEmail = EnvConfig.ADMIN_EMAIL;
      
      if (username === adminUsername && password === adminPassword) {
        // Sign in to Supabase with the admin user
        const { error } = await supabase.auth.signInWithPassword({
          email: adminEmail,
          password: adminPassword,
        });

        if (error) {
          console.error('Supabase auth error:', error);
          // Fall back to localStorage auth if Supabase auth fails
          const authData = {
            isAuthenticated: true,
            user: { username: 'admin', role: 'admin' }
          };
          localStorage.setItem('adminAuth', JSON.stringify(authData));
          setIsAuthenticated(true);
          setUser({ username: 'admin', role: 'admin' });
          return true;
        }

        // Supabase auth successful
        setIsAuthenticated(true);
        setUser({ username: 'admin', role: 'admin' });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Sign out from Supabase
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    // Clear local state
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('adminAuth');
  };

  const value: AuthContextType = {
    isAuthenticated,
    login,
    logout,
    user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 