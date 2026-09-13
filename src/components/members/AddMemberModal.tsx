'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addMemberSchema, AddMemberInput } from '@/lib/validations';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ProjectMember } from '@/types/database';
import { UserPlus, Info } from 'lucide-react';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  onMemberAdded: (member: ProjectMember) => void;
}

export function AddMemberModal({
  isOpen,
  onClose,
  projectId,
  onMemberAdded,
}: AddMemberModalProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddMemberInput>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: { email: '', name: '' },
  });

  const onFormSubmit = async (data: AddMemberInput) => {
    setServerError(null);
    try {
      const res = await fetch(`/api/projects/${projectId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        setServerError(json.error?.message || 'Failed to add collaborator');
        return;
      }

      onMemberAdded(json.data);
      reset();
      onClose();
    } catch (err: any) {
      setServerError(err.message || 'An unexpected error occurred');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        reset();
        setServerError(null);
        onClose();
      }}
      title="Invite Team Member"
      description="Add a collaborator to this workspace by their email, or provide their name to add them immediately."
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        {serverError && (
          <div className="p-3 text-xs bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] rounded-lg">
            {serverError}
          </div>
        )}

        <Input
          label="Collaborator Email *"
          type="email"
          placeholder="colleague@nova.team"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Collaborator Name (Optional)"
          type="text"
          placeholder="e.g. Rachel Adams"
          hint="If they haven't registered yet, entering their name auto-provisions and adds them directly."
          error={errors.name?.message}
          {...register('name')}
        />

        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#EEF0FD] border border-[#D9DCF9] text-[#5B5CE2] text-xs">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Registered demo team accounts for quick testing: <br />
            <span className="font-semibold text-[#171923]">sarah@nova.team</span> or{' '}
            <span className="font-semibold text-[#171923]">marcus@nova.team</span>
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E6E8F0]">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              reset();
              setServerError(null);
              onClose();
            }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            <UserPlus className="w-3.5 h-3.5 mr-1" />
            Add Collaborator
          </Button>
        </div>
      </form>
    </Modal>
  );
}
