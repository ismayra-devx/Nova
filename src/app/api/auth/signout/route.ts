import { NextRequest } from 'next/server';
import { apiSuccess } from '@/types/api';

export async function POST(req: NextRequest) {
  const response = apiSuccess({ message: 'Signed out successfully' });
  response.cookies.delete('nova_session');
  return response;
}
