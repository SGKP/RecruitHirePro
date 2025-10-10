import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import connectDB from '@/lib/mongodb';
import Student from '@/models/Student';
import Job from '@/models/Job';
import User from '@/models/User';

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

    // Calculate match scores for each student
    const candidatesWithScores = students.map(student => {
      // Calculate skill match score (100% of match score)
      const studentSkills = student.resume_parsed_data?.skills || [];
      const requiredSkills = job.required_skills || [];
      
      const matchedSkills = requiredSkills.filter(skill =>
        studentSkills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
      );
      
      const skillMatchScore = requiredSkills.length > 0
        ? (matchedSkills.length / requiredSkills.length) * 100
        : 0;

      // Extract education data
      const education = student.resume_parsed_data?.education || {};
      const studentGPA = education.gpa ? parseFloat(education.gpa) : null;
      const studentDegree = education.degree || '';
      const studentGradYear = education.graduation_year || null;

      // Match score is based ONLY on skills
      const match_score = skillMatchScore;

      // Calculate retention score based on cultural fitness
      let retentionScore = 50; // Base score
      
      if (student.cultural_fitness) {
        const cf = student.cultural_fitness;
        
        // Work style alignment
        if (cf.work_style === 'In teams') retentionScore += 10;
        if (cf.work_life_balance === 'Very important') retentionScore += 5;
        if (cf.learning_preference === 'Mentorship') retentionScore += 10;
        if (cf.career_goals === 'Leadership role') retentionScore += 10;
        if (cf.collaboration_style === 'Contribute equally') retentionScore += 10;
        if (cf.feedback_preference === 'Regular structured reviews') retentionScore += 5;
      }

      retentionScore = Math.min(retentionScore, 100);

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
        skills: studentSkills,
        matched_skills: matchedSkills,
        resume_url: student.resume_url,
        github_username: student.github_data?.username,
        github_repos: student.github_data?.repos_count || 0,
        gpa_numeric: studentGPA,
        location: student.location || 'N/A',
        interests: student.interests || []
      };
    });

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
