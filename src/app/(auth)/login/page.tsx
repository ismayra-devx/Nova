'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema, SignInInput } from '@/lib/validations';
import { useAuth } from '@/lib/auth/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FolderKanban, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { signIn } = useAuth();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: SignInInput) => {
    setErrorMsg(null);
    const result = await signIn(data.email, data.password);
    if (!result.success) {
      setErrorMsg(result.error || 'Failed to sign in');
    }
  };

  const fillDemo = (email: string) => {
    setValue('email', email);
    setValue('password', 'password123');
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-[#F8F9FC] text-[#171923]">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-[#5B5CE2] flex items-center justify-center text-white shadow-xs">
              <FolderKanban className="w-4 h-4" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#171923]">NOVA</span>
          </Link>
          <h1 className="text-xl font-bold text-[#171923] tracking-tight">Sign in to your workspace</h1>
          <p className="text-xs text-[#60657A]">
            Access your projects, team members, and tasks.
          </p>
        </div>

        {/* Login Card */}
        <Card className="p-6 bg-white border-[#E6E8F0] shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {errorMsg && (
              <div className="p-3 text-xs bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] rounded-lg">
                {errorMsg}
              </div>
            )}

            <Input
              label="Work Email"
              type="email"
              placeholder="you@company.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              isLoading={isSubmitting}
            >
              Sign In
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </form>

          {/* 1-Click Demo Accounts for Assignment Reviewers */}
          <div className="mt-5 pt-4 border-t border-[#F1F3F9]">
            <p className="text-[11px] font-semibold text-[#8C92A4] uppercase tracking-wider text-center mb-2.5">
              1-Click Demo Accounts
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemo('alex@nova.team')}
                className="px-2.5 py-2 text-xs bg-[#F8F9FC] border border-[#E6E8F0] hover:border-[#5B5CE2] rounded-lg text-left transition-colors cursor-pointer"
              >
                <span className="font-semibold block text-[#5B5CE2]">Alex (Owner)</span>
                <span className="text-[10px] text-[#8C92A4] truncate block">alex@nova.team</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemo('sarah@nova.team')}
                className="px-2.5 py-2 text-xs bg-[#F8F9FC] border border-[#E6E8F0] hover:border-[#5B5CE2] rounded-lg text-left transition-colors cursor-pointer"
              >
                <span className="font-semibold block text-[#5B5CE2]">Sarah (Member)</span>
                <span className="text-[10px] text-[#8C92A4] truncate block">sarah@nova.team</span>
              </button>
            </div>
          </div>
        </Card>

        {/* Footer link to sign up */}
        <p className="text-center text-xs text-[#60657A]">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-semibold text-[#5B5CE2] hover:underline">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
}
