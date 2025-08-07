# Authentication Setup Guide

This guide will help you set up Apple and Google authentication for the Mitoderm website.

## Prerequisites

1. Node.js and npm installed
2. NextAuth.js dependencies installed (already done)

## Environment Variables

Add the following environment variables to your `.env.local` file:

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Apple OAuth
APPLE_ID=your-apple-client-id
APPLE_SECRET=your-apple-client-secret
```

## Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create an OAuth 2.0 Client ID
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
6. Copy the Client ID and Client Secret to your environment variables

## Apple OAuth Setup

1. Go to [Apple Developer](https://developer.apple.com/)
2. Create a new App ID or use an existing one
3. Enable "Sign In with Apple"
4. Create a Services ID
5. Configure the Services ID with your domain
6. Create a private key for the Services ID
7. Use the Services ID as your `APPLE_ID` and the private key as your `APPLE_SECRET`

## Generate NextAuth Secret

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

## Features Added

### 1. Authentication Components
- **SignInButton**: Reusable component for Google and Apple sign-in
- **UserProfile**: User profile dropdown with sign-out functionality
- **SessionProvider**: NextAuth session management wrapper

### 2. Pages
- **Sign-in Page**: `/auth/signin` - Dedicated sign-in page with both providers

### 3. Navigation Integration
- Authentication components integrated into the main navigation
- Responsive design for mobile and desktop
- User profile dropdown when signed in
- Sign-in buttons when not authenticated

### 4. Styling
- Modern, consistent design matching the existing theme
- Responsive layouts for all screen sizes
- Loading states and error handling
- Hover effects and animations

## Usage

### For Users
1. Click "Sign in with Google" or "Sign in with Apple" in the navigation
2. Complete the OAuth flow with the chosen provider
3. User profile will appear in the navigation
4. Click the profile to access sign-out option

### For Developers
1. Import authentication components where needed:
   ```tsx
   import SignInButton from '@/components/sharedUI/SignInButton/SignInButton';
   import UserProfile from '@/components/sharedUI/UserProfile/UserProfile';
   ```

2. Use the session hook to check authentication status:
   ```tsx
   import { useSession } from 'next-auth/react';
   
   const { data: session } = useSession();
   ```

3. Protect routes or components:
   ```tsx
   if (!session) {
     return <div>Please sign in to access this content</div>;
   }
   ```

## Security Features

- JWT-based sessions
- Secure cookie handling
- CSRF protection
- Environment variable protection
- Provider-specific security measures

## Customization

### Styling
- Modify SCSS files in each component directory
- Update color schemes and spacing as needed
- Adjust responsive breakpoints

### Functionality
- Add additional OAuth providers in `src/app/api/auth/[...nextauth]/route.ts`
- Customize user data handling in the callbacks
- Add role-based access control

### Localization
- Add translation keys for authentication text
- Update messages in the `messages/` directory

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI"**: Ensure your redirect URIs match exactly in the OAuth provider settings
2. **"NEXTAUTH_SECRET not set"**: Generate and set a secure secret
3. **"Provider not found"**: Check that the provider is properly configured in the NextAuth route

### Debug Mode

Enable debug mode by adding to your environment variables:
```bash
NEXTAUTH_DEBUG=true
```

## Production Deployment

1. Update `NEXTAUTH_URL` to your production domain
2. Update redirect URIs in OAuth provider settings
3. Ensure all environment variables are set in your hosting platform
4. Test authentication flow in production environment

## Support

For issues or questions about the authentication implementation, refer to:
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Apple Sign In Documentation](https://developer.apple.com/sign-in-with-apple/) 