import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import connectDB from '@/lib/mongodb';
import Student from '@/models/Student';
import Job from '@/models/Job';
import User from '@/models/User';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { calculateSemanticSkillMatch } from '@/lib/skillSemantics';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function GET(request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    
    if (decoded.role !== 'recruiter') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const job_id = searchParams.get('job_id');
    const min_match_score = searchParams.get('min_match_score');
    const min_retention_score = searchParams.get('min_retention_score');
    const min_gpa = searchParams.get('min_gpa');
    const max_gpa = searchParams.get('max_gpa');
    const degree = searchParams.get('degree');
    const university = searchParams.get('university');
    const skills = searchParams.get('skills');
    const graduation_year = searchParams.get('graduation_year');
    const min_github_repos = searchParams.get('min_github_repos');
    const location = searchParams.get('location');
    const interests = searchParams.get('interests');

    await connectDB();

    const job = await Job.findById(job_id);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Get all students
    const students = await Student.find().populate('user_id');

    // Calculate match scores for each student (with AI-powered retention)
    const candidatesWithScores = await Promise.all(students.map(async student => {
      // ✨ SEMANTIC SKILL MATCHING - Understands related skills
      const studentSkills = student.resume_parsed_data?.skills || [];
      const requiredSkills = job.required_skills || [];
      
      // Use semantic matching instead of simple keyword matching
      const skillMatchResult = calculateSemanticSkillMatch(requiredSkills, studentSkills);
      const skillMatchScore = skillMatchResult.score;
      const matchedSkills = skillMatchResult.matchedSkills;
      const unmatchedSkills = skillMatchResult.unmatchedSkills;

      // Extract education data
      const education = student.resume_parsed_data?.education || {};
      const studentGPA = education.gpa ? parseFloat(education.gpa) : null;
      const studentDegree = education.degree || '';
      const studentGradYear = education.graduation_year || null;

      // Match score is based ONLY on skills
      const match_score = skillMatchScore;

      // ✨ AI-POWERED RETENTION SCORE CALCULATION ✨
      const retentionResult = await calculateAIRetentionScore(student.cultural_fitness);
      const retentionScore = retentionResult.score;
      const retentionReasoning = retentionResult.reasoning;
      const aiPowered = retentionResult.ai_powered;

      return {
        student_id: student._id.toString(),
        name: student.user_id?.name || 'N/A',
        email: student.user_id?.email || 'N/A',
        gpa: education.gpa || 'N/A',
        graduation_year: education.graduation_year || 'N/A',
        degree: education.degree || 'N/A',
        university: education.university || 'N/A',
        phone: student.phone || 'N/A',
        linkedin_url: student.linkedin_url || null,
        current_year: student.current_year || 'N/A',
        achievements: student.achievements || [],
        match_score: Math.round(match_score),
        retention_score: Math.round(retentionScore),
        retention_reasoning: retentionReasoning,
        ai_powered: aiPowered,
        skills: studentSkills,
        matched_skills: matchedSkills,
        unmatched_skills: unmatchedSkills, // Show which skills are missing
        resume_url: student.resume_url,
        github_username: student.github_data?.username,
        github_repos: student.github_data?.repos_count || 0,
        gpa_numeric: studentGPA,
        location: student.location || 'N/A',
        interests: student.interests || []
      };
    }));

    // Apply filters
    let filteredCandidates = candidatesWithScores;

    // Match score filter
    if (min_match_score) {
      filteredCandidates = filteredCandidates.filter(
        c => c.match_score >= parseInt(min_match_score)
      );
    }

    // Retention score filter
    if (min_retention_score) {
      filteredCandidates = filteredCandidates.filter(
        c => c.retention_score >= parseInt(min_retention_score)
      );
    }

    // GPA range filters
    if (min_gpa) {
      filteredCandidates = filteredCandidates.filter(
        c => c.gpa_numeric !== null && c.gpa_numeric >= parseFloat(min_gpa)
      );
    }

    if (max_gpa) {
      filteredCandidates = filteredCandidates.filter(
        c => c.gpa_numeric !== null && c.gpa_numeric <= parseFloat(max_gpa)
      );
    }

    // Degree filter (case-insensitive partial match)
    if (degree) {
      filteredCandidates = filteredCandidates.filter(
        c => c.degree && c.degree.toLowerCase().includes(degree.toLowerCase())
      );
    }

    // University filter (case-insensitive partial match)
    if (university) {
      filteredCandidates = filteredCandidates.filter(
        c => c.university && c.university.toLowerCase().includes(university.toLowerCase())
      );
    }

    // Skills filter (comma-separated, check if candidate has ANY of the listed skills)
    if (skills) {
      const requiredSkillsList = skills.split(',').map(s => s.trim().toLowerCase());
      filteredCandidates = filteredCandidates.filter(c => {
        const candidateSkills = c.skills.map(s => s.toLowerCase());
        return requiredSkillsList.some(reqSkill => 
          candidateSkills.some(candSkill => candSkill.includes(reqSkill))
        );
      });
    }

    // Graduation year filter (exact match)
    if (graduation_year) {
      filteredCandidates = filteredCandidates.filter(
        c => c.graduation_year && c.graduation_year.toString() === graduation_year
      );
    }

    // GitHub repositories filter
    if (min_github_repos) {
      filteredCandidates = filteredCandidates.filter(
        c => c.github_repos >= parseInt(min_github_repos)
      );
    }

    // Location filter (case-insensitive partial match)
    if (location) {
      filteredCandidates = filteredCandidates.filter(
        c => c.location && c.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Interests filter (comma-separated, check if candidate has ANY of the listed interests)
    if (interests) {
      const requiredInterestsList = interests.split(',').map(i => i.trim().toLowerCase());
      filteredCandidates = filteredCandidates.filter(c => {
        if (!c.interests || c.interests.length === 0) return false;
        const candidateInterests = Array.isArray(c.interests) 
          ? c.interests.map(i => i.toLowerCase())
          : [c.interests.toLowerCase()];
        return requiredInterestsList.some(reqInterest => 
          candidateInterests.some(candInterest => candInterest.includes(reqInterest))
        );
      });
    }

    // Sort by match score (highest first), then by GPA as tie-breaker
    filteredCandidates.sort((a, b) => {
      // First, sort by match score
      if (b.match_score !== a.match_score) {
        return b.match_score - a.match_score;
      }
      // If match scores are equal, use GPA as tie-breaker
      const gpaA = a.gpa_numeric || 0;
      const gpaB = b.gpa_numeric || 0;
      return gpaB - gpaA;
    });

    return NextResponse.json({
      job: {
        id: job._id,
        title: job.title,
        required_skills: job.required_skills
      },
      candidates: filteredCandidates,
      total: filteredCandidates.length
    });

  } catch (error) {
    console.error('Search Candidates API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// AI-Powered Retention Score Calculation using Gemini
async function calculateAIRetentionScore(culturalFitness) {
  if (!culturalFitness) {
    return {
      score: 50,
      reasoning: 'No cultural fitness data available',
      ai_powered: false
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = `Analyze this candidate's cultural fitness profile and predict retention probability (0-100).

PROFILE:
Team: ${culturalFitness.team_preference || 'N/A'}, Conflict: ${culturalFitness.conflict_handling || 'N/A'}, Collaboration: ${culturalFitness.collaboration_style || 'N/A'}
Work-Life: ${culturalFitness.work_life_balance || 'N/A'}, Environment: ${culturalFitness.work_environment || 'N/A'}
Learning: ${culturalFitness.learning_preference || 'N/A'}, Feedback: ${culturalFitness.feedback_preference || 'N/A'}
Career: ${culturalFitness.career_focus || 'N/A'}, Vision: ${culturalFitness.five_year_vision || 'N/A'}
Communication: ${culturalFitness.communication_style || 'N/A'}

Respond with ONLY a JSON object:
{"score": <0-100>, "reason": "<brief 1-sentence reason>"}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse response
    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const aiResult = JSON.parse(cleanText);

    return {
      score: Math.max(0, Math.min(100, aiResult.score || 50)),
      reasoning: aiResult.reason || 'AI analysis completed',
      ai_powered: true
    };

  } catch (error) {
    console.error('AI Retention Error:', error);
    // Fallback to basic calculation
    return calculateFallbackRetention(culturalFitness);
  }
}

// Fallback calculation if AI fails
function calculateFallbackRetention(culturalFitness) {
  let score = 50;
  const strengths = [];
  const concerns = [];
  
  if (!culturalFitness) {
    return { 
      score: 50, 
      reasoning: 'No cultural fitness assessment completed. Score based on baseline metrics only.', 
      ai_powered: false 
    };
  }
  
  // Team dynamics (25 points)
  if (culturalFitness.collaboration_style?.includes('Contribute equally')) {
    score += 5;
    strengths.push('balanced team collaboration');
  }
  if (culturalFitness.collaboration_style?.includes('Take initiative')) {
    score += 5;
    strengths.push('proactive leadership');
  }
  if (culturalFitness.conflict_handling?.includes('Address directly')) {
    score += 5;
    strengths.push('direct conflict resolution');
  } else if (culturalFitness.conflict_handling?.includes('Avoid')) {
    concerns.push('may avoid confrontation');
  }
  if (culturalFitness.team_preference?.toLowerCase().includes('collaborative')) {
    score += 5;
    strengths.push('team-oriented mindset');
  }
  if (culturalFitness.group_role) {
    score += 5;
  }
  
  // Work style (20 points)
  if (culturalFitness.work_life_balance?.includes('Important') || culturalFitness.work_life_balance?.includes('priority')) {
    score += 5;
    strengths.push('values work-life balance');
  }
  if (culturalFitness.work_environment) {
    score += 5;
    if (culturalFitness.work_environment.toLowerCase().includes('flexible') || 
        culturalFitness.work_environment.toLowerCase().includes('remote')) {
      strengths.push('adaptable work style');
    }
  }
  if (culturalFitness.deadline_management) {
    score += 5;
  }
  if (culturalFitness.schedule_flexibility) {
    score += 5;
  }
  
  // Learning & growth (25 points)
  if (culturalFitness.learning_preference) {
    score += 5;
    if (culturalFitness.learning_preference.toLowerCase().includes('hands-on') || 
        culturalFitness.learning_preference.toLowerCase().includes('practical')) {
      strengths.push('hands-on learner');
    }
  }
  if (culturalFitness.feedback_preference?.includes('Regular')) {
    score += 5;
    strengths.push('seeks regular feedback');
  }
  if (culturalFitness.feedback_preference?.includes('Continuous')) {
    score += 5;
    strengths.push('growth-oriented mindset');
  }
  if (culturalFitness.challenge_approach) {
    score += 5;
  }
  if (culturalFitness.mentorship_preference) {
    score += 5;
  }
  
  // Career goals (10 points)
  if (culturalFitness.five_year_vision) {
    score += 5;
    strengths.push('clear career vision');
  } else {
    concerns.push('unclear long-term goals');
  }
  if (culturalFitness.leadership_interest) {
    score += 5;
    if (culturalFitness.leadership_interest.toLowerCase().includes('yes') || 
        culturalFitness.leadership_interest.toLowerCase().includes('interested')) {
      strengths.push('leadership ambitions');
    }
  }
  
  // Build personalized reasoning
  let reasoning = '';
  
  if (score >= 80) {
    reasoning = '🌟 Strong cultural fit. ';
  } else if (score >= 65) {
    reasoning = '✅ Good cultural alignment. ';
  } else if (score >= 50) {
    reasoning = '⚖️ Moderate fit. ';
  } else {
    reasoning = '⚠️ Limited cultural data. ';
  }
  
  if (strengths.length > 0) {
    reasoning += `Key strengths: ${strengths.slice(0, 3).join(', ')}.`;
  }
  
  if (concerns.length > 0 && score < 70) {
    reasoning += ` Areas to explore: ${concerns.join(', ')}.`;
  }
  
  if (strengths.length === 0 && concerns.length === 0) {
    reasoning += 'Standard cultural assessment completed.';
  }
  
  return {
    score: Math.min(score, 100),
    reasoning: reasoning.trim(),
    ai_powered: false
  };
}
