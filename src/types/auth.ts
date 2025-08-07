import 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    provider?: string;
    user?: {
      email?: string;
      role?: string;
      name?: string;
      image?: string;
    };
  }

  interface JWT {
    accessToken?: string;
    provider?: string;
    user?: {
      email?: string;
      role?: string;
      name?: string;
      image?: string;
    };
  }
} 