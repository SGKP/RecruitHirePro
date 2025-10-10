'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default function StudentProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [connectingGithub, setConnectingGithub] = useState(false);
  const [githubUsername, setGithubUsername] = useState('');
  const [formData, setFormData] = useState({
    phone: '',
    linkedin_url: '',
    current_year: '',
    gpa: '',
    degree: '',
    university: '',
    graduation_year: '',
    major: '',
    skills: [],
    achievements: []
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/student/profile');
      if (response.ok) {
        const data = await response.json();
        console.log('📊 Profile data received:', data.student);
        setProfile(data.student);
        const edu = data.student.resume_parsed_data?.education || {};
        
        console.log('📞 Phone from DB:', data.student.phone);
        console.log('🔗 LinkedIn from DB:', data.student.linkedin_url);
        console.log('📅 Year from DB:', data.student.current_year);
        console.log('📚 Education data:', edu);
        
        // Merge resume data with existing profile data
        setFormData({
          phone: data.student.phone || '',
          linkedin_url: data.student.linkedin_url || '',
          current_year: data.student.current_year || '',
          gpa: data.student.gpa || edu.gpa || '',
          degree: edu.degree || '',
          university: edu.university || '',
          graduation_year: edu.graduation_year || '',
          major: edu.major || '',
          skills: data.student.resume_parsed_data?.skills || [],
          achievements: data.student.achievements || []
        });
        
        console.log('✅ Form data set:', {
          phone: data.student.phone || '',
          linkedin_url: data.student.linkedin_url || '',
          current_year: data.student.current_year || ''
        });
        
        setGithubUsername(data.student.github_data?.username || '');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.pdf')) {
      alert('Please upload a PDF file');
      return;
    }

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('resume', file);

    try {
      const response = await fetch('/api/student/upload-resume', {
        method: 'POST',
        body: formDataUpload
      });

      const data = await response.json();

      if (response.ok) {
        const parsedData = data.parsed_data;
        const skills = parsedData?.skills || [];
        const edu = parsedData?.education || {};
        const achievementsCount = data.achievements_added || 0;
        
        // Show detailed success message
        alert(`✅ Resume uploaded successfully!\n\n` +
              `📄 Skills found: ${skills.length} skills\n` +
              `   ${skills.slice(0, 8).join(', ')}${skills.length > 8 ? '...' : ''}\n\n` +
              `📊 GPA: ${edu.gpa || 'Not found'}\n` +
              `🎓 University: ${edu.university || 'Not found'}\n` +
              `📜 Degree: ${edu.degree || 'Not found'}\n` +
              `📚 Major: ${edu.major || 'Not found'}\n` +
              `📅 Graduation: ${edu.graduation_year || 'Not found'}\n` +
              `🏆 Achievements: ${achievementsCount} extracted\n\n` +
              `Your profile has been updated! You can edit any field below.`);
        
        await fetchProfile(); // Reload profile with parsed data
      } else {
        alert('❌ ' + (data.error || 'Failed to upload resume'));
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('❌ Error uploading resume: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleConnectGithub = async () => {
    if (!githubUsername.trim()) {
      alert('Please enter your GitHub username');
      return;
    }

    setConnectingGithub(true);
    try {
      const response = await fetch('/api/student/connect-github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ github_username: githubUsername })
      });

      const data = await response.json();

      if (response.ok) {
        alert('✅ GitHub connected successfully!');
        await fetchProfile(); // Reload profile with GitHub data
      } else {
        alert(data.error || 'Failed to connect GitHub');
      }
    } catch (error) {
      alert('Error connecting GitHub');
    } finally {
      setConnectingGithub(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    console.log('💾 Saving profile data:', formData);
    try {
      const response = await fetch('/api/student/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      console.log('💾 Save response:', result);

      if (response.ok) {
        alert('✅ Profile updated successfully!');
        fetchProfile();
      } else {
        alert('Failed to update profile: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('❌ Save error:', error);
      alert('Error updating profile: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    const skill = prompt('Enter skill name:');
    if (skill && skill.trim()) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skill.trim()]
      });
    }
  };

  const removeSkill = (index) => {
    const newSkills = formData.skills.filter((_, i) => i !== index);
    setFormData({ ...formData, skills: newSkills });
  };

  const addAchievement = () => {
    setFormData({
      ...formData,
      achievements: [...formData.achievements, { title: '', description: '', date: '' }]
    });
  };

  const updateAchievement = (index, field, value) => {
    const newAchievements = [...formData.achievements];
    newAchievements[index][field] = value;
    setFormData({ ...formData, achievements: newAchievements });
  };

  const removeAchievement = (index) => {
    const newAchievements = formData.achievements.filter((_, i) => i !== index);
    setFormData({ ...formData, achievements: newAchievements });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar role="student" />
      <div className="ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-5">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
                <p className="text-gray-600 mt-1">Update your information and skills</p>
              </div>
              <button
                onClick={() => router.push('/student/dashboard')}
                className="btn-secondary"
              >
                ← Back
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="card-modern p-8">
            {/* Quick Actions */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Resume Upload */}
              <div className="card-modern p-6 bg-blue-50 border-blue-200">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">📄</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-2">Upload Resume</h3>
                    <p className="text-sm text-gray-600 mb-4">Auto-fill profile from PDF</p>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleResumeUpload}
                      disabled={uploading}
                      className="w-full text-sm text-gray-700 bg-white border-2 border-gray-300 rounded-lg p-2"
                    />
                    {uploading && <p className="text-sm text-blue-600 font-medium mt-2">Uploading & parsing...</p>}
                    {profile?.resume_url && (
                      <a href={profile.resume_url} target="_blank" className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-2 block">
                        📎 View Current Resume
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* GitHub Connect */}
              <div className="card-modern p-6 bg-purple-50 border-purple-200">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">🐙</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-2">Connect GitHub</h3>
                    <p className="text-sm text-gray-600 mb-4">Fetch repos & languages</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={githubUsername}
                        onChange={(e) => setGithubUsername(e.target.value)}
                        placeholder="Your GitHub username"
                        className="input-modern flex-1 text-sm py-2"
                      />
                      <button
                        onClick={handleConnectGithub}
                        disabled={connectingGithub}
                        className="btn-primary text-sm disabled:opacity-50"
                      >
                        {connectingGithub ? '...' : '✓'}
                      </button>
                    </div>
                    {profile?.github_data?.username && (
                      <p className="text-sm text-green-600 font-medium mt-2">✓ Connected: {profile.github_data.username} ({profile.github_data.repos_count} repos)</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            </div>

            {/* Basic Info */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-modern"
                  placeholder="+1 234 567 8900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                  className="input-modern"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Current Year
                </label>
                <select
                  value={formData.current_year}
                  onChange={(e) => setFormData({ ...formData, current_year: e.target.value })}
                  className="input-modern"
                >
                  <option value="">Select Year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Graduate">Graduate</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  GPA
                </label>
                <input
                  type="text"
                  value={formData.gpa}
                  onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                  className="input-modern"
                  placeholder="3.8"
                />
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Education</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Degree
                </label>
                <input
                  type="text"
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  className="input-modern"
                  placeholder="Bachelor of Science"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Major/Field of Study
                </label>
                <input
                  type="text"
                  value={formData.major}
                  onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                  className="input-modern"
                  placeholder="Computer Science"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  University
                </label>
                <input
                  type="text"
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  className="input-modern"
                  placeholder="University Name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Graduation Year
                </label>
                <input
                  type="text"
                  value={formData.graduation_year}
                  onChange={(e) => setFormData({ ...formData, graduation_year: e.target.value })}
                  className="input-modern"
                  placeholder="2025"
                />
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Skills</h2>
              <button
                onClick={addSkill}
                className="btn-primary text-sm"
              >
                + Add Skill
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.length === 0 ? (
                <p className="text-gray-600 text-sm">No skills added. Upload resume or add manually.</p>
              ) : (
                formData.skills.map((skill, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-blue-100 border border-blue-300 text-blue-700 rounded-lg font-medium">
                    <span>{skill}</span>
                    <button
                      onClick={() => removeSkill(idx)}
                      className="text-blue-700 hover:text-red-600 font-bold text-lg"
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Achievements */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Achievements</h2>
              <button
                onClick={addAchievement}
                className="btn-primary text-sm"
              >
                + Add Achievement
              </button>
            </div>

            <div className="space-y-4">
              {formData.achievements.map((achievement, index) => (
                <div key={index} className="card-modern p-6 border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-gray-900">Achievement #{index + 1}</h3>
                    <button
                      onClick={() => removeAchievement(index)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        value={achievement.title}
                        onChange={(e) => updateAchievement(index, 'title', e.target.value)}
                        placeholder="Achievement Title"
                        className="input-modern"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <textarea
                        value={achievement.description}
                        onChange={(e) => updateAchievement(index, 'description', e.target.value)}
                        placeholder="Description"
                        rows="3"
                        className="input-modern"
                      />
                    </div>
                    <div>
                      <input
                        type="date"
                        value={achievement.date}
                        onChange={(e) => updateAchievement(index, 'date', e.target.value)}
                        className="input-modern"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {formData.achievements.length === 0 && (
                <p className="text-center text-gray-600 py-12 bg-gray-50 rounded-xl">
                  No achievements added yet. Click "Add Achievement" to get started!
                </p>
              )}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
