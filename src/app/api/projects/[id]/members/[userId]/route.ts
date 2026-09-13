import { NextRequest } from 'next/server';
import { db, getCurrentUser } from '@/lib/db';
import { apiError, apiSuccess } from '@/types/api';

interface RouteContext {
  params: Promise<{ id: string; userId: string }>;
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return apiError('UNAUTHENTICATED', 'Authentication required', 401);
    }

    const { id: projectId, userId: targetUserId } = await context.params;

    const removed = db.removeMember(projectId, user.id, targetUserId);
    if (!removed) {
      return apiError('NOT_FOUND', 'Project or member not found', 404);
    }

    return apiSuccess({ message: 'Member removed and tasks safely unassigned' });
  } catch (error: any) {
    if (error.message?.includes('FORBIDDEN')) {
      return apiError('FORBIDDEN', 'Only project owners can remove members', 403);
    }
    if (error.message?.includes('INVALID_OPERATION')) {
      return apiError('INVALID_OPERATION', error.message, 400);
    }
    return apiError('SERVER_ERROR', error.message || 'Failed to remove member', 500);
  }
}
