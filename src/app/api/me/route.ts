import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/db';
import { apiError, apiSuccess } from '@/types/api';

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) {
    return apiError('UNAUTHENTICATED', 'You must be signed in to view your profile', 401);
  }
  return apiSuccess(user);
}
