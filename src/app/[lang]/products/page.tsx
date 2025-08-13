import { unstable_setRequestLocale } from 'next-intl/server';
import ProductsEnhanced from './ProductsEnhanced';

export const dynamic = 'force-dynamic';

export default async function ProductsPage(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params;
  unstable_setRequestLocale(params.lang);
  
  return <ProductsEnhanced />;
} 