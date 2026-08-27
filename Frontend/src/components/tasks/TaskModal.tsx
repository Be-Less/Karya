import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import type { Task, Project, TaskPriority, TaskStatus } from '../../types';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description?: string;
    projectId: string;
    assignedTo?: string;
    dueDate?: string;
    priority?: TaskPriority;
    status?: TaskStatus;
  }) => Promise<void>;
  initialTask?: Task | null;
  projects: Project[];
  defaultProjectId?: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialTask,
  projects,
  defaultProjectId,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title || '');
      setDescription(initialTask.description || '');
      const pid =
        typeof initialTask.projectId === 'object'
          ? initialTask.projectId._id
          : initialTask.projectId;
      setProjectId(pid || defaultProjectId || (projects[0]?._id ?? ''));

      const assignId =
        typeof initialTask.assignedTo === 'object'
          ? initialTask.assignedTo._id
          : initialTask.assignedTo;
      setAssignedTo(assignId || '');

      setDueDate(
        initialTask.dueDate ? new Date(initialTask.dueDate).toISOString().split('T')[0] : ''
      );
      setPriority(initialTask.priority || 'medium');
      setStatus(initialTask.status || 'todo');
    } else {
      setTitle('');
      setDescription('');
      setProjectId(defaultProjectId || (projects[0]?._id ?? ''));
      setAssignedTo('');
      setDueDate('');
      setPriority('medium');
      setStatus('todo');
    }
    setError(null);
  }, [initialTask, isOpen, defaultProjectId, projects]);

  const selectedProject = projects.find((p) => p._id === projectId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please add a task title');
      return;
    }
    if (!projectId) {
      setError('Please choose a project');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        projectId,
        assignedTo: assignedTo || undefined,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        priority,
        status,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialTask ? 'Edit task' : 'New task'}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs bg-rose-950/40 border border-rose-800/60 text-rose-300 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1">
            Task title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full bg-[#0d0f15] border border-zinc-700/70 focus:border-zinc-400 rounded-lg px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1">
            Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add context or notes..."
            className="w-full bg-[#0d0f15] border border-zinc-700/70 focus:border-zinc-400 rounded-lg px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 transition-colors resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Project
            </label>
            <select
              disabled={!!initialTask}
              value={projectId}
              onChange={(e) => {
                setProjectId(e.target.value);
                setAssignedTo('');
              }}
              className="w-full bg-[#0d0f15] border border-zinc-700/70 focus:border-zinc-400 rounded-lg px-3 py-2 text-xs text-zinc-200 transition-colors disabled:opacity-50"
            >
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Assign to
            </label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full bg-[#0d0f15] border border-zinc-700/70 focus:border-zinc-400 rounded-lg px-3 py-2 text-xs text-zinc-200 transition-colors"
            >
              <option value="">Unassigned</option>
              {selectedProject?.members?.map((m) => {
                const memberUser = typeof m.user === 'object' ? m.user : null;
                const memberId = typeof m.user === 'object' ? m.user._id : m.user;
                return (
                  <option key={memberId} value={memberId}>
                    {memberUser?.name ? `${memberUser.name} (${m.role})` : memberId}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full bg-[#0d0f15] border border-zinc-700/70 focus:border-zinc-400 rounded-lg px-3 py-2 text-xs text-zinc-200 transition-colors"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {initialTask && (
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full bg-[#0d0f15] border border-zinc-700/70 focus:border-zinc-400 rounded-lg px-3 py-2 text-xs text-zinc-200 transition-colors"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Done</option>
              </select>
            </div>
          )}

          <div className={initialTask ? '' : 'md:col-span-2'}>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Due date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-[#0d0f15] border border-zinc-700/70 focus:border-zinc-400 rounded-lg px-3 py-2 text-xs text-zinc-200 transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-1.5 bg-zinc-100 hover:bg-white text-zinc-900 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            {loading && <LoadingSpinner size="sm" />}
            <span>{initialTask ? 'Save changes' : 'Create task'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
