import { API_URL } from '@/config';
import { User } from '@/types';

interface RegisterResponse {
  user: User;
  token: string;
}

export interface UsersAPI {
  getAll: () => Promise<User[]>;
  update: (id: number, data: { email: string; name: string; role: string; password?: string }) => Promise<User>;
  delete: (id: number) => Promise<void>;
  login: (email: string, password: string) => Promise<{ user: User; token: string }>;
  register: (email: string, password: string, name: string) => Promise<RegisterResponse>;
}

export const users: UsersAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/users`);
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    return response.json();
  },

  update: async (id: number, data: { email: string; name: string; role: string; password?: string }) => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update user');
    }

    return response.json();
  },

  delete: async (id: number) => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete user');
    }

    return response.json();
  },

  login: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Failed to login');
    }

    return response.json();
  },

  register: async (email: string, password: string, name: string): Promise<RegisterResponse> => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    });

    if (!response.ok) {
      throw new Error('Failed to register user');
    }

    return response.json();
  },
}; 