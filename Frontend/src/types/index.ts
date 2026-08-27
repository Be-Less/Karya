export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectMember {
  user: User | string;
  role: 'owner' | 'admin' | 'member';
  _id?: string;
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  owner: string;
  members: ProjectMember[];
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = 'todo' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string | Project;
  userId: string;
  assignedTo?: string | User;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  content: string;
  taskId: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  } | string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  token?: string;
  user?: User;
}
