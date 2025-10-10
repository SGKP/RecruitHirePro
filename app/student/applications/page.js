'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default function StudentApplications() {
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/student/applications', {
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login?role=student');
          return;
        }
        throw new Error('Failed to fetch applications');
      }

      const data = await response.json();
      setApplications(data.applications || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
      case 'shortlisted':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'pending':
      case 'applied':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const handleLogout = () => {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/login?role=student');
  };

  return (
    <div className="min-h-screen">
      <Sidebar role="student" />
      <div className="ml-64">
        {/* Header */}
        <header className="navbar-modern border-b border-purple-500/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gradient bg-gradient-to-r from-purple-400 to-pink-400">
                  My Applications
                </h1>
                <p className="text-gray-300">Track your job application status</p>
              </div>
              <button
                onClick={handleLogout}
                className="btn-secondary"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-300">Loading your applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="card-modern p-12 text-center">
              <div className="text-6xl mb-4">📭</div>
              <h2 className="text-2xl font-bold text-gray-200 mb-2">No Applications Yet</h2>
              <p className="text-gray-400 mb-6">You haven't applied to any jobs yet. Start browsing opportunities!</p>
              <button
                onClick={() => router.push('/student/jobs')}
                className="btn-primary"
              >
                Browse Jobs
              </button>
            </div>
          ) : (
            <div className="grid gap-6">
              {applications.map((application) => (
                <div
                  key={application._id}
                  className="card-modern p-6 hover:scale-[1.02] transition-transform"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-200 mb-2">
                        {application.job_id?.title || 'Job Title Not Available'}
                      </h2>
                      <p className="text-gray-400 mb-4">
                        {application.job_id?.description || 'No description available'}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/50 rounded-full text-sm">
                          📍 {application.job_id?.location || 'Location N/A'}
                        </span>
                        <span className="px-3 py-1 bg-green-500/20 text-green-300 border border-green-500/50 rounded-full text-sm">
                          💰 {application.job_id?.salary_range || 'Salary N/A'}
                        </span>
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/50 rounded-full text-sm">
                          🎓 {application.job_id?.experience_level || 'Experience N/A'}
                        </span>
                      </div>

                      {application.job_id?.required_skills && application.job_id.required_skills.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-300 mb-2">Required Skills:</p>
                          <div className="flex flex-wrap gap-2">
                            {application.job_id.required_skills.map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-white/5 text-gray-300 rounded-full text-sm border border-white/10"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className={`ml-4 rounded-lg px-4 py-2 text-center border ${getStatusColor(application.status)}`}>
                      <div className="text-sm font-bold uppercase">{application.status || 'Pending'}</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                    <div className="text-sm text-gray-400">
                      <p>📅 Applied: {new Date(application.applied_at || application.createdAt).toLocaleDateString()}</p>
                      {application.match_score && (
                        <p className="mt-1">🎯 Match Score: {Math.round(application.match_score)}%</p>
                      )}
                    </div>
                    {application.job_id?._id && (
                      <button
                        onClick={() => router.push(`/student/jobs`)}
                        className="btn-secondary text-sm"
                      >
                        View Similar Jobs
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
