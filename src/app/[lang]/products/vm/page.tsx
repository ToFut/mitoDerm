import { unstable_setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import VMProductsClient from './VMProductsClient';

export async function generateMetadata({ params: { lang } }: { params: { lang: string } }): Promise<Metadata> {
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

export default function ProductsVMPage({ params: { lang } }: { params: { lang: string } }) {
  unstable_setRequestLocale(lang);
  
  return (
    <main>
      <VMProductsClient />
    </main>
  );
} 