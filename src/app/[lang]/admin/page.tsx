import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import AdminDashboard from '@/components/admin/AdminDashboard/AdminDashboard';

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await props.params;
  const t = await getTranslations({ locale: lang, namespace: 'admin' });
  
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

export default function AdminPage() {
  return <AdminDashboard />;
} 