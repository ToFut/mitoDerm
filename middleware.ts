import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './src/i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

export default async function middleware(request: NextRequest) {
  console.log('🔍 MIDDLEWARE RUNNING for:', request.nextUrl.pathname);
  console.log('🔍 MIDDLEWARE URL:', request.url);
  
  // Apply internationalization middleware
  try {
    const response = intlMiddleware(request);
    console.log('✅ MIDDLEWARE SUCCESS - Status:', response.status);
    return response;
  } catch (error) {
    console.error('❌ MIDDLEWARE ERROR:', error);
    // Fallback: just pass through the request
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    // Match all routes except static files and API
    '/((?!api|_next|.*\\..*).*)',
  ],
};
