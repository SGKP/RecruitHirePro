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
  const progress = ((currentCategory + 1) / categories.length) * 100;
  const answeredInCategory = currentCategoryData.questions.filter(q => answers[q.id]).length;
  const totalInCategory = currentCategoryData.questions.length;

  const Question = ({ id, question, options }) => (
    <div className="mb-6">
      <label className="block text-gray-200 font-medium mb-3 text-lg">{question}</label>
      <div className="space-y-3">
        {options.map((option) => (
          <label 
            key={option} 
            className={`flex items-center p-4 card-modern cursor-pointer transition-all hover:scale-[1.02] ${
              answers[id] === option ? 'border-2 border-green-400 bg-green-500/20' : 'border border-gray-600'
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
              className="mr-3 text-green-500 pointer-events-none w-5 h-5"
            />
            <span className="text-gray-200">{option}</span>
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
        <header className="navbar-modern border-b border-gray-700">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-2xl font-bold text-gradient">Cultural Fitness Test</h1>
            <p className="text-gray-300 mt-1">25 questions to understand your work preferences</p>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-300 text-sm font-medium">Overall Progress</span>
            <span className="text-gray-300 text-sm">{currentCategory + 1} / {categories.length} categories</span>
          </div>
          <div className="w-full bg-gray-700/50 rounded-full h-3">
            <div
              className="h-3 rounded-full transition-all bg-gradient-to-r from-green-500 to-purple-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((cat, idx) => {
            const categoryAnswered = cat.questions.filter(q => answers[q.id]).length;
            const categoryTotal = cat.questions.length;
            const isComplete = categoryAnswered === categoryTotal;
            
            return (
              <button
                key={idx}
                onClick={() => setCurrentCategory(idx)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  currentCategory === idx
                    ? `btn-primary`
                    : isComplete
                    ? 'bg-green-500/20 border border-green-400 text-green-200 hover:bg-green-500/30'
                    : 'btn-secondary'
                }`}
              >
                {cat.name} ({categoryAnswered}/{categoryTotal})
              </button>
            );
          })}
        </div>

        <div className="card-modern p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg">
              {error}
            </div>
          )}

          {/* Category Header */}
          <div className="mb-8 pb-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-gradient mb-2">{currentCategoryData.name}</h2>
            <p className="text-gray-400">{currentCategoryData.description}</p>
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-400 mb-1">
                <span>Category Progress</span>
                <span>{answeredInCategory} / {totalInCategory} answered</span>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all bg-${currentCategoryData.color}-500`}
                  style={{ width: `${(answeredInCategory / totalInCategory) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Questions */}
          <form onSubmit={handleSubmit}>
            {currentCategoryData.questions.map((q) => (
              <Question key={q.id} {...q} />
            ))}

            {/* Navigation */}
            <div className="mt-8 flex justify-between items-center pt-6 border-t border-gray-700">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => router.push('/student/dashboard')}
                  className="btn-secondary"
                >
                  Back to Dashboard
                </button>
                {currentCategory > 0 && (
                  <button
                    type="button"
                    onClick={() => setCurrentCategory(currentCategory - 1)}
                    className="btn-secondary"
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
                    className="btn-primary"
                  >
                    Next Category
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading || Object.values(answers).filter(a => !a).length > 0}
                    className="btn-primary disabled:opacity-50"
                  >
                    {loading ? 'Submitting...' : 'Submit Test'}
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
