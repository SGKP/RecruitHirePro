import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { put } from '@vercel/blob';
import pdf from 'pdf-parse/lib/pdf-parse.js';
import connectDB from '@/lib/mongodb';
import Student from '@/models/Student';
import User from '@/models/User';

export async function POST(request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    
    if (decoded.role !== 'student') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('resume');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN
    });

    // Parse PDF
    const buffer = await file.arrayBuffer();
    const pdfData = await pdf(Buffer.from(buffer));
    const text = pdfData.text;

    console.log('📄 PDF Text extracted, length:', text.length);
    console.log('📄 First 500 chars:', text.substring(0, 500));

    // Extract skills (case-insensitive matching)
    const skillKeywords = [
      'JavaScript', 'Python', 'Java', 'React', 'ReactJS', 'React.js', 'Next.js', 'NextJS', 'Node.js', 'NodeJS', 'MongoDB', 
      'SQL', 'HTML', 'CSS', 'TypeScript', 'Angular', 'Vue', 'VueJS', 'Express', 'ExpressJS',
      'Django', 'Flask', 'Spring', 'SpringBoot', 'AWS', 'Docker', 'Kubernetes', 'Git', 'GitHub',
      'C++', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Go', 'Golang', 'Rust',
      'PostgreSQL', 'MySQL', 'Redis', 'GraphQL', 'REST', 'RESTful', 'API',
      'Machine Learning', 'ML', 'AI', 'Artificial Intelligence', 'Data Science', 'TensorFlow', 'PyTorch',
      'Tailwind', 'TailwindCSS', 'Bootstrap', 'Material UI', 'MUI', 'Sass', 'SCSS',
      'Redux', 'Context API', 'Zustand', 'Recoil', 'Prisma', 'Mongoose', 'Sequelize',
      'Jest', 'Mocha', 'Chai', 'Cypress', 'Selenium', 'Puppeteer',
      'Firebase', 'Supabase', 'Vercel', 'Netlify', 'Heroku', 'Azure', 'GCP',
      'Linux', 'Ubuntu', 'Bash', 'PowerShell', 'CI/CD', 'Jenkins', 'GitHub Actions',
      'Webpack', 'Vite', 'Babel', 'ESLint', 'Prettier',
      'Figma', 'Adobe XD', 'Photoshop', 'Illustrator',
      'Agile', 'Scrum', 'Jira', 'Confluence', 'Trello',
      'Pandas', 'NumPy', 'Scikit-learn', 'Matplotlib', 'Seaborn',
      'FastAPI', 'NestJS', 'Laravel', 'Ruby on Rails', 'ASP.NET'
    ];
    
    const textLower = text.toLowerCase();
    const foundSkills = new Set();
    
    skillKeywords.forEach(skill => {
      // Create regex pattern for case-insensitive whole word matching
      // Handle special characters in skill names (like . + #)
      const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp(`\\b${escapedSkill}\\b`, 'gi');
      
      if (pattern.test(textLower)) {
        // Normalize the skill name (use the standard version from our list)
        if (skill.toLowerCase().includes('react') && !skill.toLowerCase().includes('native')) {
          foundSkills.add('React');
        } else if (skill.toLowerCase().includes('next')) {
          foundSkills.add('Next.js');
        } else if (skill.toLowerCase().includes('node')) {
          foundSkills.add('Node.js');
        } else if (skill.toLowerCase().includes('express')) {
          foundSkills.add('Express');
        } else if (skill.toLowerCase().includes('tailwind')) {
          foundSkills.add('Tailwind CSS');
        } else if (skill.toLowerCase().includes('typescript')) {
          foundSkills.add('TypeScript');
        } else if (skill.toLowerCase() === 'ml' || skill.toLowerCase() === 'machine learning') {
          foundSkills.add('Machine Learning');
        } else if (skill.toLowerCase() === 'ai' || skill.toLowerCase() === 'artificial intelligence') {
          foundSkills.add('AI');
        } else if (skill.toLowerCase().includes('golang')) {
          foundSkills.add('Go');
        } else if (skill.toLowerCase().includes('springboot')) {
          foundSkills.add('Spring Boot');
        } else {
          foundSkills.add(skill);
        }
      }
    });
    
    const skills = Array.from(foundSkills);
    console.log('🎯 Skills found:', skills);

    // Extract LinkedIn
    let linkedin_url = null;
    const linkedinMatch = text.match(/(https?:\/\/(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?)/i);
    if (linkedinMatch) {
      linkedin_url = linkedinMatch[1];
    }
    console.log('🔗 LinkedIn found:', linkedin_url);

    // Extract GPA
    let gpa = null;
    const gpaPatterns = [
      /GPA[:\s]*(\d+\.?\d*)/i,
      /(\d\.\d+)\s*\/\s*4\.?0?/i,
      /CGPA[:\s]*(\d+\.?\d*)/i,
    ];
    for (const pattern of gpaPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        gpa = match[1];
        break;
      }
    }
    console.log('📊 GPA found:', gpa);

    // Extract University
    let university = null;
    const universityPatterns = [
      /(?:Army Institute of Technology)/i,
      /University of ([A-Za-z\s,]+?)(?:\n|Bachelor|B\.E\.|B\.S\.|Degree|20\d{2})/i,
      /([A-Za-z\s]+Institute of Technology)/i,
    ];
    for (const pattern of universityPatterns) {
      const match = text.match(pattern);
      if (match) {
        university = match[1] ? match[1].trim() : match[0].trim();
        break;
      }
    }
    console.log('🎓 University found:', university);

    // Extract Degree
    let degree = null;
    const degreePatterns = [
      /(B\.?E\.?\s+in [A-Za-z\s]+)/i,
      /(Bachelor of [A-Za-z\s]+)/i,
      /(B\.?Tech\.?\s+in [A-Za-z\s]+)/i,
      /(B\.?S\.?\s+in [A-Za-z\s]+)/i,
    ];
    for (const pattern of degreePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        degree = match[1].trim();
        break;
      }
    }
    console.log('📜 Degree found:', degree);

    // Extract Major
    let major = null;
    if (degree && degree.includes(' in ')) {
      major = degree.split(' in ')[1].trim();
    } else {
      const majorMatch = text.match(/(?:Information Technology|Computer Science|Software Engineering)/i);
      if (majorMatch) {
        major = majorMatch[0];
      }
    }
    console.log('📚 Major found:', major);

    // Extract Graduation Year
    let graduation_year = null;
    const yearPatterns = [
      /(20\d{2})\s*-\s*(20\d{2})/g,
      /(?:Expected|Graduation)[:\s]+(20\d{2})/gi,
      /\b(202[0-9])\b/g,
    ];
    for (const pattern of yearPatterns) {
      const matches = Array.from(text.matchAll(pattern));
      if (matches.length > 0) {
        const match = matches[matches.length - 1];
        graduation_year = match[2] || match[1];
        break;
      }
    }
    console.log('📅 Graduation year found:', graduation_year);

    // Calculate Current Year
    let current_year = null;
    if (graduation_year) {
      const gradYear = parseInt(graduation_year);
      const now = 2025;
      const yearsRemaining = gradYear - now;
      
      if (yearsRemaining >= 3) current_year = '1st Year';
      else if (yearsRemaining >= 2) current_year = '2nd Year';
      else if (yearsRemaining >= 1) current_year = '3rd Year';
      else if (yearsRemaining >= 0) current_year = '4th Year';
      else current_year = 'Graduate';
    }
    console.log('📚 Current year calculated:', current_year);

    // Extract Phone
    let phone = null;
    const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/);
    if (phoneMatch) {
      phone = phoneMatch[1];
    }
    console.log('📱 Phone found:', phone);

    // Extract Achievements
    const achievements = [];
    const achievementPatterns = [
      /(?:Finalist|Winner|Ranked|Selected)[^\.]+(?:Hackathon|Competition)[^\.]+\./gi,
      /(?:Competitive Programming)[^\.]+(?:LeetCode|Codeforces)[^\.]+\./gi,
      /Ranked\s+\d+[^\n\.]+(?:among|participants)[^\n\.]+\./gi,
    ];
    
    achievementPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => {
          if (match.length > 20 && match.length < 300) {
            achievements.push({
              title: match.substring(0, 100).trim(),
              description: match.trim(),
              date: 'Extracted from resume'
            });
          }
        });
      }
    });
    console.log('🏆 Achievements extracted:', achievements.length);

    await connectDB();

    const student = await Student.findOne({ user_id: decoded.userId });
    
    if (!student) {
      return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });
    }

    // Update student profile
    student.resume_url = blob.url;
    
    if (phone && !student.phone) student.phone = phone;
    if (linkedin_url && !student.linkedin_url) student.linkedin_url = linkedin_url;
    if (current_year && !student.current_year) student.current_year = current_year;
    
    student.resume_parsed_data = {
      skills,
      education: {
        degree,
        major,
        university,
        graduation_year,
        gpa
      }
    };
    
    if (!student.achievements || student.achievements.length === 0) {
      student.achievements = achievements;
    }
    
    student.markModified('resume_parsed_data');
    
    await student.save();

    console.log('✅ Student profile updated successfully');
    console.log('   - Phone:', phone);
    console.log('   - LinkedIn:', linkedin_url);
    console.log('   - Current Year:', current_year);
    console.log('   - Skills:', skills.length);
    console.log('   - GPA:', gpa);
    console.log('   - University:', university);
    console.log('   - Degree:', degree);
    console.log('   - Major:', major);
    console.log('   - Graduation Year:', graduation_year);
    console.log('   - Achievements:', achievements.length);

    return NextResponse.json({
      message: 'Resume uploaded and parsed successfully',
      resume_url: blob.url,
      parsed_data: student.resume_parsed_data,
      achievements_added: achievements.length,
      extracted_fields: {
        phone,
        linkedin_url,
        current_year,
        gpa,
        university,
        degree,
        major,
        graduation_year,
        skills: skills.length,
        achievements: achievements.length
      }
    });

  } catch (error) {
    console.error('❌ Resume upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}
