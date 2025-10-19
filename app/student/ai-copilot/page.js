'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default function AITalentCopilot() {
  const router = useRouter();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI Career Coach. I can help you with job matching, skill assessment, interview preparation, and career advice. What would you like to explore today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchStudentData();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchStudentData = async () => {
    try {
      const response = await fetch('/api/student/profile', {
        credentials: 'include',
      });
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login?role=student');
          return;
        }
        throw new Error('Failed to fetch profile');
      }
      const data = await response.json();
      setStudent(data.student);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAIResponse = async (userMessage) => {
    // Simulated AI responses based on student data
    const lowerMessage = userMessage.toLowerCase();
    
    let response = '';

    if (lowerMessage.includes('skill') || lowerMessage.includes('learn')) {
      const skills = student?.skills || [];
      response = `📊 **Skill Analysis:**\n\nYou currently have ${skills.length} skills in your profile. Based on market demand:\n\n**Your Strengths:**\n${skills.slice(0, 5).map(s => `✓ ${s}`).join('\n')}\n\n**Recommended to Learn:**\n• Cloud Computing (AWS/Azure)\n• Machine Learning\n• System Design\n• DevOps (Docker, Kubernetes)\n\nThese skills are in high demand and will increase your match rate by 25-40%.`;
    } 
    else if (lowerMessage.includes('career') || lowerMessage.includes('path')) {
      response = `🎯 **Career Path Recommendation:**\n\nBased on your profile (GPA: ${student?.gpa || 'N/A'}, Skills: ${student?.skills?.length || 0}), I recommend:\n\n**Short-term (0-2 years):**\n1. Software Engineer - Entry Level\n2. Full Stack Developer\n3. Frontend Developer\n\n**Mid-term (2-5 years):**\n• Senior Engineer\n• Tech Lead\n• Solution Architect\n\n**Focus Areas:**\n• Build 3-5 strong projects\n• Contribute to open source\n• Get certified in cloud platforms`;
    }
    else if (lowerMessage.includes('interview') || lowerMessage.includes('prepare')) {
      response = `💼 **Interview Preparation Guide:**\n\n**For Technical Interviews:**\n1. Practice 50+ LeetCode problems (Easy → Medium)\n2. Master system design basics\n3. Review your projects deeply\n\n**For Cultural Fit:**\nBased on your cultural test (Retention: ${student?.retention_score || 'Not taken'}%), emphasize:\n• Teamwork experiences\n• Learning from failures\n• Adaptability examples\n\n**Common Questions:**\n• "Tell me about yourself" - 2 min pitch\n• "Why this company?" - Research thoroughly\n• "Biggest challenge?" - Use STAR method`;
    }
    else if (lowerMessage.includes('resume') || lowerMessage.includes('cv')) {
      response = `📝 **Resume Improvement Tips:**\n\n**Current Status:**\n• Skills listed: ${student?.skills?.length || 0}\n• Achievements: ${student?.achievements?.length || 0}\n• GPA: ${student?.gpa || 'N/A'}\n\n**Improvements:**\n1. Add quantifiable achievements (increased by X%, reduced by Y%)\n2. Use action verbs (Developed, Implemented, Optimized)\n3. Include project metrics (users, performance, scale)\n4. Highlight leadership roles\n5. Add certifications/courses\n\n**Format:**\n• Keep it 1 page\n• Use bullet points\n• Reverse chronological order\n• ATS-friendly (no tables/graphics)`;
    }
    else if (lowerMessage.includes('job') || lowerMessage.includes('match')) {
      response = `🎯 **Job Matching Insights:**\n\n**Your Profile Strength:** ${calculateProfileStrength()}%\n\n**Best Matches:**\n1. Entry-level Software Engineer (85% match)\n2. Full Stack Developer (78% match)\n3. Backend Developer (72% match)\n\n**Why these matches?**\n• Your skills align with requirements\n• GPA meets criteria\n• Cultural fit score is strong\n\n**To improve matches:**\n• Complete cultural test if not done\n• Add more projects\n• Learn trending technologies\n• Connect GitHub (shows coding activity)`;
    }
    else if (lowerMessage.includes('salary') || lowerMessage.includes('compensation')) {
      response = `💰 **Salary Expectations:**\n\nBased on your profile:\n\n**Entry Level (0-2 years):**\n• Software Engineer: $70,000 - $95,000\n• Full Stack Developer: $75,000 - $100,000\n• Frontend Developer: $65,000 - $90,000\n\n**Factors affecting salary:**\n✓ Skills (${student?.skills?.length || 0} currently)\n✓ GPA (${student?.gpa || 'N/A'})\n✓ Projects quality\n✓ Company size & location\n✓ Negotiation skills\n\n**Tip:** Never reveal expected salary first. Research company ranges and ask about their budget.`;
    }
    else {
      response = `🤔 I understand you're asking about "${userMessage}".\n\nI can help you with:\n\n1. **Skills Analysis** - What to learn next\n2. **Career Planning** - Short & long-term paths\n3. **Interview Prep** - Technical & behavioral\n4. **Resume Tips** - Make it stand out\n5. **Job Matching** - Find best opportunities\n6. **Salary Guidance** - Know your worth\n\nWhich area interests you most?`;
    }

    return response;
  };

  const calculateProfileStrength = () => {
    if (!student) return 0;
    
    let strength = 0;
    if (student.skills?.length > 0) strength += 30;
    if (student.skills?.length > 5) strength += 20;
    if (student.gpa >= 3.5) strength += 20;
    if (student.gpa >= 3.0) strength += 10;
    if (student.achievements?.length > 0) strength += 10;
    if (student.github_username) strength += 10;
    if (student.cultural_test_completed) strength += 20;
    
    return Math.min(strength, 100);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      role: 'user',
      content: inputMessage
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking delay
    setTimeout(async () => {
      const aiResponse = await generateAIResponse(inputMessage);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: aiResponse
      }]);
      setIsTyping(false);
    }, 1500);
  };

  const quickQuestions = [
    "What skills should I learn?",
    "How can I improve my resume?",
    "What's my career path?",
    "Prepare me for interviews",
    "Show me job matches"
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-300 text-xl">Loading AI Co-Pilot...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Sidebar role="student" />
      <div className="ml-64">
        {/* Header */}
        <header className="bg-gradient-to-r from-purple-900 via-purple-800 to-pink-900 border-b border-purple-500/50 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  <span className="text-4xl">🤖</span>
                  AI Talent Co-Pilot
                </h1>
                <p className="text-purple-200 mt-1">Your personal AI career coach & advisor</p>
              </div>
              <button
                onClick={() => router.push('/student/dashboard')}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium border border-white/30 transition-all"
              >
                ← Back
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Chat Container */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-6 border border-purple-500/30 shadow-xl" style={{ height: '550px', display: 'flex', flexDirection: 'column' }}>
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl p-4 shadow-lg ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-2 border-purple-500/30 text-white backdrop-blur-sm'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-medium leading-relaxed">{msg.content}</div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-2 border-purple-500/30 rounded-xl p-4 backdrop-blur-sm">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-purple-500/30 pt-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me anything about your career..."
                className="flex-1 px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-gray-400 backdrop-blur-sm focus:border-purple-400 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
              >
                Send ✨
              </button>
            </div>
          </div>
        </div>

        {/* Quick Questions */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 mb-6 border border-purple-500/30 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>⚡</span> Quick Questions
          </h3>
          <div className="flex flex-wrap gap-3">
            {quickQuestions.map((question, idx) => (
              <button
                key={idx}
                onClick={() => setInputMessage(question)}
                className="px-5 py-3 bg-gradient-to-r from-purple-600/30 to-pink-600/30 border-2 border-purple-500/50 text-white rounded-xl hover:from-purple-600/50 hover:to-pink-600/50 hover:scale-105 transition-all font-medium shadow-lg"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Features Info */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-700/20 border-2 border-blue-500/30 backdrop-blur-sm rounded-xl p-8 text-center hover:scale-105 transition-transform shadow-xl">
            <div className="text-5xl mb-4">🎯</div>
            <h4 className="font-bold text-white text-lg mb-3">Predictive Analysis</h4>
            <p className="text-blue-200">AI predicts your potential and suggests improvements</p>
          </div>
          <div className="bg-gradient-to-br from-purple-600/20 to-purple-700/20 border-2 border-purple-500/30 backdrop-blur-sm rounded-xl p-8 text-center hover:scale-105 transition-transform shadow-xl">
            <div className="text-5xl mb-4">📚</div>
            <h4 className="font-bold text-white text-lg mb-3">Personalized Coaching</h4>
            <p className="text-purple-200">Get tailored advice based on your unique profile</p>
          </div>
          <div className="bg-gradient-to-br from-pink-600/20 to-pink-700/20 border-2 border-pink-500/30 backdrop-blur-sm rounded-xl p-8 text-center hover:scale-105 transition-transform shadow-xl">
            <div className="text-5xl mb-4">💼</div>
            <h4 className="font-bold text-white text-lg mb-3">Career Guidance</h4>
            <p className="text-pink-200">Real-time insights for your career journey</p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
