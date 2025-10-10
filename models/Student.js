import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  phone: String,
  linkedin_url: String,
  current_year: {
    type: String,
    enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate'],
    default: null
  },
  achievements: [{
    title: String,
    description: String,
    date: String
  }],
  resume_url: String,
  resume_parsed_data: {
    skills: [String],
    education: {
      degree: String,
      major: String,
      university: String,
      graduation_year: String,
      gpa: String
    },
    experience: [{
      company: String,
      role: String,
      duration: String
    }],
    certifications: [String]
  },
  github_data: {
    username: String,
    repos_count: Number,
    followers: Number,
    top_languages: [String],
    profile_url: String
  },
  cultural_fitness: {
    work_environment: String,
    work_style: String,
    motivation: String,
    company_size: String,
    career_goals: String,
    learning_preference: String,
    work_life_balance: String,
    feedback_preference: String,
    risk_tolerance: String,
    collaboration_style: String
  },
  profile_completion: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.models.Student || mongoose.model('Student', studentSchema);
