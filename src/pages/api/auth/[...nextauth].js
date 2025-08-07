import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Development',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (credentials?.email && credentials?.password) {
          return {
            id: 'dev-user',
            name: 'Development User',
            email: credentials.email,
            image: 'https://via.placeholder.com/150',
          };
        }
        return null;
      }
    }),
  ],
  pages: {
    signIn: '/en/auth/signin',
    error: '/en/auth/signin',
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      console.log('Redirect callback called:', { url, baseUrl });
      
      // If the URL is relative, redirect to English version
      if (url.startsWith('/')) {
        return `${baseUrl}/en`;
      }
      
      // If it's the base URL, redirect to English version
      if (url === baseUrl) {
        return `${baseUrl}/en`;
      }
      
      // If it's a full URL starting with baseUrl, redirect to English version
      if (url.startsWith(baseUrl)) {
        return `${baseUrl}/en`;
      }
      
      // For external URLs, return as is
      return url;
    },
    async session({ session, token }) {
      return session;
    },
    async jwt({ token, user }) {
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  // Fix for state cookie issues
  useSecureCookies: false,
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: false
      }
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        sameSite: 'lax',
        path: '/',
        secure: false
      }
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: false
      }
    }
  }
}); 