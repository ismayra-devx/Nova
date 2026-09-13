import { NextRequest } from 'next/server';
import { db, getCurrentUser } from '@/lib/db';
import { addMemberSchema } from '@/lib/validations';
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

    const { id: projectId } = await context.params;
    const members = db.listMembers(projectId, user.id);

    return apiSuccess(members);
  } catch (error: any) {
    if (error.message?.includes('FORBIDDEN')) {
      return apiError('FORBIDDEN', 'Access denied to project members', 403);
    }
    return apiError('SERVER_ERROR', error.message || 'Failed to list members', 500);
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
    const parseResult = addMemberSchema.safeParse(body);

    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || 'Invalid email address';
      return apiError('VALIDATION_ERROR', firstError, 400);
    }

    const member = db.addMember(projectId, user.id, parseResult.data.email, parseResult.data.name);
    return apiSuccess(member, 201);
  } catch (error: any) {
    if (error.message?.includes('USER_NOT_FOUND')) {
      return apiError('USER_NOT_FOUND', 'No user found with that email address. Ask them to register first.', 404);
    }
    if (error.message?.includes('CONFLICT')) {
      return apiError('CONFLICT', 'User is already a collaborator on this project', 409);
    }
    if (error.message?.includes('FORBIDDEN')) {
      return apiError('FORBIDDEN', 'Only project owners can invite members', 403);
    }
    return apiError('SERVER_ERROR', error.message || 'Failed to add member', 500);
  }
}
