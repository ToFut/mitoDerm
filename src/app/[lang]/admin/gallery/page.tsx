'use client';

import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import AdminLayout from '@/components/admin/AdminLayout/AdminLayout';
import GalleryManager from '@/components/admin/GalleryManager/GalleryManager';

export default function GalleryPage() {
  const { data: session } = useSession();
  const t = useTranslations('Admin');

  if (!session) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <GalleryManager />
    </AdminLayout>
  );
} 