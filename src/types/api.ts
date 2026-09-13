import { NextResponse } from 'next/server';

export interface ApiError {
  code: string;
  message: string;
}

export interface ApiSuccessResponse<T> {
  data: T;
  error: null;
}

export interface ApiErrorResponse {
  data: null;
  error: ApiError;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export function apiSuccess<T>(data: T, status: number = 200): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    { data, error: null },
    { status }
  );
}

export function apiError(code: string, message: string, status: number = 400): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    { data: null, error: { code, message } },
    { status }
  );
}
