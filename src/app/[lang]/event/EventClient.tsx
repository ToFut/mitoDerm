'use client';

import dynamic from 'next/dynamic';

// Import the enhanced event component
const EventEnhanced = dynamic(() => import('./EventEnhanced'), { ssr: false });

export default function EventClient() {
  return <EventEnhanced />;
} 