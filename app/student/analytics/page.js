'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  PieChart, Pie, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell 
} from 'recharts';
import Sidebar from '@/components/Sidebar';

export default function StudentAnalytics() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/student/analytics', {
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login?role=student');
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-300 text-xl">Loading your analytics...</p>
        </div>
      </div>
    );
  }

  const COLORS = ['#a855f7', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

  return (
    <div className="min-h-screen">
      <Sidebar role="student" />
      <div className="ml-64">
        {/* Header */}
        <header className="navbar-modern border-b border-purple-500/30">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gradient bg-gradient-to-r from-purple-400 to-pink-400">
              My Career Analytics
            </h1>
            <button onClick={handleLogout} className="btn-secondary">Logout</button>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Profile Strength & Key Metrics */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="card-modern p-6 hover:scale-105 transition-transform">
              <div className="text-gray-400 text-sm mb-1">📊 Profile Strength</div>
              <div className="text-4xl font-bold text-gradient bg-gradient-to-r from-green-400 to-emerald-400">
                {analytics?.profile_strength || 0}%
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
                <div 
                  className="bg-gradient-to-r from-green-600 to-emerald-500 h-2 rounded-full transition-all"
                  style={{ width: `${analytics?.profile_strength || 0}%` }}
                ></div>
              </div>
            </div>

            <div className="card-modern p-6 hover:scale-105 transition-transform">
              <div className="text-gray-400 text-sm mb-1">📬 Applications</div>
              <div className="text-4xl font-bold text-gradient bg-gradient-to-r from-blue-400 to-cyan-400">
                {analytics?.total_applications || 0}
              </div>
              <div className="text-purple-400 text-xs mt-2">Jobs applied to</div>
            </div>
          </div>

          {/* Application Status Breakdown */}
          <div className="grid lg:grid-cols-1 gap-8 mb-8">
            <div className="card-modern p-6">
              <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
                📋 Application Status
              </h2>
              {analytics?.status_breakdown && analytics.status_breakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.status_breakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analytics.status_breakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4b5563', borderRadius: '8px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  No application data yet
                </div>
              )}
            </div>
          </div>

          {/* Profile Completion Checklist */}
          <div className="card-modern p-6 mb-8">
            <h2 className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-6">
              ✨ Profile Completion Checklist
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {analytics?.profile_checklist && analytics.profile_checklist.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    item.completed ? 'bg-green-500' : 'bg-gray-600'
                  }`}>
                    {item.completed && '✓'}
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-200 font-medium">{item.name}</div>
                    <div className="text-gray-400 text-sm">{item.description}</div>
                  </div>
                  <div className="text-sm text-purple-400">+{item.points}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="card-modern p-6">
            <h2 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-6">
              💡 Recommendations to Improve
            </h2>
            <div className="space-y-4">
              {analytics?.recommendations && analytics.recommendations.length > 0 ? (
                analytics.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-lg border border-purple-500/30">
                    <div className="text-3xl">{rec.icon}</div>
                    <div className="flex-1">
                      <div className="text-gray-200 font-semibold mb-1">{rec.title}</div>
                      <div className="text-gray-400 text-sm">{rec.description}</div>
                    </div>
                    <button 
                      onClick={() => router.push(rec.action_link)}
                      className="btn-primary text-sm whitespace-nowrap"
                    >
                      {rec.action_text}
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Great job! Keep applying to more jobs.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
