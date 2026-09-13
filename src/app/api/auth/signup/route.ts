import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { signUpSchema } from '@/lib/validations';
import { apiError, apiSuccess } from '@/types/api';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = signUpSchema.safeParse(body);

    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || 'Invalid input';
      return apiError('VALIDATION_ERROR', firstError, 400);
    }

    const { name, email, password } = parseResult.data;

    // Check if user already exists
    const existing = db.findUserByEmail(email);
    if (existing) {
      return apiError('USER_EXISTS', 'An account with this email already exists', 409);
    }

    const profile = db.createUser(name, email, password);

    // Set auth cookie
    const response = apiSuccess(profile, 201);
    response.cookies.set('nova_session', profile.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    return apiError('SERVER_ERROR', error.message || 'Failed to create account', 500);
  }
}
