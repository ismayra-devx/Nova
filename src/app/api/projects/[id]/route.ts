import { NextRequest } from 'next/server';
import { db, getCurrentUser } from '@/lib/db';
import { updateProjectSchema } from '@/lib/validations';
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
    const project = db.getProject(id, user.id);

    if (!project) {
      return apiError('NOT_FOUND', 'Project not found or you do not have access', 404);
    }

    return apiSuccess(project);
  } catch (error: any) {
    return apiError('SERVER_ERROR', error.message || 'Failed to fetch project', 500);
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
    const parseResult = updateProjectSchema.safeParse(body);

    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || 'Invalid input';
      return apiError('VALIDATION_ERROR', firstError, 400);
    }

    const updated = db.updateProject(id, user.id, parseResult.data.name, parseResult.data.description);
    if (!updated) {
      return apiError('NOT_FOUND', 'Project not found', 404);
    }

    return apiSuccess(updated);
  } catch (error: any) {
    if (error.message?.includes('FORBIDDEN')) {
      return apiError('FORBIDDEN', 'Only project owners can modify project details', 403);
    }
    return apiError('SERVER_ERROR', error.message || 'Failed to update project', 500);
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return apiError('UNAUTHENTICATED', 'Authentication required', 401);
    }

    const { id } = await context.params;
    const deleted = db.deleteProject(id, user.id);

    if (!deleted) {
      return apiError('NOT_FOUND', 'Project not found', 404);
    }

    return apiSuccess({ success: true, message: 'Project deleted successfully' });
  } catch (error: any) {
    if (error.message?.includes('FORBIDDEN')) {
      return apiError('FORBIDDEN', 'Only project owners can delete the project', 403);
    }
    return apiError('SERVER_ERROR', error.message || 'Failed to delete project', 500);
  }
}
