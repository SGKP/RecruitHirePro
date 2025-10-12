'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658', '#ff7c7c'];

export default function GitHubAnalytics() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/student/github-analytics');
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to fetch GitHub analytics');
        router.push('/student/profile');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      alert('Error loading GitHub analytics');
      router.push('/student/profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar role="student" />
        <div className="flex-1 ml-64">
          <div className="p-8">
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading GitHub Analytics...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar role="student" />
        <div className="flex-1 ml-64">
          <div className="p-8">
            <div className="text-center py-20">
              <p className="text-red-600">Failed to load analytics</p>
              <button 
                onClick={() => router.push('/student/profile')}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Back to Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { profile, statistics, languages, top_repos, repo_type_distribution, organizations } = analytics;

  // Prepare data for pie charts
  const repoTypeData = [
    { name: 'Original', value: repo_type_distribution.original },
    { name: 'Forked', value: repo_type_distribution.forked }
  ];

  const languageData = languages.slice(0, 8).map(l => ({
    name: l.language,
    value: parseFloat(l.percentage)
  }));

  const followData = [
    { name: 'Followers', value: profile.followers },
    { name: 'Following', value: profile.following }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar role="student" />
      <div className="flex-1 ml-64">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">GitHub Analytics Pro</h1>
              <p className="text-gray-600 mt-1">Comprehensive analysis of your GitHub profile</p>
            </div>
            <button 
              onClick={() => router.push('/student/profile')}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              ← Back to Profile
            </button>
          </div>

          {/* Profile Header Card */}
          <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-xl p-6 mb-6 text-white shadow-lg">
            <div className="flex items-center gap-6">
              <img 
                src={profile.avatar_url} 
                alt={profile.username}
                className="w-24 h-24 rounded-full border-4 border-white shadow-xl"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{profile.name || profile.username}</h2>
                <p className="text-blue-100">@{profile.username}</p>
                {profile.bio && <p className="mt-2 text-blue-50">{profile.bio}</p>}
                <div className="flex gap-4 mt-3 text-sm">
                  {profile.location && (
                    <span className="flex items-center gap-1">
                      <span>📍</span> {profile.location}
                    </span>
                  )}
                  {profile.company && (
                    <span className="flex items-center gap-1">
                      <span>🏢</span> {profile.company}
                    </span>
                  )}
                  {profile.blog && (
                    <a href={profile.blog} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline">
                      <span>🔗</span> Website
                    </a>
                  )}
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg p-4 text-center">
                <div className="text-4xl font-bold">{statistics.activity_score}</div>
                <div className="text-sm text-blue-100">Activity Score</div>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Repositories</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{statistics.total_repos}</p>
                </div>
                <div className="text-4xl">📦</div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {statistics.original_repos} original, {statistics.forked_repos} forked
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Stars</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{statistics.total_stars}</p>
                </div>
                <div className="text-4xl">⭐</div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Across all repositories</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Commits</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{statistics.total_commits_recent}</p>
                </div>
                <div className="text-4xl">💻</div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Recent activity</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Followers</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{profile.followers}</p>
                </div>
                <div className="text-4xl">👥</div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Following {profile.following}</p>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Language Distribution Pie Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Language Distribution</h3>
              {languageData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={languageData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={false}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {languageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend 
                      layout="vertical" 
                      align="right" 
                      verticalAlign="middle"
                      formatter={(value, entry) => `${value}: ${entry.payload.value}%`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-gray-500 py-20">No language data available</p>
              )}
            </div>

            {/* Repository Type Distribution */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Repository Types</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={repoTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={false}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {repoTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#0088FE' : '#00C49F'} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend 
                    layout="vertical" 
                    align="right" 
                    verticalAlign="middle"
                    formatter={(value, entry) => `${value}: ${entry.payload.value} repos`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Followers vs Following */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Social Network</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={followData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={false}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {followData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#8884D8' : '#82ca9d'} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend 
                    layout="vertical" 
                    align="right" 
                    verticalAlign="middle"
                    formatter={(value, entry) => `${value}: ${entry.payload.value}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Top Languages Bar Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Top Languages (by usage)</h3>
              {languageData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={languageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8">
                      {languageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-gray-500 py-20">No language data available</p>
              )}
            </div>
          </div>

          {/* Top Repositories */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">🏆 Top Repositories</h3>
            {top_repos.length > 0 ? (
              <div className="space-y-4">
                {top_repos.map((repo, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <a 
                          href={repo.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-lg font-semibold text-blue-600 hover:underline"
                        >
                          {repo.name}
                        </a>
                        <p className="text-gray-600 text-sm mt-1">{repo.description || 'No description'}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          {repo.language && (
                            <span className="flex items-center gap-1">
                              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                              {repo.language}
                            </span>
                          )}
                          <span>⭐ {repo.stars}</span>
                          <span>🍴 {repo.forks}</span>
                          <span className="text-xs">
                            Updated: {new Date(repo.updated_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No repositories found</p>
            )}
          </div>

          {/* Organizations */}
          {organizations.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">🏢 Organizations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {organizations.map((org, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <img 
                      src={org.avatar_url} 
                      alt={org.login}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{org.login}</p>
                      {org.description && (
                        <p className="text-xs text-gray-600 truncate">{org.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-3xl font-bold text-blue-600">{statistics.total_forks}</div>
              <div className="text-gray-600 mt-1">Total Forks</div>
              <div className="text-xs text-gray-500 mt-2">Across all repositories</div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-3xl font-bold text-green-600">{profile.public_gists}</div>
              <div className="text-gray-600 mt-1">Public Gists</div>
              <div className="text-xs text-gray-500 mt-2">Code snippets shared</div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-3xl font-bold text-purple-600">{statistics.total_organizations}</div>
              <div className="text-gray-600 mt-1">Organizations</div>
              <div className="text-xs text-gray-500 mt-2">Member of</div>
            </div>
          </div>

          {/* Profile Age */}
          <div className="mt-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-6 text-center">
            <p className="text-gray-700">
              <span className="font-semibold">GitHub member since:</span> {new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Last updated: {new Date(profile.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
