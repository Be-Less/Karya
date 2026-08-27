import { useState, useEffect } from 'react';
import { tasksApi } from '../api/tasks.api';
import { projectsApi } from '../api/projects.api';
import type { Task, Project, TaskStatus, TaskPriority } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { KanbanBoard } from '../components/tasks/KanbanBoard';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskModal } from '../components/tasks/TaskModal';
import { TaskDetailModal } from '../components/tasks/TaskDetailModal';
import {
  Plus,
  Search,
  LayoutGrid,
  List,
} from 'lucide-react';

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTaskDetail, setSelectedTaskDetail] = useState<Task | null>(null);
  const [defaultTaskStatus, setDefaultTaskStatus] = useState<TaskStatus>('todo');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [taskRes, projRes] = await Promise.all([
        tasksApi.getTasks({
          status: statusFilter !== 'all' ? (statusFilter as TaskStatus) : undefined,
          priority: priorityFilter !== 'all' ? (priorityFilter as TaskPriority) : undefined,
        }),
        projectsApi.getProjects(),
      ]);
      setTasks(taskRes.tasks || []);
      setProjects(projRes.projects || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter, priorityFilter]);

  const handleCreateOrUpdateTask = async (data: any) => {
    if (editingTask) {
      const res = await tasksApi.updateTask(editingTask._id, data);
      setTasks((prev) => prev.map((t) => (t._id === editingTask._id ? res.task : t)));
    } else {
      const res = await tasksApi.createTask({
        ...data,
        status: defaultTaskStatus,
      });
      setTasks((prev) => [res.task, ...prev]);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      const res = await tasksApi.updateTask(taskId, { status: newStatus });
      setTasks((prev) => prev.map((t) => (t._id === taskId ? res.task : t)));
      if (selectedTaskDetail && selectedTaskDetail._id === taskId) {
        setSelectedTaskDetail(res.task);
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to update status');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await tasksApi.deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err: any) {
      alert(err?.message || 'Failed to delete task');
    }
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const pId = typeof t.projectId === 'object' ? t.projectId._id : t.projectId;
    const matchesProject = selectedProjectId === 'all' || pId === selectedProjectId;

    return matchesSearch && matchesProject;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">
            Tasks
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            View, organize and prioritize all your work items
          </p>
        </div>

        <button
          onClick={() => {
            setEditingTask(null);
            setDefaultTaskStatus('todo');
            setIsTaskModalOpen(true);
          }}
          disabled={projects.length === 0}
          className="px-3 py-1.5 bg-zinc-100 hover:bg-white disabled:opacity-40 text-zinc-900 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New task</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs rounded-lg">
          {error}
        </div>
      )}

      {/* Filter and Search Controls */}
      <div className="bg-[#12141d] border border-zinc-800/80 p-3 rounded-xl space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tasks..."
              className="w-full bg-[#0d0f15] border border-zinc-800 focus:border-zinc-500 rounded-lg pl-9 pr-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 transition-colors"
            />
          </div>

          {/* Project Filter */}
          <div>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full bg-[#0d0f15] border border-zinc-800 focus:border-zinc-500 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200"
            >
              <option value="all">All Projects ({projects.length})</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full bg-[#0d0f15] border border-zinc-800 focus:border-zinc-500 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#0d0f15] border border-zinc-800 focus:border-zinc-500 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200"
            >
              <option value="all">All Statuses</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Done</option>
            </select>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
          <span className="text-xs text-zinc-400">
            {filteredTasks.length} task{filteredTasks.length === 1 ? '' : 's'}
          </span>

          <div className="flex items-center gap-1 bg-[#0d0f15] p-1 rounded-lg border border-zinc-800">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Board</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
          </div>
        </div>
      </div>

      {/* Task Content */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner size="md" label="Loading tasks..." />
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="bg-[#12141d] border border-zinc-800/80 rounded-xl p-10 text-center space-y-2">
          <h3 className="text-sm font-medium text-zinc-300">No tasks found</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            {searchTerm || selectedProjectId !== 'all' || priorityFilter !== 'all' || statusFilter !== 'all'
              ? 'Try clearing active filters.'
              : 'Create a task to get started.'}
          </p>
          {projects.length > 0 && (
            <button
              onClick={() => {
                setEditingTask(null);
                setDefaultTaskStatus('todo');
                setIsTaskModalOpen(true);
              }}
              className="mt-1 px-3 py-1.5 bg-zinc-100 hover:bg-white text-zinc-900 text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New task</span>
            </button>
          )}
        </div>
      ) : viewMode === 'kanban' ? (
        <KanbanBoard
          tasks={filteredTasks}
          onOpenDetail={(t) => setSelectedTaskDetail(t)}
          onEditTask={(t) => {
            setEditingTask(t);
            setIsTaskModalOpen(true);
          }}
          onDeleteTask={handleDeleteTask}
          onStatusChange={handleStatusChange}
          onAddTaskToColumn={(colStatus) => {
            setEditingTask(null);
            setDefaultTaskStatus(colStatus);
            setIsTaskModalOpen(true);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onOpenDetail={(t) => setSelectedTaskDetail(t)}
              onEdit={(t) => {
                setEditingTask(t);
                setIsTaskModalOpen(true);
              }}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleCreateOrUpdateTask}
        initialTask={editingTask}
        projects={projects}
      />

      <TaskDetailModal
        task={selectedTaskDetail}
        isOpen={!!selectedTaskDetail}
        onClose={() => setSelectedTaskDetail(null)}
        onEdit={(t) => {
          setSelectedTaskDetail(null);
          setEditingTask(t);
          setIsTaskModalOpen(true);
        }}
        onDelete={handleDeleteTask}
        onStatusChange={handleStatusChange}
        projects={projects}
      />
    </div>
  );
}
