import React from 'react';
import type { Task } from '../../types';
import { Badge } from '../common/Badge';
import { Calendar, Trash2, Edit3, User as UserIcon } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onOpenDetail: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange?: (taskId: string, newStatus: Task['status']) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onOpenDetail,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const formattedDueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <div
      onClick={() => onOpenDetail(task)}
      className="bg-[#151822] border border-zinc-800/80 hover:border-zinc-700 rounded-xl p-3.5 shadow-sm hover:shadow transition-all cursor-pointer group flex flex-col justify-between space-y-3"
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <Badge variant="priority" value={task.priority} />

          <div
            className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => onEdit(task)}
              className="p-1 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded transition-colors"
              title="Edit"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(task._id)}
              className="p-1 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 rounded transition-colors"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <h4 className="font-medium text-[13px] text-zinc-100 group-hover:text-white leading-snug line-clamp-2">
          {task.title}
        </h4>

        {task.description && (
          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed font-normal">
            {task.description}
          </p>
        )}
      </div>

      <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between gap-2 text-[11px] text-zinc-400">
        <div className="flex items-center gap-3">
          {formattedDueDate && (
            <div className="flex items-center gap-1 text-zinc-400">
              <Calendar className="w-3 h-3 text-zinc-400" />
              <span>{formattedDueDate}</span>
            </div>
          )}

          {task.assignedTo && (
            <div className="flex items-center gap-1 text-zinc-400" title="Assigned">
              <UserIcon className="w-3 h-3 text-zinc-400" />
              <span>
                {typeof task.assignedTo === 'object' && task.assignedTo !== null
                  ? task.assignedTo.name
                  : 'Assigned'}
              </span>
            </div>
          )}
        </div>

        {onStatusChange && (
          <div onClick={(e) => e.stopPropagation()}>
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task._id, e.target.value as Task['status'])}
              className="bg-zinc-900 border border-zinc-700/60 rounded text-[11px] font-medium text-zinc-300 px-2 py-0.5 outline-none hover:border-zinc-600 cursor-pointer"
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Done</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};
