import { z } from 'zod';

export const signUpSchema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters'),
    email: z.string().trim().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const signInSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, 'Project name is required').max(100, 'Project name cannot exceed 100 characters'),
  description: z.string().max(500, 'Description cannot exceed 500 characters').optional().nullable(),
});

export const updateProjectSchema = z.object({
  name: z.string().trim().min(1, 'Project name is required').max(100, 'Project name cannot exceed 100 characters').optional(),
  description: z.string().max(500, 'Description cannot exceed 500 characters').optional().nullable(),
});

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, 'Task title is required').max(120, 'Task title cannot exceed 120 characters'),
  description: z.string().max(1000, 'Description cannot exceed 1000 characters').optional().nullable(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  assigneeId: z.string().optional().nullable().or(z.literal('')),
  dueDate: z.string().optional().nullable().or(z.literal('')),
});

export const updateTaskSchema = z.object({
  title: z.string().trim().min(1, 'Task title is required').max(120, 'Task title cannot exceed 120 characters').optional(),
  description: z.string().max(1000, 'Description cannot exceed 1000 characters').optional().nullable(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  assigneeId: z.string().optional().nullable().or(z.literal('')),
  dueDate: z.string().optional().nullable().or(z.literal('')),
});

export const updateTaskStatusSchema = z.object({
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']),
});

export const updateTaskAssigneeSchema = z.object({
  assigneeId: z.string().uuid().optional().nullable().or(z.literal('')),
});

export const addMemberSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(50).optional().nullable().or(z.literal('')),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>;
export type UpdateTaskAssigneeInput = z.infer<typeof updateTaskAssigneeSchema>;
export type AddMemberInput = z.infer<typeof addMemberSchema>;
