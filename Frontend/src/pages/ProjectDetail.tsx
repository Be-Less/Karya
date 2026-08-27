import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectsApi } from '../api/projects.api';
import { tasksApi } from '../api/tasks.api';
import type { Project, Task, TaskStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { KanbanBoard } from '../components/tasks/KanbanBoard';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskModal } from '../components/tasks/TaskModal';
import { TaskDetailModal } from '../components/tasks/TaskDetailModal';
import { MemberManagementModal } from '../components/projects/MemberManagementModal';
import { ProjectModal } from '../components/projects/ProjectModal';
import { Badge } from '../components/common/Badge';
import {
  ArrowLeft,
  Plus,
  Users,
  LayoutGrid,
  List,
  Edit2,
} from 'lucide-react';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Views
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTaskDetail, setSelectedTaskDetail] = useState<Task | null>(null);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [defaultTaskStatus, setDefaultTaskStatus] = useState<TaskStatus>('todo');

  const fetchProjectData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const [projRes, tasksRes] = await Promise.all([
        projectsApi.getProject(id),
        tasksApi.getTasks(),
      ]);
      setProject(projRes.project);
      const projectTasks = (tasksRes.tasks || []).filter((t) => {
        const pId = typeof t.projectId === 'object' ? t.projectId._id : t.projectId;
        return pId === id;
      });
      setTasks(projectTasks);
    } catch (err: any) {
      setError(err?.message || 'Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const handleCreateOrUpdateTask = async (data: any) => {
    if (editingTask) {
      const res = await tasksApi.updateTask(editingTask._id, data);
      setTasks((prev) => prev.map((t) => (t._id === editingTask._id ? res.task : t)));
    } else {
      const res = await tasksApi.createTask({
        ...data,
        projectId: id!,
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

  const handleUpdateProject = async (data: { name: string; description?: string }) => {
    if (!id) return;
    const res = await projectsApi.updateProject(id, data);
    setProject(res.project);
  };

  const handleAddMember = async (projectId: string, userId: string) => {
    const res = await projectsApi.addMember(projectId, userId);
    setProject(res.project);
  };

  const handleRemoveMember = async (projectId: string, userId: string) => {
    const res = await projectsApi.removeMember(projectId, userId);
    setProject(res.project);
  };

  const filteredTasks = tasks.filter((t) => {
    if (priorityFilter === 'all') return true;
    return t.priority === priorityFilter;
  });

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner size="md" label="Loading project..." />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="space-y-4">
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to projects
        </Link>
        <div className="p-4 bg-rose-950/40 border border-rose-800/60 text-rose-300 rounded-xl text-xs">
          {error || 'Project not found or inaccessible.'}
        </div>
      </div>
    );
  }

  const isOwner = user?._id && project.owner === user._id;

  return (
    <div className="space-y-5">
      {/* Back link */}
      <Link
        to="/projects"
        className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>All projects</span>
      </Link>

      {/* Project Header */}
      <div className="bg-[#12141d] border border-zinc-800/80 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge variant="role" value={isOwner ? 'owner' : 'member'} />
              <span className="text-[11px] text-zinc-400">
                Created {new Date(project.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">
              {project.name}
            </h1>
            {project.description && (
              <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                {project.description}
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setIsMemberModalOpen(true)}
              className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/70 text-zinc-300 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5 text-zinc-400" />
              <span>{project.members?.length || 1} members</span>
            </button>

            {isOwner && (
              <button
                onClick={() => setIsProjectModalOpen(true)}
                className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/70 text-zinc-300 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Edit2 className="w-3 h-3 text-zinc-400" />
                <span>Edit</span>
              </button>
            )}

            <button
              onClick={() => {
                setEditingTask(null);
                setDefaultTaskStatus('todo');
                setIsTaskModalOpen(true);
              }}
              className="px-3 py-1.5 bg-zinc-100 hover:bg-white text-zinc-900 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add task</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#10121a] p-2.5 rounded-xl border border-zinc-800/80">
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 font-medium">Priority:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-[#0e1017] border border-zinc-700/70 rounded-lg text-xs text-zinc-200 px-2.5 py-1 outline-none"
          >
            <option value="all">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

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

      {/* Task Content */}
      {viewMode === 'kanban' ? (
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
        <div className="space-y-2.5">
          {filteredTasks.length === 0 ? (
            <div className="bg-[#12141d] border border-zinc-800/80 rounded-xl p-10 text-center text-zinc-400 text-xs">
              No tasks found for this project.
            </div>
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
        projects={project ? [project] : []}
        defaultProjectId={project._id}
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
        projects={project ? [project] : []}
      />

      <MemberManagementModal
        project={project}
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        onAddMember={handleAddMember}
        onRemoveMember={handleRemoveMember}
      />

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSubmit={handleUpdateProject}
        initialProject={project}
      />
    </div>
  );
}
