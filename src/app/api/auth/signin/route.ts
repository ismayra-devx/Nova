import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { signInSchema } from '@/lib/validations';
import { apiError, apiSuccess } from '@/types/api';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = signInSchema.safeParse(body);

    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || 'Invalid email or password';
      return apiError('VALIDATION_ERROR', firstError, 400);
    }

    const { email, password } = parseResult.data;
    const user = db.findUserByEmail(email);

    if (!user || user.passwordHash !== password) {
      return apiError('INVALID_CREDENTIALS', 'Invalid email or password', 401);
    }

    const profile = db.getProfile(user.id);
    const response = apiSuccess(profile, 200);

    response.cookies.set('nova_session', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    return apiError('SERVER_ERROR', error.message || 'Failed to sign in', 500);
  }
}
