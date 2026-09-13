'use client';

import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Task, TaskStatus, TaskPriority, ProjectMember } from '@/types/database';
import { TaskCard } from './TaskCard';
import { Button } from '@/components/ui/Button';
import {
  Plus,
  Filter,
  Search,
  X,
  CheckCircle2,
  Clock,
  ListTodo,
} from 'lucide-react';

interface TaskBoardProps {
  tasks: Task[];
  members: ProjectMember[];
  onStatusChange: (taskId: string, newStatus: TaskStatus) => Promise<void>;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onOpenTaskDetails: (task: Task) => void;
  onCreateTask: (status?: TaskStatus) => void;
}

export function TaskBoard({
  tasks,
  members,
  onStatusChange,
  onEditTask,
  onDeleteTask,
  onOpenTaskDetails,
  onCreateTask,
}: TaskBoardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('ALL');

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    statusFilter !== 'ALL' ||
    priorityFilter !== 'ALL' ||
    assigneeFilter !== 'ALL';

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setPriorityFilter('ALL');
    setAssigneeFilter('ALL');
  };

  const handleStatusChangeWithConfetti = async (taskId: string, newStatus: TaskStatus) => {
    await onStatusChange(taskId, newStatus);
    if (newStatus === 'DONE') {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.8 },
      });
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = task.description?.toLowerCase().includes(query) || false;
        if (!matchesTitle && !matchesDesc) return false;
      }

      if (statusFilter !== 'ALL' && task.status !== statusFilter) {
        return false;
      }

      if (priorityFilter !== 'ALL' && task.priority !== priorityFilter) {
        return false;
      }

      if (assigneeFilter !== 'ALL') {
        if (assigneeFilter === 'UNASSIGNED') {
          if (task.assignee_id !== null) return false;
        } else if (task.assignee_id !== assigneeFilter) {
          return false;
        }
      }

      return true;
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter, assigneeFilter]);

  const todoTasks = filteredTasks.filter((t) => t.status === 'TODO');
  const inProgressTasks = filteredTasks.filter((t) => t.status === 'IN_PROGRESS');
  const doneTasks = filteredTasks.filter((t) => t.status === 'DONE');

  const columns: Array<{
    status: TaskStatus;
    title: string;
    icon: any;
    color: string;
    tasks: Task[];
  }> = [
    {
      status: 'TODO',
      title: 'To Do',
      icon: ListTodo,
      color: 'text-[#60657A]',
      tasks: todoTasks,
    },
    {
      status: 'IN_PROGRESS',
      title: 'In Progress',
      icon: Clock,
      color: 'text-[#5B5CE2]',
      tasks: inProgressTasks,
    },
    {
      status: 'DONE',
      title: 'Completed',
      icon: CheckCircle2,
      color: 'text-[#16A34A]',
      tasks: doneTasks,
    },
  ];

  return (
    <div className="space-y-5">
      {/* Productivity Toolbar: Search & Select Filters */}
      <div className="bg-white border border-[#E6E8F0] rounded-xl p-2.5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5 shadow-xs">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-[#8C92A4] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-7 py-1.5 text-xs bg-[#F8F9FC] border border-[#E6E8F0] rounded-lg text-[#171923] placeholder-[#A0AEC0] focus:outline-none focus:border-[#5B5CE2] focus:bg-white transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C92A4] hover:text-[#171923]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-[#F8F9FC] border border-[#E6E8F0] rounded-lg text-[#171923] focus:outline-none focus:border-[#5B5CE2] cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Completed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-[#F8F9FC] border border-[#E6E8F0] rounded-lg text-[#171923] focus:outline-none focus:border-[#5B5CE2] cursor-pointer"
          >
            <option value="ALL">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>

          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-[#F8F9FC] border border-[#E6E8F0] rounded-lg text-[#171923] focus:outline-none focus:border-[#5B5CE2] cursor-pointer max-w-[140px] truncate"
          >
            <option value="ALL">All Assignees</option>
            <option value="UNASSIGNED">Unassigned</option>
            {members.map((m) => (
              <option key={m.user_id} value={m.user_id}>
                {m.user?.name || m.user_id}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-xs text-[#5B5CE2] hover:text-[#4E4FD1] px-2 py-1 rounded-md hover:bg-[#EEF0FD] transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}

          <Button
            size="sm"
            variant="primary"
            onClick={() => onCreateTask('TODO')}
            className="ml-auto"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Filter Empty State */}
      {hasActiveFilters && filteredTasks.length === 0 && (
        <div className="bg-white border border-[#E6E8F0] rounded-xl p-8 text-center space-y-2.5">
          <Filter className="w-6 h-6 text-[#8C92A4] mx-auto" />
          <h4 className="text-xs font-semibold text-[#171923]">No matching tasks found</h4>
          <p className="text-xs text-[#60657A] max-w-sm mx-auto">
            Try adjusting your search query or reset your filters.
          </p>
          <Button size="sm" variant="secondary" onClick={clearFilters}>
            Reset Filters
          </Button>
        </div>
      )}

      {/* 3-Column Kanban Board */}
      {(!hasActiveFilters || filteredTasks.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {columns.map((col) => {
            const Icon = col.icon;
            return (
              <div
                key={col.status}
                className="bg-[#F4F5F9] border border-[#E6E8F0] rounded-xl p-3.5 flex flex-col min-h-[460px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E6E8F0]">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${col.color}`} />
                    <h3 className="text-xs font-bold text-[#171923] uppercase tracking-wider">
                      {col.title}
                    </h3>
                    <span className="text-[11px] font-semibold px-2 py-0.2 rounded-md bg-white text-[#60657A] border border-[#E6E8F0]">
                      {col.tasks.length}
                    </span>
                  </div>

                  <button
                    onClick={() => onCreateTask(col.status)}
                    className="p-1 rounded text-[#8C92A4] hover:text-[#171923] hover:bg-white transition-colors"
                    title={`Add task to ${col.title}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Task Cards Column */}
                <div className="space-y-2.5 flex-1">
                  {col.tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onStatusChange={handleStatusChangeWithConfetti}
                      onEdit={onEditTask}
                      onDelete={onDeleteTask}
                      onClick={onOpenTaskDetails}
                    />
                  ))}

                  {/* Empty state for column */}
                  {col.tasks.length === 0 && (
                    <div className="h-32 border border-dashed border-[#D0D4E4] rounded-lg flex flex-col items-center justify-center p-3 text-center">
                      <p className="text-xs text-[#8C92A4] mb-1.5">No tasks</p>
                      <button
                        onClick={() => onCreateTask(col.status)}
                        className="text-xs font-medium text-[#5B5CE2] hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        Create
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
