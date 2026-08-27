import { apiClient } from './client';
import type { AuthResponse } from '../types';

export const authApi = {
  register: (data: { name: string; email: string; password: string }) => {
    return apiClient<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  login: (data: { email: string; password: string }) => {
    return apiClient<{ message: string; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getProfile: () => {
    return apiClient<{ message: string; user: { userId: string; email?: string; name?: string } }>('/auth/profile', {
      method: 'GET',
    });
  },
};
