import { apiClient } from './client';
import type { Task, TaskStatus, TaskPriority } from '../types';

export interface GetTasksParams {
  status?: TaskStatus;
  priority?: TaskPriority;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  projectId: string;
  assignedTo?: string;
  dueDate?: string;
  priority?: TaskPriority;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: string;
  priority?: TaskPriority;
}

export const tasksApi = {
  getTasks: (params?: GetTasksParams) => {
    return apiClient<{ tasks: Task[] }>('/tasks', {
      method: 'GET',
      params: params as Record<string, string | undefined>,
    });
  },

  getTask: (id: string) => {
    return apiClient<{ task: Task }>(`/tasks/${id}`, {
      method: 'GET',
    });
  },

  createTask: (data: CreateTaskData) => {
    return apiClient<{ message: string; task: Task }>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateTask: (id: string, data: UpdateTaskData) => {
    return apiClient<{ message: string; task: Task }>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteTask: (id: string) => {
    return apiClient<{ message: string }>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },
};
