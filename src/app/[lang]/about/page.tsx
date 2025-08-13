import { unstable_setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import AboutClient from './AboutClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const params = await props.params;
  const t = await getTranslations({ locale: params.lang, namespace: 'about' });
  
  return {
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: t('meta.keywords'),
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      type: 'website',
    },
  };
}

export default async function AboutPage(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params;
  unstable_setRequestLocale(params.lang);
  
  return <AboutClient />;
} 