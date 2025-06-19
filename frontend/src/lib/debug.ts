'use client';

import { supabase } from './supabase';

interface TableResults {
  [key: string]: { data: any; error: any };
}

export const debugSupabase = {

  checkAuthStatus: async () => {
    console.log('Checking auth status...');
    try {
      const storedUser = localStorage.getItem('user');
      console.log('Stored user:', storedUser);
      return { 
        success: true, 
        result: storedUser ? JSON.parse(storedUser) : null 
      };
    } catch (e) {
      console.error('Auth Check Error:', e);
      return { 
        success: false, 
        error: e instanceof Error ? e.message : 'Unknown error' 
      };
    }
  },
  
  checkTables: async () => {
    console.log('Checking tables...');
    try {
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('*');

      console.log('Users table result:', { data: users, error: usersError });

      if (usersError) {
        throw usersError;
      }

      return {
        success: true,
        result: {
          users: users || [],
          count: users?.length || 0
        }
      };
    } catch (e) {
      console.error('Tables Check Error:', e);
      return {
        success: false,
        error: e instanceof Error ? e.message : 'Unknown error'
      };
    }
  },
  
  testRegistration: async (email: string, password: string, name: string) => {
    console.log('Starting registration test...', { email, name });
    try {
      if (!email || !password || !name) {
        throw new Error('Email, password and name are required');
      }

      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      console.log('Existing user check:', { existingUser, checkError });

      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      console.log('Attempting to insert user...');
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            email,
            password,
            name,
            role: 'user',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      console.log('Insert result:', { data, error });

      if (error) {
        console.error('Insert error:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No data returned after insert');
      }

      return {
        success: true,
        result: data
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}; 