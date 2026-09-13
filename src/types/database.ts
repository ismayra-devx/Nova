export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type ProjectMemberRole = 'OWNER' | 'MEMBER';

export interface Profile {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectMember {
  id: string;
  project_id: string;
  user_id: string;
  role: ProjectMemberRole;
  joined_at: string;
  // Joined profile for display
  user?: Profile;
}

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  assignee_id: string | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  // Joined assignee for display
  assignee?: Profile | null;
}

export interface ProjectSummary extends Project {
  owner?: Profile;
  progress: number;
  total_tasks: number;
  completed_tasks: number;
  remaining_tasks: number;
  member_count: number;
  members?: ProjectMember[];
  tasks?: Task[];
}
