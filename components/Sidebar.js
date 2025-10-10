'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Sidebar({ role }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const recruiterLinks = [
    { href: '/recruiter/dashboard', icon: '📊', label: 'Dashboard' },
    { href: '/recruiter/jobs', icon: '💼', label: 'Jobs' },
    { href: '/recruiter/jobs/new', icon: '➕', label: 'Post Job' },
    { href: '/recruiter/candidates', icon: '🔍', label: 'Search Candidates' },
    { href: '/recruiter/shortlist', icon: '⭐', label: 'Shortlisted' },
    { href: '/recruiter/analytics', icon: '📈', label: 'Analytics' },
  ];

  const studentLinks = [
    { href: '/student/dashboard', icon: '🏠', label: 'Dashboard' },
    { href: '/student/profile', icon: '👤', label: 'Profile' },
    { href: '/student/jobs', icon: '💼', label: 'Browse Jobs' },
    { href: '/student/applications', icon: '📝', label: 'My Applications' },
    { href: '/student/analytics', icon: '📊', label: 'My Analytics' },
    { href: '/student/cultural-test', icon: '🎯', label: 'Cultural Fit Test' },
  ];

  const links = role === 'recruiter' ? recruiterLinks : studentLinks;

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-40 shadow-sm ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo & Toggle */}
      <div className="p-5 border-b border-gray-200 flex items-center justify-between">
        {!collapsed && (
          <div>
            <h2 className="text-2xl font-bold text-gradient">
              RecruitPro
            </h2>
            <p className="text-xs text-gray-500 mt-1">Campus Recruitment</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-all text-gray-600"
        >
          {collapsed ? '☰' : '✕'}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-100px)]">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                isActive
                  ? 'bg-blue-50 text-blue-700 shadow-sm'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
              }`}
              title={collapsed ? link.label : ''}
            >
              <span className="text-xl">{link.icon}</span>
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
