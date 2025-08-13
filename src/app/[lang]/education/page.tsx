import { unstable_setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import EducationClient from './EducationClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const params = await props.params;
  const t = await getTranslations({ locale: params.lang, namespace: 'education' });
  
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

export default async function EducationPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params;
  unstable_setRequestLocale(lang);
  
  return <EducationClient />;
} 