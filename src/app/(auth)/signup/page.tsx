'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema, SignUpInput } from '@/lib/validations';
import { useAuth } from '@/lib/auth/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FolderKanban, ArrowRight } from 'lucide-react';

export default function SignUpPage() {
  const { signUp } = useAuth();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignUpInput) => {
    setErrorMsg(null);
    const result = await signUp(data.name, data.email, data.password, data.confirmPassword);
    if (!result.success) {
      setErrorMsg(result.error || 'Failed to create account');
    }
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
          <h1 className="text-xl font-bold text-[#171923] tracking-tight">Create your account</h1>
          <p className="text-xs text-[#60657A]">
            Start collaborating with your product team on NOVA today.
          </p>
        </div>

        {/* SignUp Card */}
        <Card className="p-6 bg-white border-[#E6E8F0] shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {errorMsg && (
              <div className="p-3 text-xs bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] rounded-lg">
                {errorMsg}
              </div>
            )}

            <Input
              label="Full Name"
              placeholder="e.g. Jordan Miller"
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="Work Email"
              type="email"
              placeholder="jordan@company.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password (min. 6 characters)"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              isLoading={isSubmitting}
            >
              Create Account
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </form>
        </Card>

        {/* Footer link to sign in */}
        <p className="text-center text-xs text-[#60657A]">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-[#5B5CE2] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
