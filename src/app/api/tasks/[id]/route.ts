import { NextRequest } from 'next/server';
import { db, getCurrentUser } from '@/lib/db';
import { updateTaskSchema } from '@/lib/validations';
import { apiError, apiSuccess } from '@/types/api';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return apiError('UNAUTHENTICATED', 'Authentication required', 401);
    }

    const { id } = await context.params;
    const task = db.getTask(id, user.id);

    if (!task) {
      return apiError('NOT_FOUND', 'Task not found', 404);
    }

    return apiSuccess(task);
  } catch (error: any) {
    if (error.message?.includes('FORBIDDEN')) {
      return apiError('FORBIDDEN', 'Access denied to task', 403);
    }
    return apiError('SERVER_ERROR', error.message || 'Failed to fetch task', 500);
  }
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return apiError('UNAUTHENTICATED', 'Authentication required', 401);
    }

    const { id } = await context.params;
    const body = await req.json();
    const parseResult = updateTaskSchema.safeParse(body);

    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || 'Invalid task input';
      return apiError('VALIDATION_ERROR', firstError, 400);
    }

    const updated = db.updateTask(id, user.id, parseResult.data);
    return apiSuccess(updated);
  } catch (error: any) {
    if (error.message?.includes('NOT_FOUND')) {
      return apiError('NOT_FOUND', 'Task not found', 404);
    }
    if (error.message?.includes('FORBIDDEN')) {
      return apiError('FORBIDDEN', 'Access denied to modify task', 403);
    }
    if (error.message?.includes('INVALID_ASSIGNEE')) {
      return apiError('INVALID_ASSIGNEE', error.message, 400);
    }
    return apiError('SERVER_ERROR', error.message || 'Failed to update task', 500);
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return apiError('UNAUTHENTICATED', 'Authentication required', 401);
    }

    const { id } = await context.params;
    const deleted = db.deleteTask(id, user.id);

    if (!deleted) {
      return apiError('NOT_FOUND', 'Task not found', 404);
    }

    return apiSuccess({ success: true, message: 'Task deleted successfully' });
  } catch (error: any) {
    if (error.message?.includes('FORBIDDEN')) {
      return apiError('FORBIDDEN', 'Access denied to delete task', 403);
    }
    return apiError('SERVER_ERROR', error.message || 'Failed to delete task', 500);
  }
}
