'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  ProjectSummary,
  Task,
  ProjectMember,
  TaskStatus,
} from '@/types/database';
import { Navbar } from '@/components/layout/Navbar';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { ProjectModal } from '@/components/projects/ProjectModal';
import { DeleteConfirmModal } from '@/components/projects/DeleteConfirmModal';
import { TaskBoard } from '@/components/tasks/TaskBoard';
import { TaskModal } from '@/components/tasks/TaskModal';
import { TaskDetailsModal } from '@/components/tasks/TaskDetailsModal';
import { MemberList } from '@/components/members/MemberList';
import { AddMemberModal } from '@/components/members/AddMemberModal';
import { calculateProgress } from '@/lib/utils/progress';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  Users,
  Trash2,
  Edit2,
  Plus,
  ArrowLeft,
  Layers,
  BarChart3,
  UserPlus,
  AlertCircle,
} from 'lucide-react';

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectWorkspacePage({ params }: ProjectPageProps) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;

  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [project, setProject] = useState<ProjectSummary | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active Tab: 'overview' | 'tasks' | 'members'
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'members'>('overview');

  // Modals state
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [isDeleteProjectOpen, setIsDeleteProjectOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteTaskOpen, setIsDeleteTaskOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isRemoveMemberOpen, setIsRemoveMemberOpen] = useState(false);

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [taskModalDefaultStatus, setTaskModalDefaultStatus] = useState<TaskStatus>('TODO');
  const [memberToRemove, setMemberToRemove] = useState<ProjectMember | null>(null);

  // Authenticated guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Load project workspace data
  const loadWorkspace = async () => {
    setLoading(true);
    setError(null);
    try {
      const projectRes = await fetch(`/api/projects/${projectId}`);
      const projectJson = await projectRes.json();

      if (!projectRes.ok || projectJson.error) {
        setError(projectJson.error?.message || 'Failed to load project');
        return;
      }

      setProject(projectJson.data);

      const tasksRes = await fetch(`/api/projects/${projectId}/tasks`);
      const tasksJson = await tasksRes.json();
      if (tasksJson.data) {
        setTasks(tasksJson.data);
      }

      const membersRes = await fetch(`/api/projects/${projectId}/members`);
      const membersJson = await membersRes.json();
      if (membersJson.data) {
        setMembers(membersJson.data);
      }
    } catch (err: any) {
      setError(err.message || 'Network error loading workspace');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && projectId) {
      loadWorkspace();
    }
  }, [user, projectId]);

  const progressSummary = calculateProgress(tasks);
  const isOwner = user?.id === project?.owner_id;

  // Task Handlers
  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      const res = await fetch(`/api/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (!res.ok || json.error) {
        loadWorkspace();
      } else if (activeTask?.id === taskId) {
        setActiveTask(json.data);
      }
    } catch {
      loadWorkspace();
    }
  };

  const handleOpenCreateTask = (status: TaskStatus = 'TODO') => {
    setActiveTask(null);
    setTaskModalDefaultStatus(status);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTask = (task: Task) => {
    setActiveTask(task);
    setIsTaskModalOpen(true);
  };

  const handleTaskSaved = (savedTask: Task) => {
    setTasks((prev) => {
      const exists = prev.some((t) => t.id === savedTask.id);
      if (exists) {
        return prev.map((t) => (t.id === savedTask.id ? savedTask : t));
      }
      return [savedTask, ...prev];
    });
  };

  const handleConfirmDeleteTask = async () => {
    if (!activeTask) return;
    const res = await fetch(`/api/tasks/${activeTask.id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      throw new Error('Failed to delete task');
    }
    setTasks((prev) => prev.filter((t) => t.id !== activeTask.id));
    setActiveTask(null);
  };

  // Member Handlers
  const handleMemberAdded = (newMember: ProjectMember) => {
    setMembers((prev) => [...prev, newMember]);
  };

  const handleConfirmRemoveMember = async () => {
    if (!memberToRemove) return;
    const res = await fetch(`/api/projects/${projectId}/members/${memberToRemove.user_id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      throw new Error('Failed to remove member');
    }
    setMembers((prev) => prev.filter((m) => m.id !== memberToRemove.id));
    setTasks((prev) =>
      prev.map((t) =>
        t.assignee_id === memberToRemove.user_id ? { ...t, assignee_id: null, assignee: null } : t
      )
    );
    setMemberToRemove(null);
  };

  const handleProjectUpdated = (updatedProject: ProjectSummary) => {
    setProject((prev) => (prev ? { ...prev, ...updatedProject } : updatedProject));
  };

  const handleConfirmDeleteProject = async () => {
    const res = await fetch(`/api/projects/${projectId}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      throw new Error('Failed to delete project');
    }
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex flex-col">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8 w-full space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex flex-col">
        <Navbar />
        <div className="max-w-md mx-auto my-auto p-8 text-center bg-white border border-[#E6E8F0] rounded-xl space-y-3 shadow-sm">
          <AlertCircle className="w-8 h-8 text-[#DC2626] mx-auto" />
          <h2 className="text-base font-bold text-[#171923]">Project Not Found</h2>
          <p className="text-xs text-[#60657A]">
            {error || 'You do not have access to this workspace or it has been removed.'}
          </p>
          <Link href="/dashboard">
            <Button variant="primary" size="sm">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FC] text-[#171923]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Breadcrumb: small and quiet */}
        <div className="flex items-center gap-1.5 text-xs text-[#8C92A4]">
          <Link href="/dashboard" className="hover:text-[#171923] flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-3 h-3" />
            Dashboard
          </Link>
          <span>/</span>
          <span className="text-[#60657A] font-medium truncate max-w-[240px]">
            {project.name}
          </span>
        </div>

        {/* Project Header: Airy, Clean Hierarchy with Breathing Room */}
        <div className="bg-white border border-[#E6E8F0] rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
            {/* Title, Badges, Description & Metadata */}
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171923]">
                  {project.name}
                </h1>
                <Badge variant={isOwner ? 'owner' : 'member'} size="sm">
                  {isOwner ? 'Owner' : 'Member'}
                </Badge>
              </div>

              <p className="text-xs sm:text-sm text-[#60657A] leading-relaxed">
                {project.description || 'No description provided.'}
              </p>

              <div className="flex items-center gap-3 text-xs text-[#8C92A4] pt-1">
                <span>Created by <strong className="font-semibold text-[#475569]">{project.owner?.name || 'Owner'}</strong></span>
                <span>•</span>
                <span>{members.length} {members.length === 1 ? 'member' : 'members'}</span>
              </div>
            </div>

            {/* Right Controls: Compact Progress & Logically Grouped Actions */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
              {/* Compact Progress Summary */}
              <div className="w-full sm:w-52 bg-[#F8F9FC] border border-[#E6E8F0] rounded-lg p-3 space-y-1.5">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-[#60657A] font-medium text-[11px]">Overall Progress</span>
                  <span className="text-sm font-bold text-[#5B5CE2]">
                    {progressSummary.progress}%
                  </span>
                </div>
                <ProgressBar progress={progressSummary.progress} size="sm" />
                <div className="flex justify-between text-[11px] text-[#8C92A4]">
                  <span>{progressSummary.completed} completed</span>
                  <span>{progressSummary.remaining} left</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {isOwner && (
                  <div className="flex items-center gap-1 border border-[#E6E8F0] rounded-lg p-0.5 bg-white">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditProjectOpen(true)}
                      className="text-xs h-7 px-2 text-[#60657A]"
                      title="Edit project"
                    >
                      <Edit2 className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <button
                      onClick={() => setIsDeleteProjectOpen(true)}
                      className="text-xs h-7 px-2 text-[#DC2626] hover:bg-[#FEF2F2] rounded transition-colors flex items-center cursor-pointer"
                      title="Delete project"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleOpenCreateTask('TODO')}
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  New Task
                </Button>
              </div>
            </div>
          </div>

          {/* Clean Tab Row with clear active state */}
          <div className="flex items-center gap-1 pt-3 border-t border-[#F1F3F9]">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#EEF0FD] text-[#5B5CE2]'
                  : 'text-[#60657A] hover:text-[#171923] hover:bg-[#F8F9FC]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Overview
            </button>

            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'tasks'
                  ? 'bg-[#EEF0FD] text-[#5B5CE2]'
                  : 'text-[#60657A] hover:text-[#171923] hover:bg-[#F8F9FC]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Task Board
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white border border-[#E6E8F0] text-[#60657A]">
                {tasks.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('members')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'members'
                  ? 'bg-[#EEF0FD] text-[#5B5CE2]'
                  : 'text-[#60657A] hover:text-[#171923] hover:bg-[#F8F9FC]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Members
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white border border-[#E6E8F0] text-[#60657A]">
                {members.length}
              </span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            {/* Meaningful Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="p-4 flex items-center gap-3.5">
                <div className="p-2.5 rounded-lg bg-[#EEF0FD] text-[#5B5CE2] shrink-0">
                  <FolderKanban className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-[#60657A]">Total Deliverables</p>
                  <p className="text-xl font-bold text-[#171923]">{progressSummary.total}</p>
                </div>
              </Card>

              <Card className="p-4 flex items-center gap-3.5">
                <div className="p-2.5 rounded-lg bg-[#FFFBEB] text-[#D97706] shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-[#60657A]">Remaining Tasks</p>
                  <p className="text-xl font-bold text-[#171923]">{progressSummary.remaining}</p>
                </div>
              </Card>

              <Card className="p-4 flex items-center gap-3.5">
                <div className="p-2.5 rounded-lg bg-[#EDFDF5] text-[#16A34A] shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-[#60657A]">Completed Tasks</p>
                  <p className="text-xl font-bold text-[#171923]">{progressSummary.completed}</p>
                </div>
              </Card>
            </div>

            {/* Overview Detail Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Recent Tasks */}
              <div className="lg:col-span-2 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#171923] uppercase tracking-wider">Recent Tasks</h3>
                  <button
                    onClick={() => setActiveTab('tasks')}
                    className="text-xs text-[#5B5CE2] hover:text-[#4E4FD1] font-semibold cursor-pointer"
                  >
                    View Task Board →
                  </button>
                </div>

                {tasks.length === 0 ? (
                  <div className="bg-white border border-dashed border-[#D0D4E4] rounded-xl p-8 text-center space-y-2">
                    <p className="text-xs text-[#60657A]">No tasks created yet in this project.</p>
                    <Button size="sm" variant="primary" onClick={() => handleOpenCreateTask('TODO')}>
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      Create first task
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {tasks.slice(0, 5).map((task) => (
                      <div
                        key={task.id}
                        onClick={() => {
                          setActiveTask(task);
                          setIsDetailsModalOpen(true);
                        }}
                        className="flex items-center justify-between p-3 bg-white border border-[#E6E8F0] hover:border-[#D0D4E4] rounded-xl cursor-pointer transition-colors shadow-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              task.status === 'DONE'
                                ? 'bg-[#16A34A]'
                                : task.status === 'IN_PROGRESS'
                                ? 'bg-[#5B5CE2]'
                                : 'bg-[#A0AEC0]'
                            }`}
                          />
                          <span className={`text-xs font-medium truncate ${task.status === 'DONE' ? 'text-[#8C92A4]' : 'text-[#171923]'}`}>
                            {task.title}
                          </span>
                        </div>
                        <Badge
                          variant={task.status === 'DONE' ? 'done' : task.status === 'IN_PROGRESS' ? 'in_progress' : 'todo'}
                          size="sm"
                        >
                          {task.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Team Roster */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#171923] uppercase tracking-wider">Team ({members.length})</h3>
                  <button
                    onClick={() => setActiveTab('members')}
                    className="text-xs text-[#5B5CE2] hover:text-[#4E4FD1] font-semibold cursor-pointer"
                  >
                    Manage →
                  </button>
                </div>

                <Card className="p-3.5 bg-white border-[#E6E8F0] space-y-2.5">
                  {members.map((m) => (
                    <div key={m.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <Avatar name={m.user?.name || 'User'} avatarUrl={m.user?.avatar_url} size="sm" />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#171923] truncate">{m.user?.name}</p>
                          <p className="text-[10px] text-[#8C92A4] truncate max-w-[130px]">{m.user?.email}</p>
                        </div>
                      </div>
                      <Badge variant={m.role === 'OWNER' ? 'owner' : 'member'} size="sm">
                        {m.role}
                      </Badge>
                    </div>
                  ))}

                  {isOwner && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full mt-1.5"
                      onClick={() => setIsAddMemberOpen(true)}
                    >
                      <UserPlus className="w-3.5 h-3.5 mr-1" />
                      Invite Member
                    </Button>
                  )}
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Tasks Tab: Full Kanban Board */}
        {activeTab === 'tasks' && (
          <div className="animate-in fade-in duration-150">
            <TaskBoard
              tasks={tasks}
              members={members}
              onStatusChange={handleStatusChange}
              onEditTask={handleOpenEditTask}
              onDeleteTask={(task) => {
                setActiveTask(task);
                setIsDeleteTaskOpen(true);
              }}
              onOpenTaskDetails={(task) => {
                setActiveTask(task);
                setIsDetailsModalOpen(true);
              }}
              onCreateTask={handleOpenCreateTask}
            />
          </div>
        )}

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div className="animate-in fade-in duration-150">
            <MemberList
              members={members}
              isOwner={isOwner}
              onAddMember={() => setIsAddMemberOpen(true)}
              onRemoveMember={(m) => {
                setMemberToRemove(m);
                setIsRemoveMemberOpen(true);
              }}
            />
          </div>
        )}
      </main>

      {/* MODALS */}
      <ProjectModal
        isOpen={isEditProjectOpen}
        onClose={() => setIsEditProjectOpen(false)}
        onSubmitSuccess={handleProjectUpdated}
        initialData={project}
      />

      <DeleteConfirmModal
        isOpen={isDeleteProjectOpen}
        onClose={() => setIsDeleteProjectOpen(false)}
        onConfirm={handleConfirmDeleteProject}
        title="Delete Project Workspace"
        itemName={project.name}
        itemType="project"
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setActiveTask(null);
        }}
        onSubmitSuccess={handleTaskSaved}
        projectId={projectId}
        members={members}
        initialData={activeTask}
        defaultStatus={taskModalDefaultStatus}
      />

      <TaskDetailsModal
        task={activeTask}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setActiveTask(null);
        }}
        onEdit={(task) => {
          setIsDetailsModalOpen(false);
          handleOpenEditTask(task);
        }}
        onDelete={(task) => {
          setIsDetailsModalOpen(false);
          setActiveTask(task);
          setIsDeleteTaskOpen(true);
        }}
        onStatusChange={handleStatusChange}
      />

      <DeleteConfirmModal
        isOpen={isDeleteTaskOpen}
        onClose={() => {
          setIsDeleteTaskOpen(false);
          setActiveTask(null);
        }}
        onConfirm={handleConfirmDeleteTask}
        title="Delete Task"
        itemName={activeTask?.title || 'this task'}
        itemType="task"
      />

      <AddMemberModal
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        projectId={projectId}
        onMemberAdded={handleMemberAdded}
      />

      <DeleteConfirmModal
        isOpen={isRemoveMemberOpen}
        onClose={() => {
          setIsRemoveMemberOpen(false);
          setMemberToRemove(null);
        }}
        onConfirm={handleConfirmRemoveMember}
        title="Remove Collaborator"
        itemName={memberToRemove?.user?.name || 'this member'}
        itemType="member"
        warningMessage="This collaborator will be removed from the workspace. All tasks currently assigned to them will be safely unassigned."
      />
    </div>
  );
}
