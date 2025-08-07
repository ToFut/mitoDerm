import { NextResponse } from 'next/server';

export async function GET() {
  const startTime = Date.now();
  
  try {
    // Simple test without Firebase or file system
    const testData = {
      message: 'Performance test successful',
      timestamp: new Date().toISOString(),
      responseTime: 0
    };
    
    const responseTime = Date.now() - startTime;
    testData.responseTime = responseTime;
    
    const response = NextResponse.json(testData);
    response.headers.set('X-Response-Time', `${responseTime}ms`);
    
    return response;
  } catch (error) {
    const responseTime = Date.now() - startTime;
    return NextResponse.json(
      { 
        error: 'Performance test failed', 
        responseTime,
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
} 