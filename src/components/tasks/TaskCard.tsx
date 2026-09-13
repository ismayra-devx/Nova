'use client';

import React from 'react';
import { Task, TaskStatus } from '@/types/database';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { formatDate, isOverdue } from '@/lib/utils/progress';
import {
  Calendar,
  CheckCircle,
  CircleDot,
  Circle,
  AlertCircle,
  Trash2,
  Edit2,
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onClick: (task: Task) => void;
}

export function TaskCard({
  task,
  onStatusChange,
  onEdit,
  onDelete,
  onClick,
}: TaskCardProps) {
  const overdue = isOverdue(task.due_date, task.status);

  const getPriorityVariant = (p: string) => {
    switch (p) {
      case 'HIGH':
        return 'high';
      case 'MEDIUM':
        return 'medium';
      case 'LOW':
      default:
        return 'low';
    }
  };

  const getNextStatus = (current: TaskStatus): TaskStatus => {
    if (current === 'TODO') return 'IN_PROGRESS';
    if (current === 'IN_PROGRESS') return 'DONE';
    return 'TODO';
  };

  return (
    <div
      onClick={() => onClick(task)}
      className="group relative bg-white border border-[#E6E8F0] hover:border-[#CBD2E0] rounded-xl p-3.5 transition-all duration-150 shadow-[0_1px_3px_0_rgba(16,24,40,0.04)] hover:shadow-[0_4px_6px_-2px_rgba(16,24,40,0.05)] cursor-pointer"
    >
      {/* Top Row: Priority semantic badge & Quiet action icons */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <Badge variant={getPriorityVariant(task.priority)} size="sm">
          {task.priority}
        </Badge>

        <div
          className="flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Quick status cycle button */}
          <button
            onClick={() => onStatusChange(task.id, getNextStatus(task.status))}
            title={`Advance status to ${getNextStatus(task.status).replace('_', ' ')}`}
            className="p-1 rounded text-[#60657A] hover:text-[#5B5CE2] hover:bg-[#F1F3F9] transition-colors"
          >
            {task.status === 'DONE' ? (
              <CheckCircle className="w-4 h-4 text-[#16A34A]" />
            ) : task.status === 'IN_PROGRESS' ? (
              <CircleDot className="w-4 h-4 text-[#5B5CE2]" />
            ) : (
              <Circle className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={() => onEdit(task)}
            title="Edit task"
            className="p-1 rounded text-[#60657A] hover:text-[#171923] hover:bg-[#F1F3F9] transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onDelete(task)}
            title="Delete task"
            className="p-1 rounded text-[#60657A] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Task Title: 15-16px semibold */}
      <h4
        className={`text-[15px] font-semibold leading-snug mb-1 transition-colors ${
          task.status === 'DONE'
            ? 'text-[#8C92A4]'
            : 'text-[#171923] group-hover:text-[#5B5CE2]'
        }`}
      >
        {task.title}
      </h4>

      {/* Description: 13-14px muted (2-3 lines) */}
      {task.description && (
        <p className="text-[13px] text-[#60657A] line-clamp-2 mb-3 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Footer: Due date & Assignee */}
      <div className="flex items-center justify-between pt-2.5 border-t border-[#F1F3F9] text-xs">
        {/* Due date with restrained overdue styling */}
        <div
          className={`flex items-center gap-1.5 font-medium ${
            overdue
              ? 'text-[#DC2626] bg-[#FEF2F2] px-2 py-0.5 rounded border border-[#FECACA]'
              : 'text-[#60657A]'
          }`}
          title={overdue ? 'This task is past its due date' : 'Due date'}
        >
          {overdue ? <AlertCircle className="w-3.5 h-3.5 shrink-0" /> : <Calendar className="w-3.5 h-3.5 shrink-0 text-[#8C92A4]" />}
          <span className="text-[11px]">{formatDate(task.due_date)}</span>
        </div>

        {/* Assignee Avatar + Name */}
        <div className="flex items-center gap-1.5" title={task.assignee ? `Assigned to ${task.assignee.name}` : 'Unassigned'}>
          {task.assignee ? (
            <>
              <Avatar
                name={task.assignee.name}
                avatarUrl={task.assignee.avatar_url}
                size="sm"
              />
              <span className="text-[11px] font-medium text-[#475569] hidden sm:inline max-w-[80px] truncate">
                {task.assignee.name.split(' ')[0]}
              </span>
            </>
          ) : (
            <span className="text-[11px] text-[#A0AEC0] italic">Unassigned</span>
          )}
        </div>
      </div>
    </div>
  );
}
