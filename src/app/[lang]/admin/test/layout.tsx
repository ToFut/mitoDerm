import { Metadata } from 'next';

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await props.params;
  
  return {
    title: 'Admin Test Suite',
    description: 'Comprehensive testing suite for admin functionality',
  };
}

export default function AdminTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <div style={{ padding: '20px' }}>
        <h1>Admin Test Suite</h1>
        {children}
      </div>
    </div>
  );
} 