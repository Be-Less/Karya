import { apiClient } from './client';
import type { Project } from '../types';

export const projectsApi = {
  getProjects: () => {
    return apiClient<{ projects: Project[] }>('/projects', {
      method: 'GET',
    });
  },

  getProject: (id: string) => {
    return apiClient<{ project: Project }>(`/projects/${id}`, {
      method: 'GET',
    });
  },

  createProject: (data: { name: string; description?: string }) => {
    return apiClient<{ message: string; project: Project }>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateProject: (id: string, data: { name?: string; description?: string }) => {
    return apiClient<{ message: string; project: Project }>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteProject: (id: string) => {
    return apiClient<{ message: string }>(`/projects/${id}`, {
      method: 'DELETE',
    });
  },

  addMember: (projectId: string, userId: string) => {
    return apiClient<{ message: string; project: Project }>(`/projects/${projectId}/members`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  },

  removeMember: (projectId: string, userId: string) => {
    return apiClient<{ message: string; project: Project }>(`/projects/${projectId}/members/${userId}`, {
      method: 'DELETE',
    });
  },
};
