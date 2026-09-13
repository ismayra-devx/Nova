'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { ProjectSummary } from '@/types/database';
import { Navbar } from '@/components/layout/Navbar';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ProjectModal } from '@/components/projects/ProjectModal';
import { DashboardStats } from '@/components/projects/DashboardStats';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  FolderKanban,
  Plus,
  Search,
  FolderPlus,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { OnboardingWalkthrough } from '@/components/onboarding/OnboardingWalkthrough';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Authentication guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Fetch projects
  const fetchProjects = async () => {
    setLoadingProjects(true);
    setFetchError(null);
    try {
      const res = await fetch('/api/projects');
      const json = await res.json();
      if (!res.ok || json.error) {
        setFetchError(json.error?.message || 'Failed to load projects');
        return;
      }
      setProjects(json.data || []);
    } catch (err: any) {
      setFetchError(err.message || 'Network error fetching projects');
    } finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const handleProjectCreated = (newProject: ProjectSummary) => {
    setProjects((prev) => [newProject, ...prev]);
  };

  const filteredProjects = projects.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q));
  });

  if (authLoading || (!user && !fetchError)) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#5B5CE2] animate-pulse flex items-center justify-center text-white">
            <FolderKanban className="w-4 h-4" />
          </div>
          <p className="text-xs text-[#60657A]">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FC] text-[#171923]">
      <Navbar onCreateProject={() => setIsCreateModalOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171923]">
                Workspace Dashboard
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#EEF0FD] text-[#5B5CE2] border border-[#D9DCF9]">
                {projects.length} {projects.length === 1 ? 'Project' : 'Projects'}
              </span>
            </div>
            <p className="text-xs text-[#60657A] mt-1">
              Welcome back, <span className="font-semibold text-[#171923]">{user?.name}</span>. Monitor deliverables and collaborate with your team.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsTourOpen(true)}
              title="Start guided onboarding walkthrough"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-[#5B5CE2]" />
              Quick Tour
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchProjects}
              title="Refresh projects"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              New Project
            </Button>
          </div>
        </div>

        {/* High-level Statistics */}
        {!loadingProjects && projects.length > 0 && (
          <DashboardStats projects={projects} />
        )}

        {/* Project Listing Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E6E8F0]">
            <h2 className="text-sm font-bold text-[#171923] uppercase tracking-wider">Active Projects</h2>

            {projects.length > 0 && (
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-[#8C92A4] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-[#E6E8F0] rounded-lg text-[#171923] placeholder-[#A0AEC0] focus:outline-none focus:border-[#5B5CE2] shadow-xs"
                />
              </div>
            )}
          </div>

          {/* Loading Skeletons */}
          {loadingProjects && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-5 rounded-xl border border-[#E6E8F0] bg-white space-y-3 shadow-xs">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-2 w-full mt-3" />
                  <div className="flex justify-between pt-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-5 w-14 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error Banner */}
          {fetchError && (
            <div className="p-4 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] text-xs flex items-center justify-between">
              <span>{fetchError}</span>
              <Button size="sm" variant="outline" onClick={fetchProjects}>
                Retry
              </Button>
            </div>
          )}

          {/* Projects Grid */}
          {!loadingProjects && filteredProjects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}

          {/* Search Empty State */}
          {!loadingProjects && projects.length > 0 && filteredProjects.length === 0 && (
            <div className="text-center py-12 border border-dashed border-[#D0D4E4] rounded-xl p-8 bg-white space-y-2">
              <Search className="w-6 h-6 text-[#8C92A4] mx-auto" />
              <h3 className="text-xs font-semibold text-[#171923]">No projects match &quot;{searchQuery}&quot;</h3>
              <p className="text-xs text-[#60657A]">Try searching with a different term.</p>
              <Button size="sm" variant="secondary" onClick={() => setSearchQuery('')}>
                Clear Search
              </Button>
            </div>
          )}

          {/* Zero Projects Useful Empty State */}
          {!loadingProjects && projects.length === 0 && !fetchError && (
            <div className="text-center py-14 border border-dashed border-[#D0D4E4] rounded-xl p-8 bg-white max-w-md mx-auto space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#EEF0FD] text-[#5B5CE2] flex items-center justify-center mx-auto">
                <FolderPlus className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-[#171923]">No projects yet</h3>
                <p className="text-xs text-[#60657A] leading-relaxed">
                  Workspaces allow your team to coordinate tasks, monitor progress, and deliver goals.
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Create your first project
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Create Project Modal */}
      <ProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmitSuccess={handleProjectCreated}
      />

      {/* First-time Onboarding Walkthrough */}
      <OnboardingWalkthrough
        forceOpen={isTourOpen}
        onCloseTour={() => setIsTourOpen(false)}
      />
    </div>
  );
}
