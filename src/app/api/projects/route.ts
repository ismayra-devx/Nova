import { NextRequest } from 'next/server';
import { db, getCurrentUser } from '@/lib/db';
import { createProjectSchema } from '@/lib/validations';
import { apiError, apiSuccess } from '@/types/api';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return apiError('UNAUTHENTICATED', 'Authentication required', 401);
    }

    const projects = db.listProjects(user.id);
    return apiSuccess(projects);
  } catch (error: any) {
    return apiError('SERVER_ERROR', error.message || 'Failed to fetch projects', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return apiError('UNAUTHENTICATED', 'Authentication required', 401);
    }

    const body = await req.json();
    const parseResult = createProjectSchema.safeParse(body);

    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || 'Invalid project data';
      return apiError('VALIDATION_ERROR', firstError, 400);
    }

    const { name, description } = parseResult.data;
    const project = db.createProject(user.id, name, description);

    return apiSuccess(project, 201);
  } catch (error: any) {
    return apiError('SERVER_ERROR', error.message || 'Failed to create project', 500);
  }
}
