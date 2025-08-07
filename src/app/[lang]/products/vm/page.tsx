import { unstable_setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import VMProductsClient from './VMProductsClient';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: 'vmProducts' });
  
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

export default async function ProductsVMPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  unstable_setRequestLocale(lang);
  
  return (
    <main>
      <VMProductsClient />
    </main>
  );
} 