'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<User>;
  logout: () => Promise<void>;
  clearInvalidAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const clearInvalidAuth = () => {
    try {
      localStorage.removeItem('user');
      setUser(null);
      console.log('Invalid auth cleared, redirecting to login...');
    } catch (error) {
      console.error('Error clearing invalid auth:', error);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          
          if (!userData.id || !userData.email || !userData.name) {
            console.warn('Invalid user data in localStorage, clearing...');
            clearInvalidAuth();
            return;
          }
          
          try {
            const { data: currentUser, error } = await supabase
              .from('users')
              .select('*')
              .eq('id', userData.id)
              .single();
              
            if (error || !currentUser) {
              console.warn('User not found in database, clearing localStorage...');
              clearInvalidAuth();
              return;
            }
            
            if (JSON.stringify(currentUser) !== JSON.stringify(userData)) {
              localStorage.setItem('user', JSON.stringify(currentUser));
              setUser(currentUser);
            } else {
              setUser(userData);
            }
          } catch (dbError) {
            console.warn('Database check failed, using localStorage data:', dbError);
            setUser(userData);
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        clearInvalidAuth();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error) throw error;
      if (!user) throw new Error('Kullanıcı bulunamadı');

      if (user.password !== password) {
        throw new Error('Hatalı şifre');
      }

      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (existingUser) {
        throw new Error('Bu email adresi zaten kullanımda');
      }

      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            email,
            password,
            name,
            role: 'TEKNISYEN'
          }
        ])
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Kullanıcı oluşturulamadı');

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('user');
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, clearInvalidAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}