'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTaskSchema, CreateTaskInput } from '@/lib/validations';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { ProjectMember, Task, TaskStatus } from '@/types/database';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (task: Task) => void;
  projectId: string;
  members: ProjectMember[];
  initialData?: Task | null;
  defaultStatus?: TaskStatus;
}

export function TaskModal({
  isOpen,
  onClose,
  onSubmitSuccess,
  projectId,
  members,
  initialData,
  defaultStatus = 'TODO',
}: TaskModalProps) {
  const isEditing = Boolean(initialData?.id);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: defaultStatus,
      priority: 'MEDIUM',
      assigneeId: '',
      dueDate: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        description: initialData.description || '',
        status: initialData.status,
        priority: initialData.priority,
        assigneeId: initialData.assignee_id || '',
        dueDate: initialData.due_date ? initialData.due_date.substring(0, 10) : '',
      });
    } else {
      reset({
        title: '',
        description: '',
        status: defaultStatus,
        priority: 'MEDIUM',
        assigneeId: '',
        dueDate: '',
      });
    }
    setServerError(null);
  }, [initialData, defaultStatus, isOpen, reset]);

  const onFormSubmit = async (data: CreateTaskInput) => {
    setServerError(null);
    try {
      const url = isEditing
        ? `/api/tasks/${initialData?.id}`
        : `/api/projects/${projectId}/tasks`;
      const method = isEditing ? 'PATCH' : 'POST';

      const payload = {
        ...data,
        assigneeId: data.assigneeId ? data.assigneeId : null,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        setServerError(json.error?.message || 'Failed to save task');
        return;
      }

      onSubmitSuccess(json.data);
      onClose();
    } catch (err: any) {
      setServerError(err.message || 'An unexpected network error occurred');
    }
  };

  const memberOptions = [
    { value: '', label: 'Unassigned' },
    ...members.map((m) => ({
      value: m.user_id,
      label: m.user?.name ? `${m.user.name} (${m.user.email})` : m.user_id,
    })),
  ];

  const statusOptions = [
    { value: 'TODO', label: 'To Do' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'DONE', label: 'Completed' },
  ];

  const priorityOptions = [
    { value: 'LOW', label: 'Low Priority' },
    { value: 'MEDIUM', label: 'Medium Priority' },
    { value: 'HIGH', label: 'High Priority' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Task' : 'Create New Task'}
      description={
        isEditing
          ? 'Update task details, assignment, and status.'
          : 'Add a new actionable item to this project workspace.'
      }
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        {serverError && (
          <div className="p-3 text-xs bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] rounded-lg">
            {serverError}
          </div>
        )}

        <Input
          label="Task Title *"
          placeholder="e.g. Implement authentication middleware"
          error={errors.title?.message}
          {...register('title')}
        />

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[#171923]">
            Description
          </label>
          <textarea
            rows={3}
            className="w-full px-3 py-2 text-sm bg-white border border-[#E6E8F0] hover:border-[#D0D4E4] rounded-lg text-[#171923] placeholder-[#A0AEC0] focus:outline-none focus:border-[#5B5CE2] focus:ring-2 focus:ring-[#5B5CE2]/15 resize-none shadow-xs"
            placeholder="Detailed description of deliverables and acceptance criteria..."
            {...register('description')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Select
            label="Status"
            options={statusOptions}
            {...register('status')}
          />

          <Select
            label="Priority"
            options={priorityOptions}
            {...register('priority')}
          />

          <Select
            label="Assignee"
            options={memberOptions}
            {...register('assigneeId')}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#171923] mb-1.5">
            Due Date
          </label>
          <input
            type="date"
            className="w-full px-3 py-2 text-sm bg-white border border-[#E6E8F0] hover:border-[#D0D4E4] rounded-lg text-[#171923] focus:outline-none focus:border-[#5B5CE2] focus:ring-2 focus:ring-[#5B5CE2]/15 cursor-pointer shadow-xs"
            {...register('dueDate')}
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E6E8F0]">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {isEditing ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
