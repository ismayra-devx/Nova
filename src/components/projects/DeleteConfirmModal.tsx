'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  itemName: string;
  itemType?: 'project' | 'task' | 'member' | 'item';
  warningMessage?: string;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
  itemType = 'item',
  warningMessage,
}: DeleteConfirmModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setError(null);
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Operation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const defaultWarning =
    itemType === 'project'
      ? 'This will permanently delete this project along with all associated tasks and member assignments. This action cannot be undone.'
      : itemType === 'member'
      ? 'This member will be removed from the project. Any tasks currently assigned to them will be safely unassigned.'
      : 'This task will be permanently removed. This action cannot be undone.';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="md"
    >
      <div className="space-y-4">
        {error && (
          <div className="p-3 text-xs bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] rounded-lg">
            {error}
          </div>
        )}

        <div className="flex items-start gap-3 p-3.5 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B]">
          <AlertTriangle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-semibold text-[#171923]">
              Are you sure you want to delete <span className="font-bold underline">&quot;{itemName}&quot;</span>?
            </p>
            <p className="text-[#60657A] leading-relaxed">
              {warningMessage || defaultWarning}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E6E8F0]">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            isLoading={loading}
            onClick={handleConfirm}
          >
            Confirm Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
