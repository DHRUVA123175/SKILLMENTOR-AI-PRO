import React, { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import ProfileSetup from './components/ProfileSetup';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import { ChatProvider } from './context/ChatContext';
import './App.css';
import './styles/animations.css';

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    // Check if user has a profile saved
    const savedProfile = localStorage.getItem('skillmentor_profile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }

    // Listen for profile setup events from chat interface
    const handleOpenProfileSetup = () => {
      setShowProfileSetup(true);
    };

    window.addEventListener('openProfileSetup', handleOpenProfileSetup);

    return () => {
      window.removeEventListener('openProfileSetup', handleOpenProfileSetup);
    };
  }, []);

  const handleProfileComplete = (profile) => {
    setUserProfile(profile);
    localStorage.setItem('skillmentor_profile', JSON.stringify(profile));
    setShowProfileSetup(false);
  };

  const handleEditProfile = () => {
    setShowProfileSetup(true);
  };

  const handleGetStarted = () => {
    setShowLanding(false);
  };

  if (showLanding) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  return (
    <ChatProvider>
      <div className="min-h-screen gradient-animated">
        <Header 
          userProfile={userProfile}
          onEditProfile={handleEditProfile}
          onSetupProfile={() => setShowProfileSetup(true)}
          // onResumeUpload removed
        />
        
        <main className="container mx-auto px-4 py-6 max-w-6xl">
          {showProfileSetup ? (
            <ProfileSetup 
              initialProfile={userProfile}
              onComplete={handleProfileComplete}
              onCancel={() => setShowProfileSetup(false)}
            />
          ) : (
            <ChatInterface userProfile={userProfile} />
          )}
        </main>

        {/* ResumeUpload functionality removed */}

        <footer className="bg-white/10 backdrop-blur-sm border-t border-white/20 py-6 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-white text-sm font-medium">
              SkillMentor AI Pro - Your personalized career and skills advisor
            </p>
            <p className="text-white/80 text-xs mt-1">
              Built with ❤️ for career growth and development
            </p>
          </div>
        </footer>
      </div>
    </ChatProvider>
  );
}

export default App;