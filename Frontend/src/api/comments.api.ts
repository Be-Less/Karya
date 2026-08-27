import { apiClient } from './client';
import type { Comment } from '../types';

export const commentsApi = {
  getComments: (taskId: string) => {
    return apiClient<{ comments: Comment[] }>(`/tasks/${taskId}/comments`, {
      method: 'GET',
    });
  },

  createComment: (taskId: string, content: string) => {
    return apiClient<{ message: string; comment: Comment }>(`/tasks/${taskId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },

  updateComment: (taskId: string, commentId: string, content: string) => {
    return apiClient<{ message: string; comment: Comment }>(`/tasks/${taskId}/comments/${commentId}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
  },

  deleteComment: (taskId: string, commentId: string) => {
    return apiClient<{ message: string }>(`/tasks/${taskId}/comments/${commentId}`, {
      method: 'DELETE',
    });
  },
};
