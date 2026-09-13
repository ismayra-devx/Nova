'use client';

import React from 'react';
import { Task, TaskStatus } from '@/types/database';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { formatDate, isOverdue } from '@/lib/utils/progress';
import {
  Calendar,
  User,
  Edit2,
  Trash2,
  AlertCircle,
} from 'lucide-react';

interface TaskDetailsModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
}

export function TaskDetailsModal({
  task,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskDetailsModalProps) {
  if (!task) return null;

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

  const getStatusVariant = (s: TaskStatus) => {
    switch (s) {
      case 'DONE':
        return 'done';
      case 'IN_PROGRESS':
        return 'in_progress';
      case 'TODO':
      default:
        return 'todo';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Task Details"
      maxWidth="lg"
    >
      <div className="space-y-5">
        {/* Title & Status Badges */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant={getStatusVariant(task.status)} size="md">
              {task.status.replace('_', ' ')}
            </Badge>
            <Badge variant={getPriorityVariant(task.priority)} size="md">
              {task.priority} Priority
            </Badge>
            {overdue && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]">
                <AlertCircle className="w-3 h-3" /> Overdue
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-[#171923] leading-snug">
            {task.title}
          </h3>
        </div>

        {/* Description */}
        <div className="bg-[#F8F9FC] p-3.5 rounded-xl border border-[#E6E8F0]">
          <p className="text-[11px] font-semibold text-[#8C92A4] uppercase tracking-wider mb-1.5">
            Description
          </p>
          <p className="text-xs text-[#475569] whitespace-pre-wrap leading-relaxed">
            {task.description ? task.description : <span className="text-[#A0AEC0] italic">No description provided.</span>}
          </p>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F8F9FC] border border-[#E6E8F0]">
            <div className="p-2 rounded-lg bg-white text-[#5B5CE2] border border-[#E6E8F0] shadow-xs">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] text-[#8C92A4] font-medium">Assignee</p>
              {task.assignee ? (
                <div className="flex items-center gap-2 mt-0.5">
                  <Avatar name={task.assignee.name} avatarUrl={task.assignee.avatar_url} size="sm" />
                  <span className="text-xs font-semibold text-[#171923]">{task.assignee.name}</span>
                </div>
              ) : (
                <p className="text-xs text-[#A0AEC0] italic mt-0.5">Not assigned</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F8F9FC] border border-[#E6E8F0]">
            <div className="p-2 rounded-lg bg-white text-[#0284C7] border border-[#E6E8F0] shadow-xs">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] text-[#8C92A4] font-medium">Due Date</p>
              <p className={`text-xs font-semibold mt-0.5 ${overdue ? 'text-[#DC2626]' : 'text-[#171923]'}`}>
                {formatDate(task.due_date)}
              </p>
            </div>
          </div>
        </div>

        {/* Status Quick Switcher */}
        <div className="p-3 rounded-xl bg-[#F8F9FC] border border-[#E6E8F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          <div>
            <p className="text-xs font-semibold text-[#171923]">Move Status</p>
            <p className="text-[11px] text-[#60657A]">Update task stage</p>
          </div>
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            {(['TODO', 'IN_PROGRESS', 'DONE'] as TaskStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => onStatusChange(task.id, status)}
                className={`flex-1 sm:flex-none text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer ${
                  task.status === status
                    ? 'bg-[#5B5CE2] border-[#5B5CE2] text-white font-semibold shadow-xs'
                    : 'bg-white border-[#E6E8F0] text-[#60657A] hover:bg-[#F8F9FC]'
                }`}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E6E8F0]">
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              onClose();
              onDelete(task);
            }}
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            Delete
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                onClose();
                onEdit(task);
              }}
            >
              <Edit2 className="w-3.5 h-3.5 mr-1" />
              Edit Task
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
