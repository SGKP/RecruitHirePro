'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import AIChatbot from '@/components/AIChatbot';

export default function StudentDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, jobsRes] = await Promise.all([
        fetch('/api/student/profile'),
        fetch('/api/student/recommended-jobs')
      ]);

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile(profileData.student);
      }

      if (jobsRes.ok) {
        const jobsData = await jobsRes.json();
        setJobs(jobsData.jobs || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
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
        fetchData(); // Refresh data
      } else {
        alert(data.error || 'Failed to apply');
      }
    } catch (error) {
      alert('Error submitting application');
    } finally {
      setApplying(null);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar role="student" />
      
      {/* Main Content - Add left margin for sidebar */}
      <div className="ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome Back!</h1>
              <p className="text-gray-600 mt-1">Hey {profile?.user_id?.name}, explore new opportunities</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/student/profile')}
                className="btn-primary"
              >
                ✏️ Edit Profile
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
          <div className="card-modern p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Recommended Jobs</p>
                <p className="text-3xl font-bold text-blue-900 mt-2">{jobs.length}</p>
              </div>
              <div className="text-4xl">💼</div>
            </div>
          </div>
          
          <div className="card-modern p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Profile Strength</p>
                <p className="text-3xl font-bold text-green-900 mt-2">{profile?.skills?.length || 0}</p>
                <p className="text-xs text-green-700">Skills Added</p>
              </div>
              <div className="text-4xl">⭐</div>
            </div>
          </div>
          
          <div className="card-modern p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Profile Completion</p>
                <p className="text-3xl font-bold text-purple-900 mt-2">85%</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>
        </div>

        {/* Recommended Jobs */}
        <div className="card-modern p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recommended Jobs for You</h2>
            <button
              onClick={() => router.push('/student/jobs')}
              className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
            >
              View All →
            </button>
          </div>
          
          {jobs.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-700 text-lg font-medium">No jobs available at the moment</p>
              <p className="text-gray-500 mt-2">Check back later for new opportunities!</p>
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
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                      <p className="text-gray-600 mb-3 line-clamp-2">{job.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                          📍 {job.location}
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          💰 {job.salary_range}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          📈 {job.experience_level}
                        </span>
                      </div>
                    </div>
                    {job.match_score && (
                      <div className="flex flex-col items-center bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-green-300 text-green-700 rounded-xl px-5 py-3 ml-4">
                        <span className="text-3xl font-bold">{Math.round(job.match_score)}%</span>
                        <span className="text-xs font-semibold mt-1">Match</span>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Required Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {job.required_skills?.slice(0, 5).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.required_skills?.length > 5 && (
                        <span className="px-3 py-1 text-gray-500 text-sm">
                          +{job.required_skills.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                      Posted: {new Date(job.created_at).toLocaleDateString()}
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

      {/* Floating AI Chatbot Button */}
      <button
        onClick={() => router.push('/student/ai-copilot')}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center text-3xl z-50"
        title="Launch AI Co-Pilot"
      >
        🤖
      </button>

      </div>
    </div>
  );
}
