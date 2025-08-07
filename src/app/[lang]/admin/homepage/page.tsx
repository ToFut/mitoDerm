import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import HomepageManager from '@/components/admin/HomepageManager/HomepageManager';

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await props.params;
  const t = await getTranslations({ locale: lang, namespace: 'admin' });
  
  return {
    title: 'Homepage Manager - ' + t('meta.title'),
    description: 'Manage homepage content, videos, and multilingual support',
  };
}

export default function HomepageManagerPage() {
  return <HomepageManager />;
}