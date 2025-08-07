import { unstable_setRequestLocale } from 'next-intl/server';
import EventsEnhanced from './EventsEnhanced';

export default async function EventsPage(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params;
  unstable_setRequestLocale(params.lang);
  
  return <EventsEnhanced />;
}