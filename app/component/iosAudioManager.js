"use client";

import React from 'react';
import { iosAudioSession } from '@/app/libs/iosAudioSession';

export const IOSAudioManager = () => {
  React.useEffect(() => {
    // Initialize iOS audio session when component mounts
    iosAudioSession.initialize();

    // Set up global event listeners for PWA launch
    const handleAppLaunch = () => {
      // Handle app launch from background audio controls
      if (window.location.search.includes('audio-session')) {
        // App was launched from audio controls, ensure proper state
        iosAudioSession.restoreAudioSession();
      }
    };

    // Listen for app launch events
    window.addEventListener('load', handleAppLaunch);
    
    // Handle visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        iosAudioSession.ensureBackgroundAudio();
      } else {
        iosAudioSession.restoreAudioSession();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Handle focus/blur events
    const handleFocus = () => {
      iosAudioSession.restoreAudioSession();
    };

    const handleBlur = () => {
      iosAudioSession.ensureBackgroundAudio();
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('load', handleAppLaunch);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      iosAudioSession.cleanup();
    };
  }, []);

  // This component doesn't render anything
  return null;
}; 