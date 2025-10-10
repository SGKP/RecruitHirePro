'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';

export default function ShortlistPage() {
  const router = useRouter();
  const [shortlist, setShortlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupBy, setGroupBy] = useState('job'); // 'job' or 'status'

  useEffect(() => {
    fetchShortlist();
  }, []);

  const fetchShortlist = async () => {
    try {
      const response = await fetch('/api/recruiter/shortlist');
      if (response.ok) {
        const data = await response.json();
        setShortlist(data.shortlist || []);
      }
    } catch (error) {
      console.error('Error fetching shortlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id, candidateName) => {
    if (!confirm(`Remove ${candidateName} from shortlist?`)) return;

    try {
      const response = await fetch(`/api/recruiter/shortlist?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Remove from state
        setShortlist(prev => prev.filter(s => s._id !== id));
        alert(`✅ ${candidateName} removed from shortlist`);
      } else {
        alert('Failed to remove from shortlist');
      }
    } catch (error) {
      console.error('Error removing from shortlist:', error);
      alert('Error removing candidate');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-300 text-xl">Loading shortlist...</p>
        </div>
      </div>
    );
  }

  // Group shortlist by job
  const groupedByJob = {};
  shortlist.forEach(item => {
    const jobTitle = item.job_id?.title || 'Unknown Job';
    if (!groupedByJob[jobTitle]) {
      groupedByJob[jobTitle] = [];
    }
    groupedByJob[jobTitle].push(item);
  });

  // Group shortlist by status
  const groupedByStatus = {};
  shortlist.forEach(item => {
    const status = item.status || 'shortlisted';
    if (!groupedByStatus[status]) {
      groupedByStatus[status] = [];
    }
    groupedByStatus[status].push(item);
  });

  return (
    <div className="min-h-screen">
      <Sidebar role="recruiter" />
      <div className="ml-64">
        {/* Header */}
        <header className="navbar-modern border-b border-purple-500/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gradient bg-gradient-to-r from-purple-400 to-pink-400">
                  Shortlisted Candidates
                </h1>
                <p className="text-gray-300">{shortlist.length} candidates shortlisted</p>
              </div>
              <div className="flex gap-3">
                <Link href="/recruiter/dashboard" className="btn-secondary">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="btn-secondary">
                  Logout
                </button>
              </div>
            </div>
          </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Group By Toggle */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setGroupBy('job')}
            className={`px-4 py-2 rounded-lg transition-all ${
              groupBy === 'job'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                : 'btn-secondary'
            }`}
          >
            Group by Job
          </button>
          <button
            onClick={() => setGroupBy('status')}
            className={`px-4 py-2 rounded-lg transition-all ${
              groupBy === 'status'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                : 'btn-secondary'
            }`}
          >
            Group by Status
          </button>
        </div>

        {shortlist.length === 0 ? (
          <div className="card-modern p-12 text-center">
            <p className="text-gray-400 text-lg mb-4">No candidates shortlisted yet</p>
            <Link href="/recruiter/candidates" className="btn-primary inline-block">
              Search Candidates
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {groupBy === 'job' ? (
              // Group by Job
              Object.entries(groupedByJob).map(([jobTitle, items]) => (
                <div key={jobTitle} className="card-modern p-6">
                  <h2 className="text-xl font-bold text-gradient bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
                    {jobTitle} ({items.length})
                  </h2>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item._id}
                        className="bg-black/20 border border-purple-500/20 rounded-lg p-4 hover:border-purple-500/50 transition-all"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-200 mb-2">
                              {item.student_id?.user_id?.name || 'Unknown Student'}
                            </h3>
                            
                            {/* Student Details - Only Email and Phone */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 text-sm">
                              <div>
                                <span className="text-gray-400">Email:</span>
                                <p className="text-gray-200">
                                  {item.student_id?.user_id?.email || 'No email available'}
                                </p>
                              </div>
                              {item.student_id?.phone && item.student_id.phone !== 'N/A' && (
                                <div>
                                  <span className="text-gray-400">Phone:</span>
                                  <p className="text-gray-200">{item.student_id.phone}</p>
                                </div>
                              )}
                            </div>

                            {/* Skills */}
                            {item.student_id?.resume_parsed_data?.skills && item.student_id.resume_parsed_data.skills.length > 0 && (
                              <div className="mb-3">
                                <p className="text-gray-400 text-sm mb-2">Skills:</p>
                                <div className="flex flex-wrap gap-2">
                                  {item.student_id.resume_parsed_data.skills.slice(0, 8).map((skill, idx) => (
                                    <span
                                      key={idx}
                                      className="px-2 py-1 bg-green-500/20 border border-green-400/50 text-green-200 rounded text-xs"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {/* Notes */}
                            {item.notes && (
                              <div className="bg-purple-500/10 border border-purple-400/30 rounded p-3 mb-3">
                                <p className="text-purple-300 text-sm font-semibold">Recruiter Notes:</p>
                                <p className="text-gray-300 text-sm">{item.notes}</p>
                              </div>
                            )}
                            
                            {/* Status and Date */}
                            <div className="flex gap-2 mt-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                item.status === 'shortlisted' ? 'bg-purple-500/20 text-purple-300' :
                                item.status === 'interviewed' ? 'bg-blue-500/20 text-blue-300' :
                                item.status === 'offered' ? 'bg-green-500/20 text-green-300' :
                                item.status === 'rejected' ? 'bg-red-500/20 text-red-300' :
                                'bg-yellow-500/20 text-yellow-300'
                              }`}>
                                ⭐ {item.status?.toUpperCase()}
                              </span>
                              <span className="text-gray-400 text-xs px-3 py-1 bg-gray-800 rounded-full">
                                Added: {new Date(item.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-700">
                          {item.student_id?.resume_url && (
                            <a
                              href={item.student_id.resume_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50 transition-all text-sm"
                            >
                              📄 View Resume
                            </a>
                          )}
                          <a
                            href={`mailto:${item.student_id?.user_id?.email || ''}?subject=Opportunity at RecruitPro&body=Hi ${item.student_id?.user_id?.name || ''},%0D%0A%0D%0AWe would like to discuss the ${jobTitle} position with you.`}
                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50 transition-all text-sm"
                          >
                            ✉️ Contact
                          </a>
                          {item.student_id?.linkedin_url && (
                            <a
                              href={item.student_id.linkedin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:scale-105 transition-all text-sm"
                            >
                              🔗 LinkedIn
                            </a>
                          )}
                          {item.student_id?.github_username && (
                            <a
                              href={`https://github.com/${item.student_id.github_username}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:scale-105 transition-all text-sm"
                            >
                              💻 GitHub
                            </a>
                          )}
                          <button
                            onClick={() => handleRemove(item._id, item.student_id?.user_id?.name || 'candidate')}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg hover:scale-105 transition-all text-sm ml-auto"
                          >
                            ✕ Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              // Group by Status
              Object.entries(groupedByStatus).map(([status, items]) => (
                <div key={status} className="card-modern p-6">
                  <h2 className="text-xl font-bold text-gradient bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
                    {status.charAt(0).toUpperCase() + status.slice(1)} ({items.length})
                  </h2>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item._id}
                        className="bg-black/20 border border-purple-500/20 rounded-lg p-4 hover:border-purple-500/50 transition-all"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-200">
                              {item.student_id?.user_id?.name || 'Unknown Student'}
                            </h3>
                            <p className="text-gray-400 text-sm">{item.student_id?.user_id?.email}</p>
                            <p className="text-purple-300 text-sm mt-1">
                              Job: {item.job_id?.title || 'Unknown'}
                            </p>
                            {item.notes && (
                              <p className="text-gray-300 text-sm mt-2 bg-purple-500/10 p-2 rounded">
                                {item.notes}
                              </p>
                            )}
                            <span className="text-gray-400 text-xs block mt-2">
                              Added: {new Date(item.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Link
                              href={`/recruiter/candidates?job_id=${item.job_id?._id}`}
                              className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
                            >
                              View Profile
                            </Link>
                            <button
                              onClick={() => handleRemove(item._id, item.student_id?.user_id?.name || 'candidate')}
                              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
