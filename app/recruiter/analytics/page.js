'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  BarChart, Bar, PieChart, Pie, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell 
} from 'recharts';
import Sidebar from '@/components/Sidebar';

export default function RecruiterAnalyticsPage() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/recruiter/analytics', {
        credentials: 'include',
      });
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login?role=recruiter');
          return;
        }
        throw new Error('Failed to fetch analytics');
      }
      const data = await response.json();
      setAnalytics(data.analytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { 
      method: 'POST',
      credentials: 'include' 
    });
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 text-xl font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Prepare data for Skill Gap Bar Chart
  const skillGapData = analytics?.skill_gaps?.slice(0, 8).map(gap => ({
    skill: gap.skill.charAt(0).toUpperCase() + gap.skill.slice(1),
    Demand: gap.demand,
    Supply: gap.supply,
    Gap: gap.gap
  })) || [];

  // Prepare data for University Distribution Pie Chart
  const universityData = analytics?.university_distribution?.slice(0, 6).map(uni => ({
    name: uni.name || 'Unknown',
    value: uni.count
  })) || [];

  // Prepare data for Degree Distribution
  const degreeData = analytics?.degree_distribution?.slice(0, 5).map(deg => ({
    name: deg.name || 'Unknown',
    value: deg.count
  })) || [];

  // Colors for charts
  const COLORS = ['#2563eb', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6', '#06b6d4', '#ef4444', '#14b8a6'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar role="recruiter" />
      
      {/* Main Content with left margin for sidebar */}
      <div className="ml-64">
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">?? Analytics Dashboard</h1>
            <div className="flex gap-3">
              <button onClick={handleLogout} className="btn-secondary">Logout</button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <div className="card-modern p-6 hover:scale-105 transition-transform border border-gray-200">
            <div className="text-gray-700 text-sm mb-1 font-medium">?? Total Jobs</div>
            <div className="text-4xl font-bold text-purple-600">{analytics?.total_jobs || 0}</div>
            <div className="text-green-600 text-xs mt-2 font-medium">Active: {analytics?.active_jobs || 0}</div>
          </div>
          <div className="card-modern p-6 hover:scale-105 transition-transform border border-gray-200">
            <div className="text-gray-700 text-sm mb-1 font-medium">?? Applications</div>
            <div className="text-4xl font-bold text-blue-600">{analytics?.total_applications || 0}</div>
            <div className="text-gray-600 text-xs mt-2 font-medium">Avg: {analytics?.average_applications_per_job || 0}/job</div>
          </div>
          <div className="card-modern p-6 hover:scale-105 transition-transform border border-gray-200">
            <div className="text-gray-700 text-sm mb-1 font-medium">?? Candidates</div>
            <div className="text-4xl font-bold text-green-600">{analytics?.total_students || 0}</div>
            <div className="text-gray-600 text-xs mt-2 font-medium">In talent pool</div>
          </div>
          <div className="card-modern p-6 hover:scale-105 transition-transform border border-gray-200">
            <div className="text-gray-700 text-sm mb-1 font-medium">? Conversion</div>
            <div className="text-4xl font-bold text-teal-600">
              {analytics?.conversion_rate || 0}%
            </div>
            <div className="text-green-600 text-xs mt-2 font-medium">Acceptance rate</div>
          </div>
          <div className="card-modern p-6 hover:scale-105 transition-transform border border-gray-200">
            <div className="text-gray-700 text-sm mb-1 font-medium">?? Skill Gaps</div>
            <div className="text-4xl font-bold text-orange-600">
              {analytics?.skill_gaps?.filter(g => g.gap_percentage > 50).length || 0}
            </div>
            <div className="text-red-600 text-xs mt-2 font-medium">Critical shortage</div>
          </div>
        </div>

        {/* Application Funnel */}
        <div className="card-modern p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            ?? Application Funnel
          </h2>
          {analytics?.application_funnel && analytics.application_funnel.length > 0 ? (
            <div className="space-y-4">
              {analytics.application_funnel.map((stage, index) => (
                <div key={stage.stage} className="relative">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-900 font-medium">{stage.stage}</span>
                    <span className="text-gray-700">{stage.count} ({stage.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-8 relative overflow-hidden">
                    <div 
                      className={`h-8 rounded-full transition-all duration-500 flex items-center px-4 ${
                        index === 0 ? 'bg-gradient-to-r from-purple-600 to-pink-600' :
                        index === 1 ? 'bg-gradient-to-r from-blue-600 to-cyan-600' :
                        index === 2 ? 'bg-gradient-to-r from-yellow-600 to-orange-600' :
                        'bg-gradient-to-r from-green-600 to-emerald-600'
                      }`}
                      style={{ width: `${stage.percentage}%` }}
                    >
                      <span className="text-white font-bold text-sm">{stage.percentage}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-800">No application data available</div>
          )}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-700">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{analytics?.shortlist_rate || 0}%</div>
              <div className="text-sm text-gray-700">Shortlist Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">{analytics?.conversion_rate || 0}%</div>
              <div className="text-sm text-gray-700">Conversion Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">{analytics?.average_time_to_apply || 0} days</div>
              <div className="text-sm text-gray-700">Avg Time to Apply</div>
            </div>
          </div>
        </div>

        {/* Applications Over Time */}
        <div className="card-modern p-6 mb-8">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-6">
            ?? Applications Trend (Last 30 Days)
          </h2>
          {analytics?.applications_over_time && analytics.applications_over_time.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics.applications_over_time}>
                <defs>
                  <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  labelStyle={{ color: '#f3f4f6' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="applications" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorApplications)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-800">
              No recent application data
            </div>
          )}
        </div>

        {/* Top Performing Jobs */}
        <div className="card-modern p-6 mb-8">
          <h2 className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-6">
            ?? Top Performing Jobs
          </h2>
          {analytics?.top_jobs && analytics.top_jobs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-900">Job Title</th>
                    <th className="text-left py-3 px-4 text-gray-900">Location</th>
                    <th className="text-center py-3 px-4 text-gray-900">Applications</th>
                    <th className="text-center py-3 px-4 text-gray-900">Shortlisted</th>
                    <th className="text-center py-3 px-4 text-gray-900">Success Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.top_jobs.map((job, index) => (
                    <tr key={index} className="border-b border-gray-800 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 text-gray-200">{job.title}</td>
                      <td className="py-3 px-4 text-gray-700">{job.location}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                          {job.applications}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                          {job.shortlisted}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          job.applications > 0 && (job.shortlisted / job.applications) > 0.3
                            ? 'bg-green-500/20 text-green-300'
                            : job.applications > 0 && (job.shortlisted / job.applications) > 0.15
                            ? 'bg-yellow-500/20 text-yellow-300'
                            : 'bg-red-500/20 text-red-300'
                        }`}>
                          {job.applications > 0 ? Math.round((job.shortlisted / job.applications) * 100) : 0}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-800">No job performance data available</div>
          )}
        </div>

        {/* Main Charts Row */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Skill Supply vs Demand Bar Chart */}
          <div className="card-modern p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              ?? Skill Supply vs Demand
            </h2>
            {skillGapData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={skillGapData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="skill" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    labelStyle={{ color: '#f3f4f6' }}
                  />
                  <Legend />
                  <Bar dataKey="Demand" fill="#a855f7" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="Supply" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-800">
                No skill data available
              </div>
            )}
            <p className="text-sm text-gray-700 mt-4 text-center">
              Purple = Jobs needing skill | Green = Students having skill
            </p>
          </div>

          {/* University Distribution Pie Chart */}
          <div className="card-modern p-6">
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-6">
              ?? Candidate Universities
            </h2>
            {universityData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={universityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {universityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-800">
                No university data available
              </div>
            )}
            <p className="text-sm text-gray-700 mt-4 text-center">
              Distribution of candidates across universities
            </p>
          </div>
        </div>

        {/* Degree Distribution */}
        <div className="card-modern p-6 mb-8">
          <h2 className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-6">
            ?? Degree Distribution
          </h2>
          {degreeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={degreeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9ca3af" />
                <YAxis dataKey="name" type="category" stroke="#9ca3af" width={150} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  labelStyle={{ color: '#f3f4f6' }}
                />
                <Bar dataKey="value" fill="#10b981" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-800">
              No degree data available
            </div>
          )}
        </div>

        {/* Critical Skill Gaps Table */}
        <div className="card-modern p-6 mb-8">
          <h2 className="text-xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-6">
            ?? Critical Skill Shortages (Action Required)
          </h2>
          {analytics?.skill_gaps && analytics.skill_gaps.filter(g => g.gap_percentage > 30).length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-900">Skill</th>
                    <th className="text-center py-3 px-4 text-gray-900">Jobs Need</th>
                    <th className="text-center py-3 px-4 text-gray-900">Students Have</th>
                    <th className="text-center py-3 px-4 text-gray-900">Shortage</th>
                    <th className="text-right py-3 px-4 text-gray-900">Gap %</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.skill_gaps
                    .filter(gap => gap.gap_percentage > 30)
                    .sort((a, b) => b.gap_percentage - a.gap_percentage)
                    .map((gap, idx) => (
                      <tr key={idx} className="border-b border-gray-800 hover:bg-white/5">
                        <td className="py-3 px-4 font-semibold capitalize text-gray-200">{gap.skill}</td>
                        <td className="py-3 px-4 text-center text-purple-300">{gap.demand}</td>
                        <td className="py-3 px-4 text-center text-green-300">{gap.supply}</td>
                        <td className="py-3 px-4 text-center text-red-300 font-bold">{gap.gap}</td>
                        <td className="py-3 px-4 text-right">
                          <span className={`px-3 py-1 rounded-full font-semibold ${
                            gap.gap_percentage > 70 ? 'bg-red-500/20 text-red-300' :
                            gap.gap_percentage > 50 ? 'bg-orange-500/20 text-orange-300' :
                            'bg-yellow-500/20 text-yellow-300'
                          }`}>
                            {gap.gap_percentage}%
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-700 text-center py-8">
              ? No critical skill shortages! All skills have good candidate supply.
            </p>
          )}
        </div>

        {/* AI-Powered Recommendations */}
        <div className="card-modern p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-gray-200 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            ?? AI-Powered Recruitment Insights
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-green-400 mb-2">? Strengths</h4>
              {analytics?.skill_gaps?.filter(g => g.gap_percentage <= 0).length > 0 ? (
                analytics.skill_gaps
                  .filter(g => g.gap_percentage <= 0)
                  .slice(0, 3)
                  .map((gap, idx) => (
                    <p key={idx} className="text-gray-900 text-sm">
                      � <span className="capitalize font-semibold">{gap.skill}</span>: Excellent supply ({gap.supply} candidates for {gap.demand} positions)
                    </p>
                  ))
              ) : (
                <p className="text-gray-700 text-sm">Focus on building your candidate pool</p>
              )}
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-red-400 mb-2">?? Action Items</h4>
              {analytics?.skill_gaps?.filter(g => g.gap_percentage > 50).length > 0 ? (
                analytics.skill_gaps
                  .filter(g => g.gap_percentage > 50)
                  .slice(0, 3)
                  .map((gap, idx) => (
                    <p key={idx} className="text-gray-900 text-sm">
                      � Urgently recruit <span className="capitalize font-semibold">{gap.skill}</span> talent (need {gap.gap} more)
                    </p>
                  ))
              ) : (
                <p className="text-gray-700 text-sm">All critical skills are well covered!</p>
              )}
                        </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
