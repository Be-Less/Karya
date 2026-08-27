import React from 'react';
import { Modal } from '../common/Modal';
import type { Task, Project } from '../../types';
import { Badge } from '../common/Badge';
import { CommentSection } from '../comments/CommentSection';
import { Calendar, User as UserIcon, Folder, Edit3, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: Task['status']) => void;
  projects: Project[];
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
  projects,
}) => {
  if (!task) return null;

  const { user } = useAuth();
  const assignedUserId =
    typeof task.assignedTo === 'object' && task.assignedTo !== null
      ? task.assignedTo._id
      : task.assignedTo;
  const canManageTask = task.userId === user?._id || assignedUserId === user?._id;

  const project =
    typeof task.projectId === 'object'
      ? task.projectId
      : projects.find((p) => p._id === task.projectId);

  const formattedDueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })
    : 'None';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Task" maxWidth="xl">
      <div className="space-y-5">
        {/* Header Details */}
        <div className="space-y-3 pb-3 border-b border-zinc-800">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="status" value={task.status} />
              <Badge variant="priority" value={task.priority} />
            </div>

            {canManageTask && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    onClose();
                    onEdit(task);
                  }}
                  className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Delete this task?')) {
                      onDelete(task._id);
                      onClose();
                    }
                  }}
                  className="px-2.5 py-1 bg-zinc-900 hover:bg-rose-950/40 text-zinc-400 hover:text-rose-300 border border-zinc-800 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>

          <h2 className="text-base font-semibold text-zinc-100">{task.title}</h2>

          {task.description && (
            <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap bg-[#0d0f15] p-3.5 rounded-lg border border-zinc-800/80">
              {task.description}
            </p>
          )}
        </div>

        {/* Status progress bar */}
        {canManageTask && <div className="bg-[#0e1118] p-3 rounded-lg border border-zinc-800/80 flex items-center justify-between gap-3">
          <span className="text-xs text-zinc-400 font-medium">Status:</span>
          <div className="flex items-center gap-1.5">
            {(['todo', 'in-progress', 'completed'] as Task['status'][]).map((st) => (
              <button
                key={st}
                onClick={() => onStatusChange(task._id, st)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  task.status === st
                    ? 'bg-zinc-200 text-zinc-900 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                }`}
              >
                {st === 'todo' ? 'To Do' : st === 'in-progress' ? 'In Progress' : 'Done'}
              </button>
            ))}
          </div>
        </div>}

        {/* Metadata row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-[#0e1118] border border-zinc-800/80 p-2.5 rounded-lg flex items-center gap-2.5">
            <Folder className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <div className="overflow-hidden">
              <div className="text-[10px] text-zinc-400 uppercase font-medium">Project</div>
              <div className="text-xs font-medium text-zinc-200 truncate">
                {project?.name || 'Workspace'}
              </div>
            </div>
          </div>

          <div className="bg-[#0e1118] border border-zinc-800/80 p-2.5 rounded-lg flex items-center gap-2.5">
            <Calendar className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <div>
              <div className="text-[10px] text-zinc-400 uppercase font-medium">Due Date</div>
              <div className="text-xs font-medium text-zinc-200">{formattedDueDate}</div>
            </div>
          </div>

          <div className="bg-[#0e1118] border border-zinc-800/80 p-2.5 rounded-lg flex items-center gap-2.5">
            <UserIcon className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <div>
              <div className="text-[10px] text-zinc-400 uppercase font-medium">Assignee</div>
              <div className="text-xs font-medium text-zinc-200">
                {typeof task.assignedTo === 'object' && task.assignedTo !== null
                  ? task.assignedTo.name
                  : task.assignedTo
                  ? 'Assigned user'
                  : 'Unassigned'}
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="pt-2 border-t border-zinc-800">
          <CommentSection taskId={task._id} />
        </div>
      </div>
    </Modal>
  );
};
