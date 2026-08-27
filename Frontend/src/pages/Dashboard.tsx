import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { projectsApi } from '../api/projects.api';
import { tasksApi } from '../api/tasks.api';
import type { Project, Task, TaskStatus } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Badge } from '../components/common/Badge';
import { ProjectModal } from '../components/projects/ProjectModal';
import { TaskModal } from '../components/tasks/TaskModal';
import { TaskDetailModal } from '../components/tasks/TaskDetailModal';
import {
  Plus,
  ArrowRight,
  Folder,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTaskDetail, setSelectedTaskDetail] = useState<Task | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [projRes, taskRes] = await Promise.all([
        projectsApi.getProjects(),
        tasksApi.getTasks(),
      ]);
      setProjects(projRes.projects || []);
      setTasks(taskRes.tasks || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateProject = async (data: { name: string; description?: string }) => {
    const res = await projectsApi.createProject(data);
    setProjects((prev) => [res.project, ...prev]);
  };

  const handleCreateOrUpdateTask = async (data: any) => {
    if (editingTask) {
      const res = await tasksApi.updateTask(editingTask._id, data);
      setTasks((prev) => prev.map((t) => (t._id === editingTask._id ? res.task : t)));
    } else {
      const res = await tasksApi.createTask(data);
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
      alert(err?.message || 'Failed to update task status');
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

  // Metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in-progress').length;
  const todoTasks = tasks.filter((t) => t.status === 'todo').length;

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner size="md" label="Loading workspace..." />
      </div>
    );
  }

  const firstName = user?.name ? user.name.split(' ')[0] : 'there';

  return (
    <div className="space-y-7">
      {/* Header with Greeting & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">
            Welcome back, {firstName}
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Here is a quick glance at your tasks and projects.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsProjectModalOpen(true)}
            className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New project</span>
          </button>
          <button
            onClick={() => {
              setEditingTask(null);
              setIsTaskModalOpen(true);
            }}
            disabled={projects.length === 0}
            className="px-3 py-1.5 bg-zinc-100 hover:bg-white disabled:opacity-40 text-zinc-900 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New task</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs rounded-lg">
          {error}
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-[#12141d] border border-zinc-800/80 rounded-xl p-4 flex flex-col justify-between">
          <span className="text-[11px] font-medium text-zinc-400">Projects</span>
          <div className="mt-2 text-2xl font-bold text-zinc-100 tracking-tight">
            {projects.length}
          </div>
        </div>

        <div className="bg-[#12141d] border border-zinc-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-zinc-400">To Do</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-zinc-100 tracking-tight">
            {todoTasks}
          </div>
        </div>

        <div className="bg-[#12141d] border border-zinc-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-zinc-400">In Progress</span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-zinc-100 tracking-tight">
            {inProgressTasks}
          </div>
        </div>

        <div className="bg-[#12141d] border border-zinc-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-zinc-400">Done</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-zinc-100 tracking-tight">
            {completedTasks} <span className="text-xs font-normal text-zinc-400">/ {totalTasks}</span>
          </div>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects Preview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-xs text-zinc-300 uppercase tracking-wider">
              Projects
            </h3>
            <Link
              to="/projects"
              className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2">
            {projects.length === 0 ? (
              <div className="bg-[#12141d] border border-zinc-800/80 rounded-xl p-6 text-center text-zinc-400 text-xs">
                No projects yet. Click "New project" to begin.
              </div>
            ) : (
              projects.slice(0, 4).map((p) => (
                <Link
                  key={p._id}
                  to={`/projects/${p._id}`}
                  className="block bg-[#12141d] border border-zinc-800/80 hover:border-zinc-700 p-3.5 rounded-xl transition-all group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <Folder className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span className="font-medium text-xs text-zinc-200 group-hover:text-white truncate">
                        {p.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400 shrink-0 font-mono">
                      {p.members?.length || 1} member{p.members?.length === 1 ? '' : 's'}
                    </span>
                  </div>
                  {p.description && (
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-1 pl-5.5 font-normal">
                      {p.description}
                    </p>
                  )}
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-xs text-zinc-300 uppercase tracking-wider">
              Recent Tasks
            </h3>
            <Link
              to="/tasks"
              className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1 transition-colors"
            >
              Open task board <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-[#12141d] border border-zinc-800/80 rounded-xl divide-y divide-zinc-800/60 overflow-hidden">
            {tasks.length === 0 ? (
              <div className="p-8 text-center text-zinc-400 text-xs">
                No tasks created yet.
              </div>
            ) : (
              tasks.slice(0, 5).map((task) => (
                <div
                  key={task._id}
                  onClick={() => setSelectedTaskDetail(task)}
                  className="p-3 flex items-center justify-between gap-3 hover:bg-zinc-800/30 cursor-pointer transition-colors"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant="status" value={task.status} />
                      <Badge variant="priority" value={task.priority} />
                    </div>
                    <p className="text-xs font-medium text-zinc-200 truncate">{task.title}</p>
                  </div>

                  <div
                    className="shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <select
                      value={task.status}
                      onChange={(e) =>
                        handleStatusChange(task._id, e.target.value as TaskStatus)
                      }
                      className="bg-zinc-900 border border-zinc-700/60 rounded text-[11px] text-zinc-300 px-2 py-0.5 outline-none hover:border-zinc-500 cursor-pointer"
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Done</option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSubmit={handleCreateProject}
      />

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