"use client";

import React from 'react';

export const ServiceWorkerRegistration = () => {
  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Register service worker
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration);
          
          // Handle service worker updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker available
                console.log('New service worker available');
              }
            });
          });
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });

      // Handle service worker messages
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'AUDIO_SESSION') {
          // Handle audio session events from service worker
          console.log('Audio session event from SW:', event.data);
        }
      });

      // Handle app launch from background audio
      if (window.location.search.includes('audio-session')) {
        // App was launched from audio controls
        console.log('App launched from audio session');
        
        // Send message to service worker
        navigator.serviceWorker.ready.then((registration) => {
          registration.active.postMessage({
            type: 'AUDIO_SESSION',
            action: 'app_launched',
            url: window.location.search
          });
        });
      }
    }
  }, []);

  // This component doesn't render anything
  return null;
}; 