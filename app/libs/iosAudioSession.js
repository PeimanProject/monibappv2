



// iOS Audio Session Management for Background Audio
export class IOSAudioSession {
  constructor() {
    this.isIOS = this.detectIOS();
    this.audioSession = null;
    this.isInitialized = false;
  }

  detectIOS() {
    if (typeof window === 'undefined') return false;
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }

  async initialize() {
    if (!this.isIOS || this.isInitialized) return;

    try {
      // Set up audio session for background playback
      if (window.webkit && window.webkit.messageHandlers) {
        // Native app integration
        window.webkit.messageHandlers.audioSession?.postMessage({
          action: 'setupAudioSession',
          category: 'playback',
          options: {
            allowBluetooth: true,
            allowBluetoothA2DP: true,
            allowAirPlay: true,
            allowHapticsAndSystemSoundsDuringRecording: false,
            defaultToSpeaker: false,
            mixWithOthers: false,
            routeSharingPolicy: 'default',
            category: 'playback'
          }
        });
      }

      // Set up page visibility handling
      this.setupPageVisibilityHandling();
      
      // Set up audio interruption handling
      this.setupAudioInterruptionHandling();

      // Set up PWA launch handling
      this.setupPWALaunchHandling();

      this.isInitialized = true;
      console.log('iOS Audio Session initialized');
    } catch (error) {
      console.error('Failed to initialize iOS Audio Session:', error);
    }
  }

  setupPageVisibilityHandling() {
    if (typeof document === 'undefined') return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, ensure audio continues
        this.ensureBackgroundAudio();
      } else {
        // Page is visible, restore audio session
        this.restoreAudioSession();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Also handle focus/blur events
    window.addEventListener('blur', () => {
      this.ensureBackgroundAudio();
    });

    window.addEventListener('focus', () => {
      this.restoreAudioSession();
    });
  }

  setupAudioInterruptionHandling() {
    if (typeof window === 'undefined') return;

    // Handle audio interruptions (phone calls, etc.)
    window.addEventListener('beforeunload', () => {
      this.cleanup();
    });

    // Handle app state changes
    if (document.addEventListener) {
      document.addEventListener('webkitvisibilitychange', () => {
        if (document.webkitVisibilityState === 'hidden') {
          this.ensureBackgroundAudio();
        }
      });
    }
  }

  setupPWALaunchHandling() {
    if (typeof window === 'undefined') return;

    // Handle PWA launch from background audio controls
    const handleAppLaunch = () => {
      if (window.location.search.includes('audio-session')) {
        // App was launched from audio controls
        console.log('PWA launched from audio session');
        
        // Ensure proper audio session state
        setTimeout(() => {
          this.restoreAudioSession();
        }, 100);
      }
    };

    // Listen for app launch events
    window.addEventListener('load', handleAppLaunch);
    
    // Also handle URL changes (for SPA navigation)
    let currentUrl = window.location.href;
    const checkUrlChange = () => {
      if (window.location.href !== currentUrl) {
        currentUrl = window.location.href;
        handleAppLaunch();
      }
    };

    // Check for URL changes periodically
    setInterval(checkUrlChange, 1000);
  }

  ensureBackgroundAudio() {
    if (!this.isIOS) return;

    try {
      // Ensure audio session is set for background playback
      if (window.webkit && window.webkit.messageHandlers) {
        window.webkit.messageHandlers.audioSession?.postMessage({
          action: 'ensureBackgroundAudio',
          category: 'playback'
        });
      }
    } catch (error) {
      console.error('Failed to ensure background audio:', error);
    }
  }

  restoreAudioSession() {
    if (!this.isIOS) return;

    try {
      // Restore audio session when app becomes active
      if (window.webkit && window.webkit.messageHandlers) {
        window.webkit.messageHandlers.audioSession?.postMessage({
          action: 'restoreAudioSession',
          category: 'playback'
        });
      }
    } catch (error) {
      console.error('Failed to restore audio session:', error);
    }
  }

  cleanup() {
    if (!this.isIOS) return;

    try {
      // Clean up audio session
      if (window.webkit && window.webkit.messageHandlers) {
        window.webkit.messageHandlers.audioSession?.postMessage({
          action: 'cleanup'
        });
      }
    } catch (error) {
      console.error('Failed to cleanup audio session:', error);
    }
  }

  // Method to handle audio element setup for iOS
  setupAudioElement(audioElement) {
    if (!this.isIOS || !audioElement) return;

    // Set necessary attributes for iOS background audio
    audioElement.setAttribute('playsinline', 'true');
    audioElement.setAttribute('webkit-playsinline', 'true');
    audioElement.setAttribute('x-webkit-airplay', 'allow');
    audioElement.setAttribute('preload', 'auto');
    audioElement.setAttribute('crossorigin', 'anonymous');

    // Add event listeners for iOS-specific handling
    audioElement.addEventListener('play', () => {
      this.ensureBackgroundAudio();
    });

    audioElement.addEventListener('pause', () => {
      // Handle pause events
    });

    audioElement.addEventListener('ended', () => {
      // Handle end of audio
    });

    audioElement.addEventListener('error', (error) => {
      console.error('Audio element error:', error);
    });
  }
}

// Create a singleton instance
export const iosAudioSession = new IOSAudioSession();

// Initialize on module load
if (typeof window !== 'undefined') {
  iosAudioSession.initialize();
} 