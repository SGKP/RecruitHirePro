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
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingIdCard, setUploadingIdCard] = useState(false);
  const [connectingGithub, setConnectingGithub] = useState(false);
  const [githubUsername, setGithubUsername] = useState('');
  const [formData, setFormData] = useState({
    name: '',
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
        const data = await response.json(); // Direct data, no wrapper
        console.log('📊 Profile data received:', data);
        setProfile(data);
        const edu = data.resume_parsed_data?.education || {};
        
        console.log('📞 Phone from DB:', data.phone);
        console.log('🔗 LinkedIn from DB:', data.linkedin_url);
        console.log('📅 Year from DB:', data.current_year);
        console.log('📚 Education data:', edu);
        console.log('📸 Photo URL:', data.profile_photo_url);
        console.log('🆔 ID Card URL:', data.id_card_url);
        console.log('🎯 Skills:', data.resume_parsed_data?.skills);
        
        // Auto-fill form data from resume
        setFormData({
          name: data.user_id?.name || '',
          phone: data.phone || '',
          linkedin_url: data.linkedin_url || '',
          current_year: data.current_year || '',
          gpa: data.gpa || edu.gpa || '',
          degree: edu.degree || '',
          university: edu.university || '',
          graduation_year: edu.graduation_year || '',
          major: edu.major || '',
          skills: data.resume_parsed_data?.skills || [],
          achievements: data.achievements || []
        });
        
        console.log('✅ Form data auto-filled from resume');
        console.log('✅ Skills in formData:', data.resume_parsed_data?.skills);
        
        setGithubUsername(data.github_data?.username || '');
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
        const exp = parsedData?.experience || [];
        const certs = parsedData?.certifications || [];
        const achievementsData = data.achievements || [];
        const achievementsCount = data.achievements_added || 0;
        const autoFilled = data.auto_filled || {};
        
        // Build detailed alert message
        let alertMsg = `✅ Resume uploaded & parsed successfully!\n\n`;
        alertMsg += `📞 Phone: ${autoFilled.phone || 'Not found'}\n`;
        alertMsg += `📧 Email: ${autoFilled.email || 'Not found'}\n`;
        alertMsg += `🔗 LinkedIn: ${autoFilled.linkedin_url || 'Not found'}\n`;
        alertMsg += `🐙 GitHub: ${autoFilled.github_url || 'Not found'}\n`;
        alertMsg += `📅 Current Year: ${autoFilled.current_year || 'Not found'}\n\n`;
        
        alertMsg += `📄 Skills: ${skills.length} found\n`;
        alertMsg += `   ${skills.slice(0, 10).join(', ')}${skills.length > 10 ? '...' : ''}\n\n`;
        
        alertMsg += `🎓 Education:\n`;
        alertMsg += `   University: ${edu.university || 'Not found'}\n`;
        alertMsg += `   Degree: ${edu.degree || 'Not found'}\n`;
        alertMsg += `   Major: ${edu.major || 'Not found'}\n`;
        alertMsg += `   GPA: ${edu.gpa || 'Not found'}\n`;
        alertMsg += `   Graduation: ${edu.graduation_year || 'Not found'}\n\n`;
        
        alertMsg += `💼 Experience: ${exp.length} entries\n`;
        alertMsg += `🏅 Certifications: ${certs.length} found\n`;
        alertMsg += `🏆 Achievements: ${achievementsCount} extracted\n`;
        
        // Show achievement titles
        if (achievementsData.length > 0) {
          alertMsg += `\nAchievements:\n`;
          achievementsData.slice(0, 3).forEach((ach, idx) => {
            alertMsg += `   ${idx + 1}. ${ach.title.substring(0, 80)}...\n`;
          });
          if (achievementsData.length > 3) {
            alertMsg += `   ... and ${achievementsData.length - 3} more\n`;
          }
        }
        
        alertMsg += `\n✅ All data auto-filled! Review below.`;
        
        alert(alertMsg);
        
        await fetchProfile(); // Reload profile with ALL parsed data
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

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a JPG, PNG, or WEBP image');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploadingPhoto(true);
    const formDataUpload = new FormData();
    formDataUpload.append('photo', file);

    try {
      const response = await fetch('/api/student/upload-photo', {
        method: 'POST',
        body: formDataUpload
      });

      const data = await response.json();

      if (response.ok) {
        alert('✅ Photo uploaded successfully!');
        await fetchProfile(); // Reload to show new photo
      } else {
        alert('❌ ' + (data.error || 'Failed to upload photo'));
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('❌ Error uploading photo: ' + error.message);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleIdCardUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a JPG, PNG, WEBP, or PDF file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setUploadingIdCard(true);
    const formDataUpload = new FormData();
    formDataUpload.append('idcard', file);

    try {
      const response = await fetch('/api/student/upload-idcard', {
        method: 'POST',
        body: formDataUpload
      });

      const data = await response.json();

      if (response.ok) {
        alert('✅ ID Card uploaded successfully!');
        await fetchProfile(); // Reload to show new ID card
      } else {
        alert('❌ ' + (data.error || 'Failed to upload ID card'));
      }
    } catch (error) {
      console.error('Error uploading ID card:', error);
      alert('❌ Error uploading ID card: ' + error.message);
    } finally {
      setUploadingIdCard(false);
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
        await fetchProfile(); // Wait for reload to complete
      } else {
        alert('❌ Failed to update profile: ' + (result.error || 'Unknown error'));
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
    <div className="min-h-screen">
      <Sidebar role="student" />
      <div className="ml-64">
        {/* LinkedIn-Style Profile Header */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl overflow-hidden mb-6 mx-8 mt-8 border border-purple-500/30">
          {/* Cover Photo */}
          <div className="h-48 bg-gradient-to-r from-purple-900 via-purple-800 to-pink-900"></div>
          
          {/* Profile Section */}
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row gap-6 -mt-24">
              {/* Left Side - Profile Photo */}
              <div className="relative">
                {profile?.profile_photo_url ? (
                  <img 
                    src={profile.profile_photo_url} 
                    alt="Profile"
                    className="w-40 h-40 rounded-full border-4 border-white shadow-xl object-cover"
                  />
                ) : (
                  <div className="w-40 h-40 rounded-full border-4 border-white shadow-xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center">
                    <span className="text-6xl text-white">
                      {profile?.user_id?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
                
                {/* Camera Icon for Upload */}
                <label className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    disabled={uploadingPhoto}
                  />
                  {uploadingPhoto ? (
                    <div className="animate-spin w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full"></div>
                  ) : (
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </label>
              </div>

              {/* Right Side - Name and Info */}
              <div className="flex-1 md:mt-16">
                {/* Editable Name Field */}
                <div className="mb-4">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="text-3xl font-bold text-white bg-transparent border-b-2 border-transparent hover:border-purple-400 focus:border-purple-500 focus:outline-none transition-colors w-full max-w-md"
                    placeholder="Enter your name"
                  />
                  <p className="text-xs text-purple-300 mt-1">Click to edit your name</p>
                </div>
                
                <p className="text-xl text-gray-300 mt-1">
                  {formData.degree || 'Student'} {formData.university && `at ${formData.university}`}
                </p>
                <p className="text-gray-400 mt-2">
                  {profile?.user_id?.email}
                </p>
                
                {/* Quick Info */}
                <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-300">
                  {formData.current_year && (
                    <span className="flex items-center gap-1">
                      🎓 {formData.current_year}
                    </span>
                  )}
                  {formData.phone && (
                    <span className="flex items-center gap-1">
                      📱 {formData.phone}
                    </span>
                  )}
                  {formData.linkedin_url && (
                    <a 
                      href={formData.linkedin_url.startsWith('http') ? formData.linkedin_url : `https://${formData.linkedin_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      🔗 LinkedIn
                    </a>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => router.push('/student/dashboard')}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    ← Dashboard
                  </button>
                  
                  {profile?.resume_url && (
                    <a
                      href={profile.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      📄 View Resume
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border border-purple-500/30 shadow-xl">
            {/* Quick Actions */}
            <div className="mb-8 pb-8 border-b border-purple-500/30">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span>⚡</span> Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Resume Upload */}
              <div className="bg-gradient-to-br from-blue-600/20 to-blue-700/20 rounded-lg p-6 border border-blue-500/30">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">📄</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white mb-2">Upload Resume</h3>
                    <p className="text-sm text-gray-300 mb-4">Auto-fill profile from PDF</p>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleResumeUpload}
                      disabled={uploading}
                      className="w-full text-sm text-white bg-white/10 border-2 border-white/20 rounded-lg p-2"
                    />
                    {uploading && <p className="text-sm text-blue-400 font-medium mt-2">Uploading & parsing...</p>}
                    {profile?.resume_url && (
                      <a href={profile.resume_url} target="_blank" className="text-sm text-blue-400 hover:text-blue-300 font-medium mt-2 block">
                        📎 View Current Resume
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Student ID Card Upload */}
              <div className="bg-gradient-to-br from-green-600/20 to-green-700/20 rounded-lg p-6 border border-green-500/30">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">🪪</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white mb-2">Student ID Card</h3>
                    <p className="text-sm text-gray-300 mb-4">Upload your student ID</p>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      onChange={handleIdCardUpload}
                      disabled={uploadingIdCard}
                      className="w-full text-sm text-white bg-white/10 border-2 border-white/20 rounded-lg p-2"
                    />
                    {uploadingIdCard && <p className="text-sm text-green-400 font-medium mt-2">Uploading ID card...</p>}
                    {profile?.id_card_url && (
                      <a href={profile.id_card_url} target="_blank" className="text-sm text-green-400 hover:text-green-300 font-medium mt-2 block">
                        🪪 View Current ID Card
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* GitHub Connect */}
              <div className="bg-gradient-to-br from-purple-600/20 to-purple-700/20 rounded-lg p-6 border border-purple-500/30">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">🐙</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white mb-2">Connect GitHub</h3>
                    <p className="text-sm text-gray-300 mb-4">Fetch repos & languages</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={githubUsername}
                        onChange={(e) => setGithubUsername(e.target.value)}
                        placeholder="Your GitHub username"
                        className="flex-1 text-sm py-2 px-3 bg-white/10 border-2 border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                      />
                      <button
                        onClick={handleConnectGithub}
                        disabled={connectingGithub}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
                      >
                        {connectingGithub ? '...' : '✓'}
                      </button>
                    </div>
                    {profile?.github_data?.username && (
                      <p className="text-sm text-green-400 font-medium mt-2">✓ Connected: {profile.github_data.username} ({profile.github_data.repos_count} repos)</p>
                    )}
                  </div>
                </div>
              </div>

              {/* GitHub Analytics Pro Button */}
              {(profile?.github_username || profile?.github_data?.username) && (
                <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-lg p-6 border border-indigo-500/30">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">📊</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white mb-2">GitHub Analytics Pro</h3>
                      <p className="text-sm text-gray-300 mb-4">View comprehensive stats & charts</p>
                      <button
                        onClick={() => router.push('/student/github-analytics')}
                        className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-semibold"
                      >
                        🚀 View Analytics Dashboard
                      </button>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        📈 Pie charts • Languages • Commits • Stars • Contributors
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            </div>

            {/* Basic Info */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span>📋</span> Basic Information
              </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-purple-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border-2 border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  placeholder="+1 234 567 8900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-purple-300 mb-2">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border-2 border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-purple-300 mb-2">
                  Current Year
                </label>
                <select
                  value={formData.current_year}
                  onChange={(e) => setFormData({ ...formData, current_year: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border-2 border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="" className="bg-gray-800">Select Year</option>
                  <option value="1st Year" className="bg-gray-800">1st Year</option>
                  <option value="2nd Year" className="bg-gray-800">2nd Year</option>
                  <option value="3rd Year" className="bg-gray-800">3rd Year</option>
                  <option value="4th Year" className="bg-gray-800">4th Year</option>
                  <option value="Graduate" className="bg-gray-800">Graduate</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-purple-300 mb-2">
                  GPA
                </label>
                <input
                  type="text"
                  value={formData.gpa}
                  onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border-2 border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  placeholder="3.8"
                />
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="mb-8 pb-8 border-b border-purple-500/30">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span>🎓</span> Education
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-purple-300 mb-2">
                  Degree
                </label>
                <input
                  type="text"
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border-2 border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  placeholder="Bachelor of Science"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-purple-300 mb-2">
                  Major/Field of Study
                </label>
                <input
                  type="text"
                  value={formData.major}
                  onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border-2 border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  placeholder="Computer Science"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-purple-300 mb-2">
                  University
                </label>
                <input
                  type="text"
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border-2 border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  placeholder="University Name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-purple-300 mb-2">
                  Graduation Year
                </label>
                <input
                  type="text"
                  value={formData.graduation_year}
                  onChange={(e) => setFormData({ ...formData, graduation_year: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border-2 border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  placeholder="2025"
                />
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="mb-8 pb-8 border-b border-purple-500/30">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>💡</span> Skills
              </h2>
              <button
                onClick={addSkill}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg text-sm"
              >
                + Add Skill
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.length === 0 ? (
                <p className="text-gray-400 text-sm">No skills added. Upload resume or add manually.</p>
              ) : (
                formData.skills.map((skill, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium border border-indigo-400/30">
                    <span>{skill}</span>
                    <button
                      onClick={() => removeSkill(idx)}
                      className="text-white hover:text-red-300 font-bold text-lg"
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
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>🏆</span> Achievements
              </h2>
              <button
                onClick={addAchievement}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg text-sm"
              >
                + Add Achievement
              </button>
            </div>

            <div className="space-y-4">
              {formData.achievements.map((achievement, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-white">Achievement #{index + 1}</h3>
                    <button
                      onClick={() => removeAchievement(index)}
                      className="text-red-400 hover:text-red-300 text-sm font-medium"
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
                        className="w-full px-4 py-2 bg-white/10 border-2 border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <textarea
                        value={achievement.description}
                        onChange={(e) => updateAchievement(index, 'description', e.target.value)}
                        placeholder="Description"
                        rows="3"
                        className="w-full px-4 py-2 bg-white/10 border-2 border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <input
                        type="date"
                        value={achievement.date}
                        onChange={(e) => updateAchievement(index, 'date', e.target.value)}
                        className="w-full px-4 py-2 bg-white/10 border-2 border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {formData.achievements.length === 0 && (
                <p className="text-center text-gray-400 py-12 bg-white/5 rounded-xl border border-white/10">
                  No achievements added yet. Click "Add Achievement" to get started!
                </p>
              )}
            </div>
          </div>

          {/* Recommendations Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>💬</span> Recommendations & Feedback
              </h2>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">
                  {profile?.recommendations?.length || 0} Recommendations
                </span>
              </div>
            </div>

            {/* Share Link */}
            <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg p-6 mb-6 border border-purple-500/30">
              <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                <span>🔗</span> Get Recommendations
              </h3>
              <p className="text-sm text-gray-300 mb-4">
                Share this link with your professors, mentors, or colleagues to request recommendations:
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={`${window.location.origin}/recommend/${profile?._id}`}
                  readOnly
                  className="flex-1 px-4 py-2 bg-white/10 border-2 border-white/20 rounded-lg text-white text-sm"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/recommend/${profile?._id}`);
                    alert('✅ Link copied to clipboard!');
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors text-sm font-semibold"
                >
                  📋 Copy Link
                </button>
              </div>
            </div>

            {/* Recommendations List */}
            {profile?.recommendations && profile.recommendations.length > 0 ? (
              <div className="space-y-4">
                {profile.recommendations.map((rec, index) => (
                  <div 
                    key={index} 
                    className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">{rec.recommender_name}</h4>
                        <p className="text-sm text-gray-600">{rec.recommender_role} {rec.organization && `at ${rec.organization}`}</p>
                        {rec.relationship && (
                          <p className="text-xs text-gray-500 mt-1">{rec.relationship}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-lg ${i < rec.rating ? 'text-yellow-500' : 'text-gray-300'}`}>
                              ★
                            </span>
                          ))}
                        </div>
                        {rec.verified && (
                          <span className="text-xs text-green-600 font-semibold mt-1 inline-block">
                            ✓ Verified
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Skills Ratings */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
                      {[
                        { label: '💻 Technical', value: rec.skills_rating?.technical },
                        { label: '💬 Communication', value: rec.skills_rating?.communication },
                        { label: '🤝 Teamwork', value: rec.skills_rating?.teamwork },
                        { label: '👑 Leadership', value: rec.skills_rating?.leadership },
                        { label: '🧩 Problem Solving', value: rec.skills_rating?.problem_solving }
                      ].map((skill, idx) => (
                        <div key={idx} className="bg-gray-50 rounded p-2 text-center">
                          <div className="text-xs text-gray-600">{skill.label}</div>
                          <div className="text-sm font-bold text-blue-600">{skill.value || 0}/5</div>
                        </div>
                      ))}
                    </div>

                    {/* Recommendation Text */}
                    <p className="text-gray-700 leading-relaxed mb-3 italic border-l-2 border-gray-300 pl-4">
                      "{rec.recommendation_text}"
                    </p>

                    {/* Footer */}
                    <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-200">
                      <span>{new Date(rec.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      {rec.would_hire_again && (
                        <span className="text-green-600 font-semibold">✓ Would recommend for hiring</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <p className="text-gray-600 mb-4">No recommendations yet</p>
                <p className="text-sm text-gray-500">Share your link with professors and mentors to get started!</p>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-xl shadow-purple-500/30 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : '💾 Save Changes'}
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
