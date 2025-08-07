import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Apple from 'next-auth/providers/apple';
import Credentials from 'next-auth/providers/credentials';
import '@/types/auth';

export default NextAuth({
  providers: [
    // OAuth providers disabled for development
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== 'disabled' ? [
      Google({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      })
    ] : []),
    ...(process.env.APPLE_ID && process.env.APPLE_ID !== 'disabled' ? [
      Apple({
        clientId: process.env.APPLE_ID!,
        clientSecret: process.env.APPLE_SECRET!,
      })
    ] : []),
    // Credentials provider for email/password authentication (simplified for development)
    Credentials({
      id: 'credentials',
      name: 'Credentials', 
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Development authentication - simplified for testing
        try {
          // Handle quick sign-up credentials
          if (credentials.email === 'quick@mitoderm.com' && credentials.password === 'quick123') {
            return {
              id: 'quick-user',
              email: 'quick@mitoderm.com',
              name: 'Quick User',
              role: 'user'
            };
          }

          // Demo admin user
          if (credentials.email === 'admin@mitoderm.com' && credentials.password === 'admin123') {
            return {
              id: 'admin-user',
              email: 'admin@mitoderm.com',
              name: 'Admin User',
              role: 'admin'
            };
          }

          // Demo regular user
          if (credentials.email === 'user@mitoderm.com' && credentials.password === 'user123') {
            return {
              id: 'demo-user',
              email: 'user@mitoderm.com',
              name: 'Demo User',
              role: 'user'
            };
          }

          // For any other email/password combination in development
          if (credentials.email.includes('@') && credentials.password.length >= 6) {
            return {
              id: `user-${Date.now()}`,
              email: credentials.email,
              name: credentials.email.split('@')[0],
              role: 'user'
            };
          }
          
          return null;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async signIn({ user, account }) {
      // All authentication is handled in the providers
      // Just return true to allow sign in
      return true;
    },
    async jwt({ token, user, account }: any) {
      if (account && user) {
        token.accessToken = account.access_token as string;
        token.provider = account.provider as string;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken as string;
      session.provider = token.provider as string;
      session.user.role = token.role;
      return session;
    },
  },
  session: {
    strategy: 'jwt' as const,
  },
}); 