# Event Video System Guide

## Overview
The event system now supports video uploads to help users understand what events are about. Videos can be uploaded through the admin interface and will appear on the events page.

## Features

### 1. Admin Video Upload
- **Location**: Admin → Events → Create/Edit Event → Step 1 (Event Basics)
- **Supported formats**: MP4, WebM, MOV
- **Max size**: 100MB
- **Purpose**: Event introduction videos to help users understand the event

### 2. Events Page Redesign
- **Hero Video Section**: Featured event with video plays at the top
- **Video Controls**: Mute/unmute functionality
- **Past Events Section**: Shows completed events with video indicators
- **Video Indicators**: Visual cues for events with videos

### 3. Video Storage
- **Storage**: Firebase Storage (`events/videos/` folder)
- **Database**: Firestore with event tags
- **Tags**: Automatically tagged with "event-page" for filtering

## How to Use

### For Admins

1. **Create/Edit Event**:
   - Go to Admin → Events
   - Click "Create Event" or edit existing event
   - In Step 1 (Event Basics), scroll to "Event Introduction Video"
   - Click "Upload Event Video" and select your video file
   - Set status to "Published" for the event to appear on user page

2. **Video Requirements**:
   - Format: MP4, WebM, or MOV
   - Size: Up to 100MB
   - Content: Should explain what the event is about
   - Duration: Recommended 30 seconds to 3 minutes

3. **Best Practices**:
   - Use high-quality videos (1920x1080 recommended)
   - Keep videos concise and engaging
   - Include event highlights or testimonials
   - Ensure videos are optimized for web

### For Users

1. **Viewing Events**:
   - Visit the Events page
   - Featured event with video plays automatically
   - Use video controls to mute/unmute
   - Scroll down to see upcoming events
   - Past events section shows completed events

2. **Video Features**:
   - Auto-play with mute (user-friendly)
   - Loop playback
   - Responsive design
   - Video indicators on event cards

## Technical Implementation

### Database Schema
```typescript
interface Event {
  // ... existing fields
  coverVideo?: string; // Main event video URL
  videos: EventMedia[]; // Additional videos
}
```

### File Structure
```
public/videos/
├── eventIntroVideo.webm    # Main event intro video
├── workshop-highlights.mp4 # Workshop highlights
└── ...

scripts/
└── upload-event-video.js   # Video upload script
```

### API Endpoints
- `GET /api/events?status=published` - Fetch all published events
- `POST /api/events` - Create event with video
- `PUT /api/events/[id]` - Update event video

## Upload Script

Use the provided script to upload videos to the gallery:

```bash
# Upload event videos
node scripts/upload-event-video.js
```

The script will:
1. Upload videos to Firebase Storage
2. Add metadata to Firestore
3. Tag videos with "event-page"
4. Provide download URLs for events

## Styling

### Video Hero Section
- Full-width video background
- Overlay with event information
- Video controls (mute/unmute)
- Responsive design

### Past Events Section
- Grid layout for past events
- Video indicators on cards
- Hover effects and animations
- "Watch Video" buttons

## Troubleshooting

### Common Issues

1. **Video not playing**:
   - Check video format (MP4, WebM, MOV)
   - Verify video URL is accessible
   - Check browser console for errors

2. **Video not appearing**:
   - Ensure event status is "Published"
   - Check if video URL is set in event data
   - Verify video file exists in storage

3. **Upload failures**:
   - Check file size (max 100MB)
   - Verify file format is supported
   - Check Firebase permissions

### Debug Commands

```bash
# Check event data
curl -X GET "http://localhost:3090/api/events?status=published"

# Update event video
curl -X PUT "http://localhost:3090/api/events/[eventId]" \
  -H "Content-Type: application/json" \
  -d '{"coverVideo":"/videos/your-video.mp4"}'
```

## Future Enhancements

1. **Video Analytics**: Track video views and engagement
2. **Video Thumbnails**: Auto-generate thumbnails
3. **Video Compression**: Automatic optimization
4. **Multiple Videos**: Support for multiple videos per event
5. **Video Playlists**: Curated video collections
6. **Live Streaming**: Integration with live event streaming

## Support

For technical support or questions about the video system, contact the development team or refer to the Firebase documentation for storage and media handling. 