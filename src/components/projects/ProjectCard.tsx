'use client';

import React from 'react';
import Link from 'next/link';
import { ProjectSummary } from '@/types/database';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Avatar } from '@/components/ui/Avatar';
import { CheckCircle2, Users } from 'lucide-react';

interface ProjectCardProps {
  project: ProjectSummary;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`} className="group block focus:outline-none">
      <Card
        hover
        className="h-full flex flex-col justify-between p-5 bg-white border border-[#E6E8F0] hover:border-[#CBD2E0] transition-all duration-150"
      >
        <div>
          {/* Header & Title */}
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <h3 className="text-[15px] font-bold text-[#171923] group-hover:text-[#5B5CE2] transition-colors line-clamp-1">
              {project.name}
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#F8F9FC] text-[#60657A] border border-[#E6E8F0] shrink-0">
              {project.progress}%
            </span>
          </div>

          {/* Description */}
          <p className="text-xs text-[#60657A] line-clamp-2 min-h-[32px] mb-3 leading-relaxed">
            {project.description || 'No description provided.'}
          </p>

          {/* Progress Bar */}
          <div className="mb-4">
            <ProgressBar progress={project.progress} size="sm" />
          </div>
        </div>

        {/* Card Footer: Tasks & Members */}
        <div className="pt-3 border-t border-[#F1F3F9] flex items-center justify-between text-xs text-[#60657A]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5" title="Tasks completed / total">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
              <span className="font-medium text-[#475569]">
                {project.completed_tasks}/{project.total_tasks}
              </span>
            </div>

            <div className="flex items-center gap-1.5" title="Project members">
              <Users className="w-3.5 h-3.5 text-[#5B5CE2]" />
              <span className="font-medium text-[#475569]">{project.member_count}</span>
            </div>
          </div>

          {/* Member avatars preview */}
          <div className="flex items-center -space-x-1.5 overflow-hidden">
            {project.members?.slice(0, 3).map((m) => (
              <Avatar
                key={m.id}
                name={m.user?.name || 'User'}
                avatarUrl={m.user?.avatar_url}
                size="sm"
                className="ring-2 ring-white"
              />
            ))}
            {(project.member_count || 0) > 3 && (
              <div className="w-6 h-6 rounded-full bg-[#F8F9FC] border border-[#E6E8F0] flex items-center justify-center text-[10px] font-bold text-[#60657A]">
                +{(project.member_count || 0) - 3}
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
