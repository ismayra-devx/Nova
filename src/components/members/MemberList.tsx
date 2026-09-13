'use client';

import React from 'react';
import { ProjectMember } from '@/types/database';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils/progress';
import { UserPlus, UserMinus, Mail, Calendar } from 'lucide-react';

interface MemberListProps {
  members: ProjectMember[];
  isOwner: boolean;
  onAddMember: () => void;
  onRemoveMember: (member: ProjectMember) => void;
}

export function MemberList({
  members,
  isOwner,
  onAddMember,
  onRemoveMember,
}: MemberListProps) {
  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E6E8F0]">
        <div>
          <h3 className="text-sm font-bold text-[#171923]">Project Collaborators</h3>
          <p className="text-xs text-[#60657A] mt-0.5">
            Team members with access to tasks and deliverables in this workspace.
          </p>
        </div>

        {isOwner && (
          <Button size="sm" variant="primary" onClick={onAddMember}>
            <UserPlus className="w-3.5 h-3.5 mr-1" />
            Invite Member
          </Button>
        )}
      </div>

      {/* Clean Members Table/Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {members.map((member) => {
          const isMemberOwner = member.role === 'OWNER';
          return (
            <div
              key={member.id}
              className="flex items-center justify-between p-3.5 bg-white border border-[#E6E8F0] hover:border-[#D0D4E4] rounded-xl transition-colors shadow-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Avatar
                  name={member.user?.name || 'User'}
                  avatarUrl={member.user?.avatar_url}
                  size="md"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#171923] truncate">
                      {member.user?.name || 'Project Member'}
                    </span>
                    <Badge variant={isMemberOwner ? 'owner' : 'member'} size="sm">
                      {member.role}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-[11px] text-[#60657A] truncate">
                    <span className="flex items-center gap-1 truncate">
                      <Mail className="w-3 h-3 text-[#8C92A4]" />
                      {member.user?.email || 'No email'}
                    </span>
                    <span className="hidden sm:flex items-center gap-1 shrink-0 text-[#8C92A4]">
                      <Calendar className="w-3 h-3" />
                      {formatDate(member.joined_at)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              {isOwner && !isMemberOwner && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onRemoveMember(member)}
                  className="text-[#60657A] hover:text-[#DC2626] hover:bg-[#FEF2F2] p-1.5 ml-2"
                  title="Remove collaborator"
                >
                  <UserMinus className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
