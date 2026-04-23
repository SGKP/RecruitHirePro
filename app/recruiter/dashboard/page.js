'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import PageTransition from '@/components/PageTransition';
import AnimatedCard from '@/components/AnimatedCard';
import AnimatedCyberBackground from '@/components/AnimatedCyberBackground';
import { LogOut, PlusCircle, Briefcase, Users, CheckCircle, BarChart2, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RecruiterDashboard() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [analyticsRes, jobsRes] = await Promise.all([
        fetch('/api/recruiter/analytics'),
        fetch('/api/recruiter/jobs')
      ]);

      if (analyticsRes.ok) {
        const data = await analyticsRes.json();
        setAnalytics(data.analytics);
      }

      if (jobsRes.ok) {
        const data = await jobsRes.json();
        setJobs(data.jobs || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative font-sans text-gray-800">
      <AnimatedCyberBackground />
      <Sidebar role="recruiter" />
      
      {/* Main Content */}
      <div className="ml-64 relative z-10">
        {/* Header */}
        <header className="navbar-modern">
          <div className="max-w-7xl mx-auto px-8 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700">
                  Welcome back, Recruiter
                </h1>
                <p className="text-gray-500 font-medium mt-1">Manage your hiring pipeline seamlessly.</p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => router.push('/recruiter/jobs/new')}
                  className="btn-primary flex items-center gap-2"
                >
                  <PlusCircle size={20} />
                  Post Job
                </button>
                <button
                  onClick={handleLogout}
                  className="btn-secondary flex items-center gap-2"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        <PageTransition className="max-w-7xl mx-auto px-8 py-10">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <AnimatedCard index={0} className="p-6 bg-gradient-to-br from-white/80 to-white/40 border border-white/60">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Total Jobs Posted</p>
                  <motion.p 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                    className="text-4xl font-extrabold text-gray-900"
                  >
                    {analytics?.total_jobs || 0}
                  </motion.p>
                </div>
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-inner">
                  <Briefcase size={28} />
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard index={1} className="p-6 bg-gradient-to-br from-white/80 to-white/40 border border-white/60">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Total Candidates</p>
                  <motion.p 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className="text-4xl font-extrabold text-gray-900"
                  >
                    {analytics?.total_students || 0}
                  </motion.p>
                </div>
                <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-inner">
                  <Users size={28} />
                </div>
              </div>
            </AnimatedCard>
            
            <AnimatedCard index={2} className="p-6 bg-gradient-to-br from-white/80 to-white/40 border border-white/60">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Active Hirings</p>
                  <motion.p 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                    className="text-4xl font-extrabold text-gray-900"
                  >
                    {analytics?.active_jobs || 0}
                  </motion.p>
                </div>
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-600 shadow-inner">
                  <CheckCircle size={28} />
                </div>
              </div>
            </AnimatedCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Jobs (Takes up 2 cols) */}
            <div className="lg:col-span-2">
              <AnimatedCard index={3} className="p-8 h-full">
                <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Briefcase className="text-blue-600" />
                    Your Job Postings
                  </h2>
                  <button
                    onClick={() => router.push('/recruiter/jobs')}
                    className="text-blue-600 hover:text-blue-800 font-bold text-sm bg-blue-50 px-4 py-2 rounded-lg transition-colors"
                  >
                    View All
                  </button>
                </div>

                {jobs.length === 0 ? (
                  <div className="text-center py-16 bg-white/50 rounded-2xl border border-dashed border-gray-300">
                    <Briefcase className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg font-medium">No jobs posted yet</p>
                    <button
                      onClick={() => router.push('/recruiter/jobs/new')}
                      className="mt-6 btn-primary shadow-lg shadow-blue-500/30"
                    >
                      Post Your First Job
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {jobs.slice(0, 5).map((job, i) => (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        key={job._id}
                        className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow group flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                          <div className="flex flex-wrap gap-2 mt-3">
                            <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-bold border border-purple-100">
                              {job.location}
                            </span>
                            <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-100">
                              {job.salary_range}
                            </span>
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100">
                              {job.applications_count || 0} Apps
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => router.push(`/recruiter/candidates?job_id=${job._id}`)}
                          className="ml-4 px-4 py-2 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 rounded-lg font-semibold text-sm transition-colors border border-gray-200 hover:border-blue-200"
                        >
                          Review
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatedCard>
            </div>

            {/* Quick Actions (Takes up 1 col) */}
            <div className="lg:col-span-1">
              <AnimatedCard index={4} className="p-8 h-full bg-gradient-to-b from-white/90 to-blue-50/50">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 gap-4">
                  <button
                    onClick={() => router.push('/recruiter/analytics')}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-100 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10 transition-all group text-left"
                  >
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <BarChart2 size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">View Analytics</h3>
                      <p className="text-sm text-gray-500 font-medium">Track hiring metrics</p>
                    </div>
                  </button>

                  <button
                    onClick={() => router.push('/recruiter/candidates')}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-100 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/10 transition-all group text-left"
                  >
                    <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Users size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Search Candidates</h3>
                      <p className="text-sm text-gray-500 font-medium">Find the best talent</p>
                    </div>
                  </button>

                  <button
                    onClick={() => router.push('/recruiter/shortlist')}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-100 hover:border-yellow-300 hover:shadow-lg hover:shadow-yellow-500/10 transition-all group text-left"
                  >
                    <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600 group-hover:bg-yellow-500 group-hover:text-white transition-colors">
                      <Star size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Shortlisted</h3>
                      <p className="text-sm text-gray-500 font-medium">View saved candidates</p>
                    </div>
                  </button>
                </div>
              </AnimatedCard>
            </div>
          </div>
        </PageTransition>
      </div>
    </div>
  );
}
