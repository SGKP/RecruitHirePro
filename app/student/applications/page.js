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
        <header className="bg-gradient-to-r from-purple-900 via-purple-800 to-pink-900 border-b border-purple-500/50 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
                  <span className="text-4xl">📋</span>
                  My Applications
                </h1>
                <p className="text-purple-200">Track your job application status and progress</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium border border-white/30 transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="relative inline-flex">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="text-2xl">📋</span>
                </div>
              </div>
              <p className="mt-6 text-lg text-white font-medium">Loading your applications...</p>
              <p className="text-gray-400 text-sm mt-2">Please wait while we fetch your data</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-16 text-center border border-purple-500/30 shadow-2xl">
              <div className="text-8xl mb-6">📭</div>
              <h2 className="text-3xl font-bold text-white mb-3">No Applications Yet</h2>
              <p className="text-gray-300 text-lg mb-8 max-w-md mx-auto">You haven't applied to any jobs yet. Start browsing exciting opportunities and take the first step towards your dream career!</p>
              <button
                onClick={() => router.push('/student/jobs')}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:scale-105"
              >
                🚀 Browse Jobs Now
              </button>
            </div>
          ) : (
            <>
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 shadow-lg">
                  <div className="text-4xl mb-2">📊</div>
                  <div className="text-3xl font-bold text-white">{applications.length}</div>
                  <div className="text-purple-200 text-sm">Total Applications</div>
                </div>
                <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 shadow-lg">
                  <div className="text-4xl mb-2">✅</div>
                  <div className="text-3xl font-bold text-white">
                    {applications.filter(a => ['accepted', 'shortlisted'].includes(a.status?.toLowerCase())).length}
                  </div>
                  <div className="text-green-200 text-sm">Shortlisted/Accepted</div>
                </div>
                <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-xl p-6 shadow-lg">
                  <div className="text-4xl mb-2">⏳</div>
                  <div className="text-3xl font-bold text-white">
                    {applications.filter(a => ['pending', 'applied'].includes(a.status?.toLowerCase())).length}
                  </div>
                  <div className="text-yellow-200 text-sm">Pending Review</div>
                </div>
              </div>

              {/* Applications List */}
              <div className="grid gap-6">
              {applications.map((application) => (
                <div
                  key={application._id}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-purple-500/30 shadow-xl hover:shadow-2xl hover:border-purple-500/50 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h2 className="text-2xl font-bold text-white">
                          {application.job_id?.title || 'Job Title Not Available'}
                        </h2>
                        <div className={`rounded-lg px-4 py-2 text-center border-2 ${getStatusColor(application.status)} min-w-[120px]`}>
                          <div className="text-sm font-bold uppercase">{application.status || 'Pending'}</div>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 mb-4 leading-relaxed">
                        {application.job_id?.description || 'No description available'}
                      </p>
                      
                      <div className="flex flex-wrap gap-3 mb-4">
                        <span className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-purple-500/30">
                          📍 {application.job_id?.location || 'Location N/A'}
                        </span>
                        <span className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-green-500/30">
                          💰 {application.job_id?.salary_range || 'Salary N/A'}
                        </span>
                        <span className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-500/30">
                          🎓 {application.job_id?.experience_level || 'Experience N/A'}
                        </span>
                      </div>

                      {application.job_id?.required_skills && application.job_id.required_skills.length > 0 && (
                        <div className="mb-4 bg-white/5 rounded-lg p-4 border border-white/10">
                          <p className="text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
                            <span>💼</span> Required Skills
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {application.job_id.required_skills.map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-medium border border-indigo-400/30"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-purple-500/30">
                    <div className="text-sm text-gray-200 flex gap-6">
                      <p className="flex items-center gap-2">
                        <span className="text-purple-400">📅</span>
                        <span className="font-medium">Applied:</span>
                        <span className="text-white">{new Date(application.applied_at || application.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      </p>
                      {application.match_score && (
                        <p className="flex items-center gap-2">
                          <span className="text-green-400">🎯</span>
                          <span className="font-medium">Match Score:</span>
                          <span className="text-white font-bold">{Math.round(application.match_score)}%</span>
                        </p>
                      )}
                    </div>
                    {application.job_id?._id && (
                      <button
                        onClick={() => router.push(`/student/jobs`)}
                        className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/30 hover:shadow-xl"
                      >
                        View Similar Jobs
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
