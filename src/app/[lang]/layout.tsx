import type { Metadata } from 'next';
import { unstable_setRequestLocale } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import '../globals.scss';
import { Rubik } from 'next/font/google';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import SessionProvider from '@/components/providers/SessionProvider';
import AppShellClient from '@/components/layout/AppShellClient';

const rubik = Rubik({
  weight: ['300', '400', '500', '900'],
  style: 'normal',
  display: 'swap',
  variable: '--font-Rubik',
  subsets: ['latin', 'cyrillic', 'hebrew'],
});

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'he' }, { lang: 'ru' }];
}

export const metadata: Metadata = {
  title: 'אקסוזומים V-Tech | מיטודרם - מערכת מתקדמת לקוסמטיקאיות בישראל',
  description:
    'מערכת V-Tech - אקסוזומים סינתטיים + PDRN פולינוקלאוטידים לקוסמטיקאיות. תוצאות מהטיפול הראשון | הכשרות מקצועיות | מיטודרם ישראל 054-762-1889',
  keywords:
    'אקסוזומים לקוסמטיקאיות, V-Tech System, מיטודרם, PDRN פולינוקלאוטידים, אקסוזומים סינתטיים, טיפולי אקסוזומים, צלקות פוסט אקנה',
  icons: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      url: '/favicon/favicon.ico',
      sizes: 'auto',
    },
    {
      rel: 'icon',
      type: 'image/png',
      url: '/favicon/favicon-16x16.png',
      sizes: '16x16',
    },
    {
      rel: 'icon',
      type: 'image/png',
      url: '/favicon/favicon-32x32.png',
      sizes: '32x32',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '512x512',
      url: '/favicon/android-chrome-512x512.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '192x192',
      url: '/favicon/android-chrome-192x192.png',
    },
    {
      rel: 'apple-touch-icon',
      type: 'image/png',
      sizes: '192x192',
      url: '/favicon/apple-touch-icon.png',
    },
  ],
  alternates: {
    canonical: '/he',
    languages: {
      he: '/he',
      en: '/en',
      ru: '/ru',
    },
  },
  openGraph: {
    images: 'https://mitoderm.com/images/v-tech-social.jpg',
    url: 'https://mitoderm.com/he',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'MedicalBusiness',
  name: 'מיטודרם - Mitoderm',
  description:
    'מומחים בטכנולוגיית אקסוזומים מתקדמת למקצועות האסתטיקה. מערכת V-Tech - אקסוזומים סינתטיים ו-PDRN פולינוקלאוטידים',
  url: 'https://mitoderm.com',
  telephone: '+972-54-762-1889',
  email: 'info@mitoderm.com',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'IL',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'V-Tech System Professional Products',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Product',
          name: 'V-Tech System',
          description: 'אקסוזומים סינתטיים עם PDRN פולינוקלאוטידים',
          brand: {
            '@type': 'Brand',
            name: 'VM Corporation',
          },
        },
      },
    ],
  },
};

export default async function LangLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const resolvedParams = await params;

  if (!routing.locales.includes(resolvedParams.lang as any)) {
    notFound();
  }

  unstable_setRequestLocale(resolvedParams.lang);
  
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <SessionProvider>
        <div
          className={rubik.className}
          dir={resolvedParams.lang === 'he' ? 'rtl' : 'ltr'}
        >
          <AppShellClient lang={resolvedParams.lang} structuredData={structuredData}>
            {children}
          </AppShellClient>
        </div>
      </SessionProvider>
    </NextIntlClientProvider>
  );
}
