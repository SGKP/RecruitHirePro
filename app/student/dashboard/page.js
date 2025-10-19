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
    <div className="min-h-screen">
      <Sidebar role="student" />
      
      {/* Main Content - Add left margin for sidebar */}
      <div className="ml-64">
        {/* Header */}
        <header className="bg-gradient-to-r from-purple-900 via-purple-800 to-pink-900 border-b border-purple-500/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <span className="text-4xl">👋</span>
                Welcome Back!
              </h1>
              <p className="text-purple-200 mt-1">Hey {profile?.user_id?.name}, explore new opportunities</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/student/profile')}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium border border-white/30 transition-all"
              >
                ✏️ Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium border border-white/30 transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-8 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-lg font-semibold">Recommended Jobs</p>
                <p className="text-5xl font-bold text-white mt-3">{jobs.length}</p>
                <p className="text-purple-200 text-sm mt-2">Available opportunities matching your profile</p>
              </div>
              <div className="text-7xl">💼</div>
            </div>
          </div>
        </div>

        {/* Recommended Jobs */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border border-purple-500/30 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span>💼</span> Recommended Jobs for You
            </h2>
            <button
              onClick={() => router.push('/student/jobs')}
              className="text-purple-300 hover:text-purple-200 font-semibold text-sm"
            >
              View All →
            </button>
          </div>
          
          {jobs.length === 0 ? (
            <div className="text-center py-16 bg-white/5 rounded-xl border border-white/10">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-white text-lg font-medium">No jobs available at the moment</p>
              <p className="text-gray-400 mt-2">Check back later for new opportunities!</p>
            </div>
          ) : (
            <div className="grid gap-5">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-6 hover:shadow-2xl transition-all border border-purple-500/20 hover:border-purple-500/40"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{job.title}</h3>
                      <p className="text-gray-300 mb-3 line-clamp-2">{job.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg text-sm font-medium shadow-lg">
                          📍 {job.location}
                        </span>
                        <span className="px-3 py-1 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg text-sm font-medium shadow-lg">
                          💰 {job.salary_range}
                        </span>
                        <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium shadow-lg">
                          📈 {job.experience_level}
                        </span>
                      </div>
                    </div>
                    {job.match_score && (
                      <div className="flex flex-col items-center bg-gradient-to-br from-green-600 to-green-700 text-white rounded-xl px-5 py-3 ml-4 shadow-lg">
                        <span className="text-3xl font-bold">{Math.round(job.match_score)}%</span>
                        <span className="text-xs font-semibold mt-1">Match</span>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-semibold text-purple-300 mb-2">Required Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {job.required_skills?.slice(0, 5).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-medium border border-indigo-400/30"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.required_skills?.length > 5 && (
                        <span className="px-3 py-1 text-gray-400 text-sm">
                          +{job.required_skills.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-purple-500/30">
                    <p className="text-sm text-gray-400">
                      Posted: {new Date(job.created_at).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => handleApply(job._id)}
                      disabled={applying === job._id}
                      className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center text-3xl z-50"
        title="Launch AI Co-Pilot"
      >
        🤖
      </button>

      </div>
    </div>
  );
}
