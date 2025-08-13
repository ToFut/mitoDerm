import { unstable_setRequestLocale } from 'next-intl/server';
import HomePageEnhanced from './HomePageEnhanced';

export const dynamic = 'force-dynamic';

export default async function HomePage(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params;
  unstable_setRequestLocale(params.lang);
  return <HomePageEnhanced locale={params.lang} />;
}
