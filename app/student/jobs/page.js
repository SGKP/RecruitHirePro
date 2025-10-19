'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default function StudentJobs() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/student/recommended-jobs');
      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs || []);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    setApplying(jobId);
    try {
      const response = await fetch('/api/student/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_id: jobId })
      });

      const data = await response.json();

      if (response.ok) {
        alert('✅ Application submitted successfully!');
      } else {
        alert(data.error || 'Failed to apply');
      }
    } catch (error) {
      alert('Error submitting application');
    } finally {
      setApplying(null);
    }
  };

  return (
    <div className="min-h-screen">
      <Sidebar role="student" />
      <div className="ml-64">
        {/* Header */}
        <header className="bg-gradient-to-r from-purple-900 via-purple-800 to-pink-900 border-b border-purple-500/50 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  <span className="text-4xl">💼</span>
                  Browse Jobs
                </h1>
                <p className="text-purple-200 mt-1">Find your perfect career opportunity</p>
              </div>
              <button
                onClick={() => router.push('/student/dashboard')}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium border border-white/30 transition-all"
              >
                ← Back
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="relative inline-flex">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="text-2xl">💼</span>
              </div>
            </div>
            <p className="mt-6 text-lg text-white font-medium">Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-16 text-center border border-purple-500/30 shadow-2xl">
            <div className="text-7xl mb-6">📭</div>
            <h2 className="text-2xl font-bold text-white mb-3">No Jobs Available</h2>
            <p className="text-gray-300">Check back later for new opportunities!</p>
          </div>
        ) : (
          <div className="grid gap-5">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-purple-500/30 shadow-xl hover:shadow-2xl hover:border-purple-500/50 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2">{job.title}</h2>
                    <p className="text-gray-300 mb-4 line-clamp-2">{job.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-purple-500/30">
                        📍 {job.location}
                      </span>
                      <span className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-green-500/30">
                        💰 {job.salary_range}
                      </span>
                      <span className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-500/30">
                        🎓 {job.experience_level}
                      </span>
                      <span className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-yellow-500/30">
                        👥 {job.applications_count || 0} applicants
                      </span>
                    </div>

                    <div className="mb-4 bg-white/5 rounded-lg p-4 border border-white/10">
                      <p className="text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
                        <span>💼</span> Required Skills
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {job.required_skills?.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-medium border border-indigo-400/30"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {job.match_score && (
                    <div className="ml-4 bg-gradient-to-br from-green-600 to-green-700 text-white rounded-xl px-5 py-3 text-center shadow-lg">
                      <div className="text-3xl font-bold">{Math.round(job.match_score)}%</div>
                      <div className="text-xs font-semibold mt-1">Match</div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-purple-500/30">
                  <p className="text-sm text-gray-200 flex items-center gap-2">
                    <span className="text-purple-400">📅</span>
                    <span className="font-medium">Posted:</span>
                    <span className="text-white">{new Date(job.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </p>
                  <button
                    onClick={() => handleApply(job._id)}
                    disabled={applying === job._id}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/30 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {applying === job._id ? 'Applying...' : 'Apply Now'}
                  </button>
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
