import { NextRequest } from 'next/server';
import { localDb } from './store';
import { Profile } from '@/types/database';

export async function getCurrentUser(req: NextRequest): Promise<Profile | null> {
  // 1. Check nova_session cookie
  const sessionCookie = req.cookies.get('nova_session')?.value;
  if (sessionCookie) {
    const user = localDb.findUserById(sessionCookie);
    if (user) {
      return localDb.getProfile(user.id);
    }
  }

  // 2. Check Authorization header or x-user-id header
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const user = localDb.findUserById(token);
    if (user) return localDb.getProfile(user.id);
  }

  const customUserId = req.headers.get('x-user-id');
  if (customUserId) {
    const profile = localDb.getProfile(customUserId);
    if (profile) return profile;
  }

  return null;
}

export const db = localDb;
