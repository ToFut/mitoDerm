import { unstable_setRequestLocale } from 'next-intl/server';
import EventClient from './EventClient';

export const dynamic = 'force-dynamic';

interface EventPageProps {
  params: Promise<{ lang: string }>;
}

export default async function EventPage({ params }: EventPageProps) {
  const { lang } = await params;
  unstable_setRequestLocale(lang);
  return <EventClient />;
}
