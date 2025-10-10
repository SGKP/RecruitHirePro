'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default function RecruiterCandidates() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [shortlistedIds, setShortlistedIds] = useState(new Set());
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showReasoningModal, setShowReasoningModal] = useState(false);
  const [selectedReasoning, setSelectedReasoning] = useState(null);
  const [filters, setFilters] = useState({
    min_match_score: '',
    min_retention_score: '',
    min_gpa: '',
    max_gpa: '',
    degree: '',
    university: '',
    skills: '',
    graduation_year: '',
    min_github_repos: '',
    location: '',
    interests: ''
  });

  useEffect(() => {
    fetchJobs();
    fetchShortlist();
    const jobId = searchParams.get('job_id');
    if (jobId) {
      setSelectedJob(jobId);
    }
  }, []);

  useEffect(() => {
    if (selectedJob) {
      searchCandidates();
    }
  }, [selectedJob]);

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/recruiter/jobs');
      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs || []);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const searchCandidates = async () => {
    if (!selectedJob) return;

    setLoading(true);
    try {
      // Build query parameters
      const queryParams = new URLSearchParams({
        job_id: selectedJob,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        )
      });

      const response = await fetch(`/api/recruiter/search-candidates?${queryParams}`, {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setCandidates(data.candidates || []);
      }
    } catch (error) {
      console.error('Error searching candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      min_match_score: '',
      min_retention_score: '',
      min_gpa: '',
      max_gpa: '',
      degree: '',
      university: '',
      skills: '',
      graduation_year: '',
      min_github_repos: '',
      location: '',
      interests: ''
    });
  };

  const applyFilters = () => {
    searchCandidates();
  };

  const fetchShortlist = async () => {
    try {
      const response = await fetch('/api/recruiter/shortlist');
      if (response.ok) {
        const data = await response.json();
        const ids = new Set(data.shortlist.map(s => s.student_id._id));
        setShortlistedIds(ids);
      }
    } catch (error) {
      console.error('Error fetching shortlist:', error);
    }
  };

  const handleShortlist = async (candidate) => {
    if (!selectedJob) {
      alert('Please select a job first');
      return;
    }

    const studentId = candidate.student_id || candidate._id;
    
    if (!studentId) {
      alert('Cannot find student ID');
      console.error('Candidate data:', candidate);
      return;
    }

    try {
      const response = await fetch('/api/recruiter/shortlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          job_id: selectedJob,
          notes: `Match: ${candidate.match_score}%, Retention: ${candidate.retention_score}%`
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Add to shortlisted set
        setShortlistedIds(prev => new Set([...prev, studentId]));
        
        // Remove from candidates list
        setCandidates(prev => prev.filter(c => (c.student_id || c._id) !== studentId));
        
        alert(`✅ ${candidate.name} has been shortlisted!`);
      } else {
        alert(data.error || 'Failed to shortlist');
      }
    } catch (error) {
      console.error('Error shortlisting:', error);
      alert('Error shortlisting candidate');
    }
  };

  const openReasoningModal = (candidate) => {
    setSelectedReasoning({
      name: candidate.name,
      score: candidate.retention_score,
      reasoning: candidate.retention_reasoning || 'No detailed reasoning available.',
      aiPowered: candidate.ai_powered
    });
    setShowReasoningModal(true);
  };

  const closeReasoningModal = () => {
    setShowReasoningModal(false);
    setSelectedReasoning(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar role="recruiter" />
      <div className="ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-5">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Search Candidates</h1>
                <p className="text-gray-600 mt-1">Find the best talent for your openings</p>
              </div>
              <button
                onClick={() => router.push('/recruiter/dashboard')}
                className="btn-secondary"
              >
                ← Back
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search Filters */}
        <div className="card-modern p-8 mb-8 border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              🔍 Smart Search
            </h2>
            <button
              onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
              className="btn-secondary text-sm"
            >
              {showAdvancedSearch ? '▼ Hide Advanced' : '▶ Show Advanced Filters'}
            </button>
          </div>
          
          {/* Basic Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Job *
              </label>
              <select
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
                className="input-modern"
              >
                <option value="">Choose a job...</option>
                {jobs.map((job) => (
                  <option key={job._id} value={job._id}>
                    {job.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Min Match Score (%)
              </label>
              <input
                type="number"
                value={filters.min_match_score}
                onChange={(e) => handleFilterChange('min_match_score', e.target.value)}
                className="input-modern"
                placeholder="e.g., 50"
                min="0"
                max="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Min GPA
              </label>
              <input
                type="number"
                step="0.1"
                value={filters.min_gpa}
                onChange={(e) => handleFilterChange('min_gpa', e.target.value)}
                className="input-modern"
                placeholder="e.g., 3.0"
                min="0"
                max="4.0"
              />
            </div>
          </div>

          {/* Advanced Filters */}
          {showAdvancedSearch && (
            <div className="border-t border-gray-700 pt-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-200 mb-4">🎯 Advanced Filters</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Degree */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Degree
                  </label>
                  <input
                    type="text"
                    value={filters.degree}
                    onChange={(e) => handleFilterChange('degree', e.target.value)}
                    className="input-modern"
                    placeholder="e.g., Computer Science, MBA"
                  />
                </div>

                {/* University */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    University
                  </label>
                  <input
                    type="text"
                    value={filters.university}
                    onChange={(e) => handleFilterChange('university', e.target.value)}
                    className="input-modern"
                    placeholder="e.g., MIT, Stanford"
                  />
                </div>

                {/* Graduation Year */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Graduation Year
                  </label>
                  <input
                    type="number"
                    value={filters.graduation_year}
                    onChange={(e) => handleFilterChange('graduation_year', e.target.value)}
                    className="input-modern"
                    placeholder="e.g., 2024"
                    min="2020"
                    max="2030"
                  />
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Skills (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={filters.skills}
                    onChange={(e) => handleFilterChange('skills', e.target.value)}
                    className="input-modern"
                    placeholder="e.g., Python, React, Node.js"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="input-modern"
                    placeholder="e.g., New York, Remote"
                  />
                </div>

                {/* Max GPA */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Max GPA
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={filters.max_gpa}
                    onChange={(e) => handleFilterChange('max_gpa', e.target.value)}
                    className="input-modern"
                    placeholder="e.g., 4.0"
                    min="0"
                    max="4.0"
                  />
                </div>

                {/* Min GitHub Repos */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Min GitHub Repositories
                  </label>
                  <input
                    type="number"
                    value={filters.min_github_repos}
                    onChange={(e) => handleFilterChange('min_github_repos', e.target.value)}
                    className="input-modern"
                    placeholder="e.g., 5"
                    min="0"
                  />
                </div>

                {/* Interests */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Interests (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={filters.interests}
                    onChange={(e) => handleFilterChange('interests', e.target.value)}
                    className="input-modern"
                    placeholder="e.g., AI, Data Science"
                  />
                </div>

                {/* Retention Score */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Min Retention Score (%)
                  </label>
                  <input
                    type="number"
                    value={filters.min_retention_score}
                    onChange={(e) => handleFilterChange('min_retention_score', e.target.value)}
                    className="input-modern"
                    placeholder="e.g., 60"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={applyFilters}
              disabled={!selectedJob || loading}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '🔄 Searching...' : '🔍 Search Candidates'}
            </button>
            <button
              onClick={clearFilters}
              className="btn-secondary"
            >
              🗑️ Clear Filters
            </button>
          </div>

          {/* Active Filters Display */}
          {Object.values(filters).some(v => v !== '') && (
            <div className="mt-4 p-4 bg-purple-900/20 rounded-lg border border-purple-500/30">
              <div className="text-sm text-gray-300 font-medium mb-2">Active Filters:</div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(filters).filter(([_, value]) => value !== '').map(([key, value]) => (
                  <span key={key} className="px-3 py-1 bg-purple-500/30 text-purple-200 rounded-full text-sm flex items-center gap-2">
                    {key.replace(/_/g, ' ')}: {value}
                    <button
                      onClick={() => handleFilterChange(key, '')}
                      className="text-purple-300 hover:text-white"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Candidates Results */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            👥 Candidates ({candidates.length})
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-700 font-medium">Searching candidates...</p>
            </div>
          ) : candidates.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-700 text-lg font-medium">
                {selectedJob ? 'No candidates match your criteria' : 'Select a job to view candidates'}
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {candidates.map((candidate) => (
                <div
                  key={candidate.student_id}
                  className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/20 transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {candidate.name}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700 mb-3 font-medium">
                        <p>{candidate.email}</p>
                        <p>GPA: {candidate.gpa}</p>
                        <p>Year: {candidate.graduation_year}</p>
                        <p>{candidate.university}</p>
                        {candidate.phone && candidate.phone !== 'N/A' && (
                          <p>{candidate.phone}</p>
                        )}
                        {candidate.current_year && candidate.current_year !== 'N/A' && (
                          <p>{candidate.current_year}</p>
                        )}
                      </div>
                      
                      {candidate.linkedin_url && (
                        <div className="mb-3">
                          <a
                            href={candidate.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 text-sm hover:underline font-medium"
                          >
                            LinkedIn Profile →
                          </a>
                        </div>
                      )}

                      {candidate.achievements && candidate.achievements.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-900 mb-1">Achievements:</p>
                          <div className="space-y-1">
                            {candidate.achievements.map((ach, idx) => (
                              <p key={idx} className="text-sm text-gray-700">• {ach.title}</p>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-900 mb-2">Matched Skills:</p>
                        <div className="flex flex-wrap gap-2">
                          {candidate.matched_skills?.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-green-100 border border-green-500 text-green-700 rounded-full text-sm font-medium"
                            >
                              ✓ {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="ml-4 flex flex-col gap-2">
                      <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-lg px-4 py-2 text-center shadow-lg shadow-purple-500/50">
                        <div className="text-2xl font-bold">{candidate.match_score}%</div>
                        <div className="text-xs">Skills Match</div>
                      </div>
                      <div 
                        onClick={() => candidate.retention_reasoning && openReasoningModal(candidate)}
                        className={`bg-gradient-to-br from-pink-600 to-purple-600 text-white rounded-lg px-4 py-2 text-center shadow-lg shadow-pink-500/50 ${candidate.retention_reasoning ? 'cursor-pointer hover:scale-105 transition-transform' : ''}`}
                        title={candidate.retention_reasoning ? "Click to view detailed analysis" : ""}
                      >
                        <div className="text-2xl font-bold">{candidate.retention_score}%</div>
                        <div className="text-xs flex items-center justify-center gap-1">
                          Retention
                          {candidate.ai_powered && (
                            <span className="text-yellow-300" title="AI-Powered Analysis">✨</span>
                          )}
                          {candidate.retention_reasoning && (
                            <span className="ml-1">🔍</span>
                          )}
                        </div>
                      </div>
                      {candidate.gpa_numeric && (
                        <div className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-lg px-4 py-2 text-center shadow-lg shadow-blue-500/50">
                          <div className="text-xl font-bold">{candidate.gpa_numeric.toFixed(2)}</div>
                          <div className="text-xs">GPA</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-700">
                    <button
                      onClick={() => handleShortlist(candidate)}
                      disabled={shortlistedIds.has(candidate.student_id || candidate._id)}
                      className={`px-4 py-2 rounded-lg hover:scale-105 transition-all text-sm ${
                        shortlistedIds.has(candidate.student_id || candidate._id)
                          ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                          : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/50'
                      }`}
                    >
                      {shortlistedIds.has(candidate.student_id || candidate._id) ? '✓ Shortlisted' : 'Shortlist'}
                    </button>
                    {candidate.resume_url && (
                      <a
                        href={candidate.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50 transition-all text-sm"
                      >
                        View Resume
                      </a>
                    )}
                    <a
                      href={`mailto:${candidate.email}?subject=Opportunity at RecruitPro&body=Hi ${candidate.name},%0D%0A%0D%0AWe are interested in your profile for our ${jobs.find(j => j._id === selectedJob)?.title} position.`}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50 transition-all text-sm"
                    >
                      Contact
                    </a>
                    {candidate.github_username && (
                      <a
                        href={`https://github.com/${candidate.github_username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:scale-105 hover:shadow-lg transition-all text-sm"
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Retention Reasoning Modal */}
      {showReasoningModal && selectedReasoning && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={closeReasoningModal}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-6 rounded-t-xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    🎯 Retention Analysis
                  </h2>
                  <p className="text-pink-100">{selectedReasoning.name}</p>
                </div>
                <button
                  onClick={closeReasoningModal}
                  className="text-white hover:text-pink-200 text-3xl leading-none"
                >
                  ×
                </button>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                  <div className="text-3xl font-bold">{selectedReasoning.score}%</div>
                  <div className="text-xs text-pink-100">Retention Score</div>
                </div>
                {selectedReasoning.aiPowered && (
                  <div className="bg-yellow-400 bg-opacity-20 text-yellow-100 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <span>✨</span>
                    AI-Powered Analysis
                  </div>
                )}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                📊 Detailed Analysis:
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {selectedReasoning.reasoning}
                </p>
              </div>

              {selectedReasoning.aiPowered && (
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900">
                    <strong>💡 Note:</strong> This analysis was generated using Google Gemini AI based on the candidate's cultural fitness assessment responses. It analyzes 25 questions across 5 categories: Team Dynamics, Work Style, Learning & Growth, Career Goals, and Work Environment.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 rounded-b-xl border-t border-gray-200">
              <button
                onClick={closeReasoningModal}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:scale-105 transition-transform font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
