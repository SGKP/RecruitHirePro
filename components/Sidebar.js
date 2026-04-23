'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Briefcase, 
  PlusCircle, 
  Search, 
  Star, 
  BarChart2, 
  User, 
  FileText, 
  Target,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ role }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const recruiterLinks = [
    { href: '/recruiter/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/recruiter/jobs', icon: Briefcase, label: 'Jobs' },
    { href: '/recruiter/jobs/new', icon: PlusCircle, label: 'Post Job' },
    { href: '/recruiter/candidates', icon: Search, label: 'Search Candidates' },
    { href: '/recruiter/shortlist', icon: Star, label: 'Shortlisted' },
    { href: '/recruiter/analytics', icon: BarChart2, label: 'Analytics' },
  ];

  const studentLinks = [
    { href: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/student/profile', icon: User, label: 'Profile' },
    { href: '/student/jobs', icon: Briefcase, label: 'Browse Jobs' },
    { href: '/student/applications', icon: FileText, label: 'My Applications' },
    { href: '/student/analytics', icon: BarChart2, label: 'My Analytics' },
    { href: '/student/cultural-test', icon: Target, label: 'Cultural Fit Test' },
  ];

  const links = role === 'recruiter' ? recruiterLinks : studentLinks;

  return (
    <motion.div
      animate={{ width: collapsed ? 80 : 256 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed left-0 top-0 h-screen glass-panel rounded-none border-t-0 border-l-0 border-b-0 border-r border-white/50 flex flex-col z-40 bg-white/60"
    >
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-gray-200/50">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="w-8 h-8 flex-shrink-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
            <span className="text-white font-bold text-lg">R</span>
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.h1
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700 whitespace-nowrap"
              >
                RecruitPro
              </motion.h1>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 overflow-y-auto overflow-x-hidden space-y-2 relative">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative flex items-center px-3 py-3 rounded-xl transition-colors duration-200 group ${
                isActive ? 'text-blue-700' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white shadow-sm border border-gray-100 rounded-xl z-0"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              <div className="relative z-10 flex items-center flex-1">
                <Icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-blue-600' : ''}`} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="ml-3 text-sm font-semibold whitespace-nowrap"
                    >
                      {link.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Tooltip for collapsed state */}
              {collapsed && (
                <div className="absolute left-14 px-2 py-1 bg-gray-900 text-white text-xs font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {link.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Toggle Button */}
      <div className="p-4 border-t border-gray-200/50">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-500 transition-colors"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
    </motion.div>
  );
}
