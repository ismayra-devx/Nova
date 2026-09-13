'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import {
  FolderKanban,
  LayoutDashboard,
  Plus,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';

interface NavbarProps {
  onCreateProject?: () => void;
}

export function Navbar({ onCreateProject }: NavbarProps) {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E6E8F0] bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-[#5B5CE2] flex items-center justify-center text-white shadow-xs">
              <FolderKanban className="w-4 h-4" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold tracking-tight text-[#171923]">
                NOVA
              </span>
              <span className="text-[11px] text-[#8C92A4] font-normal hidden sm:inline">
                Plan. Collaborate. Deliver.
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          {user && (
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-[#EEF0FD] text-[#5B5CE2] font-semibold'
                        : 'text-[#60657A] hover:text-[#171923] hover:bg-[#F8F9FC]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {onCreateProject && (
                <Button
                  onClick={onCreateProject}
                  size="sm"
                  variant="primary"
                  className="hidden sm:inline-flex"
                >
                  <Plus className="w-3.5 h-3.5" />
                  New Project
                </Button>
              )}

              {/* User profile dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-lg hover:bg-[#F8F9FC] border border-transparent hover:border-[#E6E8F0] transition-colors cursor-pointer"
                  aria-expanded={userDropdownOpen}
                >
                  <Avatar name={user.name} avatarUrl={user.avatar_url} size="sm" />
                  <span className="text-xs font-medium text-[#171923] hidden lg:inline max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3 h-3 text-[#60657A] hidden sm:block" />
                </button>

                {userDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-1.5 w-56 bg-white border border-[#E6E8F0] rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in-50 zoom-in-95">
                      <div className="px-3.5 py-2 border-b border-[#E6E8F0]">
                        <p className="text-[11px] text-[#8C92A4]">Signed in as</p>
                        <p className="text-xs font-semibold text-[#171923] truncate">{user.name}</p>
                        <p className="text-[11px] text-[#60657A] truncate">{user.email}</p>
                      </div>

                      <div className="p-1">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            signOut();
                          }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[#DC2626] hover:bg-[#FEF2F2] rounded-md transition-colors text-left cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="p-1.5 rounded-lg text-[#60657A] hover:text-[#171923] hover:bg-[#F8F9FC] md:hidden"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileMenuOpen && user && (
        <div className="md:hidden border-t border-[#E6E8F0] px-4 py-3 bg-white space-y-2">
          {onCreateProject && (
            <Button
              onClick={() => {
                setMobileMenuOpen(false);
                onCreateProject();
              }}
              size="sm"
              variant="primary"
              className="w-full mb-2"
            >
              <Plus className="w-4 h-4 mr-1" />
              New Project
            </Button>
          )}
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm text-[#171923] hover:bg-[#F8F9FC]"
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              signOut();
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#DC2626] hover:bg-[#FEF2F2] rounded-lg text-left"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      )}
    </header>
  );
}
