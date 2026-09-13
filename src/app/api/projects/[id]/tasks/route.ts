import { NextRequest } from 'next/server';
import { db, getCurrentUser } from '@/lib/db';
import { createTaskSchema } from '@/lib/validations';
import { apiError, apiSuccess } from '@/types/api';
import { TaskPriority, TaskStatus } from '@/types/database';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return apiError('UNAUTHENTICATED', 'Authentication required', 401);
    }

    const { id: projectId } = await context.params;
    const { searchParams } = new URL(req.url);

    const status = searchParams.get('status') as TaskStatus | undefined;
    const priority = searchParams.get('priority') as TaskPriority | undefined;
    const assigneeId = searchParams.get('assigneeId') || undefined;

    const tasks = db.listTasks(projectId, user.id, {
      status: status || undefined,
      priority: priority || undefined,
      assigneeId: assigneeId || undefined,
    });

    return apiSuccess(tasks);
  } catch (error: any) {
    if (error.message?.includes('FORBIDDEN')) {
      return apiError('FORBIDDEN', 'Access denied to project tasks', 403);
    }
    return apiError('SERVER_ERROR', error.message || 'Failed to list tasks', 500);
  }
}

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return apiError('UNAUTHENTICATED', 'Authentication required', 401);
    }

    const { id: projectId } = await context.params;
    const body = await req.json();
    const payload = {
      ...body,
      status: body.status || 'TODO',
      priority: body.priority || 'MEDIUM',
    };
    const parseResult = createTaskSchema.safeParse(payload);

    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || 'Invalid task data';
      return apiError('VALIDATION_ERROR', firstError, 400);
    }

    const task = db.createTask(projectId, user.id, parseResult.data);
    return apiSuccess(task, 201);
  } catch (error: any) {
    if (error.message?.includes('FORBIDDEN')) {
      return apiError('FORBIDDEN', 'Access denied to this project', 403);
    }
    if (error.message?.includes('INVALID_ASSIGNEE')) {
      return apiError('INVALID_ASSIGNEE', error.message, 400);
    }
    return apiError('SERVER_ERROR', error.message || 'Failed to create task', 500);
  }
}
