'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default function RecruiterJobs() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/recruiter/jobs');
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

  return (
    <div className="min-h-screen">
      <Sidebar role="recruiter" />
      <div className="ml-64">
        {/* Header */}
        <header className="navbar-modern border-b border-purple-500/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gradient bg-gradient-to-r from-purple-400 to-pink-400">Your Job Postings</h1>
                <p className="text-gray-300">Manage all your job listings</p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => router.push('/recruiter/jobs/new')}
                  className="btn-primary"
                >
                  + Post New Job
                </button>
                <button
                  onClick={() => router.push('/recruiter/dashboard')}
                  className="btn-secondary"
                >
                ← Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-500 mx-auto"></div>
            <p className="mt-4 text-gray-300">Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="card-modern p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-bold text-gradient bg-gradient-to-r from-purple-400 to-pink-400 mb-2">No Jobs Posted Yet</h2>
            <p className="text-gray-300 mb-6">Create your first job posting to start recruiting!</p>
            <button
              onClick={() => router.push('/recruiter/jobs/new')}
              className="btn-primary"
            >
              + Post Your First Job
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="card-modern p-6 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gradient bg-gradient-to-r from-purple-400 to-pink-400 mb-2">{job.title}</h2>
                    <p className="text-gray-300 mb-4">{job.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 bg-purple-500/20 border border-purple-400/50 text-purple-200 rounded-full text-sm">
                        {job.location}
                      </span>
                      <span className="px-3 py-1 bg-green-500/20 border border-green-400/50 text-green-200 rounded-full text-sm">
                        {job.salary_range}
                      </span>
                      <span className="px-3 py-1 bg-blue-500/20 border border-blue-400/50 text-blue-200 rounded-full text-sm">
                        {job.experience_level}
                      </span>
                      <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-400/50 text-yellow-200 rounded-full text-sm">
                        {job.applications_count || 0} applications
                      </span>
                      <span className="px-3 py-1 bg-gray-500/20 border border-gray-400/50 text-gray-200 rounded-full text-sm">
                        Posted {new Date(job.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-200 mb-2">Required Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {job.required_skills?.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-pink-500/20 border border-pink-400/50 text-pink-200 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6 pt-4 border-t border-gray-700">
                  <button
                    onClick={() => router.push(`/recruiter/candidates?job_id=${job._id}`)}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50 transition-all font-medium"
                  >
                    View Candidates
                  </button>
                  <button
                    className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:scale-105 hover:shadow-lg transition-all"
                  >
                    Edit
                  </button>
                  <button
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:scale-105 hover:shadow-lg hover:shadow-red-500/50 transition-all"
                  >
                    Delete
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
