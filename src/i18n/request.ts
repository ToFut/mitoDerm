import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // Validate that the incoming `requestLocale` parameter is valid
  const locale = await requestLocale;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!routing.locales.includes(locale as any)) notFound();

  return {
    locale: locale || 'en',
    messages: (await import(`../../messages/${locale || 'en'}.json`)).default,
  };
});
