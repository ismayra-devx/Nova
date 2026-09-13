import { NextRequest } from 'next/server';
import { db, getCurrentUser } from '@/lib/db';
import { updateTaskAssigneeSchema } from '@/lib/validations';
import { apiError, apiSuccess } from '@/types/api';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return apiError('UNAUTHENTICATED', 'Authentication required', 401);
    }

    const { id } = await context.params;
    const body = await req.json();
    const parseResult = updateTaskAssigneeSchema.safeParse(body);

    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || 'Invalid assignee ID';
      return apiError('VALIDATION_ERROR', firstError, 400);
    }

    const assigneeId = parseResult.data.assigneeId || null;
    const updated = db.updateTaskAssignee(id, user.id, assigneeId);
    return apiSuccess(updated);
  } catch (error: any) {
    if (error.message?.includes('NOT_FOUND')) {
      return apiError('NOT_FOUND', 'Task not found', 404);
    }
    if (error.message?.includes('FORBIDDEN')) {
      return apiError('FORBIDDEN', 'Access denied', 403);
    }
    if (error.message?.includes('INVALID_ASSIGNEE')) {
      return apiError('INVALID_ASSIGNEE', error.message, 400);
    }
    return apiError('SERVER_ERROR', error.message || 'Failed to assign task', 500);
  }
}
