import { unstable_setRequestLocale } from 'next-intl/server';
import MainForm from '@/components/forms/MainForm';

export default async function FormPage(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params;
  unstable_setRequestLocale(params.lang);
  return (
    <main className='formPage'>
      <MainForm />
    </main>
  );
}
