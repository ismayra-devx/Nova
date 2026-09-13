'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import {
  FolderKanban,
  Layers,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  UserPlus,
  BarChart3,
  HelpCircle,
} from 'lucide-react';

interface OnboardingWalkthroughProps {
  forceOpen?: boolean;
  onCloseTour?: () => void;
}

export function OnboardingWalkthrough({
  forceOpen = false,
  onCloseTour,
}: OnboardingWalkthroughProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      setCurrentStep(0);
      return;
    }

    // Check if user has seen walkthrough in localStorage
    const hasSeen = localStorage.getItem('nova_walkthrough_seen');
    if (!hasSeen) {
      setIsOpen(true);
    }
  }, [forceOpen]);

  const handleClose = () => {
    localStorage.setItem('nova_walkthrough_seen', 'true');
    setIsOpen(false);
    if (onCloseTour) {
      onCloseTour();
    }
  };

  const steps = [
    {
      title: 'Welcome to NOVA!',
      subtitle: 'Your modern team productivity and project delivery platform.',
      icon: Sparkles,
      iconColor: 'text-[#5B5CE2] bg-[#EEF0FD]',
      badge: 'Step 1 of 4 • Overview',
      content: (
        <div className="space-y-3 text-xs text-[#60657A] leading-relaxed">
          <p>
            NOVA provides everything your product team needs: centralized project management,
            Kanban task workflows, automated progress calculation, and team collaboration.
          </p>
          <div className="p-3 rounded-lg bg-[#F8F9FC] border border-[#E6E8F0] space-y-2">
            <div className="flex items-center gap-2 font-medium text-[#171923]">
              <BarChart3 className="w-4 h-4 text-[#5B5CE2]" />
              Executive Metrics at a Glance
            </div>
            <p className="text-[11px] text-[#60657A]">
              Your dashboard aggregates all deliverables into real-time health metrics: Active Projects,
              Tasks in Progress, and Overall Completion Rate.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Creating Projects & Workspaces',
      subtitle: 'Organize your initiatives into focused team workspaces.',
      icon: FolderKanban,
      iconColor: 'text-[#5B5CE2] bg-[#EEF0FD]',
      badge: 'Step 2 of 4 • Projects',
      content: (
        <div className="space-y-3 text-xs text-[#60657A] leading-relaxed">
          <p>
            Click the <strong className="text-[#171923]">+ New Project</strong> button at the top of your dashboard to create a workspace.
          </p>
          <div className="space-y-2">
            <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white border border-[#E6E8F0]">
              <span className="w-5 h-5 rounded-full bg-[#EEF0FD] text-[#5B5CE2] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                1
              </span>
              <div>
                <p className="font-semibold text-[#171923]">Name and Description</p>
                <p className="text-[11px] text-[#60657A]">Define clear objectives and scopes for your team.</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white border border-[#E6E8F0]">
              <span className="w-5 h-5 rounded-full bg-[#EEF0FD] text-[#5B5CE2] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                2
              </span>
              <div>
                <p className="font-semibold text-[#171923]">Full Ownership & Control</p>
                <p className="text-[11px] text-[#60657A]">The creator is granted Owner rights with permissions to edit settings, invite teammates, and manage tasks.</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Kanban Task Board & Progress',
      subtitle: 'Move tasks across stages with automatic progress updates.',
      icon: Layers,
      iconColor: 'text-[#5B5CE2] bg-[#EEF0FD]',
      badge: 'Step 3 of 4 • Tasks',
      content: (
        <div className="space-y-3 text-xs text-[#60657A] leading-relaxed">
          <p>
            Inside every project workspace, the <strong className="text-[#171923]">Task Board</strong> tab organizes deliverables across three stages:
          </p>
          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="p-2 rounded-lg bg-[#F4F5F9] border border-[#E6E8F0]">
              <span className="text-[10px] font-bold text-[#60657A] uppercase">To Do</span>
              <p className="text-[10px] text-[#8C92A4] mt-0.5">Backlog</p>
            </div>
            <div className="p-2 rounded-lg bg-[#EEF0FD] border border-[#D9DCF9]">
              <span className="text-[10px] font-bold text-[#5B5CE2] uppercase">In Progress</span>
              <p className="text-[10px] text-[#5B5CE2]/80 mt-0.5">Active</p>
            </div>
            <div className="p-2 rounded-lg bg-[#EDFDF5] border border-[#BBF7D0]">
              <span className="text-[10px] font-bold text-[#16A34A] uppercase">Completed</span>
              <p className="text-[10px] text-[#16A34A]/80 mt-0.5">Finished</p>
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-[#EDFDF5] border border-[#BBF7D0] text-[#16A34A] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="text-[11px] font-medium text-[#15803D]">
              Moving tasks to Completed automatically recalculates the project progress percentage!
            </span>
          </div>
        </div>
      ),
    },
    {
      title: 'Inviting People & Collaborating',
      subtitle: 'How to add teammates and assign them to tasks.',
      icon: Users,
      iconColor: 'text-[#5B5CE2] bg-[#EEF0FD]',
      badge: 'Step 4 of 4 • Team',
      content: (
        <div className="space-y-3 text-xs text-[#60657A] leading-relaxed">
          <p className="font-medium text-[#171923]">
            Follow these two simple steps to add collaborators:
          </p>
          <div className="space-y-2">
            <div className="p-2.5 rounded-lg bg-white border border-[#E6E8F0] space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-[#171923]">
                <UserPlus className="w-3.5 h-3.5 text-[#5B5CE2]" />
                1. Invite by Registered Email
              </div>
              <p className="text-[11px] text-[#60657A]">
                Open your project &rarr; click the <strong className="text-[#171923]">Members</strong> tab &rarr; click <strong className="text-[#171923]">Invite Member</strong> &rarr; enter your teammate&apos;s account email.
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-[#F8F9FC] border border-[#E6E8F0] space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B5CE2]">
                Try It Instantly With Demo Teammates:
              </span>
              <p className="text-[11px] text-[#475569]">
                You can invite pre-registered colleagues right now:
                <br />
                <span className="font-semibold text-[#171923]">sarah@nova.team</span> (Sarah Chen) or{' '}
                <span className="font-semibold text-[#171923]">marcus@nova.team</span> (Marcus Vance).
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const current = steps[currentStep];
  const StepIcon = current.icon;

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={current.title}
      description={current.subtitle}
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Step Header Badge & Icon */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-[#5B5CE2] bg-[#EEF0FD] px-2.5 py-0.5 rounded-md border border-[#D9DCF9]">
            {current.badge}
          </span>
          <div className={`p-2 rounded-lg ${current.iconColor}`}>
            <StepIcon className="w-4 h-4" />
          </div>
        </div>

        {/* Step Body */}
        <div>{current.content}</div>

        {/* Step Progress Indicators */}
        <div className="flex items-center justify-center gap-1.5 pt-2">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentStep(i)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                i === currentStep
                  ? 'w-6 bg-[#5B5CE2]'
                  : 'w-1.5 bg-[#CBD2E0] hover:bg-[#A0AEC0]'
              }`}
              aria-label={`Go to step ${i + 1}`}
            />
          ))}
        </div>

        {/* Footer Navigation Controls */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E6E8F0]">
          {currentStep > 0 ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentStep((prev) => prev - 1)}
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              Back
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={handleClose}>
              Skip Tour
            </Button>
          )}

          {currentStep < steps.length - 1 ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setCurrentStep((prev) => prev + 1)}
            >
              Next
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          ) : (
            <Button variant="primary" size="sm" onClick={handleClose}>
              Get Started
              <CheckCircle2 className="w-3.5 h-3.5 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
