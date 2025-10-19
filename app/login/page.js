'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        if (formData.role === 'student') {
          router.push('/student/dashboard');
        } else {
          router.push('/recruiter/dashboard');
        }
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Glassmorphism Card with Animations */}
      <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-10 w-full max-w-md animate-slide-up">
        <div className="text-center mb-8 animate-scale-in">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent mb-2 animate-glow">
            RecruitPro
          </h1>
          <p className="text-gray-200 text-lg">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-400/50 text-red-200 rounded-xl backdrop-blur-sm animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-up animation-delay-300">
          <div className="animate-fade-in-up animation-delay-400">
            <label className="block text-sm font-semibold text-gray-200 mb-3">
              I am a:
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'student' })}
                className={`p-4 rounded-xl border-2 font-medium transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 ${
                  formData.role === 'student'
                    ? 'border-blue-400 bg-blue-500/30 text-blue-200 shadow-lg shadow-blue-500/50 backdrop-blur-sm'
                    : 'border-white/20 bg-white/5 text-gray-300 hover:border-blue-400/50 hover:bg-blue-500/20 backdrop-blur-sm'
                }`}
              >
                👨‍🎓 Student
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'recruiter' })}
                className={`p-4 rounded-xl border-2 font-medium transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 ${
                  formData.role === 'recruiter'
                    ? 'border-purple-400 bg-purple-500/30 text-purple-200 shadow-lg shadow-purple-500/50 backdrop-blur-sm'
                    : 'border-white/20 bg-white/5 text-gray-300 hover:border-purple-400/50 hover:bg-purple-500/20 backdrop-blur-sm'
                }`}
              >
                💼 Recruiter
              </button>
            </div>
          </div>

          <div className="animate-fade-in-up animation-delay-500">
            <label className="block text-sm font-semibold text-gray-200 mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-gray-400 backdrop-blur-sm focus:border-blue-400 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
              placeholder="your.email@example.com"
            />
          </div>

          <div className="animate-fade-in-up animation-delay-600">
            <label className="block text-sm font-semibold text-gray-200 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-gray-400 backdrop-blur-sm focus:border-purple-400 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-base shadow-lg hover:shadow-2xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-95 animate-fade-in-up animation-delay-700"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-300 animate-fade-in-up animation-delay-800">
          Don't have an account?{' '}
          <a href="/signup" className="text-blue-300 hover:text-blue-200 font-semibold transition-colors">
            Sign up
          </a>
        </p>
      </div>

      {/* Custom CSS Animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }

        @keyframes glow {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(168, 85, 247, 0.5)); }
          50% { filter: drop-shadow(0 0 30px rgba(236, 72, 153, 0.8)); }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-500 {
          animation-delay: 0.5s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        .animation-delay-700 {
          animation-delay: 0.7s;
        }

        .animation-delay-800 {
          animation-delay: 0.8s;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
