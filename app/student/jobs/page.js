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
    <div className="min-h-screen bg-gray-50">
      <Sidebar role="student" />
      <div className="ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-5">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Browse Jobs</h1>
                <p className="text-gray-600 mt-1">Find your perfect career opportunity</p>
              </div>
              <button
                onClick={() => router.push('/student/dashboard')}
                className="btn-secondary"
              >
                ← Back
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="card-modern p-16 text-center bg-gray-50">
            <div className="text-7xl mb-6">📭</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No Jobs Available</h2>
            <p className="text-gray-600">Check back later for new opportunities!</p>
          </div>
        ) : (
          <div className="grid gap-5">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="card-modern p-6 hover:shadow-lg transition-all border border-gray-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h2>
                    <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                        📍 {job.location}
                      </span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        💰 {job.salary_range}
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        🎓 {job.experience_level}
                      </span>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                        👥 {job.applications_count || 0} applicants
                      </span>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Required Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {job.required_skills?.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {job.match_score && (
                    <div className="ml-4 bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-green-300 text-green-700 rounded-xl px-5 py-3 text-center">
                      <div className="text-3xl font-bold">{Math.round(job.match_score)}%</div>
                      <div className="text-xs font-semibold mt-1">Match</div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    📅 Posted: {new Date(job.created_at).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => handleApply(job._id)}
                    disabled={applying === job._id}
                    className="btn-primary disabled:opacity-50"
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
