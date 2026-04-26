'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import PageTransition from '@/components/PageTransition';
import AnimatedCyberBackground from '@/components/AnimatedCyberBackground';
import AnimatedCard from '@/components/AnimatedCard';
import { BrainCircuit, ArrowLeft, CheckCircle, ChevronRight, ChevronLeft, Gamepad2, Check } from 'lucide-react';

export default function CulturalTest() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentCategory, setCurrentCategory] = useState(0);

  const [answers, setAnswers] = useState({
    // Team Dynamics (5 questions)
    team_preference: '',
    conflict_handling: '',
    collaboration_style: '',
    team_contribution: '',
    group_role: '',
    
    // Work Style (5 questions)
    work_life_balance: '',
    work_environment: '',
    deadline_management: '',
    remote_preference: '',
    schedule_flexibility: '',
    
    // Learning & Growth (5 questions)
    learning_preference: '',
    upskill_method: '',
    feedback_preference: '',
    challenge_approach: '',
    mentorship_preference: '',
    
    // Career Goals (5 questions)
    career_focus: '',
    five_year_vision: '',
    leadership_interest: '',
    specialist_generalist: '',
    company_size_preference: '',
    
    // Communication (5 questions)
    communication_style: '',
    meeting_preference: '',
    written_verbal: '',
    presentation_comfort: '',
    update_frequency: ''
  });

  const categories = [
    {
      name: 'Team Dynamics',
      description: 'How you work with others',
      questions: [
        {
          id: 'team_preference',
          question: 'How do you prefer to work on projects?',
          options: ['Independently with autonomy', 'In collaborative teams', 'Mix of solo and team work', 'Leading a team']
        },
        {
          id: 'conflict_handling',
          question: 'How do you handle conflicts in a team?',
          options: ['Address directly and immediately', 'Seek mediation from manager', 'Discuss in team meeting', 'Avoid and focus on work']
        },
        {
          id: 'collaboration_style',
          question: 'What\'s your collaboration approach?',
          options: ['Take initiative and lead', 'Support others\' ideas', 'Contribute equally', 'Follow established direction']
        },
        {
          id: 'team_contribution',
          question: 'How do you contribute to team success?',
          options: ['Drive strategy and vision', 'Ensure execution quality', 'Facilitate communication', 'Provide technical expertise']
        },
        {
          id: 'group_role',
          question: 'What role do you naturally take in groups?',
          options: ['Leader/organizer', 'Creative problem-solver', 'Implementer/executor', 'Supporter/helper']
        }
      ]
    },
    {
      name: 'Work Style',
      description: 'Your work preferences',
      questions: [
        {
          id: 'work_life_balance',
          question: 'How important is work-life balance?',
          options: ['Very important - strict boundaries', 'Important but flexible', 'Moderate - depends on project', 'Work comes first']
        },
        {
          id: 'work_environment',
          question: 'What work environment suits you best?',
          options: ['Fast-paced and dynamic', 'Structured and stable', 'Flexible and creative', 'Quiet and focused']
        },
        {
          id: 'deadline_management',
          question: 'How do you handle tight deadlines?',
          options: ['Thrive under pressure', 'Plan ahead to avoid rush', 'Work extra hours to deliver', 'Negotiate timeline if needed']
        },
        {
          id: 'remote_preference',
          question: 'What\'s your ideal work setup?',
          options: ['Fully remote', 'Hybrid (2-3 days office)', 'Mostly in-office', 'Fully in-office']
        },
        {
          id: 'schedule_flexibility',
          question: 'What schedule do you prefer?',
          options: ['Fixed hours (9-5)', 'Flexible hours (choose start/end)', 'Results-based (no fixed hours)', 'Project-based schedule']
        }
      ]
    },
    {
      name: 'Learning & Growth',
      description: 'How you develop skills',
      questions: [
        {
          id: 'learning_preference',
          question: 'How do you learn best?',
          options: ['Formal training/courses', 'Hands-on practice', 'Self-study and research', 'Mentorship and guidance']
        },
        {
          id: 'upskill_method',
          question: 'How do you stay updated with technology?',
          options: ['Online courses and certifications', 'Side projects and experiments', 'Reading docs and articles', 'Conferences and workshops']
        },
        {
          id: 'feedback_preference',
          question: 'How do you prefer feedback?',
          options: ['Regular structured reviews', 'Continuous informal feedback', 'Occasional check-ins', 'Self-assessment with manager input']
        },
        {
          id: 'challenge_approach',
          question: 'How do you approach new challenges?',
          options: ['Research thoroughly first', 'Jump in and learn by doing', 'Seek guidance from experts', 'Collaborate with team']
        },
        {
          id: 'mentorship_preference',
          question: 'What\'s your mentorship preference?',
          options: ['Need active mentorship', 'Appreciate occasional guidance', 'Prefer independent learning', 'Like to mentor others too']
        }
      ]
    },
    {
      name: 'Career Goals',
      description: 'Your professional aspirations',
      questions: [
        {
          id: 'career_focus',
          question: 'What\'s most important in your career?',
          options: ['Rapid career growth', 'Technical mastery', 'Work-life balance', 'Making impact']
        },
        {
          id: 'five_year_vision',
          question: 'Where do you see yourself in 5 years?',
          options: ['Leadership/management role', 'Senior technical expert', 'Starting own venture', 'Still exploring options']
        },
        {
          id: 'leadership_interest',
          question: 'How interested are you in leadership?',
          options: ['Very interested - want to lead teams', 'Somewhat interested - maybe later', 'Not interested - prefer technical', 'Interested in thought leadership']
        },
        {
          id: 'specialist_generalist',
          question: 'What career path appeals to you?',
          options: ['Deep specialist in one area', 'Generalist across domains', 'T-shaped (deep + broad)', 'Explore different roles']
        },
        {
          id: 'company_size_preference',
          question: 'What company size interests you?',
          options: ['Small startup (10-50)', 'Growing company (50-500)', 'Large corporation (500+)', 'No preference']
        }
      ]
    },
    {
      name: 'Communication',
      description: 'How you interact',
      questions: [
        {
          id: 'communication_style',
          question: 'How do you communicate at work?',
          options: ['Direct and concise', 'Detailed and thorough', 'Collaborative and inclusive', 'Adaptive to audience']
        },
        {
          id: 'meeting_preference',
          question: 'What\'s your meeting preference?',
          options: ['Love brainstorming meetings', 'Prefer async communication', 'Short focused meetings only', 'Regular team syncs']
        },
        {
          id: 'written_verbal',
          question: 'How do you prefer to communicate?',
          options: ['Written (email, docs)', 'Verbal (calls, in-person)', 'Chat/messaging', 'Mix of all']
        },
        {
          id: 'presentation_comfort',
          question: 'How comfortable are you presenting?',
          options: ['Love presenting to large groups', 'Comfortable with small groups', 'Prefer written communication', 'Willing but need preparation']
        },
        {
          id: 'update_frequency',
          question: 'How often should you update stakeholders?',
          options: ['Daily standups', 'Weekly updates', 'Milestone-based', 'When asked']
        }
      ]
    },
    {
      name: 'Gamified Assessment',
      description: 'Interactive games and challenges',
      questions: []
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Check if all questions are answered
    const unanswered = Object.values(answers).filter(a => !a).length;
    if (unanswered > 0) {
      setError(`Please answer all questions (${unanswered} remaining)`);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/student/cultural-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers)
      });

      if (response.ok) {
        alert('Cultural fitness test completed successfully!');
        router.push('/student/dashboard');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to submit test');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentCategoryData = categories[currentCategory];
  
  // Calculate overall progress based on answered questions across all categories
  const totalQuestions = categories.reduce((sum, cat) => sum + cat.questions.length, 0);
  const answeredQuestions = Object.values(answers).filter(answer => answer && answer.trim() !== '').length;
  const progress = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;
  
  // Category-specific progress
  const answeredInCategory = currentCategoryData.questions.length > 0 
    ? currentCategoryData.questions.filter(q => answers[q.id]).length 
    : 0;
  const totalInCategory = currentCategoryData.questions.length;

  const Question = ({ id, question, options }) => (
    <div className="mb-10 p-6 bg-white/[0.01] border border-white/5 rounded-2xl">
      <label className="block text-white font-bold mb-5 text-lg">{question}</label>
      <div className="space-y-3">
        {options.map((option) => {
          const isSelected = answers[id] === option;
          return (
            <label 
              key={option} 
              className={`flex items-center p-4 rounded-xl cursor-pointer transition-all border ${
                isSelected 
                  ? 'border-white bg-white/10' 
                  : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/30'
              }`}
              onClick={(e) => {
                e.preventDefault();
                setAnswers({ ...answers, [id]: option });
              }}
            >
              <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${isSelected ? 'border-white bg-white text-black' : 'border-white/30'}`}>
                {isSelected && <Check size={12} strokeWidth={4} />}
              </div>
              <span className={`font-medium ${isSelected ? 'text-white' : 'text-gray-300'}`}>{option}</span>
            </label>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative font-sans text-gray-200">
      <AnimatedCyberBackground />
      <Sidebar role="student" />
      
      <div className="ml-[260px] relative z-10 pb-20">
        {/* Header */}
        <header className="border-b border-white/5 bg-[#050505]/50 backdrop-blur-xl sticky top-0 z-20">
          <div className="max-w-4xl mx-auto px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                  <BrainCircuit size={28} className="text-white/70" />
                  Cultural Fitness Test
                </h1>
                <p className="text-gray-400 font-medium mt-1">25 questions to understand your work preferences.</p>
              </div>
              <button
                onClick={() => router.push('/student/dashboard')}
                className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold border border-white/10 flex items-center gap-2 text-sm transition-colors"
              >
                <ArrowLeft size={18} /> Back
              </button>
            </div>
          </div>
        </header>

        <PageTransition className="max-w-4xl mx-auto px-8 py-10">
          {/* Progress Bar */}
          <AnimatedCard index={0} className="mb-8 p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Overall Progress</span>
              <span className="text-gray-400 text-sm font-medium">{answeredQuestions} / {totalQuestions} answered</span>
            </div>
            <div className="w-full bg-[#0a0a0a] rounded-full h-1.5 border border-white/10 overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-500 ease-out"
                style={{ width: `${progress}%`, boxShadow: '0 0 10px rgba(255,255,255,0.5)' }}
              ></div>
            </div>
            <div className="mt-3 text-right">
              <span className="text-xl font-light text-white">{Math.round(progress)}%</span>
            </div>
          </AnimatedCard>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat, idx) => {
              const categoryAnswered = cat.questions.filter(q => answers[q.id]).length;
              const categoryTotal = cat.questions.length;
              const isComplete = categoryTotal > 0 && categoryAnswered === categoryTotal;
              const isActive = currentCategory === idx;
              
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentCategory(idx)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border ${
                    isActive
                      ? `bg-white text-black border-white`
                      : isComplete
                      ? 'bg-[#0a0a0a] text-white border-white/30 hover:bg-white/10 flex items-center gap-2'
                      : 'bg-[#050505] text-gray-500 border-white/10 hover:border-white/30 hover:text-gray-300'
                  }`}
                >
                  {isComplete && !isActive && <CheckCircle size={14} className="text-white" />}
                  {cat.name} {categoryTotal > 0 && `(${categoryAnswered}/${categoryTotal})`}
                </button>
              );
            })}
          </div>

          <AnimatedCard index={1} className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl">
            {error && (
              <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl font-medium flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                {error}
              </div>
            )}

            {/* Category Header */}
            <div className="mb-10 pb-6 border-b border-white/5">
              <h2 className="text-2xl font-bold text-white mb-2">{currentCategoryData.name}</h2>
              <p className="text-gray-400 text-sm">{currentCategoryData.description}</p>
              {currentCategoryData.questions.length > 0 && (
                <div className="mt-6">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                    <span>Category Progress</span>
                    <span>{answeredInCategory} / {totalInCategory}</span>
                  </div>
                  <div className="w-full bg-[#0a0a0a] rounded-full h-1 border border-white/5">
                    <div
                      className={`h-full bg-white transition-all duration-300 ease-out`}
                      style={{ width: `${(answeredInCategory / totalInCategory) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Questions or Gamified Section */}
            <form onSubmit={handleSubmit}>
              {currentCategoryData.questions.length > 0 ? (
                <div className="space-y-6">
                  {currentCategoryData.questions.map((q) => (
                    <Question key={q.id} {...q} />
                  ))}
                </div>
              ) : (
                /* Gamified Assessment Placeholder */
                <div className="text-center py-16">
                  <div className="mb-6">
                    <Gamepad2 size={64} className="mx-auto text-white/20 mb-6" />
                    <h3 className="text-2xl font-bold text-white mb-3">Gamified Assessment Section</h3>
                    <p className="text-gray-400 text-sm mb-8">Interactive games and challenges will be available here.</p>
                  </div>
                  
                  {/* Results Section Placeholder */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-lg mx-auto">
                    <h4 className="text-lg font-bold text-white mb-6 flex items-center justify-center gap-2">
                      <BrainCircuit size={18} className="text-white/50" /> Assessment Results
                    </h4>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6">
                        <div className="text-4xl font-light text-white tracking-tight mb-2">0</div>
                        <div className="text-xs font-bold uppercase tracking-widest text-gray-500">Games Done</div>
                      </div>
                      <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6">
                        <div className="text-4xl font-light text-white tracking-tight mb-2">0%</div>
                        <div className="text-xs font-bold uppercase tracking-widest text-gray-500">Overall Score</div>
                      </div>
                    </div>
                    <p className="text-gray-500 text-xs italic">Results will be displayed here after completion.</p>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="mt-10 pt-8 border-t border-white/5 flex flex-wrap justify-between items-center gap-4">
                <div className="flex gap-3">
                  {currentCategory > 0 && (
                    <button
                      type="button"
                      onClick={() => setCurrentCategory(currentCategory - 1)}
                      className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold text-sm transition-colors flex items-center gap-2"
                    >
                      <ChevronLeft size={16} /> Previous
                    </button>
                  )}
                </div>

                <div className="flex gap-3 ml-auto">
                  {currentCategory < categories.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentCategory(currentCategory + 1)}
                      className="px-6 py-3 bg-white text-black hover:bg-gray-200 rounded-xl font-bold text-sm transition-colors flex items-center gap-2"
                    >
                      Next Category <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading || Object.values(answers).filter(a => !a).length > 0}
                      className="px-8 py-3 bg-white text-black hover:bg-gray-200 rounded-xl font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {loading ? 'Submitting...' : 'Submit Assessment'} <CheckCircle size={16} />
                    </button>
                  )}
                </div>
              </div>
            </form>
          </AnimatedCard>
        </PageTransition>
      </div>
    </div>
  );
}
