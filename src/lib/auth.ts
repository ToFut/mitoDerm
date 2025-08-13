import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Apple from 'next-auth/providers/apple';
import Credentials from 'next-auth/providers/credentials';

export const { handlers, auth, signIn, signOut } = NextAuth({
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
      async authorize(credentials: Partial<Record<"email" | "password", unknown>>) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        const email = credentials.email as string;
        const password = credentials.password as string;

        // Development authentication - simplified for testing
        try {
          // Handle quick sign-up credentials
          if (email === 'quick@mitoderm.com' && password === 'quick123') {
            return {
              id: 'quick-user',
              email: 'quick@mitoderm.com',
              name: 'Quick User',
              role: 'user',
              status: 'active',
              membershipTier: 'basic',
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString(),
              profile: {
                phone: '',
                avatar: '',
                bio: '',
                certificationStatus: 'none',
                preferences: {
                  language: 'en',
                  notifications: {
                    email: true,
                    sms: false,
                    push: true,
                    orderUpdates: true,
                    eventInvites: true,
                    educationContent: true
                  },
                  privacy: {
                    profileVisible: true,
                    certificateVisible: true,
                    contactInfoVisible: true
                  }
                },
                stats: {
                  totalOrders: 0,
                  totalSpent: 0,
                  coursesCompleted: 0,
                  certificatesEarned: 0,
                  eventsAttended: 0,
                  joinedDate: new Date().toISOString()
                }
              }
            };
          }

          // Demo admin user
          if (email === 'admin@mitoderm.com' && password === 'admin123') {
            return {
              id: 'admin-user',
              email: 'admin@mitoderm.com',
              name: 'Admin User',
              role: 'admin',
              status: 'active',
              membershipTier: 'vip',
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString(),
              profile: {
                phone: '',
                avatar: '',
                bio: '',
                certificationStatus: 'approved',
                certificationLevel: 'expert',
                preferences: {
                  language: 'en',
                  notifications: {
                    email: true,
                    sms: false,
                    push: true,
                    orderUpdates: true,
                    eventInvites: true,
                    educationContent: true
                  },
                  privacy: {
                    profileVisible: true,
                    certificateVisible: true,
                    contactInfoVisible: true
                  }
                },
                stats: {
                  totalOrders: 0,
                  totalSpent: 0,
                  coursesCompleted: 0,
                  certificatesEarned: 0,
                  eventsAttended: 0,
                  joinedDate: new Date().toISOString()
                }
              }
            };
          }

          // Demo regular user
          if (email === 'user@mitoderm.com' && password === 'user123') {
            return {
              id: 'demo-user',
              email: 'user@mitoderm.com',
              name: 'Demo User',
              role: 'user',
              status: 'active',
              membershipTier: 'basic',
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString(),
              profile: {
                phone: '',
                avatar: '',
                bio: '',
                certificationStatus: 'none',
                preferences: {
                  language: 'en',
                  notifications: {
                    email: true,
                    sms: false,
                    push: true,
                    orderUpdates: true,
                    eventInvites: true,
                    educationContent: true
                  },
                  privacy: {
                    profileVisible: true,
                    certificateVisible: true,
                    contactInfoVisible: true
                  }
                },
                stats: {
                  totalOrders: 0,
                  totalSpent: 0,
                  coursesCompleted: 0,
                  certificatesEarned: 0,
                  eventsAttended: 0,
                  joinedDate: new Date().toISOString()
                }
              }
            };
          }

          // For any other email/password combination in development
          if (email.includes('@') && password.length >= 6) {
            return {
              id: `user-${Date.now()}`,
              email: email,
              name: email.split('@')[0],
              role: 'user',
              status: 'active',
              membershipTier: 'basic',
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString(),
              profile: {
                phone: '',
                avatar: '',
                bio: '',
                certificationStatus: 'none',
                preferences: {
                  language: 'en',
                  notifications: {
                    email: true,
                    sms: false,
                    push: true,
                    orderUpdates: true,
                    eventInvites: true,
                    educationContent: true
                  },
                  privacy: {
                    profileVisible: true,
                    certificateVisible: true,
                    contactInfoVisible: true
                  }
                },
                stats: {
                  totalOrders: 0,
                  totalSpent: 0,
                  coursesCompleted: 0,
                  certificatesEarned: 0,
                  eventsAttended: 0,
                  joinedDate: new Date().toISOString()
                }
              }
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