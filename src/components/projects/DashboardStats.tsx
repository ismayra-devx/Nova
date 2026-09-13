import React from 'react';
import { ProjectSummary } from '@/types/database';
import { Card } from '@/components/ui/Card';
import { FolderKanban, CheckCircle2, Clock } from 'lucide-react';

interface DashboardStatsProps {
  projects: ProjectSummary[];
}

export function DashboardStats({ projects }: DashboardStatsProps) {
  const totalProjects = projects.length;
  const totalTasks = projects.reduce((acc, p) => acc + (p.total_tasks || 0), 0);
  const completedTasks = projects.reduce((acc, p) => acc + (p.completed_tasks || 0), 0);
  const activeTasks = totalTasks - completedTasks;
  const overallProgress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    {
      title: 'Active Projects',
      value: totalProjects,
      subtitle: `${projects.filter((p) => p.progress === 100).length} completed`,
      icon: FolderKanban,
      color: 'text-[#5B5CE2] bg-[#EEF0FD]',
    },
    {
      title: 'Tasks In Progress',
      value: activeTasks,
      subtitle: `${totalTasks} total tasks across all projects`,
      icon: Clock,
      color: 'text-[#D97706] bg-[#FFFBEB]',
    },
    {
      title: 'Tasks Completed',
      value: completedTasks,
      subtitle: `${overallProgress}% overall completion rate`,
      icon: CheckCircle2,
      color: 'text-[#16A34A] bg-[#EDFDF5]',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <Card key={i} className="flex items-center gap-4 py-4 px-4 bg-white border-[#E6E8F0]">
            <div className={`p-2.5 rounded-lg ${stat.color} shrink-0`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-[#60657A]">{stat.title}</p>
              <p className="text-2xl font-bold text-[#171923] tracking-tight">{stat.value}</p>
              <p className="text-[11px] text-[#8C92A4] mt-0.5">{stat.subtitle}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
