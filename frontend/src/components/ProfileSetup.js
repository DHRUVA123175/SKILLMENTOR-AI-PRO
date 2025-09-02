import React, { useState } from 'react';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Target, 
  MapPin, 
  DollarSign,
  Plus,
  X,
  Save,
  ArrowLeft
} from 'lucide-react';

const ProfileSetup = ({ initialProfile, onComplete, onCancel }) => {
  const [profile, setProfile] = useState({
    name: '',
    experience_level: '',
    skills: [],
    education: [],
    experience: [],
    preferred_industries: [],
    location: '',
    salary_expectations: '',
    ...initialProfile
  });

  const [currentSkill, setCurrentSkill] = useState('');
  const [currentIndustry, setCurrentIndustry] = useState('');

  const experienceLevels = [
    'Entry Level / Student',
    'Junior (1-2 years)',
    'Mid-level (3-5 years)',
    'Senior (5-8 years)',
    'Lead/Principal (8+ years)',
    'Executive/Director'
  ];

  const commonSkills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'AWS', 'Docker',
    'Machine Learning', 'Data Analysis', 'Project Management', 'Leadership',
    'Communication', 'Problem Solving', 'Agile', 'Git', 'HTML/CSS'
  ];

  const commonIndustries = [
    'Technology', 'Finance', 'Healthcare', 'E-commerce', 'Education',
    'Gaming', 'Consulting', 'Startups', 'Enterprise', 'Government'
  ];

  const handleSkillAdd = (skill) => {
    if (skill && !profile.skills.includes(skill)) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
    setCurrentSkill('');
  };

  const handleSkillRemove = (skillToRemove) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleIndustryAdd = (industry) => {
    if (industry && !profile.preferred_industries.includes(industry)) {
      setProfile(prev => ({
        ...prev,
        preferred_industries: [...prev.preferred_industries, industry]
      }));
    }
    setCurrentIndustry('');
  };

  const handleIndustryRemove = (industryToRemove) => {
    setProfile(prev => ({
      ...prev,
      preferred_industries: prev.preferred_industries.filter(industry => industry !== industryToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete(profile);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {initialProfile ? 'Edit Profile' : 'Setup Your Profile'}
                </h2>
                <p className="text-sm text-gray-600">
                  Help us provide better career recommendations
                </p>
              </div>
            </div>
            
            {onCancel && (
              <button
                onClick={onCancel}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience Level
              </label>
              <select
                value={profile.experience_level}
                onChange={(e) => setProfile(prev => ({ ...prev, experience_level: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select experience level</option>
                {experienceLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Briefcase className="w-4 h-4 inline mr-1" />
              Skills
            </label>
            
            {/* Current Skills */}
            <div className="flex flex-wrap gap-2 mb-3">
              {profile.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleSkillRemove(skill)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add Skill */}
            <div className="flex space-x-2 mb-3">
              <input
                type="text"
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleSkillAdd(currentSkill))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add a skill..."
              />
              <button
                type="button"
                onClick={() => handleSkillAdd(currentSkill)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Common Skills */}
            <div>
              <p className="text-xs text-gray-600 mb-2">Quick add:</p>
              <div className="flex flex-wrap gap-1">
                {commonSkills.filter(skill => !profile.skills.includes(skill)).map(skill => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleSkillAdd(skill)}
                    className="px-2 py-1 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
                  >
                    + {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preferred Industries */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Target className="w-4 h-4 inline mr-1" />
              Preferred Industries
            </label>
            
            {/* Current Industries */}
            <div className="flex flex-wrap gap-2 mb-3">
              {profile.preferred_industries.map((industry, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                >
                  {industry}
                  <button
                    type="button"
                    onClick={() => handleIndustryRemove(industry)}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add Industry */}
            <div className="flex space-x-2 mb-3">
              <input
                type="text"
                value={currentIndustry}
                onChange={(e) => setCurrentIndustry(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleIndustryAdd(currentIndustry))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add an industry..."
              />
              <button
                type="button"
                onClick={() => handleIndustryAdd(currentIndustry)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Common Industries */}
            <div>
              <p className="text-xs text-gray-600 mb-2">Quick add:</p>
              <div className="flex flex-wrap gap-1">
                {commonIndustries.filter(industry => !profile.preferred_industries.includes(industry)).map(industry => (
                  <button
                    key={industry}
                    type="button"
                    onClick={() => handleIndustryAdd(industry)}
                    className="px-2 py-1 text-xs text-green-600 bg-green-50 hover:bg-green-100 rounded transition-colors"
                  >
                    + {industry}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Location and Salary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Location
              </label>
              <input
                type="text"
                value={profile.location}
                onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="City, State or Remote"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Salary Expectations
              </label>
              <input
                type="text"
                value={profile.salary_expectations}
                onChange={(e) => setProfile(prev => ({ ...prev, salary_expectations: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., $80,000 - $120,000"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;