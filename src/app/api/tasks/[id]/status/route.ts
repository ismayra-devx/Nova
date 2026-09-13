import { NextRequest } from 'next/server';
import { db, getCurrentUser } from '@/lib/db';
import { updateTaskStatusSchema } from '@/lib/validations';
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
    const parseResult = updateTaskStatusSchema.safeParse(body);

    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || 'Invalid status';
      return apiError('VALIDATION_ERROR', firstError, 400);
    }

    const updated = db.updateTaskStatus(id, user.id, parseResult.data.status);
    return apiSuccess(updated);
  } catch (error: any) {
    if (error.message?.includes('NOT_FOUND')) {
      return apiError('NOT_FOUND', 'Task not found', 404);
    }
    if (error.message?.includes('FORBIDDEN')) {
      return apiError('FORBIDDEN', 'Access denied', 403);
    }
    return apiError('SERVER_ERROR', error.message || 'Failed to update task status', 500);
  }
}
