'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProjectSchema, CreateProjectInput } from '@/lib/validations';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (project: any) => void;
  initialData?: { id: string; name: string; description?: string | null } | null;
}

export function ProjectModal({
  isOpen,
  onClose,
  onSubmitSuccess,
  initialData,
}: ProjectModalProps) {
  const isEditing = Boolean(initialData?.id);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        description: initialData.description || '',
      });
    } else {
      reset({ name: '', description: '' });
    }
    setServerError(null);
  }, [initialData, isOpen, reset]);

  const onFormSubmit = async (data: CreateProjectInput) => {
    setServerError(null);
    try {
      const url = isEditing ? `/api/projects/${initialData?.id}` : '/api/projects';
      const method = isEditing ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        setServerError(json.error?.message || 'Failed to save project');
        return;
      }

      onSubmitSuccess(json.data);
      onClose();
    } catch (err: any) {
      setServerError(err.message || 'An unexpected error occurred');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Project' : 'Create New Project'}
      description={
        isEditing
          ? 'Update project title and description.'
          : 'Create a new team workspace to organize and deliver tasks.'
      }
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        {serverError && (
          <div className="p-3 text-xs bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] rounded-lg">
            {serverError}
          </div>
        )}

        <Input
          label="Project Name *"
          placeholder="e.g. Website Redesign"
          error={errors.name?.message}
          {...register('name')}
        />

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[#171923]">
            Description
          </label>
          <textarea
            rows={3}
            className="w-full px-3 py-2 text-sm bg-white border border-[#E6E8F0] hover:border-[#D0D4E4] rounded-lg text-[#171923] placeholder-[#A0AEC0] focus:outline-none focus:border-[#5B5CE2] focus:ring-2 focus:ring-[#5B5CE2]/15 resize-none shadow-xs"
            placeholder="Brief description of the project goals and deliverables..."
            {...register('description')}
          />
          {errors.description && (
            <p className="text-xs text-[#DC2626] font-medium">{errors.description.message}</p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E6E8F0]">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {isEditing ? 'Save Changes' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
