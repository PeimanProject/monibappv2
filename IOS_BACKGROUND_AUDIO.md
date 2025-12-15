# iOS Background Audio Implementation

This implementation enables background audio playback on iOS devices for the Monib AI application and fixes the issue where clicking on iOS player controls opens a random app instead of the PWA.

## Features Implemented

### 1. Meta Tags Configuration
- Added necessary meta tags in `app/[locale]/layout.js` for iOS background audio support
- Configured `apple-mobile-web-app-capable` and related meta tags
- Added audio session meta tags and PWA launch configuration

### 2. Audio Session Management
- Created `app/libs/iosAudioSession.js` utility for managing iOS audio sessions
- Implemented background audio enablement
- Added audio interruption handling
- Configured AirPlay support
- Added PWA launch handling for background audio controls

### 3. Player Component Updates
- Updated `app/pages/player/mobilePlayerControl.js` with iOS background audio support
- Updated `app/pages/player/desktopPlayerControl.js` with similar functionality
- Added proper audio element attributes for iOS compatibility
- Integrated iOS audio session management

### 4. Global Audio Session Setup
- Created `app/component/iosAudioManager.js` component for global audio session management
- Created `app/component/serviceWorkerRegistration.js` for PWA functionality
- Integrated both components into the main layout

### 5. Service Worker Implementation
- Created `public/sw.js` service worker for background audio handling
- Added PWA launch event handling
- Implemented notification click handling for audio controls

## Key Features

### Background Playback
- Audio continues playing when the app is in the background
- Supports AirPlay for external audio devices
- Handles audio interruptions (phone calls, etc.)
- **FIXED**: Clicking on iOS player controls now opens the PWA instead of random apps

### Audio Session Configuration
- Sets up proper audio session category for background playback
- Enables Bluetooth and AirPlay support
- Handles page visibility changes
- Manages PWA launch events from background audio controls

### PWA Integration
- Proper PWA manifest configuration for iOS
- Service worker handles background audio events
- App launch from Control Center/Lock Screen controls opens the PWA
- Maintains audio session state across app launches

### Compatibility
- Works with iOS Safari and WebView
- Supports both audio-only and video content
- Maintains sync with subtitle/caption timing
- Full PWA support for background audio controls

## Technical Implementation

### Audio Element Attributes
```html
<audio
  controls
  playsInline
  webkit-playsinline="true"
  x-webkit-airplay="allow"
  preload="auto"
  crossOrigin="anonymous"
>
```

### iOS Audio Session Setup
- Detects iOS devices using user agent
- Sets up audio session with playback category
- Enables background audio capabilities
- Handles audio interruptions gracefully
- Manages PWA launch events from background controls

### PWA Configuration
- Service worker registration for background audio handling
- Proper manifest configuration with iOS-specific meta tags
- App launch URL handling with audio session parameters
- Notification click handling for audio controls

### Event Handling
- Page visibility changes
- App state changes (focus/blur)
- Audio interruptions and resumption
- Time update synchronization
- PWA launch events from background audio controls
- Service worker message handling

## Testing

To test the background audio functionality:

1. Open the app on an iOS device
2. Start playing audio content
3. Press the home button or switch to another app
4. Audio should continue playing in the background
5. Use Control Center or Lock Screen to control playback
6. **NEW**: Click on the player controls in Control Center/Lock Screen - should open the PWA

## Browser Support

- iOS Safari 12+
- iOS WebView (in native apps)
- Supports AirPlay to external devices
- Background audio in Safari and WebView
- Full PWA support for background audio controls

## Notes

- Background audio requires user interaction to start (iOS requirement)
- Audio session is automatically managed by the implementation
- Interruptions (phone calls, etc.) are handled gracefully
- Sync with subtitles/captions is maintained during background playback
- **FIXED**: PWA now properly opens when clicking on iOS player controls instead of random apps 