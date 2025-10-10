'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import AIChatbot from '@/components/AIChatbot';

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
        setAnalytics(data);
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
    <div className="min-h-screen bg-gray-50">
      <Sidebar role="recruiter" />
      
      {/* Main Content - Add left margin for sidebar */}
      <div className="ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Recruiter Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your recruitment process</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/recruiter/jobs/new')}
                className="btn-primary"
              >
                ➕ Post Job
              </button>
              <button
                onClick={handleLogout}
                className="btn-secondary"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card-modern p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Total Jobs Posted</p>
                <p className="text-3xl font-bold text-purple-900 mt-2">{analytics?.totalJobs || 0}</p>
              </div>
              <div className="text-4xl">💼</div>
            </div>
          </div>

          <div className="card-modern p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Candidates</p>
                <p className="text-3xl font-bold text-blue-900 mt-2">{analytics?.totalStudents || 0}</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>
          
          <div className="card-modern p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Active Hirings</p>
                <p className="text-3xl font-bold text-green-900 mt-2">{jobs.length}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="card-modern p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Job Postings</h2>
            <button
              onClick={() => router.push('/recruiter/jobs')}
              className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
            >
              View All →
            </button>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-gray-700 text-lg font-medium">No jobs posted yet</p>
              <button
                onClick={() => router.push('/recruiter/jobs/new')}
                className="mt-6 btn-primary"
              >
                Post Your First Job
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {jobs.slice(0, 5).map((job) => (
                <div
                  key={job._id}
                  className="card-modern p-5 hover:shadow-lg transition-all border border-gray-200"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{job.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-1">{job.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                          📍 {job.location}
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          💰 {job.salary_range}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          📝 {job.applications_count || 0} applications
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push(`/recruiter/candidates?job_id=${job._id}`)}
                      className="ml-4 btn-primary text-sm"
                    >
                      View Candidates
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <button
            onClick={() => router.push('/recruiter/analytics')}
            className="card-modern p-6 hover:shadow-lg transition-all text-left border border-gray-200"
          >
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">View Analytics</h3>
            <p className="text-gray-600 text-sm">Track hiring metrics</p>
          </button>

          <button
            onClick={() => router.push('/recruiter/candidates')}
            className="card-modern p-6 hover:shadow-lg transition-all text-left border border-gray-200"
          >
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Search Candidates</h3>
            <p className="text-gray-600 text-sm">Find the best talent</p>
          </button>

          <button
            onClick={() => router.push('/recruiter/shortlist')}
            className="card-modern p-6 hover:shadow-lg transition-all text-left border border-gray-200"
          >
            <div className="text-3xl mb-3">⭐</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Shortlisted</h3>
            <p className="text-gray-600 text-sm">View saved candidates</p>
          </button>

          <button
            onClick={() => router.push('/recruiter/jobs')}
            className="card-modern p-6 hover:shadow-lg transition-all text-left border border-gray-200"
          >
            <div className="text-3xl mb-3">💼</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Manage Jobs</h3>
            <p className="text-gray-600 text-sm">Edit job postings</p>
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
