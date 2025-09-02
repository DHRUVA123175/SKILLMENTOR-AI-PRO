import React from 'react';
import { User, Settings, Brain, Upload, X } from 'lucide-react';

const Header = ({ userProfile, onEditProfile, onSetupProfile, onResumeUpload }) => {
  return (
    <header className="bg-white/10 backdrop-blur-md shadow-lg border-b border-white/20">
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">SkillMentor AI Pro</h1>
              <p className="text-sm text-white/90">Your personalized career advisor</p>
            </div>
          </div>

          {/* User Profile Section */}
          <div className="flex items-center space-x-4">
            {userProfile ? (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-white">
                    {userProfile.name || 'User'}
                  </p>
                  <p className="text-xs text-white/80">
                    {userProfile.experience_level || 'Getting started'}
                  </p>
                </div>
                <button
                  onClick={onEditProfile}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-white hover:text-white hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm"
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem('skillmentor_profile');
                    window.location.reload();
                  }}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm"
                >
                  <X className="w-4 h-4" />
                  <span>Clear</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onSetupProfile}
                className="flex items-center space-x-2 px-4 py-2 gradient-primary text-white text-sm font-medium rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <Settings className="w-4 h-4" />
                <span>Setup Profile</span>
              </button>
            )}
          </div>
        </div>

        {/* Profile Summary Bar */}
        {userProfile && (
          <div className="mt-4 p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              {userProfile.skills && userProfile.skills.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">Skills:</span>
                  <div className="flex flex-wrap gap-1">
                    {userProfile.skills.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                    {userProfile.skills.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                        +{userProfile.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              {userProfile.preferred_industries && userProfile.preferred_industries.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">Interests:</span>
                  <span className="text-gray-800">
                    {userProfile.preferred_industries.slice(0, 2).join(', ')}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;