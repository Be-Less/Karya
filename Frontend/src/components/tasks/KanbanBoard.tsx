import React from 'react';
import type { Task, TaskStatus } from '../../types';
import { TaskCard } from './TaskCard';
import { Plus } from 'lucide-react';

interface KanbanBoardProps {
  tasks: Task[];
  onOpenDetail: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onAddTaskToColumn?: (status: TaskStatus) => void;
}

interface ColumnConfig {
  id: TaskStatus;
  title: string;
  dotColor: string;
}

const COLUMNS: ColumnConfig[] = [
  { id: 'todo', title: 'To Do', dotColor: 'bg-amber-400' },
  { id: 'in-progress', title: 'In Progress', dotColor: 'bg-blue-400' },
  { id: 'completed', title: 'Done', dotColor: 'bg-emerald-400' },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onOpenDetail,
  onEditTask,
  onDeleteTask,
  onStatusChange,
  onAddTaskToColumn,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
      {COLUMNS.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.id);

        return (
          <div
            key={col.id}
            className="bg-[#10131b] border border-zinc-800/80 rounded-xl p-3.5 flex flex-col min-h-[480px]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/60 mb-3">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${col.dotColor}`} />
                <h3 className="font-semibold text-xs text-zinc-200 uppercase tracking-wider">
                  {col.title}
                </h3>
                <span className="text-xs px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 font-mono font-medium">
                  {columnTasks.length}
                </span>
              </div>

              {onAddTaskToColumn && (
                <button
                  onClick={() => onAddTaskToColumn(col.id)}
                  className="p-1 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors"
                  title={`Add to ${col.title}`}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Column Task Cards */}
            <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[calc(100vh-270px)] pr-0.5">
              {columnTasks.length === 0 ? (
                <div className="h-28 flex flex-col items-center justify-center border border-dashed border-zinc-800/80 rounded-lg text-zinc-400 text-xs gap-1">
                  <span>No tasks</span>
                </div>
              ) : (
                columnTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onOpenDetail={onOpenDetail}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                    onStatusChange={onStatusChange}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
