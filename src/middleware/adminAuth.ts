import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Admin users list - in production, this should be in a database
const ADMIN_USERS = [
  'admin@mitoderm.com',
  'shiri@mitoderm.com',
  'segev@futurixs.com',
  'ilona@mitoderm.co.il'
];

export async function adminAuthMiddleware(request: NextRequest) {
  const token = await getToken({ req: request });
  
  // Check if user is authenticated and is an admin
  if (!token?.email || !ADMIN_USERS.includes(token.email)) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }
  
  return NextResponse.next();
} 