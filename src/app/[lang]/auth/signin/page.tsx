import { unstable_setRequestLocale } from 'next-intl/server';
import SignInClient from './SignInClient';

export default async function SignInPage(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params;
  // Enable static rendering for this page
  unstable_setRequestLocale(params.lang);

  return <SignInClient />;
} 