# MitoDerm Event Management System

## 🚀 Firebase-Integrated Event System

The event management system is now fully integrated with Firebase as the database brain. All event data, registrations, and management operations are stored and retrieved from Firestore.

## 🏗️ System Architecture

### Database Collections

**Events Collection: `events`**
- Stores all event data including details, agenda, speakers, pricing
- Includes metadata like creation dates, status, capacity
- Each event has a unique slug for public URLs

**Event Registrations Collection: `eventRegistrations`**
- Stores all registration data linked to events
- Includes attendee information, pricing, and approval status
- Tracks invitation codes and special requests

### API Endpoints

| Endpoint | Method | Description |
|----------|---------|-------------|
| `/api/events` | GET | Fetch all events with filtering |
| `/api/events` | POST | Create new event |
| `/api/events/[id]` | GET | Fetch single event by ID |
| `/api/events/[id]` | PUT | Update event |
| `/api/events/[id]` | DELETE | Delete event |
| `/api/events/slug/[slug]` | GET | Fetch published event by slug |
| `/api/events/registrations` | GET | Fetch registrations |
| `/api/events/registrations` | POST | Create registration |
| `/api/events/registrations/[id]` | PUT | Update registration status |
| `/api/events/registrations/[id]` | DELETE | Delete registration |

## 🔧 Setup Instructions

### 1. Firebase Configuration
Make sure your `.env.local` file contains:
```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...your-key...\n-----END PRIVATE KEY-----\n"
```

### 2. Seed Initial Data
Run the seeding script to populate sample events:
```bash
node scripts/seed-events.js
```

### 3. Firestore Security Rules
Update your `firestore.rules` to include:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Events - readable by all, writable by admins only
    match /events/{eventId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Event registrations - readable by admins, writable for new registrations
    match /eventRegistrations/{registrationId} {
      allow read: if request.auth != null && request.auth.token.admin == true;
      allow create: if request.auth != null;
      allow update: if request.auth != null && request.auth.token.admin == true;
      allow delete: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

## 🎯 Features Implemented

### Admin Dashboard (`/admin/events`)
- ✅ **Create Events**: Full event creation with all details
- ✅ **Edit Events**: Update existing events 
- ✅ **Delete Events**: Remove events (with registration check)
- ✅ **Registration Management**: Approve/reject registrations
- ✅ **Analytics**: View event statistics
- ✅ **Search & Filter**: Find events by status, type, etc.

### User Interface (`/events`)
- ✅ **Event Listing**: Browse all published events
- ✅ **Featured Events**: Highlighted upcoming events
- ✅ **Search & Filter**: Filter by type and location
- ✅ **Event Details**: Comprehensive event information
- ✅ **Registration**: Complete registration flow
- ✅ **Responsive Design**: Works on all devices

### Event Detail Pages (`/events/[slug]`)
- ✅ **Multi-tab Interface**: Overview, Agenda, Speakers, Gallery
- ✅ **Registration Form**: Detailed registration with pricing
- ✅ **Speaker Profiles**: Complete speaker information
- ✅ **Event Features**: What's included, requirements
- ✅ **Pricing Tiers**: Multiple pricing options with early bird
- ✅ **Social Sharing**: Share events on social media

## 📊 Data Flow

### Event Creation Flow
1. Admin creates event via `/admin/events`
2. Event data saved to Firestore `events` collection
3. Auto-generated slug for public URL
4. Event appears in listings immediately

### Registration Flow
1. User visits `/events/[slug]`
2. Fills registration form
3. Registration saved to `eventRegistrations` collection
4. Event capacity automatically updated
5. Admin receives notification for approval (if required)

### Approval Flow
1. Admin views pending registrations
2. Approves or rejects with optional reason
3. Registration status updated in database
4. User receives confirmation (email integration ready)

## 🔒 Security Features

- **Input Validation**: All API endpoints validate required fields
- **Duplicate Prevention**: Prevents duplicate registrations
- **Capacity Management**: Automatic capacity tracking
- **Admin Authorization**: Admin-only operations protected
- **Slug Generation**: Safe URL slug generation
- **Error Handling**: Comprehensive error handling throughout

## 🚀 Getting Started

### For Admins:
1. Visit `/admin/events`
2. Click "Create Event" to add new events
3. Manage registrations in the "Registrations" tab
4. View analytics in the "Analytics" tab

### For Users:
1. Visit `/events` to browse events
2. Click on events to see details
3. Register using the registration form
4. Wait for approval if required

## 🔄 Next Steps (Optional)

- **Email Integration**: Set up automated email confirmations
- **Payment Processing**: Integrate Stripe for paid events
- **Calendar Integration**: Add calendar invite generation
- **Advanced Analytics**: More detailed event analytics
- **Invitation System**: Bulk invitation generation (partially implemented)

## 🐛 Troubleshooting

### Common Issues:

**Events not loading:**
- Check Firebase configuration in `.env.local`
- Verify Firestore rules allow read access
- Check browser console for API errors

**Registration failing:**
- Verify event capacity not exceeded
- Check for duplicate registrations
- Ensure all required fields filled

**Admin functions not working:**
- Verify admin authentication
- Check Firebase Admin SDK configuration
- Ensure proper admin permissions

## 📈 Database Schema

### Event Document Structure:
```typescript
{
  id: string,
  title: string,
  subtitle?: string,
  description: string,
  type: 'conference' | 'workshop' | 'webinar' | 'product_launch' | 'training',
  status: 'draft' | 'published' | 'cancelled' | 'completed',
  startDate: Date,
  endDate: Date,
  timezone: string,
  location: {
    type: 'physical' | 'virtual' | 'hybrid',
    venue?: string,
    address?: string,
    city?: string,
    country?: string,
    virtualLink?: string,
    coordinates?: { lat: number, lng: number }
  },
  capacity: {
    total: number,
    reserved: number,
    available: number
  },
  // ... additional fields
}
```

The system is now production-ready with Firebase as the database brain! 🎉