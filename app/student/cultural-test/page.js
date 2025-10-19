'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

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
      color: 'green',
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
      color: 'purple',
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
      color: 'blue',
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
      color: 'orange',
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
      color: 'pink',
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
      color: 'indigo',
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
    <div className="mb-8">
      <label className="block text-white font-semibold mb-4 text-lg">{question}</label>
      <div className="space-y-3">
        {options.map((option) => (
          <label 
            key={option} 
            className={`flex items-center p-4 rounded-xl cursor-pointer transition-all transform hover:scale-[1.02] hover:-translate-y-1 ${
              answers[id] === option 
                ? 'border-2 border-purple-400 bg-purple-500/30 shadow-lg shadow-purple-500/50 backdrop-blur-sm' 
                : 'border-2 border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-sm'
            }`}
            onClick={(e) => {
              e.preventDefault();
              setAnswers({ ...answers, [id]: option });
            }}
          >
            <input
              type="radio"
              name={id}
              value={option}
              checked={answers[id] === option}
              onChange={() => {}}
              className="mr-4 text-purple-600 pointer-events-none w-5 h-5"
            />
            <span className="text-white font-medium">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <Sidebar role="student" />
      <div className="ml-64">
        {/* Header */}
        <header className="bg-gradient-to-r from-purple-900 via-purple-800 to-pink-900 border-b border-purple-500/50 shadow-lg">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <span className="text-4xl">🎯</span>
              Cultural Fitness Test
            </h1>
            <p className="text-purple-200 mt-1">25 questions to understand your work preferences</p>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-purple-500/30 shadow-xl">
          <div className="flex justify-between items-center mb-3">
            <span className="text-white text-sm font-semibold">Overall Progress</span>
            <span className="text-purple-300 text-sm font-medium">{answeredQuestions} / {totalQuestions} questions answered</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
            <div
              className="h-4 rounded-full transition-all bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 shadow-lg"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="mt-2 text-right">
            <span className="text-2xl font-bold text-white">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {categories.map((cat, idx) => {
            const categoryAnswered = cat.questions.filter(q => answers[q.id]).length;
            const categoryTotal = cat.questions.length;
            const isComplete = categoryAnswered === categoryTotal;
            
            return (
              <button
                key={idx}
                onClick={() => setCurrentCategory(idx)}
                className={`px-5 py-3 rounded-xl whitespace-nowrap transition-all font-bold shadow-lg text-base ${
                  currentCategory === idx
                    ? `bg-gradient-to-r from-purple-600 to-pink-600 text-white border-2 border-purple-400`
                    : isComplete
                    ? 'bg-gradient-to-r from-green-600 to-green-700 text-white border-2 border-green-400 hover:from-green-700 hover:to-green-800'
                    : 'bg-gradient-to-r from-gray-600 to-gray-700 border-2 border-gray-500 text-white hover:from-gray-500 hover:to-gray-600'
                }`}
              >
                {cat.name} ({categoryAnswered}/{categoryTotal})
              </button>
            );
          })}
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border border-purple-500/30 shadow-xl">
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border-2 border-red-400/50 text-red-200 rounded-xl backdrop-blur-sm">
              {error}
            </div>
          )}

          {/* Category Header */}
          <div className="mb-8 pb-6 border-b border-purple-500/30">
            <h2 className="text-3xl font-bold text-white mb-2">{currentCategoryData.name}</h2>
            <p className="text-gray-300 text-lg">{currentCategoryData.description}</p>
            {currentCategoryData.questions.length > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-200 font-semibold mb-2">
                  <span>Category Progress</span>
                  <span>{answeredInCategory} / {totalInCategory} answered</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all bg-gradient-to-r from-green-500 to-green-600 shadow-lg`}
                    style={{ width: `${(answeredInCategory / totalInCategory) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Questions or Gamified Section */}
          <form onSubmit={handleSubmit}>
            {currentCategoryData.questions.length > 0 ? (
              currentCategoryData.questions.map((q) => (
                <Question key={q.id} {...q} />
              ))
            ) : (
              /* Gamified Assessment Placeholder */
              <div className="text-center py-16">
                <div className="mb-6">
                  <div className="text-8xl mb-4">🎮</div>
                  <h3 className="text-3xl font-bold text-white mb-3">Gamified Assessment Section</h3>
                  <p className="text-gray-300 text-lg mb-8">Interactive games and challenges will be added here</p>
                </div>
                
                {/* Results Section Placeholder */}
                <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border-2 border-indigo-500/30 rounded-xl p-8 max-w-2xl mx-auto backdrop-blur-sm">
                  <h4 className="text-2xl font-bold text-white mb-4 flex items-center justify-center gap-2">
                    <span>📊</span> Assessment Results
                  </h4>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                      <div className="text-4xl font-bold text-green-400">0</div>
                      <div className="text-sm text-gray-300">Games Completed</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                      <div className="text-4xl font-bold text-blue-400">0%</div>
                      <div className="text-sm text-gray-300">Overall Score</div>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm italic">Results will be displayed here after completion</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-8 flex justify-between items-center pt-6 border-t border-purple-500/30">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => router.push('/student/dashboard')}
                  className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium border border-white/30 transition-all"
                >
                  Back to Dashboard
                </button>
                {currentCategory > 0 && (
                  <button
                    type="button"
                    onClick={() => setCurrentCategory(currentCategory - 1)}
                    className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium border border-white/30 transition-all"
                  >
                    Previous Category
                  </button>
                )}
              </div>

              <div className="flex gap-3">
                {currentCategory < categories.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentCategory(currentCategory + 1)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    Next Category →
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading || Object.values(answers).filter(a => !a).length > 0}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-bold hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                  >
                    {loading ? 'Submitting...' : '✓ Submit Test'}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
      </div>
    </div>
  );
}
