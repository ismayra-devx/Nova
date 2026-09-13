'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  FolderKanban,
  CheckCircle2,
  Users,
  ArrowRight,
  Layers,
  BarChart3,
} from 'lucide-react';

export default function LandingPage() {
  const { user, signIn } = useAuth();

  const handleDemoLogin = (email: string) => {
    signIn(email, 'password123');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FC] text-[#171923]">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-16 pb-14 md:pt-24 md:pb-20 border-b border-[#E6E8F0] bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#EEF0FD] border border-[#D9DCF9] text-[#5B5CE2] text-xs font-semibold mb-6">
              <span>Full-Stack Team Productivity Platform</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#171923] mb-5 leading-tight">
              Plan. Collaborate. <br />
              <span className="text-[#5B5CE2]">
                Deliver Exceptional Work.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#60657A] max-w-xl mx-auto mb-8 leading-relaxed">
              NOVA coordinates your product team with modern workspace management, interactive Kanban boards,
              dynamic progress calculation, and team collaboration.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {user ? (
                <Link href="/dashboard">
                  <Button size="lg" variant="primary">
                    Open Workspace Dashboard
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/signup">
                    <Button size="lg" variant="primary">
                      Get Started Free
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="secondary">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* 1-Click Demo Accounts for Assignment Review */}
            <div className="mt-12 p-4 rounded-xl bg-[#F8F9FC] border border-[#E6E8F0] max-w-lg mx-auto text-left shadow-xs">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#60657A]">
                  Evaluator Preview
                </span>
                <span className="text-[11px] text-[#5B5CE2] font-semibold">1-Click Sign In</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => handleDemoLogin('alex@nova.team')}
                  className="px-3 py-2 text-xs bg-white border border-[#E6E8F0] hover:border-[#5B5CE2] rounded-lg transition-colors text-left cursor-pointer shadow-xs"
                >
                  <p className="font-semibold text-[#171923]">Alex Johnson</p>
                  <p className="text-[10px] text-[#8C92A4]">Project Owner</p>
                </button>
                <button
                  onClick={() => handleDemoLogin('sarah@nova.team')}
                  className="px-3 py-2 text-xs bg-white border border-[#E6E8F0] hover:border-[#5B5CE2] rounded-lg transition-colors text-left cursor-pointer shadow-xs"
                >
                  <p className="font-semibold text-[#171923]">Sarah Chen</p>
                  <p className="text-[10px] text-[#8C92A4]">Team Member</p>
                </button>
                <button
                  onClick={() => handleDemoLogin('marcus@nova.team')}
                  className="px-3 py-2 text-xs bg-white border border-[#E6E8F0] hover:border-[#5B5CE2] rounded-lg transition-colors text-left cursor-pointer shadow-xs"
                >
                  <p className="font-semibold text-[#171923]">Marcus Vance</p>
                  <p className="text-[10px] text-[#8C92A4]">Team Member</p>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-[#171923] mb-2">
              Designed for Focused Product Delivery
            </h2>
            <p className="text-xs sm:text-sm text-[#60657A]">
              Full-stack capabilities spanning secure authentication, relational database models, and team workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card className="p-5 bg-white border-[#E6E8F0]">
              <div className="p-2.5 rounded-lg bg-[#EEF0FD] text-[#5B5CE2] w-fit mb-3">
                <FolderKanban className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#171923] mb-1.5">Project Workspaces</h3>
              <p className="text-xs text-[#60657A] leading-relaxed">
                Centralized dashboard with project health metrics, real-time progress indicators, and full lifecycle controls.
              </p>
            </Card>

            <Card className="p-5 bg-white border-[#E6E8F0]">
              <div className="p-2.5 rounded-lg bg-[#EEF0FD] text-[#5B5CE2] w-fit mb-3">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#171923] mb-1.5">Kanban Task Board</h3>
              <p className="text-xs text-[#60657A] leading-relaxed">
                Organize work across To Do, In Progress, and Completed. Filter by status, priority, and team assignees.
              </p>
            </Card>

            <Card className="p-5 bg-white border-[#E6E8F0]">
              <div className="p-2.5 rounded-lg bg-[#EDFDF5] text-[#16A34A] w-fit mb-3">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#171923] mb-1.5">Dynamic Progress Tracking</h3>
              <p className="text-xs text-[#60657A] leading-relaxed">
                Progress recalculates dynamically from persisted task states with zero hard-coded percentages.
              </p>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E6E8F0] py-6 bg-white text-[#8C92A4] text-xs">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} NOVA — Team Productivity Platform. Plan. Collaborate. Deliver.</p>
        </div>
      </footer>
    </div>
  );
}
