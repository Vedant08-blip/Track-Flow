import { useState, useEffect } from 'react';

const useUserProfile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load profile from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('currentUser');
    if (savedProfile) {
      try {
        setUserProfile(JSON.parse(savedProfile));
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    }
    setIsLoading(false);
  }, []);

  // Update profile and save to localStorage
  const updateUserProfile = (newProfile) => {
    setUserProfile(newProfile);
    localStorage.setItem('currentUser', JSON.stringify(newProfile));
    // Emit custom event for other components to listen
    window.dispatchEvent(new CustomEvent('userProfileUpdated', { detail: newProfile }));
  };

  // Clear profile (logout)
  const clearUserProfile = () => {
    setUserProfile(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userOnboarded');
    window.dispatchEvent(new CustomEvent('userProfileUpdated', { detail: null }));
  };

  return {
    userProfile,
    isLoading,
    updateUserProfile,
    clearUserProfile,
    isOnboarded: !!userProfile
  };
};

export default useUserProfile;
