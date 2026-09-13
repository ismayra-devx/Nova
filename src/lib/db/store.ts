import fs from 'fs';
import path from 'path';
import {
  Profile,
  Project,
  ProjectMember,
  Task,
  ProjectSummary,
  TaskStatus,
  TaskPriority,
} from '@/types/database';
import { calculateProgress } from '@/lib/utils/progress';

interface DatabaseSchema {
  users: Array<{
    id: string;
    email: string;
    passwordHash: string;
    name: string;
  }>;
  profiles: Profile[];
  projects: Project[];
  project_members: ProjectMember[];
  tasks: Task[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

const INITIAL_DATA: DatabaseSchema = {
  users: [
    {
      id: 'usr_demo_1',
      name: 'Alex Johnson',
      email: 'alex@nova.team',
      passwordHash: 'password123',
    },
    {
      id: 'usr_demo_2',
      name: 'Sarah Chen',
      email: 'sarah@nova.team',
      passwordHash: 'password123',
    },
    {
      id: 'usr_demo_3',
      name: 'Marcus Vance',
      email: 'marcus@nova.team',
      passwordHash: 'password123',
    },
  ],
  profiles: [
    {
      id: 'usr_demo_1',
      name: 'Alex Johnson',
      email: 'alex@nova.team',
      avatar_url: null,
      created_at: new Date(Date.now() - 86400000 * 14).toISOString(),
    },
    {
      id: 'usr_demo_2',
      name: 'Sarah Chen',
      email: 'sarah@nova.team',
      avatar_url: null,
      created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
    },
    {
      id: 'usr_demo_3',
      name: 'Marcus Vance',
      email: 'marcus@nova.team',
      avatar_url: null,
      created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    },
  ],
  projects: [
    {
      id: 'prj_demo_1',
      name: 'NOVA Web Application Launch',
      description: 'Full-stack project management platform with modern team collaboration.',
      owner_id: 'usr_demo_1',
      created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
    {
      id: 'prj_demo_2',
      name: 'Mobile Client Experience',
      description: 'Optimized touch-friendly responsive interface and offline synchronization.',
      owner_id: 'usr_demo_1',
      created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
  ],
  project_members: [
    {
      id: 'pm_1',
      project_id: 'prj_demo_1',
      user_id: 'usr_demo_1',
      role: 'OWNER',
      joined_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    },
    {
      id: 'pm_2',
      project_id: 'prj_demo_1',
      user_id: 'usr_demo_2',
      role: 'MEMBER',
      joined_at: new Date(Date.now() - 86400000 * 6).toISOString(),
    },
    {
      id: 'pm_3',
      project_id: 'prj_demo_1',
      user_id: 'usr_demo_3',
      role: 'MEMBER',
      joined_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      id: 'pm_4',
      project_id: 'prj_demo_2',
      user_id: 'usr_demo_1',
      role: 'OWNER',
      joined_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
  ],
  tasks: [
    {
      id: 'tsk_1',
      project_id: 'prj_demo_1',
      title: 'Architect PostgreSQL schema and RLS policies',
      description: 'Define relational tables, cascading rules, and secure data access policies.',
      status: 'DONE',
      priority: 'HIGH',
      assignee_id: 'usr_demo_1',
      due_date: new Date(Date.now() - 86400000 * 2).toISOString(),
      created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'tsk_2',
      project_id: 'prj_demo_1',
      title: 'Implement Next.js App Router and REST routes',
      description: 'Create standard JSON response handlers with Zod validation.',
      status: 'DONE',
      priority: 'HIGH',
      assignee_id: 'usr_demo_2',
      due_date: new Date(Date.now() - 86400000 * 1).toISOString(),
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
    {
      id: 'tsk_3',
      project_id: 'prj_demo_1',
      title: 'Design interactive Task Board & progress tracking',
      description: 'Build Kanban columns with status switching and instant recalculation.',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      assignee_id: 'usr_demo_1',
      due_date: new Date(Date.now() + 86400000 * 3).toISOString(),
      created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'tsk_4',
      project_id: 'prj_demo_1',
      title: 'Setup team collaboration and email invite flow',
      description: 'Support adding valid registered members and safe task unassignment.',
      status: 'TODO',
      priority: 'MEDIUM',
      assignee_id: 'usr_demo_3',
      due_date: new Date(Date.now() + 86400000 * 5).toISOString(),
      created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'tsk_5',
      project_id: 'prj_demo_1',
      title: 'Run end-to-end automated tests',
      description: 'Verify all CRUD mutations, security guards, and error states.',
      status: 'TODO',
      priority: 'LOW',
      assignee_id: null,
      due_date: new Date(Date.now() + 86400000 * 7).toISOString(),
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'tsk_6',
      project_id: 'prj_demo_2',
      title: 'Audit responsive viewport breakpoints',
      description: 'Ensure mobile drawer, task card stacking, and modal viewports work cleanly.',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      assignee_id: 'usr_demo_1',
      due_date: new Date(Date.now() + 86400000 * 2).toISOString(),
      created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
};

function readStore(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(STORE_FILE)) {
      fs.writeFileSync(STORE_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf-8');
      return JSON.parse(JSON.stringify(INITIAL_DATA));
    }
    const raw = fs.readFileSync(STORE_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read local store, using in-memory fallback', err);
    return JSON.parse(JSON.stringify(INITIAL_DATA));
  }
}

function writeStore(data: DatabaseSchema): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write local store', err);
  }
}

// Generate simple UUID-like strings
function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;
}

export const localDb = {
  // Profiles & Auth
  findUserByEmail(email: string) {
    const store = readStore();
    return store.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  findUserById(id: string) {
    const store = readStore();
    return store.users.find((u) => u.id === id) || null;
  },

  getProfile(id: string): Profile | null {
    const store = readStore();
    return store.profiles.find((p) => p.id === id) || null;
  },

  createUser(name: string, email: string, passwordHash: string) {
    const store = readStore();
    const existing = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('User already exists');
    }
    const id = generateId('usr');
    const now = new Date().toISOString();
    const user = { id, name, email, passwordHash };
    const profile: Profile = {
      id,
      name,
      email,
      avatar_url: null,
      created_at: now,
    };
    store.users.push(user);
    store.profiles.push(profile);
    writeStore(store);
    return profile;
  },

  // Projects
  listProjects(userId: string): ProjectSummary[] {
    const store = readStore();
    // Projects where user is owner or member
    const memberProjectIds = new Set(
      store.project_members.filter((pm) => pm.user_id === userId).map((pm) => pm.project_id)
    );

    const userProjects = store.projects.filter(
      (p) => p.owner_id === userId || memberProjectIds.has(p.id)
    );

    return userProjects.map((project) => {
      const projectTasks = store.tasks.filter((t) => t.project_id === project.id);
      const { total, completed, remaining, progress } = calculateProgress(projectTasks);
      const members = store.project_members
        .filter((pm) => pm.project_id === project.id)
        .map((pm) => ({
          ...pm,
          user: store.profiles.find((p) => p.id === pm.user_id) || undefined,
        }));
      const owner = store.profiles.find((p) => p.id === project.owner_id) || undefined;

      return {
        ...project,
        owner,
        progress,
        total_tasks: total,
        completed_tasks: completed,
        remaining_tasks: remaining,
        member_count: members.length,
        members,
      };
    });
  },

  getProject(projectId: string, userId: string): ProjectSummary | null {
    const store = readStore();
    const project = store.projects.find((p) => p.id === projectId);
    if (!project) return null;

    const isMember = store.project_members.some(
      (pm) => pm.project_id === projectId && pm.user_id === userId
    );
    const isOwner = project.owner_id === userId;

    if (!isOwner && !isMember) {
      return null;
    }

    const projectTasks = store.tasks
      .filter((t) => t.project_id === projectId)
      .map((t) => ({
        ...t,
        assignee: t.assignee_id ? store.profiles.find((p) => p.id === t.assignee_id) || null : null,
      }));

    const { total, completed, remaining, progress } = calculateProgress(projectTasks);
    const members = store.project_members
      .filter((pm) => pm.project_id === projectId)
      .map((pm) => ({
        ...pm,
        user: store.profiles.find((p) => p.id === pm.user_id) || undefined,
      }));
    const owner = store.profiles.find((p) => p.id === project.owner_id) || undefined;

    return {
      ...project,
      owner,
      progress,
      total_tasks: total,
      completed_tasks: completed,
      remaining_tasks: remaining,
      member_count: members.length,
      members,
      tasks: projectTasks,
    };
  },

  createProject(userId: string, name: string, description?: string | null): ProjectSummary {
    const store = readStore();
    const now = new Date().toISOString();
    const projectId = generateId('prj');

    const project: Project = {
      id: projectId,
      name,
      description: description || null,
      owner_id: userId,
      created_at: now,
      updated_at: now,
    };

    const ownerMember: ProjectMember = {
      id: generateId('pm'),
      project_id: projectId,
      user_id: userId,
      role: 'OWNER',
      joined_at: now,
    };

    store.projects.push(project);
    store.project_members.push(ownerMember);
    writeStore(store);

    const ownerProfile = store.profiles.find((p) => p.id === userId) || undefined;

    return {
      ...project,
      owner: ownerProfile,
      progress: 0,
      total_tasks: 0,
      completed_tasks: 0,
      remaining_tasks: 0,
      member_count: 1,
      members: [{ ...ownerMember, user: ownerProfile }],
      tasks: [],
    };
  },

  updateProject(projectId: string, userId: string, name?: string, description?: string | null): Project | null {
    const store = readStore();
    const projectIndex = store.projects.findIndex((p) => p.id === projectId);
    if (projectIndex === -1) return null;

    const project = store.projects[projectIndex];
    if (project.owner_id !== userId) {
      throw new Error('FORBIDDEN: Only project owner can edit project');
    }

    if (name !== undefined) project.name = name;
    if (description !== undefined) project.description = description;
    project.updated_at = new Date().toISOString();

    writeStore(store);
    return project;
  },

  deleteProject(projectId: string, userId: string): boolean {
    const store = readStore();
    const project = store.projects.find((p) => p.id === projectId);
    if (!project) return false;

    if (project.owner_id !== userId) {
      throw new Error('FORBIDDEN: Only project owner can delete project');
    }

    // Cascade delete project, members, tasks
    store.projects = store.projects.filter((p) => p.id !== projectId);
    store.project_members = store.project_members.filter((pm) => pm.project_id !== projectId);
    store.tasks = store.tasks.filter((t) => t.project_id !== projectId);

    writeStore(store);
    return true;
  },

  // Tasks
  listTasks(
    projectId: string,
    userId: string,
    filters?: { status?: TaskStatus; priority?: TaskPriority; assigneeId?: string }
  ): Task[] {
    const store = readStore();
    const isMember =
      store.projects.some((p) => p.id === projectId && p.owner_id === userId) ||
      store.project_members.some((pm) => pm.project_id === projectId && pm.user_id === userId);

    if (!isMember) {
      throw new Error('FORBIDDEN: Access denied to project tasks');
    }

    let tasks = store.tasks.filter((t) => t.project_id === projectId);

    if (filters?.status) {
      tasks = tasks.filter((t) => t.status === filters.status);
    }
    if (filters?.priority) {
      tasks = tasks.filter((t) => t.priority === filters.priority);
    }
    if (filters?.assigneeId) {
      tasks = tasks.filter((t) => t.assignee_id === filters.assigneeId);
    }

    return tasks.map((t) => ({
      ...t,
      assignee: t.assignee_id ? store.profiles.find((p) => p.id === t.assignee_id) || null : null,
    }));
  },

  getTask(taskId: string, userId: string): Task | null {
    const store = readStore();
    const task = store.tasks.find((t) => t.id === taskId);
    if (!task) return null;

    const isMember =
      store.projects.some((p) => p.id === task.project_id && p.owner_id === userId) ||
      store.project_members.some((pm) => pm.project_id === task.project_id && pm.user_id === userId);

    if (!isMember) {
      throw new Error('FORBIDDEN: Access denied to task');
    }

    return {
      ...task,
      assignee: task.assignee_id ? store.profiles.find((p) => p.id === task.assignee_id) || null : null,
    };
  },

  createTask(
    projectId: string,
    userId: string,
    taskData: {
      title: string;
      description?: string | null;
      status?: TaskStatus;
      priority?: TaskPriority;
      assigneeId?: string | null;
      dueDate?: string | null;
    }
  ): Task {
    const store = readStore();
    const isMember =
      store.projects.some((p) => p.id === projectId && p.owner_id === userId) ||
      store.project_members.some((pm) => pm.project_id === projectId && pm.user_id === userId);

    if (!isMember) {
      throw new Error('FORBIDDEN: Access denied to create task in this project');
    }

    // Verify assignee belongs to project if specified
    if (taskData.assigneeId) {
      const isAssigneeMember = store.project_members.some(
        (pm) => pm.project_id === projectId && pm.user_id === taskData.assigneeId
      );
      if (!isAssigneeMember) {
        throw new Error('INVALID_ASSIGNEE: Assignee must be a member of the project');
      }
    }

    const now = new Date().toISOString();
    const newTask: Task = {
      id: generateId('tsk'),
      project_id: projectId,
      title: taskData.title,
      description: taskData.description || null,
      status: taskData.status || 'TODO',
      priority: taskData.priority || 'MEDIUM',
      assignee_id: taskData.assigneeId || null,
      due_date: taskData.dueDate || null,
      created_at: now,
      updated_at: now,
    };

    store.tasks.push(newTask);
    writeStore(store);

    return {
      ...newTask,
      assignee: newTask.assignee_id ? store.profiles.find((p) => p.id === newTask.assignee_id) || null : null,
    };
  },

  updateTask(
    taskId: string,
    userId: string,
    updates: {
      title?: string;
      description?: string | null;
      status?: TaskStatus;
      priority?: TaskPriority;
      assigneeId?: string | null;
      dueDate?: string | null;
    }
  ): Task {
    const store = readStore();
    const taskIndex = store.tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) {
      throw new Error('NOT_FOUND: Task not found');
    }

    const task = store.tasks[taskIndex];
    const isMember =
      store.projects.some((p) => p.id === task.project_id && p.owner_id === userId) ||
      store.project_members.some((pm) => pm.project_id === task.project_id && pm.user_id === userId);

    if (!isMember) {
      throw new Error('FORBIDDEN: Access denied');
    }

    // Verify assignee belongs to project if changed
    if (updates.assigneeId !== undefined && updates.assigneeId !== null && updates.assigneeId !== '') {
      const isAssigneeMember = store.project_members.some(
        (pm) => pm.project_id === task.project_id && pm.user_id === updates.assigneeId
      );
      if (!isAssigneeMember) {
        throw new Error('INVALID_ASSIGNEE: Assignee must be a member of the project');
      }
      task.assignee_id = updates.assigneeId;
    } else if (updates.assigneeId === null || updates.assigneeId === '') {
      task.assignee_id = null;
    }

    if (updates.title !== undefined) task.title = updates.title;
    if (updates.description !== undefined) task.description = updates.description;
    if (updates.status !== undefined) task.status = updates.status;
    if (updates.priority !== undefined) task.priority = updates.priority;
    if (updates.dueDate !== undefined) task.due_date = updates.dueDate || null;
    task.updated_at = new Date().toISOString();

    writeStore(store);

    return {
      ...task,
      assignee: task.assignee_id ? store.profiles.find((p) => p.id === task.assignee_id) || null : null,
    };
  },

  updateTaskStatus(taskId: string, userId: string, status: TaskStatus): Task {
    return this.updateTask(taskId, userId, { status });
  },

  updateTaskAssignee(taskId: string, userId: string, assigneeId: string | null): Task {
    return this.updateTask(taskId, userId, { assigneeId });
  },

  deleteTask(taskId: string, userId: string): boolean {
    const store = readStore();
    const task = store.tasks.find((t) => t.id === taskId);
    if (!task) return false;

    const isMember =
      store.projects.some((p) => p.id === task.project_id && p.owner_id === userId) ||
      store.project_members.some((pm) => pm.project_id === task.project_id && pm.user_id === userId);

    if (!isMember) {
      throw new Error('FORBIDDEN: Access denied');
    }

    store.tasks = store.tasks.filter((t) => t.id !== taskId);
    writeStore(store);
    return true;
  },

  // Members
  listMembers(projectId: string, userId: string): ProjectMember[] {
    const store = readStore();
    const isMember =
      store.projects.some((p) => p.id === projectId && p.owner_id === userId) ||
      store.project_members.some((pm) => pm.project_id === projectId && pm.user_id === userId);

    if (!isMember) {
      throw new Error('FORBIDDEN: Access denied');
    }

    return store.project_members
      .filter((pm) => pm.project_id === projectId)
      .map((pm) => ({
        ...pm,
        user: store.profiles.find((p) => p.id === pm.user_id) || undefined,
      }));
  },

  addMember(projectId: string, userId: string, email: string, name?: string | null): ProjectMember {
    const store = readStore();
    const project = store.projects.find((p) => p.id === projectId);
    if (!project) throw new Error('NOT_FOUND: Project not found');

    if (project.owner_id !== userId) {
      throw new Error('FORBIDDEN: Only project owner can add members');
    }

    let targetUser = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!targetUser) {
      if (name && name.trim()) {
        const profile = this.createUser(name.trim(), email.toLowerCase(), 'password123');
        targetUser = store.users.find((u) => u.id === profile.id);
      } else {
        throw new Error('USER_NOT_FOUND: No account found with this email. Enter their name below to auto-provision them now.');
      }
    }

    if (!targetUser) {
      throw new Error('USER_NOT_FOUND: Failed to provision user');
    }

    const alreadyMember = store.project_members.some(
      (pm) => pm.project_id === projectId && pm.user_id === targetUser.id
    );
    if (alreadyMember) {
      throw new Error('CONFLICT: User is already a member of this project');
    }

    const newMember: ProjectMember = {
      id: generateId('pm'),
      project_id: projectId,
      user_id: targetUser.id,
      role: 'MEMBER',
      joined_at: new Date().toISOString(),
    };

    store.project_members.push(newMember);
    writeStore(store);

    return {
      ...newMember,
      user: store.profiles.find((p) => p.id === targetUser.id) || undefined,
    };
  },

  removeMember(projectId: string, userId: string, targetUserId: string): boolean {
    const store = readStore();
    const project = store.projects.find((p) => p.id === projectId);
    if (!project) throw new Error('NOT_FOUND: Project not found');

    if (project.owner_id !== userId) {
      throw new Error('FORBIDDEN: Only project owner can remove members');
    }

    if (project.owner_id === targetUserId) {
      throw new Error('INVALID_OPERATION: Cannot remove the project owner');
    }

    // Safe unassignment policy: unassign tasks assigned to this removed member
    store.tasks.forEach((task) => {
      if (task.project_id === projectId && task.assignee_id === targetUserId) {
        task.assignee_id = null;
      }
    });

    store.project_members = store.project_members.filter(
      (pm) => !(pm.project_id === projectId && pm.user_id === targetUserId)
    );

    writeStore(store);
    return true;
  },
};
