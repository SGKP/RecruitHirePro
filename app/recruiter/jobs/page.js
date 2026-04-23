'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import PageTransition from '@/components/PageTransition';
import AnimatedCard from '@/components/AnimatedCard';
import AnimatedCyberBackground from '@/components/AnimatedCyberBackground';
import { Briefcase, PlusCircle, ArrowLeft, MapPin, DollarSign, Award, Users, Calendar, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <div className="min-h-screen relative font-sans text-gray-800">
      <AnimatedCyberBackground />
      <Sidebar role="recruiter" />
      
      <div className="ml-64 relative z-10">
        <header className="navbar-modern">
          <div className="max-w-7xl mx-auto px-8 py-5">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700">
                  Your Job Postings
                </h1>
                <p className="text-gray-500 font-medium mt-1">Manage and track all your active listings</p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => router.push('/recruiter/dashboard')}
                  className="btn-secondary flex items-center gap-2"
                >
                  <ArrowLeft size={20} />
                  Dashboard
                </button>
                <button
                  onClick={() => router.push('/recruiter/jobs/new')}
                  className="btn-primary flex items-center gap-2"
                >
                  <PlusCircle size={20} />
                  Post New Job
                </button>
              </div>
            </div>
          </div>
        </header>

        <PageTransition className="max-w-7xl mx-auto px-8 py-10">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
            </div>
          ) : jobs.length === 0 ? (
            <AnimatedCard className="text-center py-20 border border-white/60">
              <Briefcase className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Jobs Posted Yet</h2>
              <p className="text-gray-500 mb-8 font-medium">Create your first job posting to start recruiting top talent!</p>
              <button
                onClick={() => router.push('/recruiter/jobs/new')}
                className="btn-primary shadow-lg shadow-blue-500/30"
              >
                Post Your First Job
              </button>
            </AnimatedCard>
          ) : (
            <div className="grid gap-6">
              {jobs.map((job, i) => (
                <AnimatedCard key={job._id} index={i} className="p-8 border border-white/60">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {job.title}
                      </h2>
                      <p className="text-gray-600 mb-6 font-medium leading-relaxed">{job.description}</p>
                      
                      <div className="flex flex-wrap gap-3 mb-6">
                        <span className="px-3 py-1.5 bg-purple-50 border border-purple-100 text-purple-700 rounded-lg text-sm font-bold flex items-center gap-1">
                          <MapPin size={16} /> {job.location}
                        </span>
                        <span className="px-3 py-1.5 bg-green-50 border border-green-100 text-green-700 rounded-lg text-sm font-bold flex items-center gap-1">
                          <DollarSign size={16} /> {job.salary_range}
                        </span>
                        <span className="px-3 py-1.5 bg-blue-50 border border-blue-100 text-blue-700 rounded-lg text-sm font-bold flex items-center gap-1">
                          <Award size={16} /> {job.experience_level}
                        </span>
                        <span className="px-3 py-1.5 bg-yellow-50 border border-yellow-100 text-yellow-700 rounded-lg text-sm font-bold flex items-center gap-1">
                          <Users size={16} /> {job.applications_count || 0} Apps
                        </span>
                        <span className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-600 rounded-lg text-sm font-bold flex items-center gap-1">
                          <Calendar size={16} /> {new Date(job.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <div>
                        <p className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Required Skills:</p>
                        <div className="flex flex-wrap gap-2">
                          {job.required_skills?.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-white border border-gray-200 text-gray-700 shadow-sm rounded-full text-sm font-bold"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8 pt-6 border-t border-gray-100">
                    <button
                      onClick={() => router.push(`/recruiter/candidates?job_id=${job._id}`)}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-colors shadow-lg shadow-blue-500/30 flex items-center gap-2"
                    >
                      <Users size={18} /> View Candidates
                    </button>
                    <button
                      className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-bold text-sm transition-colors shadow-sm flex items-center gap-2"
                    >
                      <Edit size={18} /> Edit
                    </button>
                    <button
                      className="px-6 py-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-bold text-sm transition-colors shadow-sm flex items-center gap-2 ml-auto"
                    >
                      <Trash2 size={18} /> Delete
                    </button>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          )}
        </PageTransition>
      </div>
    </div>
  );
}
